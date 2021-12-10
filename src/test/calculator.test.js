const Calculator = require('../calculator.js');

test('set()', ()=>{
    const cal = new Calculator();
    cal.set(10);
    expect(cal.value).toBe(10);
})