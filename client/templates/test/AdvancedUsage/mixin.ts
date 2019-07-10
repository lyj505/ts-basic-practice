/* eslint-disable no-inner-declarations */
console.log('--------开始混合');
// 想用到子类的方法,实现了之后必须要使用混合哟。。
// ----------------------start mix----------------------
{
  // Disposable Mixin
  class Disposable {
    isDisposed: boolean;

    dispose() {
      this.isDisposed = true;
    }
  }

  // Activatable Mixin
  class Activatable {
    isActive: boolean;

    activate() {
      console.log('func in Activatable');
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
    }
  }

  class SmartObject implements Disposable, Activatable {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
      // setInterval(() => console.log(this.isActive + ' : ' + this.isDisposed), 500);
    }

    interact() {
      console.log('interact');
      this.activate();
    }

    // Disposable
    isDisposed: boolean = false;

    dispose: () => void;

    // Activatable
    isActive: boolean = true;

    test: number = 1;

    activate: () => void;

    deactivate: () => void;
  }

  {
    // //////////////////////////////////////
    // In your runtime library somewhere
    // //////////////////////////////////////
    applyMixins(SmartObject, [Disposable, Activatable]);
    function applyMixins(derivedCtor: any, baseCtors: any[]) {
      baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
      });
    }
  }
  // 浏览器无法mixin

  const smartObj = new SmartObject();
  // smartObj.interact();
  console.dir(smartObj);

  const ac = new Activatable();
  ac.activate();

  // 直接super
}
// ----------------------end mix----------------------

{
  //
  class t {
    constructor() {
      console.log('im cos');
    }

    test() {
      console.log('test');
    }
  }

  const t1 = new t();
  t1.test();

  class t2 extends t {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
      super();
    }
  }

  const t3 = new t2();
  t3.test();
}


export default {

};
console.log('--------结束混合');
