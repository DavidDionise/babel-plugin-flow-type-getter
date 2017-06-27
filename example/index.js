class Test1 {
  prop1: number;
  prop2: Array<User | ID>;
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

console.log('unary typeof = ', typeof Test1.prop3);
console.log('binary typeof = ', typeof Test1.prop5 == 'Client');
console.log('is_array = ', Array.isArray(Test1.prop5));
