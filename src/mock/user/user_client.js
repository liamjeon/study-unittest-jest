//Network 사용하지 않고 단위 테스트를 하기위해 별도의 class를 만듬

class UserClient {
  login(id, password) {
    return fetch("http://example.com/login/id+password").then((response) =>
      response.json()
    );
  }
}

module.exports = UserClient;
