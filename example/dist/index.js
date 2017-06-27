class Test1 {

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }

  static __getFlowTypes() {
    return {
      prop1: {
        stringified: 'number',
        is_array: false,
        types: ['number']
      },
      prop2: {
        stringified: 'Array<User | ID>',
        is_array: true,
        types: ['User', 'ID']
      },
      prop3: {
        stringified: 'Client',
        is_array: false,
        types: ['Client']
      },
      prop4: {
        stringified: 'boolean',
        is_array: false,
        types: ['boolean']
      },
      prop5: {
        stringified: 'Client | User',
        is_array: false,
        types: ['Client', 'User']
      },
      prop6: {
        stringified: 'Array<number>',
        is_array: true,
        types: ['number']
      },
      prop7: {
        stringified: 'Array<User>',
        is_array: true,
        types: ['User']
      },
      prop8: {
        stringified: '{ a : string, b : number }',
        is_array: false,
        types: ['{ a : string, b : number }']
      }
    };
  }

}

class Test2 {

  static getType() {
    return 'cool';
  }

  getTypeTwo() {
    return 'yeah';
  }

  static __getFlowTypes() {
    return {
      prop1: {
        stringified: 'number',
        is_array: false,
        types: ['number']
      },
      prop2: {
        stringified: 'Array<User | ID>',
        is_array: true,
        types: ['User', 'ID']
      }
    };
  }

}

console.log('unary typeof = ', Test1.__getFlowTypes().prop3.stringified);
console.log('binary typeof = ', typeof Test1.prop5 == 'Client');
console.log('is_array = ', Test1.__getFlowTypes().prop5.is_array);
