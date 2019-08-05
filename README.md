
<p align="middle"><img src="https://raw.githubusercontent.com/naver/egjs-list-differ/master/demo/images/logo.png"/></p>
<h2 align="middle">@egjs/list-differ</h2>
<p align="middle"><a href="https://www.npmjs.com/package/@egjs/list-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/list-differ.svg?style=flat-square&color=007acc&label=version&logo=NPM" alt="version" /></a> <a href="https://travis-ci.org/naver/egjs-list-differ" target="_blank"><img alt="Travis (.org)" src="https://img.shields.io/travis/naver/egjs-list-differ.svg?style=flat-square&label=build&logo=travis%20ci" /></a> <a href="https://coveralls.io/github/naver/egjs-list-differ?branch=master&style=flat-square" target="_blank"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/naver/egjs-list-differ.svg?style=flat-square&label=%E2%9C%85%20coverage"></a> <a href="https://www.npmjs.com/package/@egjs/list-differ" target="_blank"><img src="https://img.shields.io/npm/dm/@egjs/list-differ.svg?style=flat-square&label=%E2%AC%87%20downloads&color=08CE5D" alt="npm downloads per month"></a>  <a href="https://github.com/naver/egjs-list-differ/blob/master/LICENSE" target="_blank"><img alt="GitHub" src="https://img.shields.io/github/license/naver/egjs-list-differ.svg?style=flat-square&label=%F0%9F%93%9C%20license&color=08CE5D"></a></p>


<p align="middle">➕➖🔄 A module that checks the diff when values are added, removed, or changed in an array.</p>



## ⚙️ Installation

```sh
$ npm i @egjs/list-differ
```

```html
<script src="//naver.github.io/egjs-list-differ/release/latest/dist/list-differ.min.js"></script>
```

## 📖 Documentation
* See [**Documentation**](https://naver.github.io/egjs-list-differ/release/latest/doc/index.html) page.
* [Introducing ListDiffer to track changes in data and track changes](https://medium.com/naver-fe-platform/introducing-listdiffer-to-track-changes-in-data-27793f0c6f4a)([한국어](https://medium.com/naver-fe-platform/%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%9D%98-%EB%B3%80%ED%99%94%EB%A5%BC-%EC%95%8C%EC%95%84%EB%82%B4%EA%B3%A0-%EB%B3%80%ED%99%94-%EA%B3%BC%EC%A0%95%EC%9D%84-%EC%B6%94%EC%A0%81-%ED%95%98%EB%8A%94-listdiffer-9c3f1d770542))
* [How to Make Cross Framework Component](https://medium.com/naver-fe-platform/how-to-make-cross-framework-component-ee76d76708b1)([한국어](https://medium.com/naver-fe-platform/cross-framework-component%EB%A5%BC-%EB%A7%8C%EB%93%9C%EB%8A%94-%EB%B0%A9%EB%B2%95-234b3fece353))


## 📦 Packages
|Package|Version|Description|
|:-----:|:-----:|:-----:|
|[**@egjs/children-differ**](https://github.com/naver/egjs-children-differ)|<a href="https://www.npmjs.com/package/@egjs/children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/children-differ.svg?style=flat-square&color=007acc&label=%F0%9F%94%96" alt="version" /></a>|A module that checks diff in DOM children.|
|[**@egjs/react-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/react-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/react-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/react-children-differ.svg?style=flat-square&color=00d8ff&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/react.svg" valign="middle" alt="React" /> [React](https://reactjs.org/) port of @egjs/children-differ|
|[**@egjs/ngx-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/ngx-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/ngx-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/ngx-children-differ.svg?style=flat-square&color=dd0031&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/angular.svg" valign="middle" alt="Angular" /> [Angular](https://angular.io/) port of @egjs/children-differ|
|[**@egjs/vue-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/vue-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/vue-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/vue-children-differ.svg?style=flat-square&color=42b883&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/vue.svg" valign="middle" alt="Vue.js" /> [Vue.js](https://vuejs.org/v2/guide/index.html) port of @egjs/children-differ|

## 🏃 How to use
### checks the diff in array
```js
import ListDiffer, { diff } from "@egjs/list-differ";

// script => eg.ListDiffer
// Value is key
const differ = new ListDiffer([1, 2, 3, 4, 5, 6, 7], e => e);
// const result = diff([1, 2, 3, 4, 5, 6, 7], [4, 3, 6, 2, 1, 7], e => e);
const result = differ.update([4, 3, 6, 2, 1, 7]);
// List before update
// [1, 2, 3, 4, 5, 6, 7]
console.log(result.prevList);
// Updated list
// [4, 3, 6, 2, 1, 7]
console.log(result.list);
// Index array of values added to `list`
// [2]
console.log(result.added);
// Index array of values removed in `prevList`
// [5, 4]
console.log(result.removed);
// An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
// [[3, 0], [2, 1], [1, 3], [0, 4], [6, 5]]
console.log(result.changed);
// The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
// [[3, 0], [2, 1], [1, 3]]
console.log(result.pureChanged);
// An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
// [[3, 0], [3, 1], [3, 2]]
console.log(result.ordered);
// An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
// [[3, 0], [2, 1], [1, 3], [0, 4], [6, 5]]
console.log(result.maintained);
```
### What is changed?
* **changed**: An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
* **pureChanged**: The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)


||**changed**|**pureChanged:**|
|---:|---|---|
||[[3, 0], [2, 1], [1, 3], [0, 4], [6, 5]]|[[[3, 0], [2, 1], [1, 3]]||
|prevList|![prev_list](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_prev_list.png) |![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_before_prev_list.png)|
|process|<p align="center">-</p>|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_before_animation.gif)|
|list|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_list.png)|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_before_list.png)|

### What is ordered?
An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)

||removed -> ordered -> added|
|---:|---|
|prevList|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/prev_list.png)|
|removed<br/>[5, 4]|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/removed.png)|
|ordered|[[3, 0], [3, 1], [3, 2]]|
||![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/ordered_before_added.gif)|
|ordered[0]<br/>[3 => 0]| ![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/ordered_before_ordered0.png)|
|ordered[1]<br/>[3 => 1]| ![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/ordered_before_ordered1.png)|
|ordered[2]<br/>[3 => 2]| ![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/ordered_before_ordered2.png)|
|added<br/>[2]|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/ordered_before_added.png)|
|list|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/list.png)|



## Data Sync Examples
```js
import ListDiffer, { diff } from "@egjs/list-differ";

const prevList = [1, 2, 3, 4, 5, 6, 7];
const list = [4, 3, 6, 2, 1, 7];
// const differ = new ListDiffer(prevList, e => e);
// const result = differ.update(list);
const result = diff(prevList, list, e => e);
```

### removed => ordered => added

||removed => ordered => added|
|---|---|
|prevList|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/prev_list.png)|
|process|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/changed_before_animation.gif)|
|list|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/list.png)|

*  Synchronize List
```js
const nextList = prevList.slice();
result.removed.forEach(index => {
  nextList.splice(index, 1);
});
result.ordered.forEach(([from, to], i) => {
  nextList.splice(from, 1);
  nextList.splice(to, 0, list[result.pureChanged[i][1]]);
});
result.added.forEach(index => {
  nextList.splice(index, 0, list[index]);
});
// `nextList` is the same as `list`.
console.log(nextList);
```

*  Synchronize DOM
```js
const parentElement = document.querySelector(".parent");
const children = parentElement.children;

result.removed.forEach(index => {
  children[index].remove();
});
result.ordered.forEach(([from, to]) => {
  parentElement.insertBefore(children[from], children[from < to ? to + 1 : to]);
});
result.added.forEach(index => {
  parentElement.insertBefore(document.createElement("div"), children[index]);
});
```

### removed => maintaind => added
||maintaind => added|
|---|---|
|prevList|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/prev_list.png)|
|process|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/maintained_with_added.gif)|
|list|![](https://raw.githubusercontent.com/naver/egjs-list-differ/master/images/list.png)|

* Synchronize List
```js
const nextList: number[] = [];
result.removed.forEach(index => {
  // There is a remove operation for the index.
  // prevList[index];
});
result.maintained.forEach(([from, to]) => {
  nextList[to] = list[to];
});
result.added.forEach(index => {
  nextList[index] = list[index];
});
// `nextList` is the same as `list`.
console.log(nextList);
```

*  Synchronize DOM
```js
const parentElement = document.querySelector(".parent");
const children = parentElement.children;
const prevChildren: Element[] = [].slice.call(parentElement.children);

result.removed.forEach(index => {
  prevChildren[index].remove();
});
result.maintained.forEach(([from, to]) => {
  parentElement.appendChild(prevChildren[from]);
});
result.added.forEach(index => {
  parentElement.insertBefore(document.createElement("div"), children[index]);
});
```


## 🙌 Contributing
See [CONTRIBUTING.md](https://github.com/naver/egjs-list-differ/blob/master/CONTRIBUTING.md).

## 📝 Feedback
Please file an [Issue](https://github.com/naver/egjs-list-differ/issues).

## 📜 License
@egjs/list-differ is released under the [MIT license](https://github.com/naver/egjs-list-differ/blob/master/LICENSE).

```
Copyright (c) 2019-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
