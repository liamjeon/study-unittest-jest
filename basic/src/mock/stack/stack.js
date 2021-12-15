class Stack {
  constructor() {
    this.arr = [];
  }
  size(){
      return this.arr.length;
  }

  push(item) {
    this.arr.push(item);
  }
  
  pop() {
    if (this.size() === 0){
        throw new Error("Stack is empty");
    }
    return this.arr.pop();
  }

  peek() {
    return this.arr[this.size()-1];
  }
}

module.exports = Stack;
