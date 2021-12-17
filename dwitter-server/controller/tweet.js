// import * as this.tweets from '../data/tweet.js';
// import { getSocketIO } from '../connection/socket.js';

//tweet controller module 안에서 개별적인 함수를 쓰는 것이 아니라
//필요한 dependency를 받아와서 내부적으로 사용하는 class를 만듬

//주의, getTweets을 호출하면 getTweet안에서 this 값을 잃어버림
//이때 function이 아닌 Arrow Function을 사용해야함. 이유는 자동으로 this가 바인딩됨
export class TweetController {
  constructor(tweetRepository, getSocket) {
    this.tweets = tweetRepository;
    this.getSocket = getSocket;
  }
  getTweets = async (req, res) => {
    const username = req.query.username;
    const data = await (username
      ? this.tweets.getAllByUsername(username)
      : this.tweets.getAll());
    res.status(200).json(data);
  };

  getTweet = async (req, res, next) => {
    const id = req.params.id;
    const tweet = await this.tweets.getById(id);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
  };

  createTweet = async (req, res, next) => {
    const { text } = req.body;
    const tweet = await this.tweets.create(text, req.userId);
    res.status(201).json(tweet);
    this.getSocket().emit('tweets', tweet);
  };

  updateTweet = async (req, res, next) => {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await this.tweets.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    const updated = await this.tweets.update(id, text);
    res.status(200).json(updated);
  };

  deleteTweet = async (req, res, next) => {
    const id = req.params.id;
    const tweet = await this.tweets.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    await this.tweets.remove(id);
    res.sendStatus(204);
  };
}
