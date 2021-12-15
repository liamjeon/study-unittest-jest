const check = require("../check.js");

describe("check", () => {
  let onSuccess;
  let onFail;

  beforeEach(() => {
    //mock 함수 선언
    onSuccess = jest.fn();
    onFail = jest.fn();
  });

  it("shold call onSucces when predicate is true", () => {
    check(() => true, onSuccess, onFail);
    //onSucess mock 함수가 n 번은 호출되어야 한다
    //expect(onSuccess.mock.calls.length).toBe(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    //calls에 첫번째로 호출된 함수의 첫번쨰 인자는 'yes'여야 한다.
    //expect(onSuccess.mock.calls[0][0]).toBe('yes');
    expect(onSuccess).toHaveBeenCalledWith("yes");
    //expect(onFail.mock.calls.length).toBe(0);
    expect(onFail).toHaveBeenCalledTimes(0);
  });

  it("shold call onFail when predicate is false", () => {
    check(() => false, onSuccess, onFail);

    expect(onFail).toHaveBeenCalledTimes(1);
    expect(onFail).toHaveBeenCalledWith("no");
    expect(onSuccess).toHaveBeenCalledTimes(0);
  });
});
