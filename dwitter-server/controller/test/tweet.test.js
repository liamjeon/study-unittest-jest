import httpMocks from "node-mocks-http";
import faker from "faker";
import { TweetController } from "../tweet.js";
import { response } from "express";

describe("TweetController Test", () => {
  let tweetRepository;
  let tweetController;
  let mockedSocket;

  beforeEach(() => {
    tweetRepository = {}; //mock은 아닌데 비었음.
    mockedSocket = { emit: jest.fn() };
    tweetController = new TweetController(tweetRepository, () => mockedSocket);
  });

  describe("getTweets", () => {
    it("returns all tweets when username is not proviced", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const allTweets = [
        { text: faker.random.words(3) },
        { text: faker.random.words(3) },
      ];
      tweetRepository.getAll = () => allTweets;
      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });

    it("returns tweets for the given user when username is proviced", async () => {
      const username = faker.internet.userName();
      const request = httpMocks.createRequest({
        query: { username },
      });
      const response = httpMocks.createResponse();
      const userTweets = [{ text: faker.random.words(3) }];
      // tweetRepository.getAllByUsername = jest.fn(() => userTweets);
      tweetRepository.getAllByUsername = () => userTweets;

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(userTweets);
      // expect(tweetRepository.getAllByUsername).toHaveBeenCalledTimes(1);
      // expect(tweetRepository.getAllByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("getTweet", () => {
    it("returns tweet when id is proviced", async () => {
      let tweetId = faker.random.alphaNumeric(16);
      const request = httpMocks.createRequest({
        params: { id: tweetId },
      });
      const response = httpMocks.createResponse();
      const oneTweet = { text: faker.random.words(3) };
      tweetRepository.getById = () => oneTweet;

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(oneTweet);
    });

    it("returns 404 when id is not found", async () => {
      let tweetId = faker.random.alphaNumeric(16);
      const request = httpMocks.createRequest({
        params: {
          id: tweetId,
        },
      });
      const response = httpMocks.createResponse();
      const oneTweet = { text: faker.random.words(3) };
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet id(${tweetId}) not found`,
      });
      expect(tweetRepository.getById).toHaveBeenCalledWith(tweetId);
    });
  });

  describe("createTweet", () => {
    let newTweet, authorId, request, response;
    beforeEach(() => {
      newTweet = faker.random.words(3);
      authorId = faker.random.alphaNumeric(16);
      request = httpMocks.createRequest({
        body: { text: newTweet },
        userId: authorId,
      });
      response = httpMocks.createResponse();
    });

    it("returns 201 with created tweet object including userId", async () => {
      tweetRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        text: newTweet,
        userId: authorId,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(newTweet, authorId);
    });

    it("shold shend an event to a websocket channel", async () => {
      tweetRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(mockedSocket.emit).toHaveBeenCalledWith("tweets", {
        text: newTweet,
        userId: authorId,
      });
    });
  });

  describe("updateTweet", () => {
    let authorId, otherId, newTweet, request, response;
    beforeEach(() => {
      authorId = faker.random.alphaNumeric(16);
      otherId = faker.random.alphaNumeric(16);
      newTweet = faker.random.words(3);
      request = httpMocks.createRequest({
        userId: authorId,
        body: { text: newTweet },
      });
      response = httpMocks.createResponse();
    });

    it("returns 404 when tweet not found", async () => {
      tweetRepository.getById = jest.fn((userId) => undefined);

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(404);
    });

    it("returns 403 when tweet.userId !== req.userId", async () => {
      tweetRepository.getById = jest.fn((userId) => ({
        text: newTweet,
        userId: otherId,
      }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(403);
    });

    it("updates the repository and return 200", async () => {
      const modifiedText = faker.random.words(3);
      tweetRepository.getById = jest.fn((id) => ({
        text: newTweet,
        userId: authorId,
      }));
      tweetRepository.update = jest.fn((id, text) => ({
        text: modifiedText,
        userId: authorId,
      }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({
        text: modifiedText,
        userId: authorId,
      });
    });
  });

  describe("deleteTweet", () => {
    let authorId, tweetId, request, response;
    beforeEach(() => {
      authorId = faker.random.alphaNumeric(16);
      tweetId = faker.random.alphaNumeric(16);
      request = httpMocks.createRequest({
        userId: authorId,
        params: { id: tweetId },
      });
      response = httpMocks.createResponse();
    });
    it('returns 204 and remove the tweet from the repository if the tweet exists', async ()=>{
      tweetRepository.remove = jest.fn();
      tweetRepository.getById = jest.fn(() => ({ userId: authorId }));

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(204);
      expect(tweetRepository.remove).toHaveBeenCalledWith(tweetId);
    });

    it('returns 404 and should not update the repository if the tweet does not belong', async ()=>{
      tweetRepository.remove = jest.fn();
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toMatchObject({message: `Tweet not found: ${tweetId}`})
      expect(tweetRepository.remove).not.toHaveBeenCalled();
    });

    it('returns 403 when userId was not matched', async ()=>{
      tweetRepository.remove = jest.fn();
      tweetRepository.getById = jest.fn(() => ({userId: undefined}));

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(403);
      expect(tweetRepository.remove).not.toHaveBeenCalled();
    });
  });
});
