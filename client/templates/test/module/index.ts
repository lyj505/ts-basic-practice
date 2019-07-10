/* eslint-disable no-undef */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-unresolved */
console.log('---------开始了---------模块');
// eslint-disable-next-line import/no-unresolved
import { numberRegexp, ZipCodeValidator } from './ZipCodeValidator';

import { numberRegexp as numberRegexp1 } from './exports';

import * as allImort from './exports';

console.log('-------all', allImort);
console.log('-------偷来的', numberRegexp1);

console.log('-------module', numberRegexp);
const a = new ZipCodeValidator();
const isAcceptable = a.isAcceptable('15223');
console.log('能否通过数字检测', isAcceptable);


// 具有副作用的导入模块
// 尽管不推荐这么做，一些模块会设置一些全局状态供其它模块使用。 这些模块可能没有任何的导出或用户根本就不关注它的导出。 使用下面的方法来导入这类模块：

// import "./my-module.js";

// CommonJS和AMD的exports都可以被赋值为一个对象,
// 这种情况下其作用就类似于 es6 语法里的默认导出，
// 即 export default语法了。虽然作用相似，
// 但是 export default 语法并不能兼容CommonJS和AMD的exports。
export default {

};

// 可以反射出所有的key
// let sym0 = Symbol("o_o?");
// let obj = {
//   [sym0]: "heheda", ['a']: 1
// }
// console.log(Reflect.ownKeys(obj)); //输出：[ Symbol(o_o?) ]
// VM269: 5(2)["a", Symbol(o_o ?)]


// 使用其它的JavaScript库
// 要想描述非TypeScript编写的类库的类型，
// 我们需要声明类库所暴露出的API。

// 我们叫它声明因为它不是“外部程序”的具体实现。
//  它们通常是在 .d.ts文件里定义的。 如果你熟悉C/C++，
//  你可以把它们当做 .h文件。 让我们看一些例子。

// / <reference path="node.d.ts"/>
import * as URL from 'url';

const myUrl = URL.parse('http://www.typescriptlang.org');
console.log('myUrl-----', myUrl);
// import fileContent from './xyz.txt!text';
import data from './data.json';
// import txt from './xyz.txt!text';

console.log('json---', data);

try {
  console.log('全局引入---', mathLib.isPrime(2));
} catch (err) {
  console.log(err);
}

// UMD模块 TODO:没成功
// mathLib.isPrime(2); // 错误: 不能在模块内使用全局定义。


// 遇到
// 多个文件的顶层具有同样的
// export namespace Foo { （不要以为这些会合并到一个Foo中！）
console.log('---------结束了---------模块');
