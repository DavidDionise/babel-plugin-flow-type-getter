## Access your Flow types from classes before you instantiate objects.

---
### To use :

```javascript
npm install --save-dev babel-plugin-flow-type-getter babel-plugin-transform-flow-strip-types
```
`.babelrc`
```javascript
{
  "plugins": ["./index", "transform-flow-strip-types"]
}
```

---

## Example

```javascript
class Test1 {
  prop1: number;
  prop2: Test2;
  prop3: string | Test1;
}
class Test2 {
  prop1: string;
  prop2: Array<number>
  prop3: ?Array<Test1 | string>;
}

typeof Test1.prop1; // 'number'
typeof Test1.prop3; // 'string | Test1'
typeof Test1.prop2 == 'Test2'; // true
typeof Test2.prop1 == 'Test1'; // false
Array.isArray(Test2.prop3); // true
````
---

## Run the example

-Navigate to the root directory of the project</br>
-Open the file example/index.js</br>
-Enter the command `npm run build` to start the babel --watch process (keep this shell open)</br>
-In a new shell, enter the command `npm start` to see the values logged out in example/index.js</br>
