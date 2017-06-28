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
        stringified: 'Array<User | string>',
        is_array: true,
        types: ['User', 'string']
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
        stringified: 'object',
        is_array: false,
        types: ['object']
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

const obj_test = {
  t1: Test1,
  t2: Test2
};

const test1_str = 't1';
const testing_this_string = 'prop1';

console.log('unary test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes()[testing_this_string].stringified;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof Test1.testing_this_string;
  }
})()); // number
console.log('binary test : ', (() => {
  if (obj_test.t1.__getFlowTypes != null) {
    return obj_test.t1.__getFlowTypes().prop2.types.find(__type => __type == 'User') != null;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof obj_test.t1.prop2 == User;
  }
})()); // true
console.log('array test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes()['prop5'].is_array;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return Array.isArray(Test1.undefined);
  }
})()); // false
console.log('array test : ', (() => {
  if (obj_test['t2'].__getFlowTypes != null) {
    return obj_test['t2'].__getFlowTypes().prop2.is_array;
  } else {
    return Array.isArray(obj_test['t2'].prop2);
  }
})()); // true
