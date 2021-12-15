const ProductService = require("../product_service_di.js");
const StubProductClient = require("./stub_product_client.js");


//no_di 에서는 서비스 안에서 필요한 의존성을 생성해줬으나,
//di 있는 상태에서는 mock을 사용해도 되지만,
//Stub 버전을 이용해서 Stub 버전을 주입하여 필요한 데이터만 받아오는 것을 사용함.
//이는 상황에따라서 어느 것을 사용할지 골라야함..!! 케바케임!!
describe("productServie - Stub", () => {
  let productService;

  beforeEach(()=>{
    productService = new ProductService(new StubProductClient());
  });

  it("should filter out only available item (async,await)", async () => {
    const items = await productService.fetchAvailableItems();

    expect(items.length).toBe(1);
    expect(items).toEqual([{ item: "Milk", available: true }]);
  });

}); 