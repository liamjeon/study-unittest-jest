//Stub fn은 Mock은 아니고 실제로 구현사항이 있는 class이나,
//기존 fn과 동일한 인터페이스를 가지면서 Network를 사용하는 것이 아니라
//데이터를 바로 Retrun하는 함수로 만듬.

class StubProductClient {
  async fetchItems() {
    return [
      { item: "Milk", available: true },
      { item: "Coffee", available: false },
    ];
  }
}

module.exports = StubProductClient;