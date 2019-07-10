// 内部模块”现在称做“命名空间”。
// “外部模块”现在则简称为“模块”，


// 另外，任何使用 module关键字来声明一个内部模块的地方都应该
// 使用namespace关键字来替换。 这就避免了让新的使用者被相似的名称所迷惑。
// tslint:disable:jsdoc-format
// tslint:disable:max-line-length
// tslint:disable:no-irregular-whitespace

console.log('----------namespace start');
declare namespace Cat {
  export const a = 1;
}

console.log('----------namespace end111');
