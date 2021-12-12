const Stack = require("../stack.js");

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("is created empty", () => {
    expect(stack.size()).toBe(0);
  });

  describe("Push", () => {
    it("push", () => {
      stack.push(3);
      expect(stack.size()).toBe(1);
      expect(stack.arr[0]).toBe(3);
    });
  });

  describe("Pop", () => {
    it("return the last pushed item and remove it ", () => {
      stack.push(4);
      expect(stack.pop()).toBe(4);
    });

    it("throw an error if stack is empty", () => {
      expect(() => {
        stack.pop();
      }).toThrow("Stack is empty");
    });
  });

  describe("Peek", () => {
    it("return the last pushed item but not remove it", () => {
      stack.push(4);
      expect(stack.peek()).toBe(4);
      expect(stack.size()).toBe(1);
    });
  });
});
