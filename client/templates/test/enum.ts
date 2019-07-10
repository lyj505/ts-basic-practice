console.log('-------开始enum教学');
// 一个key 对应一个value
// 1个value 对应一个key

// 根据一个key 只能获取一个value (枚举在后面的value);
// 根据value 可以获取也只能一个key

// 都会被覆盖 ----
{
  enum Direction {
    up = 1,
    Down,
    Left,
    // up = 3,
    Right = 3,
  }
  console.log('show--', Direction);

  enum Response {
    No = 0,
    Yes = 1,
  }

  function respond(recipient: string, message: Response): void {
    // ...
    console.log(recipient + message);
  }

  respond('Princess Caroline', Response.Yes);

  const getSomeValue = (arg: number): number => {
    return arg;
  };

  enum E {
    A = getSomeValue(1),
    // B,// error! 'A' is not constant-initialized, so 'B' needs an initializer
    C = getSomeValue(1),
    D = 3,
    Foo,
  }
  console.log('EEEEE', E);

  // 由于字符串枚举没有自增长的行为，字符串枚举可以很好的序列化。
  enum stringEnum {
    Up = 'UP',
    Down = 'Down',
    L = 1,
    E,
    F = 'fuck',
    // Z 字符串必须自己初始化
  }
  console.log('stringEnum---', stringEnum);

  enum FF {
    E = 3,
  }
  enum E {
    Y = 3,
  }
  enum E { X = 2 } // 枚举组合了

  const X = 10;
  enum EE {
    X, // 这里并没有取X 所以定义的变量没用在enum里面
    Y,
  }
  console.log('EEE---', E);

  // 枚举成员使用 常量枚举表达式初始化。 常数枚举表达式是
  // TypeScript表达式的子集，它可以在编译阶段求值。
  // 当一个表达式满足下面条件之一时，它就是一个常量枚举表达式：

  {

    // 一个枚举表达式字面量 字符串 or 数字
    // 对之前定义的常量枚举成员的应用
    // 带括号的常量枚举表达式k
    // 常量枚举表达式做为二元运算符 +, -, *, /, %, <<, >>, >>>, &, |, ^的操作对象。 若常数枚举表达式求值后为 NaN或 Infinity，则会在编译阶段报错。
    enum test22 {  // test 为名字得不行？
      x = 2,
      Read = 1 << 1,
      Write = 1 << 2,
      ReadWrite = Read | Write,
      test222 = 1,
      test2 = test222 + 1, // 这种可计算的真tm好,,,以前对象就想用这种
      // computed member
      G = '123'.length,
    }

    console.log(test22);

    {
      enum ShapeKind {
        Circle,
        Square,
      }

      interface Circle {
        kind: ShapeKind.Circle;
        radius: number;
      }

      interface Square {
        kind: ShapeKind.Square;
        sideLength: number;
      }

      const c: Circle = {
        kind: ShapeKind.Circle,
        // b: ShapeKind.Square,
        //    ~~~~~~~~~~~~~~~~ Error!
        radius: 100,
      };

      const s: Square = {
        kind: ShapeKind.Square,
        sideLength: 20,
      };
      console.log('square------继承接口', c, s);

      enum E {
        Foo,
        Bar,
      }

      function f(x: E) {
        console.log('eeee', E);
        console.log(x);
        if (x !== E.Foo) {
          //             ~~~~~~~~~~~
          // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
          console.log('非EEE');
        } else {
          console.log('就是EEE');
        }
      }

      const x_v = 100;
      f(x_v);

      {

        enum E {
          H = 100, Y = 3, Z,
        }

        function f(obj: { H: number }) {
          console.log(obj);
          return obj.H;
        }

        // Works, since 'E' has a property named 'X' which is a number.
        console.log('f-e-f-e', f(E)); // 会用key 为H的
      }
    }

  }

}

// ----------------------start 方向映射----------------------
{
  enum Enum {
    A = '1', // 要注意的是 不会为字符串枚举成员生成反向映射。
    B = 2,
    c = 'xx',
  }
  // 如果等于字符串的缩影的话...就占了位置
  const a = Enum.A;
  const nameOfA = Enum[a];
  const b = Enum.B;
  const nameOfB = Enum[b];
  console.log(a, nameOfA, b, nameOfB, '整体----', Enum);

}

// 在正常的枚举里，没有初始化方法的成员被当成常数成员。
// 对于非常数的外部枚举而言，没有初始化方法时被当做需要经过计算的。 就像B 是要经过计算的
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
// ----------------------end 方向映射----------------------

// eslint-disable-next-line import/prefer-default-export
export const a = 1;
console.log('------结束enum教学');
