/* eslint-disable no-lone-blocks */
const a = 'a';
import "reflect-metadata";


console.log('---------开始装饰器');

{
  // 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，
  // 访问符，属性或参数上。 装饰器使用 @expression这种形式，
  // expression求值后必须为一个函数，它会在运行时被调用，
  // 被装饰的声明信息做为参数传入。


  //   1参数装饰器，然后依次是  方法装饰器，  访问符装饰器，
  // 或  属性装饰器   应用到每个实例成员。

  // 2参数装饰器，然后依次是  方法装饰器，   访问符装饰器，
  // 或  属性装饰器应用到每个静态成员。

  // 3参数装饰器 应用到 构造函数。
  // 4类装饰器  应用到  类。
  function f() {
    console.log('f(): evaluated');
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log('f(): called');
    };
  }

  function g() {
    console.log('g(): evaluated');
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log('g(): called');
    };
  }

  class C {
    @f()
    @g()
    // 这个输出证明像koa 的洋葱模型
    method() { }
  }
  console.log('-------大 C');
  const c = new C();
  console.log('-application', c);
}


{
  function sealed(constructor: Function) {
    console.log('类装饰器===');
    Object.seal(constructor);
    Object.seal(constructor.prototype);
  }
  @sealed
  class Greeter {
    greeting: string;

    constructor(message: string) {
      console.log('---new  greeter');
      this.greeting = message;
    }

    greet() {
      return 'Hello, ' + this.greeting;
    }
  }

  const g = new Greeter('hello world');
  console.log(g.greet());
}


{
  //重构构造函数
  function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      newProperty = "new property";
      hello = "override";
    }
  }

  @classDecorator
  class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
      this.hello = m;
    }
  }

  console.log('hello属性', new Greeter("world").hello);
}


//----------------------start 方法属性器----------------------
{
  //方法装饰器不能用在声明文件( .d.ts)
  //   方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

  // 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // 成员的名字。
  // 成员的属性描述符。

  function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.enumerable = value;
    };
  }

  class Greeter {
    greeting: string;
    constructor(message: string) {
      this.greeting = message;
    }

    @enumerable(false)
    greet() {
      return "Hello, " + this.greeting;
    }
  }

  let a = new Greeter('greeting');
  console.log('xxxx', a.greet());
  console.log(
    Object.getOwnPropertyDescriptor(a, 'greet'));
}
//----------------------end 方法属性器----------------------

{

  const formatMetadataKey = Symbol("format");

  function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
  }

  function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
  }

  class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
      this.greeting = message;
    }
    greet() {
      let formatString = getFormat(this, "greeting");
      console.log('this.greeting', this.greeting)
      return formatString.replace("%s", this.greeting);
    }
  }

  let a = new Greeter('greeeting word!');
  console.log('111111', a.greet());
}

console.log('---------11结束装饰器');
export {
  // eslint-disable-next-line import/prefer-default-export
  a
};
