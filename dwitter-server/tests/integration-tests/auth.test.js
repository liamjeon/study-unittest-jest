//테스트 전! 서버 시작 및 데이터베이스 초기화! 설정!
//테스트 후! 데이터베이스 깨끗하게 청소!

import axios from "axios";
import { startServer, stopServer } from "../../app.js";
import { sequelize } from "../../db/database.js";
import faker from "faker";

describe("Auth APIs", () => {
  let server;
  let request;
  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: "http://localhost:8080",
      validateStatus: null,
      //axios는 200:성공, 그 이외의 300,400은 에러를 던짐
      //따라서 catch로 따로 처리를해줘야하지만 테스트는 우리가 예상하는 것이기 때문에
      //null로 모두 성공으로 가정함
    });
  });

  afterAll(async () => {
    await sequelize.drop(); //모든 table 들을 drop 함
    await stopServer(server); //server를 닫음
  });

  describe("POST to /auth/signup", () => {
    it("returns 201 and authorization token when user defails are valid", async () => {
      //given
      const user = makeValidUserDetails();
      //action
      const response = await request.post("/auth/signup", user);

      //then
      expect(response.status).toBe(201);
      expect(response.data.token.length).toBeGreaterThan(0);
    });

    it("returns 409 when duplicate username", async () => {
      //given
      const user = makeValidUserDetails();
      const response1 = await request.post("/auth/signup", user);

      //action
      const response2 = await request.post("/auth/signup", user);

      //then
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(409);
    });
  });

  describe("Validates Signup to /auth/signup", () => {
    it("Error occur when name is empty", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: "",
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      //action
      const response = await request.post("/auth/signup", user);

      //then
      expect(response.data.message).toBe("name is missing");
    });

    it("Error not occur when name is", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      //action
      const response = await request.post("/auth/signup", user);

      //then
      expect(response.status).toBe(201);
    });

    it("Error occur when email is empty", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: "",
        password: faker.internet.password(10),
      };
      //action
      const response = await request.post("/auth/signup", user);

      //then
      expect(response.data.message).toBe("invalid email");
    });
  });

  describe("Validates login to /auth/login", () => {
    it("Error occur when usernae is not normall", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: "",
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      //action
      const response = await request.post("/auth/login", user);

      //then
      expect(response.data.message).toBe(
        "username should be at least 5 characters"
      );
    });

    it("Error occur when password is not normall", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: "",
      };
      //action
      const response = await request.post("/auth/login", user);

      //then
      expect(response.data.message).toBe(
        "password should be at least 5 characters"
      );
    });
  });

  describe("POST to /auth/login", () => {
    it("retruns 401 when user not found", async () => {
      //given
      const user = makeValidUserDetails();

      //action
      const response = await request.post("/auth/login", user);

      //then
      expect(response.status).toBe(401);
    });

    it("retruns 401 when not matched password", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      const otherUser = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: faker.internet.password(10),
      };
      //action
      await request.post("/auth/signup", user);
      const response = await request.post("/auth/login", otherUser);

      //then
      expect(response.status).toBe(401);
      expect(response.data.message).toBe("Invalid user or password");
    });

    it("retruns 200 when found user and valid password", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      //action
      const resSignup = await request.post("/auth/signup", user);
      const resLogin = await request.post("/auth/login", user);

      //then
      expect(resSignup.status).toBe(201);
      expect(resLogin.status).toBe(200);
    });
  });

  describe("GET to /auth/me", () => {
    it("return 200 when find user", async () => {
      //given
      const fakeUser = faker.helpers.userCard();
      const user = {
        name: fakeUser.name,
        username: fakeUser.username,
        email: fakeUser.email,
        password: faker.internet.password(10),
      };
      const me = await request.post("/auth/signup", user);
      //action
      const res = await request.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${me.data.token}`,
        },
      });
      //then
      expect(res.status).toBe(200);
    });
  });

  describe("Tweets APIs", () => {
    describe("POST /tweets", () => {
      it("returns 201 when create tweet normally", async () => {
        //given
        const text = faker.random.words(3);
        const user = await createNewUserAccount();
        //action
        const res = await request.post(
          '/tweets',
          { text: text },
          { headers: { Authorization: `Bearer ${user.jwt}` } }
        );
        //then
        expect(res.status).toBe(201);
      });
    });
  });

  async function createNewUserAccount() {
    const userDetails = makeValidUserDetails();
    const prepareUserResponse = await request.post("/auth/signup", userDetails);
    return {
      ...userDetails,
      jwt: prepareUserResponse.data.token,
    };
  }
});



function makeValidUserDetails() {
  const fakeUser = faker.helpers.userCard();
  return {
    name: fakeUser.name,
    username: fakeUser.username,
    email: fakeUser.email,
    password: faker.internet.password(10, true),
  };
}
