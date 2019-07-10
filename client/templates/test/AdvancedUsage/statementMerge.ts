/* eslint-disable no-lone-blocks */
// console.clear();

console.log('开始----生命合并');
{
  // 接口的非函数的成员应该是唯一的
  interface Box {
    height: number;
    width: number;
  }

  interface Box {
    scale: number;
  }

  const box: Box = { height: 5, width: 6, scale: 10 };
  console.log('this is merged Box', box);
}
export default {

};
console.log('end----生命合并');


{
  class Animal {

  }
  interface Cloner {
    clone(animal: Animal): Animal;
  }

  interface Cloner {
    clone(animal: Sheep): Sheep;
  }

  interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
  }

  const a: Cloner = {
    clone: (animal: Animal) => {
      console.log('---', animal);
    }
  };
  const animal = new Animal();
  // https://www.tslang.cn/docs/handbook/declaration-merging.html
  // 声明合并
  a.clone(animal);
}
