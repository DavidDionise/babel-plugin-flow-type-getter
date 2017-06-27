class Test1 {

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }
}

class Test2 {

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }
}

console.log('unary typeof = ', typeof Test1.prop3);
console.log('binary typeof = ', typeof Test1.prop2 == 'string');
console.log('is_array = ', Array.isArray(Test1.prop5));
