import { string } from "prop-types";

const a = {
  init: function (params: any) {
    console.log('开始类的学习', params);
  }
};


// ----------------------start 类----------------------
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message || '';
  }

  greeter() {
    return 'Hello,' + this.greeting;
  }
}

const firstGreeter = new Greeter(' World');
console.log(firstGreeter.greeter());
// ----------------------end 类----------------------


// ----------------------start 继承----------------------
class Animal {
  move(distanceMeters: number = 0) {
    console.log(`Animal moved ${distanceMeters}m`);
  }
}

class Dog extends Animal {
  bark() {
    console.log('woof!!!');
  }
}

const dog = new Dog();
dog.bark();
dog.move(1000);
dog.bark();

// 派生类通常被称作子类，基类通常被称作超类。
// 狗是子类 , 动物就是超类
// 超集指的是功能，而不是说能过 ts 编译器检查的文件集合是 js 的超集。
// 虽然我知道这是 ts 的特点，但是这完全不符合他说的超集。

{
  // another example

  // 与前一个例子的不同点是，派生类包含了一个构造函数，它必须调用super()，它会执行基类的构造函数。
  // 而且，在构造函数里访问this的属性之前，我们一定要调用super()。 这个是TypeScript强制执行的一条重要规则。
  class Animal {
    name: string;

    constructor(theName: string) { this.name = theName; }

    move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
  }

  class Snake extends Animal {
    // constructor(name: string) { }  //继承的animal 也不需要 super 一下了

    move(distanceInMeters = 5) {
      // 重写了move的方法
      // 和java 不同的是 不是直接重载 不是直接重写 而是重写的时候用到了super的方法
      console.log('Slithering...');
      super.move(distanceInMeters);
    }
  }

  class Horse extends Animal {
    constructor(name: string) { super(name); console.log('hhhhhhh------ horse useless constructor'); }

    move(distanceInMeters = 45) {
      console.log('Galloping...');
      super.move(distanceInMeters);
    }
  }

  const sam = new Snake('Sammy the Python');
  const tom: Animal = new Horse('Tommy the Palomino');
  console.log('name----', sam.name);
  console.log('name----', tom.name);
  sam.move();
  tom.move(34);
}


// ----------------------end 继承----------------------


// ----------------------start 公共，私有与受保护的修饰符----------------------
// 1.如果属性或者方法前不加修饰符,则默认为public

// 额外:C#要求必须明确地使用public指定成员是可见的。
// 在ts里 成员都默认为public
// 理解private 和 protected,
// 当我们比较带有private或protected成员的类型的时候，
// 情况就不同了。 如果其中一个类型里包含一个private成员
// ，那么只有当另外一个类型中也存在这样一个private成员，
// 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。
// 1.要有相同的属性或者方法。 2.出处相同
//  对于protected成员也使用这个规则。


{
  class Basic {
    private name: string;
    constructor(theName: string) {
      this.name = theName;
    }
  }

  class A extends Basic {
    constructor() { super("aaaa"); }
  }

  class Other {
    private name: string;
    constructor(theName: string) {
      this.name = theName;
    }
    public getName() {
      console.log(this.name);
    }
  }

  let a = new A();
  let ba = new Basic('a');
  let other = new Other('other');
  a = ba;
  ba = a;
  // other = a; //看上去 不能赋值...但是赋值了也可以执行 强行报错
  //不能将类型“A”分配给类型“Other”。
  // 类型具有私有属性“name”的单独声明。t
  // a = other;
  other.getName();
}

{
  class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
  }

  class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
      super(name)
      this.department = department;
    }

    public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
  }

  let howard = new Employee("Howard", "Sales");
  console.log(howard.getElevatorPitch()); //派生类中可以访问,但是不能直接访问 实例的name...因为被保护！！！！！
  // console.log('name---------', howard.name); // 错误
}

{
  //构造函数也可以被标记成protected

  class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
  }

  // Employee 能够继承 Person
  class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
      super(name);
      this.department = department;
    }

    public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
  }

  let howard = new Employee("Howard", "Sales");
  // let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的. Person不能 直接实例化 但是可以继承然后实例化
}

// ----------------------end 公共，私有与受保护的修饰符----------------------




//----------------------start readonly 修饰符----------------------
{
  class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor(theName: string) {
      this.name = theName;
    }
  }
  let dad = new Octopus("Man with the 8 strong legs");
  // dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
}
//----------------------end readonly 修饰符----------------------


//----------------------start 参数属性----------------------

// 参数属性通过给构造函数参数添加   一个访问限定符来声明。
// 使用private,public和protected 限定一个参数属性会声明并初始化一个私有成员；
// 如果不加修饰符就没有初始化哟

{
  class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
  }

  const a = new Animal('cat');
  a.move(100);
}
//----------------------end 参数属性----------------------


//----------------------start 存取器----------------------
{
  let passcode = "secret passcode1";

  class Employee {
    private _fullName: string;

    get fullName(): string {
      console.log('--get----------fullName')
      return this._fullName;
    }

    set fullName(newName: string) { //假设屏蔽了 只带有get不带有set的存取器自动被推断为readonly
      if (passcode && passcode == "secret passcode") {
        this._fullName = newName;
      } else {
        console.log("Error: Unauthorized update of employee!");
      }
    }
  }

  let employee = new Employee();
  employee.fullName = "Bob Smith";
  if (employee.fullName) {
    alert(employee.fullName);
  }
}
//----------------------end 存取器----------------------



//----------------------start 静态属性----------------------
//就是直接挂在类上的属性 我tm不知道有什么用 貌似用来计数 不是单独属于某个实例的属性
//不是在实例上的属性
{
  class Grid {
    static orgin = { x: 0, y: 0 };
    constructor(public scale: number) {

    }
    calculateDistanceFromOrigin(point: { x: number, y: number }) {
      let xDist = (point.x - Grid.orgin.x);
      let yDist = (point.y - Grid.orgin.y);
      return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
      //开方
    }
  }

  const grid1 = new Grid(1.0);
  const grid2 = new Grid(5.0);

  console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
  console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }));
}



//----------------------end 静态属性----------------------



//----------------------start 抽象类----------------------

// 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。
// 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 
//然而，抽象方法必须包含abstract关键字并且可以包含访问修饰符。


{
  abstract class Animal {
    abstract makeSound(): void;
    move(): void {
      console.log('roaming the earth....')
    }
    constructor() {

    }
  }


  class Ad extends Animal {
    makeSound(): void {
      console.log('ad from animal make some noise')
    }
    public test(): void {
      console.log('just a test');
    }
  }

  const ad = new Ad();
  ad.makeSound();
  ad.test(); //可以使用子类自己非抽象类的方法
  //but 作为抽象类的应用
  let dad: Animal;
  dad = new Ad();
  // dad.test();//类型“Animal”上不存在属性“test”。ts(
}


//----------------------end 抽象类----------------------



//----------------------start 高级技巧----------------------


//----------------------start 构造函数----------------------

{
  class Greeter {
    static standardGreeting = "Hello, ther1111e";
    greeting: string;
    greet() {
      if (this.greeting) {
        return "Hello, " + this.greeting;
      }
      else {
        return Greeter.standardGreeting;
      }
    }
  }

  let greeter1: Greeter;
  greeter1 = new Greeter();
  console.log(greeter1.greet());

  let greeterMaker: typeof Greeter = Greeter;
  greeterMaker.standardGreeting = "Hey there!";

  let greeter2: Greeter = new greeterMaker();
  console.log(greeter2.greet());
}

//----------------------end 构造函数----------------------


//----------------------start 类当做接口使用----------------------
//如上一节里所讲的，类定义会创建两个东西：类的实例类型和一个构造函数。
// 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。
{
  class Point {
    protected x: number;
    protected y: number;
  }



  interface colorPanel extends Point {
    color: string;
  }

  class c extends Point implements colorPanel {
    //这样 必须继承有私有或者保护类型
    color: string;
    protected x: number;   //才可以继续
    protected y: number;
    constructor(x: string) {
      super();
      this.color = x;
    }
  }

  // const a: colorPanel = {
  //   color: "3",
  //   x: 1,
  //   y: 2
  // }  //这种肯定不能直接....使用拉
  const a = new c('fuck string');
  console.log('---------f', a.color);
}
//----------------------end 类当做接口使用----------------------

//----------------------end 高级技巧----------------------


console.log('--------------类学习11');
export default a;
