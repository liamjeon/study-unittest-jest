const Calculator = require("../calculator.js");

//describe 관련된 테스트를 묶을 수 있음

describe("Calculator", () => {
  let cal;
  //모든 테스트가 시작할떄 beforeEach 동작 수행
  beforeEach(() => {
    cal = new Calculator();
  });
  //test 대신에 it으로 쓸 수 있음
  it("init with 0", () => {
    expect(cal.value).toBe(0);
  });
  it("set", () => {
    cal.set(10);
    expect(cal.value).toBe(10);
    expect(cal.value).not.toBe(9);
  });

  it("clear", () => {
    cal.clear();
    expect(cal.value).toBe(0);
  });

  describe("add", () => {
    it("add less than 100", () => {
      cal.add(100);
      expect(cal.value).toBe(100);
    });

    it('add should throw error if value is greater than 100', ()=>{
        expect(()=>{
            cal.add(101);
        }).toThrow(Error);
    })
  });

  it("substract", () => {
    cal.set(10);
    cal.subtract(3);

    expect(cal.value).toBe(7);
  });

  it("multiply", () => {
    cal.set(10);
    cal.multiply(2);

    expect(cal.value).toBe(20);
  });

  describe("divide", () => {
    it("0/0 === NaN", () => {
      cal.divide(0);
      expect(cal.value).toBe(NaN);
    });
    it("1/0 === Infinity", () => {
      cal.set(1);
      cal.divide(0);
      expect(cal.value).toBe(Infinity);
    });
    it("4/4 === 1", () => {
      cal.set(4);
      cal.divide(4);
      expect(cal.value).toBe(1);
    });
  });
});
