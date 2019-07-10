
console.log('----开始symbol 类型表演');


// ----------------------start production----------------------
{
  // eslint-disable-next-line symbol-description
  const symbol1 = Symbol('key');
  console.log('symbol1', symbol1);
}

{
  const sym2 = Symbol('key');
  const sym3 = Symbol('key');

  console.log('always false--', sym2 === sym3); // false, symbols是唯一的
}

{
  // symbols也可以被用做对象属性的键。
  const sym = Symbol('1');
  console.log(sym);
  const obj = {
    [sym]: 'value'
  };
  console.log('-----------v', obj);
}


{
  // Symbols也可以与计算出的属性名声明相结合来声明对象的属性和类成员。
  const getClassNameSymbol = Symbol();

  class C {
    [getClassNameSymbol]() {
      return 'C';
    }
  }

  const c = new C();
  const className = c[getClassNameSymbol](); // "C"
  console.log('--------cls', className);
}
// ----------------------end production----------------------
export default {

};
console.log('----结束symbol 类型表演');
