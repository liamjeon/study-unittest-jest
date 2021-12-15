const fetchProduct = require("../async.js");

describe("Async", () => {
  //done 방식은 5s 동안 기다림 그래서 return or await 방식이 더 깔끔하고 좋음
  it("async-done", (done) => {
    fetchProduct().then((item) => {
      expect(item).toEqual({ item: "Milk", price: 200 });
      done();
    });
  });

  it("async-return", () => {
    return fetchProduct().then((item) => {
      expect(item).toEqual({ item: "Milk", price: 200 });
    });
  });

  it("async-await", async () => {
    const product = await fetchProduct();
    expect(product).toEqual({ item: "Milk", price: 200 });
  });

  it("async-resolve", () => {
    return expect(fetchProduct()).resolves.toEqual({
      item: "Milk",
      price: 200,
    });
  });

  it("async-reject", () => {
    return expect(fetchProduct('error')).rejects.toEqual('network error');
  });
});
