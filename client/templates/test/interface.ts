
// 接口  interface 放在最上面 不然要被function 提前...
interface LabeledValue {
  label: string;
}

console.log(printLabel);


function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

const myObj = { size: '11', label: '22' };
printLabel(myObj);

// // 可选属性 option bags
interface SquareConfig {
  color?: string;
  width?: number;
  [sb: string]: any;
  // 字符串索引签名 这样就可以容错其他的位置了
  // 类似于 下面的width1
}

interface requiredConfig {
  color: string;
  area: number
}

const squreOptions = {
  colour: 'red',
  // 还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量：
  // 因为squareOptions不会经过额外属性检查，所以编译器不会报错。
  width: 10
};
// //如果变量间不存在共同的对象属性将会报错。例如：  相当于必须要有一个共同的属性才可以进入..
// //什么玩意
const mySquare = createSquare({ color: 'black', width1: 10 });
const mySquare1 = createSquare(squreOptions);

function createSquare(config: SquareConfig): { color: string, area: number } {
  // 传入的config 必须是  SquareConfig 类型 返回的是后面的对象里面的
  const newSquare = { color: 'white', area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

// // 只读属性

interface P {
  readonly x: number;
  y: number
};

const p1: P = {
  x: 1,
  y: 2
};
p1.y = 3;
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// // ro[0] = 12; //报错不能修改了
// a = ro; // ro miss push pop unshift

a = ro as number[]; //重写ro  始用类型断言
a.push(5)
console.log('ro----', ro); //不能直接改ro 但是可以改a 这tm是什么作用？

// /**
//  *
//  * 函数类型的检测
//  *
//  */

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
// //这里倒是可以不匹配 function 的类型了
mySearch = (source1: string, subString1: string): boolean => {
  //形式参数名倒是无所谓...
  const r = source1.search(subString1);
  return r > -1
}

console.log('mySearchmySearch 是否能够找到字符所在字符串位置', mySearch('aada', 'd'))


// //----------------------start 可索引的类型----------------------
interface StringArray {
  [index: number]: string;//索引签名参数类型必须为 "string" 或 "number"
}

let ar: StringArray;
ar = ["st", "Fred"];

let obj11: StringArray; //这个索引对对象无效 
obj11 = {
  '1': '2',
  3: '4'
}
console.log('---obj11', obj11)

let myStr: string = ar[0];

// //索引签名 说白了 就是校验 数组的key的动态传入的类型,在ts里面 只支持2种索引签名:
// //字符串和数字

// //这个东西和js 不同 js 可以把任何类型的转化为字符串...所以我们必须在索引之前把其他类型
// //都转化为string 或者 number  但注意在这里是数组   没有涉及到js的对象 不是很清楚哦..

class Animal {
  name: string;
}

class Dog extends Animal {
  breed: string;
}



// interface NotOkay {
//   [x: number]: Dog;
//   [x: string]: Animal; //因为这里使用了string Dog 继承于Animal 相当于都是string number 就无效了
// }

interface NotOkay {
  [x: string]: Animal;   //数值索引的Animal 不能赋值给字符串索引的Dog
  [x: number]: Dog; //因为这里使用了string Dog 继承于Animal 相当于都是string number 就无效了
  //FIXME: 让错误暴露
}

//这样写的话 数值索引的value extends 字符串索引的value
//数值索引的范围必须大于等于字符串索引的类型范围

const NotOkay1: NotOkay = {
  'x': new Animal()
}
const aaa11: NotOkay = { 1: new Dog() };
// const aaa: NotOkay = [new Dog(), new Dog()]; 数组限定索引不行？
console.log(NotOkay1);

{
  interface a {
    [asdasda: number]: number,
    // [asdasda: string]: number eg
  }
  const aaa: a = [1];


  interface b {
    [xxxx: number]: Dog,
    [xxxx: string]: Animal
  }

  const ccc = {
    a: new Animal()
  }
  // const bbb: b = [new Dog()]; 数组来说不能用有2个索引范式的.. 对象可以
  //数组里面 优先转化成了数字索引

  // 不能将类型“Dog[]”分配给类型“b”。
  // 类型“Dog[]”中缺少索引签名。ts(2322

  //如果字符串和数字范式索引都存在的话,,最后取到的肯定也是转化成字符串了。。
  //数字那个失效了。。。？？？ 

}

// //保证 字典的 key 为number 类型
interface NumberDictionary {
  [index: string]: number;
  length: number;
  // name: string; // 错误，`name`的类型与索引类型返回值的类型不匹配
}

// //索引赋值

interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];
// myArray[1] = 'ss'; //“ReadonlyStringArray”中的索引签名仅允许读取
console.log('myArray', myArray)

// //----------------------end 可索引的类型----------------------


// //----------------------start 类类型----------------------
// //与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约。

interface ClockInterFace {
  currentTime: Date;
  setTime(d: Date): void;
  c: string; //interface 接口里面如何加上修饰符
}

//类实现一个接口

class Clock implements ClockInterFace {
  currentTime: Date = new Date();
  public setTime(d: Date): number {
    this.currentTime = d;
    return 1;
  }
  private a: number;
  c: string;
  constructor(h: number, m: number) {

  }
}

const tttt = new Clock(1, 2);
console.log('Clock', tttt);

// //接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。


// //----------------------end 类类型----------------------


// //----------------------start 类静态部分和实例部分的区别----------------------
// {

//   // 这里因为当一个类实现了一个接口时，只对其   实例部分  进行类型检查。
//   // constructor存在于类的静态部分，所以不在检查的范围内。


// interface ClockConstructor {
//   new(hour: number, minute: number): ClockInterface
// }

// interface ClockInterface {
//   tick(): void;
// }

// class Clock implements ClockConstructor {
//   currentTime: Date;
//   constructor(h: number, m: number) { }
// }


//   //类型“Clock”提供的内容与签名“new (hour: number, minute: number): ClockInterface”不匹配。ts(2
//   //TODO:就必须像下面一样的解决问题

{

  interface ClockConstructor {
    //类类？
    new(hour: number, minute: number): ClockInterface;
  }
  interface ClockInterface {
    tick(): void;
  }

  function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    //构造函数 去返回一个实例是  ClockInterface 类型的
    //然后让第一个参数是 ClockConstructor类型的,
    //然后把后面2个参数传入第一个参数里面去实例化

    //后面的2个类 都实现了 ClockInterface 则至少有一个tick的方法

    //这种奇葩的 数据类型的 不要直接去实现 ClockConstructor这个接口
    //这种最好就 去返回一个实例是  ClockInterface 类型的
    console.log('---------- init function')
    console.log(new ctor(hour, minute))
    return new ctor(hour, minute);
  }

  class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
      console.log("beep beep");
    }
  }
  class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick(): number {
      console.log("tick tock");
      return 11
    }
  }

  let digital = createClock(DigitalClock, 12, 17);
  let analog = createClock(AnalogClock, 7, 32);
  //FIXME: 这里tm还是错的

  {
    interface ClockConstructor {
      //限制了contructor 里面的内容哦
      new(hour: number, minute: number): void;
    }

    interface ClockInterface {
      tick(): void;
    }

    interface ClockInterface1 {
      tick(): void;
    }

    const Clock: ClockConstructor = class Clock implements ClockInterface {
      constructor(h: number, m: number) { }
      tick() {
        console.log("beep beep");
      }
    }
  }
}


//   //----------------------start 继承接口----------------------
{
  interface Shape {
    color: string;
  }

  interface PenStroke {
    penWidth: number
  }

  interface Square extends Shape, PenStroke {
    sideLength: number;
  }

  let squre1: Square = {
    color: "fff",
    sideLength: 1,
    penWidth: 2
  }; //这样要一次写完
  let squre = <Square>{}; //TODO:范式 666
  squre.color = '#fff';
  squre.sideLength = 18;
  console.log(squre)  //这样可以不用全部去实现完
  // squre.penWidth = 18;
}

//   //----------------------end 继承接口----------------------


//   //----------------------start 混合类型----------------------
//   //一个对象可以同时做为函数和对象使用,并带有额外属性
{


  interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
  }

  function getCounter(): Counter {
    let counter = <Counter>function (start: number): string {
      console.log(start);
      return ''
    };
    counter.interval = 123;
    counter.reset = function () {
      counter.interval = 0;
    };
    return counter;
  }

  let c = getCounter();
  c(11);
  c.reset();
  console.log('reset之后的属性---interval', c.interval)

}
//   //----------------------end 混合类型----------------------


//   //----------------------start 接口继承类----------------------
//   //1.当接口继承了一个类类型时，它会继承类的成员但不包括其实现。
//   //2.接口同样会继承到类的private和protected成员。  好像java 里面接口不能继承类把？？？TODO:回去看看
//   //3.创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。
//   //注:当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。
//   //----------------------end 接口继承类----------------------

{
  class Control {
    private state: any;
  }
  interface SelectableControl extends Control {
    select(): void;
  }

  //一个Button类实现一个(继承类的接口),必须要继承对应的类...才能拥有私有属性
  class Button extends Control implements SelectableControl {
    select() {

    }
  }



  // class TextBox implements SelectableControl {
  //   select() { }
  // }

  //只有子类才能够 实现接口

}


// }
// //----------------------end 类静态部分和实例部分的区别----------------------

export default {
  name: 'practice of interface',
  mySquare,
  p1
};
