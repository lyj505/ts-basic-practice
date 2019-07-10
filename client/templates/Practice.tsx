
import React from 'react'
import PropTypes from 'prop-types'
console.log('--------------------start---------------');
import a from './test/interface';
import b from './test/class';
import c from './test/function';
import d from './test/generic';
import { a as a_alias } from './test/enum';
import f from './test/typeInference';
import g from './test/typeCompatible';
import h from './test/higherTypes';
import i from './test/symbol';
import j from './test/iterator';
import k from './test/module/index';
import l from './test/AdvancedUsage/main';
console.log('----必须要打出来使用哦11222', a);
console.log('----second class---definition', b);
console.log('----third function---definition', c);
console.log('----forth generic ---definition', d);
console.log('----fifth enum ---definition', a_alias);
console.log('----sixth typeInference ---definition', f);
console.log('----seventh typeCompatible ---definition', g);
console.log('----eighth higherTypes ---definition', h);
console.log('----nineth symbol ---definition', i);
console.log('----nineth iterator ---definition', j);
console.log('----tenth module ---definition', k);
console.log('----eleventh advanced usage ---definition', l);

/// <reference path="./nameSpace/index.ts"/>
//TODO:玩不了命名空间这里 尼玛
// const cc = Cat.a;
// console.log('----命名空间',cc);
type Props = {
  match: {
    params: {
      email: string;
      token: string;
    };
  };
};

type State = {
  loading: boolean;
}

declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number }
  }
}

export default class Practice extends React.PureComponent<
  Props,
  State
  > {
  // static propTypes = {
  //   prop: PropTypes
  // }

  componentWillMount() {
    console.log('will mount');
    // const bar = 1;
    // const foo = 'hehe';
    // const foo1 = bar as foo;
  }

  render() {

    return (
      <div>
        <p>这是联系11</p>
        {['foo', 'bar'].map((el, i) => <span key={i}>{i / 2}</span>)}
      </div>
    )
  }
}


