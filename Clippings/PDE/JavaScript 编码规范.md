---
title: JavaScript 编码规范
source: https://km.sankuai.com/collabpage/2440821513
saved: 2026-05-14
tags: [Clippings]
date: 2026-05-14
---

# JavaScript 编码规范

JavaScript 编码规范

​

正文 6821 字（9.6 页）

浏览 1076 次（318 人）

全部

目录

一、变量

二、对象

三、数组

四、解构

五、字符串

六、函数

七、箭头函数

八、类与构造函数

九、模块

十、迭代器与生成器

十一、属性

十二、运算符

十三、块

十四、控制语句

十五、类型和类型转换

十六、属性访问函数

十七、事件

十八、标准库

十九、Promise

二十、参考规范

---

### 一、变量

1. ​强制使用 const 或 let 声明局部变量。变量需要改变引用时使用 let，否则使用 const。禁止使用 var。
**说明**：更容易确定作用域，避免变量提升和重复声明，const声明常量减少错误
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
var a = 1;var b = 2; 

JavaScript

xxxxxxxxxx

 
const a = 1;const b = 2;

2. ​强制一次声明一个变量。禁止一次声明多个变量。禁止链式声明。
**说明**：这种方式更易添加变量声明，不用考虑将;变成,.用debugger逐个调试也很方便，而不是一次跳过所有变量， 变量链式赋值会创建隐藏的全局变量。
**落地方式：**静态代码扫描

JavaScript

xxxxxxxxxx

 
const a = 1, b = 2; let c = d = e = 1;

JavaScript

xxxxxxxxxx

 
const a = 1;const b = 2;

3. ​强制连续声明多种变量时，把使用 const 或 let 声明的变量分别放在一起。
**原因**：当需要给依赖前一个已经赋值的变量的变量赋值时很有用
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
let i;const items = getItems();let dragonball;const goSportsTeam = true;let len;

JavaScript

xxxxxxxxxx

 
const goSportsTeam = true;const items = getItems();let dragonball;let i;let length;

4. ​强制禁止声明不被使用的变量。
**原因**：声明但未被使用的变量通常是不完全重构犯下的错误，这种变量在代码里浪费空间并会给读者造成困扰
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
let someUnusedVar = 42;​// 仅被赋值的变量不能认为被使用let y = 10;y = 5;​// 为了修改自身而访问变量不能认为被使用let z = 0;z = z + 1;​// 不被使用的参数

JavaScript

xxxxxxxxxx

 
function getXPlusY(x, y) {  return x + y;}​let x = 1;let y = a + 2;​alert(getXPlusY(x, y));​// type 变量在此处时为了从 data 对象中去除 type 属性而获得 coords 对象，// 应被视为被使用的变量

5. ​强制禁止声明外层作用域已有变量名。
**原因**：避免重复变量造成代码混乱不易读懂
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const a = 1;​function foo() {  const a = 2;  return a;}

JavaScript

xxxxxxxxxx

 
const a = 1;​function foo() {  const b = 2;  return b;}

6. ​建议尽量在贴近变量首次使用的位置前声明变量，避免在块级结构的开始声明块中使用的所有变量。
**落地方式**：CodeReview

### 二、对象

1. ​强制使用字面值创建对象，不要使用 Object 构造器。
**说明**：对象字面的写法更加简洁
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
var myObject = new Object();​new Object();

JavaScript

xxxxxxxxxx

 
var myObject = new CustomObject();​var myObject = {};​var Object = function Object() {};new Object();

2. ​强制使用对象方法的简写形式。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const atom = {  value: 1,  addValue: function (value) {    return atom.value + value;  },};

JavaScript

xxxxxxxxxx

 
const atom = {  value: 1,  addValue(value) {    return atom.value + value;  },};

3. ​强制优先使用简写属性值。
**说明**：更简短且描述更清楚。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const anakinSkywalker = 'Anakin Skywalker';const lukeSkywalker = 'Luke Skywalker';​const obj = {  episodeOne: 1,  twoJediWalkIntoACantina: 2,  lukeSkywalker: lukeSkywalker,  episodeThree: 3,  mayTheFourth: 4,  anakinSkywalker: anakinSkywalker,};

JavaScript

xxxxxxxxxx

 
const anakinSkywalker = 'Anakin Skywalker';const lukeSkywalker = 'Luke Skywalker';​const obj = {  lukeSkywalker,  anakinSkywalker,  episodeOne: 1,  twoJediWalkIntoACantina: 2,  episodeThree: 3,  mayTheFourth: 4,};

4. ​强制仅对无效标识符的属性使用引号，其他情况禁止在属性上使用引号。
**说明**：通常我们主观上认为更易读.有利于语法高亮，更容易被许多JS引擎优化
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const bad = {  'foo': 3,  'bar': 4,  'data-blah': 5,};

JavaScript

xxxxxxxxxx

 
const good = {  foo: 3,  bar: 4,  'data-blah': 5,};

5. ​强制禁止直接调用 Object.prototype上的方法，如 hasOwnProperty、propertyIsEnumerable、isPrototypeOf 等。
**说明**：这些方法可能会被对象自身的同名属性覆盖 - 比如{ hasOwnProperty: false }或者对象是null(Object.create(null))。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
console.log(object.hasOwnProperty(key));

JavaScript

xxxxxxxxxx

 
import has from 'has';  // https://www.npmjs.com/package/hasconsole.log(has(object, key));​const has = Object.prototype.hasOwnProperty;console.log(has.call(object, key));

6. ​强制使用对象展开语法而不是 Object.assign 实现对象的浅拷贝。使用对象其余属性语法获取一个去除指定属性的新对象。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const original = { a: 1, b: 2 };const copy = Object.assign(original, { c: 3 });   // original 也被修改delete copy.a;  // 通过 delete 运算符去除指定属性

JavaScript

xxxxxxxxxx

 
const original = { a: 1, b: 2 };const copy = { ...original, c: 3 };  // copy => { a: 1, b: 2, c: 3 }​const { a, ...noA } = copy;  // noA => { b: 2, c: 3 }

### 三、数组

1. ​强制使用字面量语法创建数组。
**说明**：一般不鼓励使用 Array 构造函数来构造新数组，而是使用数组字面符号，因为存在单参数的隐患，而且 Array 全局变量可能会被重新定义。除非当 Array 构造函数被用来创建指定大小的稀疏数组时，只需给构造函数一个数字参数。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
Array(0, 1, 2)​new Array(0, 1, 2)

JavaScript

xxxxxxxxxx

 
const items = [];​Array(500)​new Array(someOtherArray.length)​[0, 1, 2]

2. ​强制使用 Array#push 而不是直接赋值的方式为数组添加项目。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const someStack = [];someStack[someStack.length] = 'abracadabra';

JavaScript

xxxxxxxxxx

 
const someStack = [];someStack.push('abracadabra');

3. ​强制使用数组扩展运算符...实现数组浅拷贝。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
for (let i = 0; i < items.length; i += 1) {  itemsCopy[i] = items[i];}

JavaScript

xxxxxxxxxx

 
const itemsCopy = [...items];

4. ​强制使用 Array.from 将一个类数组对象转成一个数组。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };​const arr = Array.prototype.slice.call(arrLike);

JavaScript

xxxxxxxxxx

 
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };​const arr = Array.from(arrLike);

5. ​强制在数组方法的回调函数中使用return，如果函数体只有一条返回没有副作用的声明则可以省略return。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {  const flatten = acc.concat(item);});​inbox.filter((msg) => {  const { subject, author } = msg;  if (subject === 'Mockingbird') {    return author === 'Harper Lee';  } else {    return false;  }

JavaScript

xxxxxxxxxx

 
[1, 2, 3].map((x) => {  const y = x + 1;  return x * y;});​[1, 2, 3].map((x) => x + 1);​inbox.filter((msg) => {  const { subject, author } = msg;  if (subject === 'Mockingbird') {    return author === 'Harper Lee';

6. ​建议使用 Array.from 而不是展开语法映射（mapping）可迭代对象。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const baz = [...foo].map(bar);

JavaScript

xxxxxxxxxx

 
const baz = Array.from(foo, bar);

7. ​建议如果数组需要以多行编写，在数组左括号后和数组右括号前换行。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const arr = [  [0, 1], [2, 3], [4, 5],];​const objectInArray = [{  id: 1,}, {  id: 2,}];​const numberInArray = [

JavaScript

xxxxxxxxxx

 
const arr = [[0, 1], [2, 3], [4, 5]];​const objectInArray = [  {    id: 1,  },  {    id: 2,  },];​

### 四、解构

1. ​强制使用对象解构来获取和使用对象的一个或多个属性。
**说明**：解构可以避免创建属性的临时引用，（建议全局JavaScript生效）
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function getFullName(user) {  const firstName = user.firstName;  const lastName = user.lastName;​  return `${firstName} ${lastName}`;}

JavaScript

xxxxxxxxxx

 
function getFullName(user) {  const { firstName, lastName } = user;  return `${firstName} ${lastName}`;}​function getFullName({ firstName, lastName }) {  return `${firstName} ${lastName}`;}

2. ​建议尽量使用数组解构来获取和使用数组中的一个或多个项目。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const arr = [1, 2, 3, 4];​const first = arr[0];const second = arr[1];

JavaScript

xxxxxxxxxx

 
const arr = [1, 2, 3, 4];​const [first, second] = arr;​const item = largeArr[100];  // 直接访问数组的大索引时可豁免该项规范

3. ​建议函数返回多个值时使用对象解构，而不是数组解构。
**说明**：可以非破坏性地随时增加或者改变属性顺序）
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
function processInput(input) {  // ...  return [left, right, top, bottom];}​const [left, __, top] = processInput(input);

JavaScript

xxxxxxxxxx

 
function processInput(input) {  // ...  return { left, right, top, bottom };}​const { left, top } = processInput(input);

### 五、字符串

1. ​强制无动态内容的字符串字面量的所有字符必须放在一对单引号之间。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const name = "Capt. Janeway";​const name = `Capt. Janeway`;

JavaScript

xxxxxxxxxx

 
const name = 'Capt. Janeway';

2. ​强制禁止对字符串使用 eval 、setTimeout、setInterval、execScript等函数。
**说明**：这些函数可执行代码片段，漏洞太多。
**落地方式**：静态代码扫描

3. ​强制不要使用非必要的转义字符。
**说明**：反斜线不利于阅读，应该只在必要的时候出现
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const foo = '\'this\' \i\s \"quoted\"';

JavaScript

xxxxxxxxxx

 
const foo = '\'this\' is "quoted"';​const foo = `my name is '${name}'`;

4. ​强制使用模版字符串构建动态字符串，不要使用字符串拼接。
**说明**：模板字符串有可读性强，语法明确，换行合理和字符串插值的特点
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function sayHi(name) {  return 'How are you, ' + name + '?';}​function sayHi(name) {  return ['How are you, ', name, '?'].join();}

JavaScript

xxxxxxxxxx

 
function sayHi(name) {  return `How are you, ${name}?`;}

5. ​强制单行超过100个字符的字符串不应该使用字符串连接符来跨行书写。
**说明**：截断的字符串很难维护并且代码不易被搜索查找
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const errorMessage = 'This is a super long error that was thrown because \of Batman. When you stop to think about how Batman had anything to do \with this, you would get nowhere \fast.';​const errorMessage = 'This is a super long error that was thrown because ' +  'of Batman. When you stop to think about how Batman had anything to do ' +  'with this, you would get nowhere fast.';

JavaScript

xxxxxxxxxx

 
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

### 六、函数

1. ​强制禁止使用函数构造器创建函数。
**说明**：此方式创建函数和对字符串使用eval()一样会产生漏洞
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
var add = new Function('a', 'b', 'return a + b');var subtract = Function('a', 'b', 'return a - b');

JavaScript

xxxxxxxxxx

 
function add(a, b) {  return a + b;}

2. ​强制用圆括号包裹自执行匿名函数。
**说明**：一个立即执行匿名函数表达式是一个单一的单元-括号清楚地表达了它包含函数自身和调用括号的意思.注意,在到处都是模块的世界中几乎不需要IIFE
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
// immediately-invoked function expression (IIFE)(function () {  console.log('Welcome to the Internet. Please follow me.');}());

3. ​强制禁止在非函数块（if、while 等）中声明函数，可以将该函数赋值给一个变量。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
if (currentUser) {  function test() {    console.log('Nope.');  }}​

JavaScript

xxxxxxxxxx

 
let test;if (currentUser) {  test = () => {    console.log('Yup.');  };}

4. ​强制禁止使用 arguments 命名函数参数。
**说明**：会导致该参数的优先级高于每个函数作用域内原先存在的arguments对象
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
function foo(name, options, arguments) {  // ...}

JavaScript

xxxxxxxxxx

 
function foo(name, options, args) {  // ...}

5. ​强制禁止使用 arguments，使用其余参数语法...替代。
**说明**：...是你想获得的参数列表，因此，扩展语法的参数是真正的数组，而arguments是类数组
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function concatenateAll() {  const args = Array.prototype.slice.call(arguments);  return args.join('');}

JavaScript

xxxxxxxxxx

 
function concatenateAll(...args) {  return args.join('');}

6. ​强制避免参数默认值的副作用。
**说明**：难以理解
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
var b = 1;// badfunction count(a = b++) {  console.log(a);}count();  // 1count();  // 2count(3); // 3count();  // 3

7. ​强制将带有默认值的参数放在参数列表最后。
**说明**：将默认参数放在最后，允许函数调用省略可选的尾部参数。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function handleThings(opts = {}, name) {  // ...}

JavaScript

xxxxxxxxxx

 
function handleThings(name, opts = {}) {  // ...}

8. ​强制定义函数时，function 关键字后和函数块的左大括号前应留有空格。
**说明**：统一为先，不应该在增删名字的同时增删空格
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const f = function(){};const g = function (){};const h = function() {};

JavaScript

xxxxxxxxxx

 
const x = function () {};const y = function a() {};

9. ​强制不要修改参数，也不要对参数重新赋值。
**说明**：操作作为参数传入的对象可能在原始调用中造成意想不到的变量副作用
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function f1(obj) {  obj.key = 1;}​function f2(a) {  a = 1;  // ...}​function f3(a) {  if (!a) { a = 1; }

JavaScript

xxxxxxxxxx

 
function f1(obj) {  const copy = { ...obj };  copy.key = 1;}​function f2(a) {  const b = a || 1;  // ...}​function f3(a = 1) {

10. ​建议使用展开语法调用可变参数函数。
**说明**：显然你无需使用上下文，很难结合new和apply
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const x = [1, 2, 3, 4, 5];console.log.apply(console, x);​new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

JavaScript

xxxxxxxxxx

 
const x = [1, 2, 3, 4, 5];console.log(...x);​new Date(...[2016, 8, 5]);

11. ​建议定义或调用的函数参数需要分多行编写时，每行应当有且只有一个参数和一个结尾逗号。
**说明**：风格统一
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function foo(bar,             baz,             quux) {  // ...}​console.log(foo,  bar,  baz);

JavaScript

xxxxxxxxxx

 
function foo(  bar,  baz,  quux,) {  // ...}​console.log(  foo,  bar,

### 七、箭头函数

1. ​强制当你必须使用函数表达式（传递匿名函数）时，使用箭头函数而不是匿名函数标记。
**说明**：这会创建一个能在其中使用this上下文的函数，这是你想要的，语法也更明确。不适用的地方：如果有一个相当复杂的函数，应该把逻辑放到自己的函数声明里。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
[1, 2, 3].map(function (x) {  const y = x + 1;  return x * y;});

JavaScript

xxxxxxxxxx

 
[1, 2, 3].map((x) => {  const y = x + 1;  return x * y;});

2. ​建议如果箭头函数的函数体仅由一个没有副作用的表达式语句组成，那么删除函数体括号并使用隐式的返回语法。否则保留括号，如需返回值则使用显式的返回语法。
**说明**：语法糖.当进行多个函数的链式操作时可读性好
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
[1, 2, 3].map((number) => {  const nextNumber = number + 1;  `A string containing the ${nextNumber}.`;});​function foo(callback) {  const val = callback();  if (val === true) {    // ...  }}

JavaScript

xxxxxxxxxx

 
[1, 2, 3].map((number) => `A string containing the ${number + 1}.`);​[1, 2, 3].map((number) => {  const nextNumber = number + 1;  return `A string containing the ${nextNumber}.`;});​[1, 2, 3].map((number, index) => ({  [index]: number,}));​

3. ​建议如果箭头函数函数体中仅有的表达式需要占用多行，那么将表达式包裹在圆括号中。
**说明**：清晰展示了函数的开始和结束
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
['get', 'post', 'put'].map((httpMethod) => Object.prototype.hasOwnProperty.call(    httpMagicObjectWithAVeryLongName,    httpMethod  ));

JavaScript

xxxxxxxxxx

 
['get', 'post', 'put'].map((httpMethod) => (  Object.prototype.hasOwnProperty.call(    httpMagicObjectWithAVeryLongName,    httpMethod  )));

4. ​强制避免混淆箭头函数语法（=>）与比较操作符（<=、>=）。
**说明**：方便代码阅读和理解
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const itemHeight = (item) => item.height <= 256 ? item.largeSize : item.smallSize;​const itemHeight = (item) => item.height >= 256 ? item.largeSize : item.smallSize;

JavaScript

xxxxxxxxxx

 
const itemHeight = (item) => (item.height <= 256 ? item.largeSize : item.smallSize);​const itemHeight = (item) => {  const { height, largeSize, smallSize } = item;  return height <= 256 ? largeSize : smallSize;};

5. ​强制禁止在箭头函数的函数体前换行。
**说明**：注意有隐式返回函数体的箭头函数的位置
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
(foo) =>  bar;​(foo) =>  (bar);

JavaScript

xxxxxxxxxx

 
(foo) => bar;(foo) => (bar);(foo) => (   bar)

### 八、类与构造函数

1. ​强制使用 class 语法。如非必要，禁止直接操作 prototype。
**说明**：class语法更明确和合理
**落地方式**：静态代码扫描/CodeReview

JavaScript

xxxxxxxxxx

 
function Queue(contents = []) {  this.queue = [...contents];}Queue.prototype.pop = function () {  const value = this.queue[0];  this.queue.splice(0, 1);  return value;};

JavaScript

xxxxxxxxxx

 
class Queue {  constructor(contents = []) {    this.queue = [...contents];  }  pop() {    const value = this.queue[0];    this.queue.splice(0, 1);    return value;  }}

2. ​强制使用 extends 实现继承。
**说明**：是实现继承功能而不会破坏instanceof的内置方法
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const inherits = require('inherits');function PeekableQueue(contents) {  Queue.apply(this, contents);}inherits(PeekableQueue, Queue);PeekableQueue.prototype.peek = function () {  return this.queue[0];}

JavaScript

xxxxxxxxxx

 
class PeekableQueue extends Queue {  peek() {    return this.queue[0];  }}

3. ​强制重写 toString 方法时，要保证方法没有副作用。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx
    return `Jedi - ${this.getName()} - ${this.count}`;

 
class Jedi {  constructor(options = {}) {    this.name = options.name || 'no name';    this.count = 1;  }​  getName() {    return this.name;  }​  toString() {

JavaScript

xxxxxxxxxx

 
class Jedi {  constructor(options = {}) {    this.name = options.name || 'no name';  }​  getName() {    return this.name;  }​  toString() {    return `Jedi - ${this.getName()}`;

4. ​强制禁止重复定义类成员。说明：重复的类成员声明会默认使用最后声明的-有重复值基本就是bug）
**说明**：重复的类成员声明会默认使用最后声明的-有重复值基本就是bug
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
class Foo {  bar() { return 1; }  bar() { return 2; }}

JavaScript

xxxxxxxxxx

 
class Foo1 {  bar() { return 1; }}​class Foo2 {  bar() { return 2; }}

5. ​建议如果子类的构造方法为空或仅调用父类构造方法，则不要定义子类构造方法。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
class Jedi {  constructor() {}​  getName() {    return this.name;  }}​class Rey extends Jedi {  // 这种构造函数是不需要写的  constructor(...args) {

JavaScript

xxxxxxxxxx

 
class Rey extends Jedi {  constructor(...args) {    super(...args);    this.name = 'Rey';  }}​class Rey extends Jedi {  getName() {    return 'Rey';  }

### 九、模块

1. ​强制不要直接从导入中直接导出模块。
**说明**：很显然有一个明确的方法来import和export会保持一致性
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
export { es6 as default } from './Foo';

JavaScript

xxxxxxxxxx

 
import { es6 } from './Foo';​export default es6;

2. ​强制使用标准模块系统导入、导出模块。
**说明**：仅作用于新增的Web的代码，不作用于node.js的代码和部分外部包
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const AirbnbStyleGuide = require('./AirbnbStyleGuide');module.exports = AirbnbStyleGuide.es6;

JavaScript

xxxxxxxxxx

 
import AirbnbStyleGuide from './AirbnbStyleGuide';export default AirbnbStyleGuide.es6;​import { es6 } from './AirbnbStyleGuide';export default es6;

3. ​强制同一文件中，一个路径只导入一次。
**说明**：有多行同一个路径的import会使代码更难维护
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
import foo from 'foo';import { named1, named2 } from 'foo';

JavaScript

xxxxxxxxxx

 
import foo, { named1, named2 } from 'foo';

4. ​强制除非必要，不要导出可变的绑定。
**说明**：通常来说可变应该被避免，尤其是在export绑定值的时候.通常来说，这个技术只在常量引用被导出的时候使用.
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
let foo = 3;export { foo };

JavaScript

xxxxxxxxxx

 
const foo = 3;export { foo };

5. ​强制将所有的导入语句放在其他语句之前。
**说明**：由于import会被提前，将其全部置于顶部会避免意外行为
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
import foo from 'foo';foo.init();​import bar from 'bar';

JavaScript

xxxxxxxxxx

 
import foo from 'foo';import bar from 'bar';​foo.init();

6. ​强制不要使用通配符导入
**说明**：不方便查找定义，增加了追踪代码的难度，并且不能使用Tree-shaking，IDE无法做自动导入和代码补全
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
import * as AirbnbStyleGuide from './AirbnbStyleGuide'

JavaScript

xxxxxxxxxx

 
import AirbnbStyleGuide from './AirbnbStyleGuide'

### 十、迭代器与生成器

1. ​强制不要使用generators
**说明**：不易理解，不能很好的翻译为ES5
**落地方式**：CodeReview

### 十一、属性

1. ​强制访问属性时，如果通过变量访问属性，或访问的属性名称为无效标识符，使用方括号，否则使用点号。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const luke = {  jedi: true,  age: 28,};​const isJedi = luke['jedi'];

JavaScript

xxxxxxxxxx
const isJedi = getProp('jedi');

 
// case1const luke = {  jedi: true,  age: 28,};​const isJedi = luke.jedi;​// case2const luke = {  jedi: true,

### 十二、运算符

1. ​强制使用严格相等和严格不相等运算符（===、!==），禁止使用相等和不相等运算符（==、!=）。
**落地方式**：静态代码扫描

2. ​强制在条件语句（即 if 语句）的条件表达式中，对布尔类型的判断省略比较运算符，对字符串、数字等其他类型的判断使用明确的比较运算符。
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
if (isValid === true) {  // ...}​if (name) {  // ...}​if (collection.length) {  // ...}

JavaScript

xxxxxxxxxx

 
if (isValid) {  // ...}​if (name !== '') {  // ...}​if (collection.length > 0) {  // ...}

3. ​强制当选择语句（即 switch 语句）中的 case 或 default 分句中需要词法声明（如 let、const、function、class 等）时，应使用花括号创建代码块。
**说明**：这些词语在整个switch中可见但是仅仅在当执行到case时被赋值的时候初始化.当多条case语句试图定义同一个变量时会导致问题
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
switch (foo) {  case 1:    let x = 1;    break;  case 2:    const y = 2;    break;  case 3:    function f() {      // ...    }

JavaScript

xxxxxxxxxx

 
switch (foo) {  case 1: {    let x = 1;    break;  }  case 2: {    const y = 2;    break;  }  case 3: {    function f() {

4. ​强制禁止在三元表达式中嵌套三元表达式。
**说明**：方便代码阅读和理解，多层嵌套难以理解
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const foo = maybe1 > maybe2  ? "bar"  : value1 > value2 ? "baz" : null;

JavaScript

xxxxxxxxxx

 
const maybeNull = value1 > value2 ? 'baz' : null;​const foo = maybe1 > maybe2  ? 'bar'  : maybeNull;​const foo = maybe1 > maybe2 ? 'bar' : maybeNull;

5. ​强制禁止使用不必要的三元表达式。
**说明**：使用条件表达式在两个布尔值之间进行选择，而不使用 ! 将测试转换为布尔值，是一个常见错误；使用一个单一的变量作为条件测试和结果也是错误的。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
var isYes = answer === 1 ? true : false;​var isNo = answer === 1 ? false : true;​foo(bar ? bar : 1);​var a = x === 2 ? true : false;​var a = x ? true : false;

JavaScript

xxxxxxxxxx

 
var isYes = answer === 1;​var isNo = answer !== 1;​foo(bar || 1);​var a = x === 2 ? "Yes" : "No";​var a = x !== false;​var a = x ? "Yes" : "No";

6. ​建议避免使用一元自增或一元自减运算符（++、--），使用加法赋值或减法赋值运算符（+=、-=）。
**说明**：根据eslint文档,自增和自减一元运算符受到分号自动插入的影响可能在应用内部引发自增和自减值的隐蔽错误.用像num += 1的语句而不是num++或num ++来修改值更有表达力.禁止一元自增和自减语句也避免了前置自增/前置自减值在程序中引起的不可预期的行为的副作用
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const array = [1, 2, 3];  let num = 1;  num++;  --num;​  let sum = 0;  let truthyCount = 0;  for (let i = 0; i < array.length; i++) {    let value = array[i];    sum += value;    if (value) {

JavaScript

xxxxxxxxxx

 
 const array = [1, 2, 3];  let num = 1;  num += 1;  num -= 1;​  const sum = array.reduce((a, b) => a + b, 0);  const truthyCount = array.filter(Boolean).length;

7. ​建议尽量使用圆括号组合多个包含运算符的表达式。
**说明**：提高可读性并表明了开发者的意图
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const foo = a && b < 0 || c > 0 || d + 1 === 0;​const bar = a ** b - 5 % d;​if (a || b && c) {  return d;}​const bar = a + b / c * d;

JavaScript

xxxxxxxxxx

 
const foo = (a && b < 0) || c > 0 || (d + 1 === 0);​const bar = (a ** b) - (5 % d);​if (a || (b && c)) {  return d;}​const bar = a + (b / c) * d;

### 十三、块

1. ​强制使用花括号包裹多行代码块。
**说明**：风格统一
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
if (test)  return false;​function foo() { return false; }

JavaScript

xxxxxxxxxx

 
if (test) {  return false;}​if (test) return false;​function bar() {  return false;}

2. ​强制如果在条件语句中使用了代码块，那么将 else 关键字放在 if 块右花括号的同一行。
**说明**：风格统一
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
if (test) {  thing1();  thing2();}else {  thing3();}

JavaScript

xxxxxxxxxx

 
if (test) {  thing1();  thing2();} else {  thing3();}

3. ​强制如果一个 if 块必定执行返回语句，那么其随后的 else 块应省略，其随后的 else if 块应到转化为 if 块。
**说明**：减少不必要的else逻辑，让代码更清晰
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
function foo() {  if (x) {    return x;  } else {    return y;  }}​function cats() {  if (x) {    return x;

JavaScript

xxxxxxxxxx
  } else {  // 因为进x没有进z的情况下没有return，如果没有此处的else，会出现进x没有进z的情况下会return z，不符合预期，所以此处的 else 块不可省略

 
function foo() {  if (x) {    return x;  }​  return y;}​function cats() {  if (x) {    return x;

### 十四、控制语句

1. ​强制禁止使用逻辑运算符替代控制语句。
**说明**：代码更加清晰容易理解
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
!isRunning && startRunning();

JavaScript

xxxxxxxxxx

 
if (!isRunning) {  startRunning();}

2. ​建议当控制语句（if、while 等）中的条件表达式太长时，每个条件（或条件组）可单独陈列一行，逻辑运算符应当置于行首。
**说明**：行开头有运算符可以使运算符有像链式方法一样的形式.这对于追踪复杂逻辑能够提高可读性
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
if ((foo === 123 || bar === 'abc') && doesItLookGoodWhenItBecomesThatLong() && isThisReallyHappening()) {  thing1();}​if (foo === 123 &&  bar === 'abc') {  thing1();}​if (foo === 123  && bar === 'abc') {

JavaScript

xxxxxxxxxx

 
if (  foo === 123  && bar === 'abc') {  thing1();}​if (  (foo === 123 || bar === 'abc')  && doesItLookGoodWhenItBecomesThatLong()  && isThisReallyHappening()

### 十五、类型和类型转换

1. ​强制优先使用 String 函数实现将其他类型强制转换为字符串类型。
**说明**：明确的类型转换，容易理解，不易出错
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
// => this.reviewScore = 9;​const totalScore = new String(this.reviewScore); // typeof totalScore is "object" not "string"​const totalScore = this.reviewScore + ''; // invokes this.reviewScore.valueOf()​const totalScore = this.reviewScore.toString(); // isn’t guaranteed to return a string

JavaScript

xxxxxxxxxx

 
// => this.reviewScore = 9;​const totalScore = String(this.reviewScore);

2. ​强制优先使用 Number 函数实现将其他类型强制转换为数字类型。使用 parseInt 时必须传入进制基数。
**说明**：明确的类型转换，容易理解，不易出错
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
const inputValue = '4';​const val = new Number(inputValue);​const val = +inputValue;​const val = inputValue >> 0;​const val = parseInt(inputValue);

JavaScript

xxxxxxxxxx

 
const inputValue = '4';​const val = Number(inputValue);​const val = parseInt(inputValue, 10);

3. ​强制禁止使用位运算实现将非数字类型转换为数字类型。
**说明**：代码对不熟悉的开发来说不易理解，在处理大于32位的数值时可能会导致意外的行为
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const val = inputValue >> 0;

4. ​强制优先使用 Boolean 函数实现将其他强制转换为布尔值。
**说明**：明确的类型转换，容易理解，不易出错
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
const age = 0;​const hasAge = new Boolean(age);

JavaScript

xxxxxxxxxx

 
const age = 0;​const hasAge = Boolean(age);​const hasAge = !!age;

### 十六、属性访问函数

1. ​建议除非必要，禁止使用 JavaScript 提供的 getter 和 setter 语法，使用自定义的属性访问函数。
**说明**：很难测试、维护和理解
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
class Dragon {  get age() {    // ...  }​  set age(value) {    // ...  }}

JavaScript

xxxxxxxxxx

 
class Dragon {  getAge() {    // ...  }​  setAge(value) {    // ...  }}

2. ​建议布尔类型属性的访问函数的名称应以 is 或 has 为前缀。
**说明**：代码更容易理解
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
if (!dragon.age()) {  return false;}

JavaScript

xxxxxxxxxx

 
if (!dragon.hasAge()) {  return false;}

3. ​建议可定义名为 get 或 set 的自定义访问函数，但要同时定义 get 和 set。
**说明**：代码更容易理解
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
class Jedi {  constructor(options = {}) {    const lightsaber = options.lightsaber || 'blue';    this.set('lightsaber', lightsaber);  }​  set(key, val) {    this[key] = val;  }​  get(key) {

### 十七、事件

1. ​建议当需要在事件上附加数据时，将数据包裹成一个对象传给事件触发函数，而不是将数据的原始值传给函数。
**说明**：允许接下来的修改者不用查找和更新事件的每一个处理器就可以给事件添加更多的数据
**落地方式**：CodeReview

JavaScript

xxxxxxxxxx

 
$(this).trigger('listingUpdated', listing.id);​// ...​$(this).on('listingUpdated', (e, listingID) => {  // ...});

JavaScript

xxxxxxxxxx

 
$(this).trigger('listingUpdated', { listingID: listing.id });​// ...​$(this).on('listingUpdated', (e, data) => {  // ...});

### 十八、标准库

1. ​强制使用 Number.isNaN 函数而不是 isNaN 函数；使用 Number.isFinite 函数而不是 isFinite 函数。
**说明**：全局的 isNaN 方法会将非数字转换为数字, 任何被转换为NaN的东西都会返回true. 若该行为被允许，则要使其明显；全局 isFinite 会把非数字转换为数字, 任何被转换为有限大的数字都会返回true. 若该行为被允许，则要使其明显。
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx

 
isNaN('1.2'); // falseisNaN('1.2.3'); // true​isFinite('2e3'); // true

JavaScript

xxxxxxxxxx

 
Number.isNaN('1.2.3'); // falseNumber.isNaN(Number('1.2.3')); // true​Number.isFinite('2e3'); // falseNumber.isFinite(parseInt('2e3', 10)); // true

### 十九、Promise

1. ​强制 async函数里必须有await
**说明**：不使用 await 的异步函数可能不需要成为异步函数，可能是重构的无意结果
**落地方式**：静态代码扫描

JavaScript

xxxxxxxxxx
  return someAsyncFunction().then(...)

 
async function foo() {    doSomething()}​bar(async () => {    doSomething()});​async function() {  return new Promise(() => { ... })}

JavaScript

xxxxxxxxxx
// Allow empty functions.

 
async function foo() {    await doSomething();}​bar(async () => {    await doSomething();});​function foo() {    doSomething();}

### 二十、参考规范

- [美团平台Web前端项目编码规范](https://km.sankuai.com/collabpage/2052754884#id-3.2.%20JavaScript%20%E5%92%8C%20TypeScript%20%E8%AF%AD%E8%A8%80%E8%A7%84%E8%8C%83)

- [Airbnb的JavaScript规范](https://github.com/airbnb/javascript)，[中文版本](https://github.com/libertyAlone/airbnb-javascript-style-guide-cn)

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)，[中文版本](https://google-styleguide.readthedocs.io/zh-cn/latest/google-javascript-styleguide/contents.html)

- [JavaScript Standard Style](https://github.com/standard/standard)，[中文版本](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md#javascript-standard-style)

暂无赞赏，鼓励一下

👏

+1

引用文档

- [美团平台Web前端项目编码规范](https://km.sankuai.com/collabpage/2052754884#id-3.2.%20JavaScript%20%E5%92%8C%20TypeScript%20%E8%AF%AD%E8%A8%80%E8%A7%84%E8%8C%83)