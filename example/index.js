class Test1 {
  prop1: number;
  prop2: Array<User | string>;
  prop3: Client;
  prop4: boolean;
  prop5: Client | User;
  prop6: ?Array<number>;
  prop7: Array<User>;
  prop8: ?{a: string, b: ?number};

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }
}

class Test2 {
  prop1: number;
  prop2: Array<User | ID>;

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }
}

const obj_test = {
  t1 : Test1,
  t2 : Test2
}

const test1_str = 't1';

console.log('unary test : ', typeof obj_test[test1_str].prop1); // number
console.log('binary test : ', typeof obj_test.t1.prop2 == 'User'); // true
console.log('array test : ', Array.isArray(Test1.prop5)); // false
console.log('array test : ', Array.isArray(obj_test['t2'].prop2)) // true
