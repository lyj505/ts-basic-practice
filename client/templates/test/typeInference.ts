// 这节介绍TypeScript里的类型推论。即，类型是在哪里如何被推断的。
console.log('-------开始类型推断');

class Animal {

}

class Rhino extends Animal {

}

class Elephant extends Animal {

}

class Snake extends Animal {

}

// 这个例子里，最佳通用类型有4个候选者：
// sAnimal，Rhino，Elephant和Snake。
// 当然， Animal会被做为最佳通用类型。

function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake(), 1];// 1为什么可以..
}

console.log(createZoo());
export default {

};
console.log('-------结束类型推断');
