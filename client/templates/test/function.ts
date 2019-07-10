

console.log('-----开始函数的学习');

// ----------------------start 介绍----------------------
/**
 *
 * 1.抽象层
 * 2.模拟类
 * 3.信息隐藏
 * 4.模块
 * TypeScript里，虽然已经支持类，命名空间和模块，
 * 但函数仍然是主要的定义行为的地方。
 * TypeScript为JavaScript函数添加了额外的功能，
 * 让我们可以更容易地使用。
 *
 *
*/
// ----------------------end 介绍----------------------


// ----------------------start 函数类型----------------------
{
  function numberAdd(a: number, b: number) {
    return a + b;
  }

  // 函数类型包括2部分: 参数类型 和返回值得类型
  // 当写出完整函数类型得时候,这两部分都是需要的
  // 我们以参数列表得形式写出参数类型,为了每个参数指定一个名字和类型
  // 名字只是为了增加可读性
  const myAdd: (baseValue: number, increment: number) => number = function (x: number, y: number): number { return x + y; };
  console.log('my----add', myAdd(1, 2));
}


// ----------------------end 函数类型----------------------


// ----------------------start 推断类型----------------------
{
  // 这叫做“按上下文归类”，是类型推论的一种。 它帮助我们更好地为程序指定类型。
  // definite const  函数名 =        函数参数列表:返回类型  函数体
  const myAdd = (x: number, y: number): number => { return x + y; };
  myAdd(1, 2);
  // definite  const :(参数列表=>返回值类型)=  函数参数列表:返回类型  函数体
  const myAdd2: (x: number, y: number) => number = (x, y) => { return x + y; };
  myAdd2(2, 2);

  const myAdd3 = (x: number, y: number): number => { return x + y; };
}
// ----------------------end 推断类型----------------------

console.log('结束函数的学习----------');


// ----------------------start 可选参数和默认参数----------------------
// 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

{
  // 与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。
  // 如果前面的话还要自己undefined
  function buildName(firstName: string, lastName?: string): string {
    if (lastName) return firstName + ' ' + lastName;
    else return firstName;
  }

  const result1 = buildName('Bob');  // works correctly now
  // const result2 = buildName('Bob', 'Adams', 'Sr.');  // error, too many parameters
  const result3 = buildName('Bob', 'Adams');  // ah, just right
}
// ----------------------end 可选参数和默认参数----------------------


// ----------------------start 剩余参数----------------------
{
  function buildName(firstName: string, ...rest: any[]) {
    return firstName + ',' + rest.join(',');
  }

  const employeeName = buildName('Joseph', 'Samuel', 'Lucas', 'MacKinzie');
  console.log(employeeName);
}

// ----------------------end 剩余参数----------------------

// ----------------------start this----------------------

const deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker: function () {
    // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
    return () => {
      const pickedCard = Math.floor(Math.random() * 52);
      const pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  }
};

const cardPicker = deck.createCardPicker();
const pickedCard = cardPicker();

console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit);


// ----------------------end this----------------------


// ----------------------start 方法的重载----------------------
{
  const suits = ['hearts', 'spades', 'clubs', 'diamonds'];

  function pickCard(x: { suit: string; card: number; }[]): any; //不写函数体 这里必须定义一个重载体
  // // TSError: ⨯ Unable to compile TypeScript:  //传入对象时的返回  number
  function pickCard(x: number): { suit: string; card: string; }; //传入number时 的返回  //
  //上面的东西 - - - - 必须定义个重载体
  // eslint-disable-next-line consistent-return
  function pickCard(x: any): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x === 'object') {
      const pickedCard = Math.floor(Math.random() * x.length);
      return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x === 'number') {
      const pickedSuit = Math.floor(x / 13);
      return { suit: suits[pickedSuit], card: x % 13 };
    }
  }

  const myDeck = [{ suit: 'diamonds', card: 2 }, { suit: 'spades', card: 10 }, { suit: 'hearts', card: 4 }];
  const pickedCard1 = myDeck[pickCard(myDeck)];
  console.log('card: ' + pickedCard1.card + ' of ' + pickedCard1.suit);

  const pickedCard2 = pickCard(15);
  console.log('asdasdad', pickedCard2);
  console.log('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit);
}
// ----------------------end 方法的重载----------------------

export default {

};
