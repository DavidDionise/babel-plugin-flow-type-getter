## Access your Flow types from classes before you instantiate objects.

---
### To use :

```javascript
npm install --save-dev babel-plugin-flow-type-getter babel-plugin-transform-flow-strip-types
```
`.babelrc`
```javascript
{
  "plugins": ["flow-type-getter", "transform-flow-strip-types"]
}
```

---

## Example

```javascript
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
````
---

## Run the example

-Navigate to the `example` directory of the project</br>
-Open the file index.js in a text editor (only do this if you want to expriment)</br>
-Enter the command `npm run build` to start the babel --watch process (keep this shell open)</br>
-In a new shell, enter the command `npm start` to see the values logged out in example/index.js</br>
