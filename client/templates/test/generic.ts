import { string, number, func } from 'prop-types';
console.log('开始进行generic范式的学习--');
/* eslint-disable no-lone-blocks */
// 泛型之Hello World

function identity(params: any): any {
  console.log(typeof params);
  return params + '';
}

console.log(typeof identity(1));
console.log(typeof identity('222'));


// 接下来我们让传入类型和传出类型保持一致;

// 这里，我们使用了类型变量，它是一种特殊的变量，只用于表示类型而不是值。

function identifyRight<T>(arg: T): T {
  return arg;
}

// 我们把这个版本的identity函数叫做泛型，因为它可以适用于多个类型。 不同于使用any，它不会丢失信息
console.log('---唯一类型', typeof identifyRight(1));
console.log('---唯一类型', typeof identifyRight('222'));


const output = identifyRight<string>('11');
console.log(typeof output);


// ----------------------start error example----------------------
// eslint-disable-next-line no-lone-blocks
{

  function loggingIdentity<T>(params: T[]): T[] {
    console.log(params.length);
    return params;
  }

  loggingIdentity<number>([1, 2]);

  function loggingIdetity1<T>(args: Array<T>): Array<T> {
    console.log(args.length);  // Array has a .length, so no more error
    return args;
  }

  loggingIdetity1<string>(['222', '1', '1', '4']);

  const output = loggingIdetity1<String>(['1', '2']);
  console.log('output----', output);
  // 。 在下一节，会介绍如何创建自定义泛型像Array<T>一样。
}

// ----------------------end error example----------------------

// ----------------------start 泛型函数----------------------
{
  function identity<T>(arg: T): T {
    return arg;
  }

  const myIdentity: <T>(arg: T) => T = identity; // 看不懂这种写法
  // 我们还可以使用带有调用签名的对象字面量来定义泛型函数：
  console.log('fuck---', myIdentity);
  const output = myIdentity<boolean>(true);
  console.log('??? oo', output);
}

// ----------------------end 泛型函数----------------------


// ----------------------start 泛型接口----------------------


{
  // 除了泛型接口，我们还可以创建泛型类。 注意，无法创建泛型枚举和泛型命名空间。
  interface GenericIdentityFn {
    <T>(arg: T): T; // 检验函数参数
  }

  function identity<T>(arg: T): T {
    return arg;
  }

  const myIdentity: GenericIdentityFn = identity;
  // console.log(myIdentity1(2));
}
// ----------------------end 泛型接口----------------------


// ----------------------start 泛型类----------------------
// https://www.tslang.cn/docs/handbook/generics.html
{
  // 泛型类使用(<>)括起泛型类型,跟在类名后面
  // 与接口一样,直接把泛型类型放在类后面,可以帮助我们确认类的所有属性都在使用相同的类型。
  // 类:静态+实例  泛类型是指实例部分的类型
  class GenericNumber<T> {
    // static a: T = 1;// 静态成员不能引用类类型参数。

    zeroValue: T;

    add: (x: T, y: T) => T;
  }

  const myGenuricNumber = new GenericNumber<number>();
  myGenuricNumber.zeroValue = 1;
  myGenuricNumber.add = (x, y) => x + y;

  const myGenericString = new GenericNumber<string>();
  myGenericString.zeroValue = '';
  myGenericString.add = (x, y) => x + y;
}

// ----------------------end 泛型类----------------------


// ----------------------start 泛型约束----------------------
{

  interface Lengthwise {
    length: number;
  }

  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
  }
  console.log('have a length -----');
  loggingIdentity({
    length: 2
  })

  interface T {

  }

  interface K {
    k: string
  }

  {
    interface K {
      k: string
    }

    const k1: K = { k: '1' };
  }




  // 函数内部 多个泛型参数怎么弄
  function getProperty(obj: T, key: string) {
    return obj[key];
  }

  let x = { a: 1, b: 2, c: 3, d: 4 };

  console.log('property---', getProperty(x, "a")); // okay
  console.log('property---', getProperty(x, "m")); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.




  //在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，
  function create<T>(c: { new(): T }): T {
    return new c();
  }

  class Test {
    constructor() {

    }
  }

  //https://stackoverflow.com/questions/39622778/what-is-new-in-typescript#

  const a = create(Test);
  console.log(a);

  {
    function create1<T>(c: { new(a: number): T; }): T {
      return new c(1);
    }
    class Test1 {
      constructor(a: number) {

      }
    }
    const a = create1(Test1);
  }


  // function create<T>(c: { new(): T; }): T {
  //   return new c();
  // }

  // const c = create(new function);
  // console.log('ccccc', c);

  //create函数的参数是构造函数没有参数的T类的类型,同理，
  //createInstance函数的参数是构造函数没有参数的A类的类型。

  //一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
  class BeeKeeper {
    hasMask: boolean;
  }

  class ZooKeeper {
    nametag: string;
  }


  class Animal {
    numLegs: number;
  }

  class Bee extends Animal {
    keeper: BeeKeeper;
  }

  class Lion extends Animal {
    keeper: ZooKeeper;
  }

  function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
  }

  const lion = new Lion();
  lion.numLegs = 1;
  console.log('xxxxxlion', lion)

  console.log('lion---11', createInstance(Lion));  // typechecks! undefined?
  console.log('bee----', createInstance(Bee).keeper);  // typechecks!
  //TODO:.keeper.hasMask
}
// ----------------------end 泛型约束----------------------
export default {

};


console.log('结束进行generic范式的学习--');