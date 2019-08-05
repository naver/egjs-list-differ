/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import { MapInteface, DiffResult } from "./types";
import PolyMap from "./PolyMap";
import HashMap from "./HashMap";
import { SUPPORT_MAP } from "./consts";
import Result from "./Result";

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
export function diff<T>(
  prevList: T[],
  list: T[],
  findKeyCallback?: (e: T, i: number, arr: T[]) => any
): DiffResult<T> {
  const mapClass: new () => MapInteface<any, number> = SUPPORT_MAP ? Map : (findKeyCallback ? HashMap : PolyMap);
  const callback = findKeyCallback || ((e: T) => e);
  const added: number[] = [];
  const removed: number[] = [];
  const maintained: number[][] = [];
  const prevKeys = prevList.map(callback);
  const keys = list.map(callback);
  const prevKeyMap: MapInteface<any, number> = new mapClass();
  const keyMap: MapInteface<any, number> = new mapClass();
  const changedBeforeAdded: number[][] = [];
  const fixed: boolean[] = [];
  const removedMap: object = {};
  let changed: number[][] = [];
  let addedCount = 0;
  let removedCount = 0;

  // Add prevKeys and keys to the hashmap.
  prevKeys.forEach((key, prevListIndex) => {
    prevKeyMap.set(key, prevListIndex);
  });
  keys.forEach((key, listIndex) => {
    keyMap.set(key, listIndex);
  });

  // Compare `prevKeys` and `keys` and add them to `removed` if they are not in `keys`.
  prevKeys.forEach((key, prevListIndex) => {
    const listIndex = keyMap.get(key);

    // In prevList, but not in list, it is removed.
    if (typeof listIndex === "undefined") {
      ++removedCount;
      removed.push(prevListIndex);
    } else {
      removedMap[listIndex] = removedCount;
    }
  });

  // Compare `prevKeys` and `keys` and add them to `added` if they are not in `prevKeys`.
  keys.forEach((key, listIndex) => {
    const prevListIndex = prevKeyMap.get(key);

    // In list, but not in prevList, it is added.
    if (typeof prevListIndex === "undefined") {
      added.push(listIndex);
      ++addedCount;
    } else {
      maintained.push([prevListIndex, listIndex]);
      removedCount = removedMap[listIndex] || 0;

      changedBeforeAdded.push([
        prevListIndex - removedCount,
        listIndex - addedCount,
      ]);
      fixed.push(listIndex === prevListIndex);
      if (prevListIndex !== listIndex) {
        changed.push([prevListIndex, listIndex]);
      }
    }
  });
  // Sort by ascending order of 'to(list's index).
  removed.reverse();

  return new Result(
    prevList,
    list,
    added,
    removed,
    changed,
    maintained,
    changedBeforeAdded,
    fixed,
  );
}
