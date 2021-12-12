//Mock 을 남용하는 사례
//ProductClient는 네트워크 통신을하는데, ProductService에서 ProductClient를 실행하며 나오는 테스트 에러를
//확인하기가 어렵다. 그래서 ProductClient를 Mock으로 만든다.

//ProductService 에서 그 어떤 module, Class를 사용하든 그 것 들의 영향을 받지 않도록
//나머지 모든 의존성에 대해서 mock을 이용함.

//이렇게 했을 떄 장점은,
//fetchItems가 실패하든, 네트워크에 문제가 생겼든 환경적인 요인에 영향을 받지않고,
//우리가 원하는 로직 검증할 수 있다!! 이게 바로 단위 테스트이다! 서로 의존하지 않게 만듬!

const ProductService = require("../product_service_no_di.js");
const ProductClient = require("../product_client.js");
jest.mock("../product_client.js");

describe("productServie", () => {
  //비동기로 동작하는 mock 함수
  //fetchItems를 호출하면 값을 리턴함.
  const fetchItems = jest.fn(async () => [
    { item: "Milk", available: true },
    { item: "Coffee", available: false },
  ]);

  //위 함수와 우리가 mock한 ProductClient를 연결해줘야함.
  //이 모듈은 fetchitems라는 것을 export하는데 바로 이건 fetchItems 다.
  //즉 바로 앞에서 정의한 함수와 연결할 수 있음.
  ProductClient.mockImplementation(() => {
    return {
      fetchItems,
    };
  });

  let productService;

  beforeEach(() => {
    productService = new ProductService();
    //manual로 mock 초기화
    //fetchItems.mockClear();
    // ProductClient.mockClear();
  });

  it("should filter out only available item (async,await)", async () => {
    const items = await productService.fetchAvailableItems();

    expect(items.length).toBe(1);
    expect(items).toEqual([{ item: "Milk", available: true }]);
  });

  it("should filter out only available item (promise)", () => {
    productService.fetchAvailableItems().then((items) => {
      expect(items.length).toBe(1);
      expect(items).toEqual([{ item: "Milk", available: true }]);
    });
  });
});
