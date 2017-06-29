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

const test_obj_2 = {
  prop1: 'hellooo woooooorrlld'
};

const test1_str = 't1';
const testing_this_string = 'prop1';

console.log('unary test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes()[testing_this_string] != null ? Test1.__getFlowTypes()[testing_this_string].stringified : 'undefined';
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof Test1.testing_this_string;
  }
})()); // number
console.log('binary test : ', (() => {
  if (obj_test.t1.__getFlowTypes != null) {
    return obj_test.t1.__getFlowTypes().prop2 != null ? obj_test.t1.__getFlowTypes().prop2.types.find(__type => __type == 'undefined') != null : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof obj_test.t1.prop2 == 'User';
  }
})()); // true
console.log('array test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes()['prop5'] != null ? Test1.__getFlowTypes()['prop5'].is_array : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return Array.isArray(Test1.undefined);
  }
})()); // false
console.log('array test : ', (() => {
  if (obj_test['t2'].__getFlowTypes != null) {
    return obj_test['t2'].__getFlowTypes().prop2 != null ? obj_test['t2'].__getFlowTypes().prop2.is_array : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return Array.isArray(obj_test['t2'].prop2);
  }
})()); // true
console.log('undefined test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes().prop9 != null ? Test1.__getFlowTypes().prop9.stringified : 'undefined';
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof Test1.prop9;
  }
})()); // undefined
console.log('binary undefined test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes().prop9 != null ? Test1.__getFlowTypes().prop9.types.find(__type => __type == 'undefined') != null : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof Test1.prop9 == 'string';
  }
})()); // false
console.log('array undefined test : ', (() => {
  if (Test1.__getFlowTypes != null) {
    return Test1.__getFlowTypes().prop9 != null ? Test1.__getFlowTypes().prop9.is_array : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return Array.isArray(Test1.prop9);
  }
})()); // false
console.log('type that is not in a class test : ', (() => {
  if (test_obj_2.__getFlowTypes != null) {
    return test_obj_2.__getFlowTypes().prop1 != null ? test_obj_2.__getFlowTypes().prop1.types.find(__type => __type == 'undefined') != null : false;
  } else {
    //_____babel-plugin-flow-type-getter-marker-comment____
    return typeof test_obj_2.prop1 == 'string';
  }
})()); // true
