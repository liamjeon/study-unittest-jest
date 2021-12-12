const UserService = require("../user_service.js");
const UserClient = require("../user_client.js");

jest.mock('../user_client.js');
describe("UserService", () => {
  //Mock을 이용하여 함수 실행을 추적할 수 있다.
  //login은 몇 번을 시도하든 한번만 실행해야하고, 이 실행횟수를 측정할 수 있다.

  const login = jest.fn(async () => "success");
  UserClient.mockImplementation(()=>{
      return {
          login,
      };
  });

  let userService;
  beforeEach(() => {
    userService = new UserService(new UserClient());
    login.mockClear();
    UserClient.mockClear();
  });

  it("calls login() on UserClient when tries to login", async () => {
    await userService.login("abc", "abc");
    expect(login.mock.calls.length).toBe(1);
  });

  it("shold not call login() on UserClient again if aleady logged in", async () => {
    await userService.login("abc", "abc");
    expect(login.mock.calls.length).toBe(1);
  });
});
