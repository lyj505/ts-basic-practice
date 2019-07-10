console.log('-------开始类型兼容课程');

// TypeScript里的类型兼容性是基于  结构子类型  的。
// 结构类型是一种只使用其 成员 来描述类型的方式
// 它正好与名义（nominal）类型形成对比

// 基于名义类型的类型系统中，数据类型的
// 兼容性或等价性是  通过明确的声明和/或类型的名称来决定的

// 这与结构性类型系统不同，
// 它是基于类型的   组成结构，且不要求明确地声明。


{
  interface Named {
    name: string;
  }

  class Person {
    name: string;
  }

  let p: Named;
  // OK, because of structural typing
  p = new Person();
  console.log('hahahha java 必须实现一个接口', p);
  // 在使用基于名义类型的语言，比如C#或Java中，这段代码会报错，
  // 因为Person类没有明确说明其实现了Named接口。
  // 这里可以看懂;


  // TypeScript的结构性子类型是根据JavaScript代码的典型写法来设计的
  // 。 因为JavaScript里广泛地使用匿名对象，例如函数表达式和对象字面量，
  // 所以使用结构类型系统来描述这些类型比使用名义类型系统更好。

  // 关于可靠性的注意事项
  // TypeScript的类型系统允许某些在编译阶段无法确认其安全性的操作。
  // 当一个类型系统具此属性时，被当做是“不可靠”的。
  // TypeScript允许这种不可靠行为的发生是经过仔细考虑的。
  // 通过这篇文章，我们会解释什么时候会发生这种情况和其有利的一面。


  let x = (a: number) => 0;
  let y = (b: number, s: string) => 0;

  y = x; // OK
  // x = y; // Error
  // 入参的数量少,且按顺序可以接受到的 可以赋值给多的 反之不行


  // 返回的结果的数量多的可以赋值给少的  反之不行
  {
    let x = () => ({ name: 'Alice' });
    let y = () => ({ name: 'Alice', location: 'Seattle' });
    x = y; // OK
    // y = x; // Error, because x() lacks a location property
  }


}

{
  enum EventType { Mouse, Keyboard }

  interface Event { timestamp: number; }
  interface MouseEvent extends Event { x: number; y: number }
  interface KeyEvent extends Event { keyCode: number }

  function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
  }

  // Unsound, but useful and common
  listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

  // Undesirable alternatives in presence of soundness
  listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
  listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

  // Still disallowed (clear error). Type safety enforced for wholly incompatible types
  // listenEvent(EventType.Mouse, (e: number) => console.log(e));
}

{

  //有一个好的例子，常见的函数接收一个回调函数并用对于程序员来说是
  // 可预知的参数但对类型系统来说是不确定的参数来调用：
  function invokeLater(args: any[], callback: (...args: any[]) => void) {
    callback(...args);
    /* ... Invoke callback with 'args' ... */
  }


  // Unsound - invokeLater "might" provide any number of arguments
  invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

  // Confusing (x and y are actually required) and undiscoverable
  invokeLater([1, 2], (x?, y?) => console.log(x + ', 111' + y));

  enum Status { Ready, Waiting };
  enum Color { Red, Blue, Green };



  //枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。比如，
  //enum Status { Ready, Waiting };
  // enum Color { Red, Blue, Green };

  let status = Status.Ready;
  let status_number = Color.Green;
  // status = status_number;
  // status = Color.Green;  // Error


  // 类与对象字面量和接口差不多，但有一点不同：
  //类有静态部分和实例部分的类型。
  // 比较两个类类型的对象时，
  //只有实例的成员会被比较。
  // 静态成员和构造函数不在比较的范围内。



  class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
    private p: number; //这里有私有变量的话 赋值的时候必须 有继承关系了
  }

  class Size extends Animal {
    feet: number;
    constructor(name: string, numFeet: number) {
      super(name, numFeet);
    };
  }

  let a: Animal = new Animal('11', 1);
  let s: Size = new Size('lyth', 22);

  a = s;  // OK
  // s = a;  // OK
  console.log('aaaaaaaaaa', a)
  console.log('ssssssssssss', s)


}

//----------------------start 类的私有成员和受保护成员----------------------

// 类的私有成员和受保护成员会影响兼容性。 
// 当检查类实例的兼容时，如果目标类型包含一个私有成员，
// 那么源类型必须包含来自同一个类的这个私有成员。 同样地，
// 这条规则也适用于包含受保护成员实例的类型检查。 
// 这允许子类赋值给父类，但是不能赋值给其它有同样类型的类。
//----------------------end 类的私有成员和受保护成员----------------------


{
  //泛型
  interface Empty<T> {
  }
  let x: Empty<number>;
  let y: Empty<string>;

  // x = y;  // OK, because y matches structure of x

  {
    interface NotEmpty<T> {
      data: T;
    }
    let x: NotEmpty<number>;
    let y: NotEmpty<string>;

    // x = y;  // Error, because x and y are not compatible
  }
}

{
  let identity = function <T>(x: T): T {
    // ...
    return x;
  }

  let reverse = function <U>(y: U): U {
    return y;
    // ...
  }

  identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
}

{
  //   子类型与赋值
  // 目前为止，我们使用了“兼容性”，它在语言规范里没有定义。 
  //在TypeScript里，有两种兼容性：子类型  和   赋值。 它们的不同点在于，
  //赋值  扩展了子类型兼容性，增加了一些规则，允许和any来回赋值，以及enum和对应数字值之间的来回赋值。

  // 语言里的不同地方分别使用了它们之中的机制。 
  //实际上，类型兼容性是由赋值兼容性来控制的，即使在implements和extends语句也不例外。
}
export default {

};
console.log('-------结束类型兼容课程');
