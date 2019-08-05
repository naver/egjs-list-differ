/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
export interface MapInteface<T, U> {
  get(key: T): U | undefined;
  set(key: T, value: U): any;
}
export type MapConstructor<T, U> = new () => MapInteface <T, U>;
export interface ListFormat<T = any> {
  [index: number]: T;
  length: number;
}
/**
 * @typedef
 * @memberof eg.ListDiffer
 * @property - List before update <ko>업데이트하기 전 데이터</ko>
 * @property - Updated list <ko>업데이트하는 데이터</ko>
 * @property - Index array of values added to `list` <ko>`list`에서 추가되는 데이터의 인덱스 배열</ko>
 * @property - Index array of values removed in `prevList` <ko>`prevList`에서 제거되는 데이터의 인덱스 배열</ko>
 * @property - An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`<ko>이전 리스트`prevList`와 지금 리스트`list`에서 위치가 다른 `prevList`와 `list`의 인덱스 배열들</ko>
 * @property - An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>) <ko>데이터를 추가하기 전 `list`를 동기화할 수 있는 정렬되는 인덱스 배열들(형태: Array<[이전 인덱스, 다음 인덱스]>) </ko>
 * @property - The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)<ko>`changed`의 부분집합으로 데이터를 추가하기 전 직접 움직이는 데이터의 인덱스 배열들. `ordered`의 절대적인 인덱스 배열들을 나타내기도 한다. (형태: Array<[prevList인덱스, list인덱스]>)</ko>
 * @property - An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved<ko>추가/삭제 되지 않아 데이터가 보존된 `prevList`와 `list`의 인덱스 배열들</ko>
 */
export interface DiffResult<T> {
  prevList: T[];
  list: T[];
  added: number[];
  removed: number[];
  changed: number[][];
  ordered: number[][];
  pureChanged: number[][];
  maintained: number[][];
}

