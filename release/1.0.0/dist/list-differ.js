/*
Copyright (c) 2019-present NAVER Corp.
name: @egjs/list-differ
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-list-differ
version: 1.0.0
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.eg = global.eg || {}, global.eg.ListDiffer = factory()));
}(this, function () { 'use strict';

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */
  var PolyMap =
  /*#__PURE__*/
  function () {
    function PolyMap() {
      this.keys = [];
      this.values = [];
    }

    var __proto = PolyMap.prototype;

    __proto.get = function (key) {
      return this.values[this.keys.indexOf(key)];
    };

    __proto.set = function (key, value) {
      var keys = this.keys;
      var values = this.values;
      var prevIndex = keys.indexOf(key);
      var index = prevIndex === -1 ? keys.length : prevIndex;
      keys[index] = key;
      values[index] = value;
    };

    return PolyMap;
  }();

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */
  var HashMap =
  /*#__PURE__*/
  function () {
    function HashMap() {
      this.object = {};
    }

    var __proto = HashMap.prototype;

    __proto.get = function (key) {
      return this.object[key];
    };

    __proto.set = function (key, value) {
      this.object[key] = value;
    };

    return HashMap;
  }();

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */
  var SUPPORT_MAP = typeof Map === "function";

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */
  var Link =
  /*#__PURE__*/
  function () {
    function Link() {}

    var __proto = Link.prototype;

    __proto.connect = function (prevLink, nextLink) {
      this.prev = prevLink;
      this.next = nextLink;
      prevLink && (prevLink.next = this);
      nextLink && (nextLink.prev = this);
    };

    __proto.disconnect = function () {
      // In double linked list, diconnect the interconnected relationship.
      var prevLink = this.prev;
      var nextLink = this.next;
      prevLink && (prevLink.next = nextLink);
      nextLink && (nextLink.prev = prevLink);
    };

    __proto.getIndex = function () {
      var link = this;
      var index = -1;

      while (link) {
        link = link.prev;
        ++index;
      }

      return index;
    };

    return Link;
  }();

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */

  function orderChanged(changed, fixed) {
    // It is roughly in the order of these examples.
    // 4, 6, 0, 2, 1, 3, 5, 7
    var fromLinks = []; // 0, 1, 2, 3, 4, 5, 6, 7

    var toLinks = [];
    changed.forEach(function (_a) {
      var from = _a[0],
          to = _a[1];
      var link = new Link();
      fromLinks[from] = link;
      toLinks[to] = link;
    }); // `fromLinks` are connected to each other by double linked list.

    fromLinks.forEach(function (link, i) {
      link.connect(fromLinks[i - 1]);
    });
    return changed.filter(function (_, i) {
      return !fixed[i];
    }).map(function (_a, i) {
      var from = _a[0],
          to = _a[1];

      if (from === to) {
        return [0, 0];
      }

      var fromLink = fromLinks[from];
      var toLink = toLinks[to - 1];
      var fromIndex = fromLink.getIndex(); // Disconnect the link connected to `fromLink`.

      fromLink.disconnect(); // Connect `fromLink` to the right of `toLink`.

      if (!toLink) {
        fromLink.connect(undefined, fromLinks[0]);
      } else {
        fromLink.connect(toLink, toLink.next);
      }

      var toIndex = fromLink.getIndex();
      return [fromIndex, toIndex];
    });
  }

  var Result =
  /*#__PURE__*/
  function () {
    function Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed) {
      this.prevList = prevList;
      this.list = list;
      this.added = added;
      this.removed = removed;
      this.changed = changed;
      this.maintained = maintained;
      this.changedBeforeAdded = changedBeforeAdded;
      this.fixed = fixed;
    }

    var __proto = Result.prototype;
    Object.defineProperty(__proto, "ordered", {
      get: function () {
        if (!this.cacheOrdered) {
          this.caculateOrdered();
        }

        return this.cacheOrdered;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(__proto, "pureChanged", {
      get: function () {
        if (!this.cachePureChanged) {
          this.caculateOrdered();
        }

        return this.cachePureChanged;
      },
      enumerable: true,
      configurable: true
    });

    __proto.caculateOrdered = function () {
      var ordered = orderChanged(this.changedBeforeAdded, this.fixed);
      var changed = this.changed;
      var pureChanged = [];
      this.cacheOrdered = ordered.filter(function (_a, i) {
        var from = _a[0],
            to = _a[1];
        var _b = changed[i],
            fromBefore = _b[0],
            toBefore = _b[1];

        if (from !== to) {
          pureChanged.push([fromBefore, toBefore]);
          return true;
        }
      });
      this.cachePureChanged = pureChanged;
    };

    return Result;
  }();

  /**
   *
   * @memberof eg.ListDiffer
   * @static
   * @function
   * @param - Previous List <ko> 이전 목록 </ko>
   * @param - List to Update <ko> 업데이트 할 목록 </ko>
   * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
   * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
   * @example
   * import { diff } from "@egjs/list-differ";
   * // script => eg.ListDiffer.diff
   * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1], e => e);
   * // List before update
   * // [1, 2, 3, 4, 5]
   * console.log(result.prevList);
   * // Updated list
   * // [4, 3, 6, 2, 1]
   * console.log(result.list);
   * // Index array of values added to `list`
   * // [0, 1, 5]
   * console.log(result.added);
   * // Index array of values removed in `prevList`
   * // [5]
   * console.log(result.removed);
   * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
   * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
   * console.log(result.changed);
   * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
   * // [[4, 3], [3, 4], [2, 6]]
   * console.log(result.pureChanged);
   * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
   * // [[4, 1], [4, 2], [4, 3]]
   * console.log(result.ordered);
   * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
   * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
   * console.log(result.maintained);
   */

  function diff(prevList, list, findKeyCallback) {
    var mapClass = SUPPORT_MAP ? Map : findKeyCallback ? HashMap : PolyMap;

    var callback = findKeyCallback || function (e) {
      return e;
    };

    var added = [];
    var removed = [];
    var maintained = [];
    var prevKeys = prevList.map(callback);
    var keys = list.map(callback);
    var prevKeyMap = new mapClass();
    var keyMap = new mapClass();
    var changedBeforeAdded = [];
    var fixed = [];
    var removedMap = {};
    var changed = [];
    var addedCount = 0;
    var removedCount = 0; // Add prevKeys and keys to the hashmap.

    prevKeys.forEach(function (key, prevListIndex) {
      prevKeyMap.set(key, prevListIndex);
    });
    keys.forEach(function (key, listIndex) {
      keyMap.set(key, listIndex);
    }); // Compare `prevKeys` and `keys` and add them to `removed` if they are not in `keys`.

    prevKeys.forEach(function (key, prevListIndex) {
      var listIndex = keyMap.get(key); // In prevList, but not in list, it is removed.

      if (typeof listIndex === "undefined") {
        ++removedCount;
        removed.push(prevListIndex);
      } else {
        removedMap[listIndex] = removedCount;
      }
    }); // Compare `prevKeys` and `keys` and add them to `added` if they are not in `prevKeys`.

    keys.forEach(function (key, listIndex) {
      var prevListIndex = prevKeyMap.get(key); // In list, but not in prevList, it is added.

      if (typeof prevListIndex === "undefined") {
        added.push(listIndex);
        ++addedCount;
      } else {
        maintained.push([prevListIndex, listIndex]);
        removedCount = removedMap[listIndex] || 0;
        changedBeforeAdded.push([prevListIndex - removedCount, listIndex - addedCount]);
        fixed.push(listIndex === prevListIndex);

        if (prevListIndex !== listIndex) {
          changed.push([prevListIndex, listIndex]);
        }
      }
    }); // Sort by ascending order of 'to(list's index).

    removed.reverse();
    return new Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed);
  }

  /**
   * A module that checks diff when values are added, removed, or changed in an array.
   * @ko 배열 또는 오브젝트에서 값이 추가되거나 삭제되거나 순서가 변경사항을 체크하는 모듈입니다.
   * @memberof eg
   */

  var ListDiffer =
  /*#__PURE__*/
  function () {
    /**
     * @param - Initializing Data Array. <ko> 초기 설정할 데이터 배열.</ko>
     * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
     * @example
     * import ListDiffer from "@egjs/list-differ";
     * // script => eg.ListDiffer
     * const differ = new ListDiffer([0, 1, 2, 3, 4, 5], e => e);
     * const result = differ.update([7, 8, 0, 4, 3, 6, 2, 1]);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`.
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`.
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`.
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved.
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */
    function ListDiffer(list, findKeyCallback) {
      if (list === void 0) {
        list = [];
      }

      this.findKeyCallback = findKeyCallback;
      this.list = [].slice.call(list);
    }
    /**
     * Update list.
     * @ko 리스트를 업데이트를 합니다.
     * @param - List to update <ko> 업데이트할 리스트 </ko>
     * @return - Returns the results of an update from `prevList` to `list`.<ko> `prevList`에서 `list`로 업데이트한 결과를 반환한다. </ko>
     */


    var __proto = ListDiffer.prototype;

    __proto.update = function (list) {
      var newData = [].slice.call(list);
      var result = diff(this.list, newData, this.findKeyCallback);
      this.list = newData;
      return result;
    };

    return ListDiffer;
  }();

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */

  /*
  egjs-list-differ
  Copyright (c) 2019-present NAVER Corp.
  MIT license
  */
  ListDiffer.diff = diff;

  return ListDiffer;

}));
//# sourceMappingURL=list-differ.js.map
