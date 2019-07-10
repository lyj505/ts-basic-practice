import { type } from 'os';

/* eslint-disable no-lone-blocks */

console.log('------高级类型---开始了11');

// ----------------------start intersection types 交叉类型----------------------
// 交叉类型是将多个类型合并为一个类型。
// 这让我们可以把现有的多种类型叠加到一起成为一种类型，
// 它包含了所需的所有类型的特性。
//  例如， Person & Serializable & Loggable
//  同时是 Person 和 Serializable 和 Loggable。
//  就是说这个类型的对象同时拥有了这三种类型的成员。
{
  console.log('11');
  try {
    function extend<T, U>(first: T, second: U): T & U {
      const result = <T & U>{};
      for (const id in first) {
        (<any>result)[id] = (<any>first)[id];
      }
      for (const id in second) {
        if (!result.hasOwnProperty(id)) {
          (<any>result)[id] = (<any>second)[id];
        }
      }
      return result;
    }

    class Person {
      constructor(public name: string) { }
    }
    interface Loggable {
      log(): void;
    }
    class ConsoleLogger implements Loggable {
      log() {
        console.log('from consoleLogger');
        // ...
      }
    }
    const jim = extend(new Person('Jim'), new ConsoleLogger());
    const n = jim.name;
    console.log(jim); // 没有混起 jim.log
    jim.log = () => {
      console.log('覆盖');
    };
    jim.log();
    console.log('n的value');
  } catch (err) {
    console.log(err);
  }

}

// ----------------------end intersection types 交叉类型----------------------

// ----------------------start 联合类型 Union Types----------------------

/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */

// 联合类型表示一个值可以是几种类型之一。 我们用竖线（ |）分隔每个类型，
// 所以 number | string | boolean表示一个值可以是 number， string，或 boolean。
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  if (typeof padding === 'string') {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft('Hello world', 4); // returns "    Hello world"

// ----------------------end 联合类型 Union Types----------------------

// ----------------------start 类型保护与区分类型（Type Guards and Differentiating Types）----------------------
{
  // /为了让这段代码工作，我们要使用类型断言：
  // 这种容错联合类型
  // if ((<Fish>pet).swim) {
  //   (<Fish>pet).swim();
  // }
  // else {
  //   (<Bird>pet).fly();
  // }

  // 用户自定义的类型保护
  //   这里可以注意到我们不得不多次使用类型断言。
  //   // 假若我们一旦检查过类型，就能在之后的每个分支里清楚地知道 pet的类型的话就好了。

  // TypeScript里的 类型保护机制让它成为了现实。
  //  类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。
  //   要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 类型谓词：

  // if (isFish(pet)) {
  //   pet.swim =
  // }
  // function isFish(pet: Fish | Bird): pet is Fish {
  //   return (<Fish>pet).swim !== undefined;
  // }

  // pet is Fish就是类型谓词。
  // 谓词为 parameterName is Type这种形式，
  // parameterName必须是来自于当前函数签名里的一个参数名。

  // 定义保护函数
}
// ----------------------end 类型保护与区分类型（Type Guards and Differentiating Types）----------------------

// ----------------------start typeof类型保护----------------------
{
  // parameter is type allright !
  function isNumber(x: any): x is number {
    return typeof x === 'number';
  }

  function isString(x: any): x is string {
    return typeof x === 'string';
  }

  // function padLeft(value: string, padding: string | number) {
  //   if (isNumber(padding)) {
  //     return Array(padding + 1).join(" ") + value;
  //   }
  //   if (isString(padding)) {
  //     return padding + value;
  //   }
  //   throw new Error(`Expected string or number, got '${padding}'.`);
  // }

  function padLeft(value: string, padding: string | number) {
    if (typeof padding === 'number') {
      return Array(padding + 1).join(' ') + value;
    }
    if (typeof padding === 'string') {
      return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
  }

  console.log(padLeft('1', '1'));
}
// ----------------------end typeof类型保护----------------------

// ----------------------start instanceof类型保护----------------------
{
  // instanceof的右侧要求是一个构造函数，TypeScript将细化为：

  // 此构造函数的 prototype属性的类型，如果它的类型不为 any的话
  // 构造签名所返回的类型的联合
  // 以此顺序。
}

// ----------------------end instanceof类型保护----------------------

// ----------------------start 可为null的类型----------------------
{
  const s = 'foo';
  // s = null; // 错误, 'null'不能赋值给'string'
  let sn: string | null | undefined = 'bar';
  sn = null; // 可以

  sn = undefined; // error, 'undefined'不能赋值给'string | null'

  // strictNullChecks 已经再tsconfig里面开启了
  {
    function f(x: number, y?: number) {
      return x + (y || 0);
    }
    f(1, 2);
    f(1);
    f(1, undefined);
    // f(1, null); // error, 'null' is not assignable to 'number | undefined'
  }

}
// ----------------------end 可为null的类型----------------------

{
  function f(sn: string | null): string {
    return sn || 'default';
  }

  function broken(name: string | null): string {
    function postfix(epithet: string) {
      return name.charAt(0) + '.  the ' + epithet; // error, 'name' is possibly null
    }
    name = name || 'Bob';
    return postfix('great');
  }

  function fixed(name: string | null): string {
    function postfix(epithet: string) {
      return name!.charAt(0) + '.  the ' + epithet; // ok
    }
    name = name || 'Bob';
    return postfix('great');
  }
}

{
  // 类型别名会给一个类型起个新名字。
  // 类型别名有时和接口很像，但是可以作用于
  // 原始值，联合类型，元组以及其它任何你需要手写的类型。
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
      return n;
    }
    else {
      return n();
    }
  }

  getName('1');
  // 同接口一样，类型别名也可以是泛型 - 我们可以添加类型参数并且在别名声明的右侧传入：
  type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
  };
  type LinkedList<T> = T & { next: LinkedList<T> };

}

{
  // 另一个重要区别是类型别名不能被 extends和 implements
  // （自己也不能 extends和 implements其它类型）。
  //  因为 软件中的对象应该对于扩展是开放的，
  //  但是对于修改是封闭的，你应该尽量去使用接口代替类型别名。

  // 另一方面，如果你无法通过接口来描述一个类型并且需要
  // 使用联合类型或元组类型，这时通常会使用类型别名。
}

// ----------------------start 字符串字面量类型----------------------
{
  type Easing = 'ease-in' | 'ease-out' | 'ease-in-out' | null;
  class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
      if (easing === 'ease-in') {
        // ...
      }
      else if (easing === 'ease-out') {
      }
      else if (easing === 'ease-in-out') {
      }
      else {
        // error! should not pass null or undefined.
      }
    }
  }

  const button = new UIElement();
  button.animate(0, 0, 'ease-in');
  button.animate(0, 0, null); // error: "uneasy" is not allowed here

}
// ----------------------end 字符串字面量类型----------------------

// ----------------------start 数字字面量类型----------------------
{
  interface Square {
    kind: 'square';
    size: number;
  }
  interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
  }
  interface Circle {
    kind: 'circle';
    radius: number;
  }

  interface Triangle {
    kind: 'triangle';
    radius: number;
  }

  type Shape = Square | Rectangle | Circle | Triangle;

  function assertNever(x: never): never {
    console.log('-------11assert Never', x);
    // throw new Error("Unexpected object: " + x);
  }
  function area(s: Shape) {
    switch (s.kind) {
      case 'square': return s.size * s.size;
      case 'rectangle': return s.height * s.width;
      case 'circle': return Math.PI * s.radius ** 2;
      default: return assertNever(s); // error here if there are missing cases
    }
  }

  const triangle: Triangle = {
    kind: 'triangle',
    radius: 1,
  };
  area(triangle);
}
// ----------------------end 数字字面量类型----------------------

// ----------------------start 多态的this类型----------------------
{
  class BasicCalculator {
    public constructor(protected value: number = 0) {

    }

    public currentValue(): number {
      return this.value;
    }

    public add(operand: number): this {
      this.value += operand;
      return this;
    }
    public multiply(operand: number): this {
      this.value *= operand;
      return this;
    }
  }

  const v = new BasicCalculator(2)
    .multiply(5)
    .add(1)
    .currentValue();
  console.log('-----------v', v);
}
// ----------------------end 多态的this类型----------------------

// ----------------------start 索引类型----------------------
{
  // 首先是 keyof T， 索引类型查询操作符。
  // 对于任何类型 T， keyof T的结果为 T上已知的公共属性名的联合。 例如：
  function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n]);
  }

  interface Person {
    name: string;
    age: number;
    test?: string;
  }

  const person: Person = {
    name: 'Jarid',
    age: 35,
  };

  function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
  }

  const strings: string[] = pluck(person, ['name']);
  const name: string = getProperty(person, 'name');
  const age: number = getProperty(person, 'age');
  // let unknown = getProperty(person, 'unknown');  error

  // 索引类型和字符串索引签名:

  interface Map<T> {
    [key: string]: T;
  }

  let keys: keyof Map<number>; // string
  let value: Map<number>['foo']; // number  == T
}
// ----------------------end 索引类型----------------------

// ----------------------start 映射类型----------------------
{

  interface Person {
    t: number;
    idx: string;
  }
  type Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  type PersonPartial = Partial<Person>;
  type ReadonlyPerson = Readonly<Person>;

  type Keys = 'option1' | 'option2';
  type Flags = { [K in Keys]: boolean };

  // TODO:这里不好写。。。keys是动态的
  // const keys: Keys = {
  //   option1: false,
  //   option2: true,
  // }

  // console.log('我的key-----来起', keys);
}
// ----------------------end 映射类型----------------------

// ----------------------start T【P】----------------------

{

  // 非同态类型本质上会创建新的属性，因此它们不会从它处拷贝属性修饰符。
  // 能不能tm 说人话 你妈的

  type Proxy<T> = {
    get(): T;
    set(value: T): void;
  };

  type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
  };

  function proxify<T>(o: Proxify<T>): Proxify<T> {

    // wrap proxies ..
    return o;
  }

  const props: Proxify<object> = {
    a: 1,
  };
  const proxyProps = proxify(props);
  console.log('proxyProps', proxyProps);
}

{

}

// ----------------------end T【P】----------------------

// ----------------------start 预定义的有条件类型----------------------

// ----------------------end 预定义的有条件类型----------------------
export default {

};
console.log('------高级类型111---结束了');

