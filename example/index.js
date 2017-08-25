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

const test_obj_2 = {
  prop1 : 'hellooo woooooorrlld'
}

const test1_str = 't1';
const testing_this_string = 'prop1';
const no_def = undefined;

console.log('unary test : ', typeof Test1[testing_this_string]); // number
console.log('binary test : ', typeof obj_test.t1.prop2 == 'User'); // true
console.log('array test : ', Array.isArray(Test1['prop5'])); // false
console.log('array test : ', Array.isArray(obj_test['t2'].prop2)) // true
console.log('undefined test : ', typeof Test1.prop9); // undefined
console.log('binary undefined test : ', typeof Test1.prop9 == 'string'); // false
console.log('array undefined test : ', Array.isArray(Test1.prop9)); // false
console.log('type that is not in a class test : ', typeof test_obj_2.prop1 == 'string'); // true
console.log(`'undefined' unary test : `, typeof no_def); // undefined
console.log(`'undefined' binary test : `, typeof no_def == 'undefined'); // true
