/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import {
  MaintainedRecord,
  CurrentRecord,
  OrderedRecord,
  PrevRecord,
} from "./types";

/**
 * Find a subsequence of a given sequence in which the subsequence's elements are in increasing order,
 * and in which the subsequence is as long as possible.
 * @returns Longest increasing subsequence of input array
 * @example
 * LIS([1, 8, 2, 3]) === [1, 2, 3]
 * LIS([5, 4, 3, 1, 2]) === [1, 2]
 */
function LIS(arr: number[]) {
  if (arr.length === 0) {
    return [];
  }

  const table: number[] = [];
  const path: number[] = [];
  arr.forEach((_, i) => {
    table[i] = 1;
    path[i] = -1;
  });

  arr.forEach((_, i) => {
    for (let j = i - 1; j > -1; j -= 1) {
      if (table[j] + 1 > table[i] && arr[j] <= arr[i]) {
        table[i] = table[j] + 1;
        path[i] = j;
      }
    }
  });

  let maxIndex = 0;
  table.forEach((x, i) => {
    if (x > table[maxIndex]) {
      maxIndex = i;
    }
  });

  const res: number[] = [];
  while (maxIndex !== -1) {
    res.push(arr[maxIndex]);
    maxIndex = path[maxIndex];
  }

  return res.reverse();
}

function orderChanged<T>(priorityList: number[], maintained: MaintainedRecord<T>[]) {
  const confirmed: Record<number, boolean> = {};
  const ordered: OrderedRecord<T>[] = [];
  const length = priorityList.length;

  LIS(priorityList).forEach((x) => {
    confirmed[x] = true;
  });

  for (let from = 0; from < length; from += 1) {
    const priority = priorityList[from];
    if (confirmed[priority]) {
      continue;
    }

    let to = 0;
    while (to < length) {
      if (confirmed[priorityList[to]] && priorityList[to] > priority) {
        break;
      }
      to += 1;
    }
    to < from && (to += 1);

    confirmed[priority] = true;

    const record = maintained[priority];
    const anchorRecord = to < length ? maintained[priorityList[to]] : null;
    ordered.push({
      beforeOrderIndex: from,
      afterOrderIndex: to - 1,
      ...record,
      anchorIndex: anchorRecord ? anchorRecord.currentIndex : -1,
      anchor: anchorRecord ? anchorRecord.currentItem : null,
    });
    priorityList.splice(from, 1);
    priorityList.splice(to - 1, 0, priority);

    if (to > from) {
      from -= 1;
    }
  }
  return ordered;
}

export default class Result<T = any> {
  public prevList: T[];
  public list: T[];
  public added: CurrentRecord<T>[];
  public removed: PrevRecord<T>[];
  public changed: MaintainedRecord<T>[];
  public maintained: MaintainedRecord<T>[];

  private orderPriority: number[];
  private cacheOrdered: OrderedRecord<T>[];

  constructor(
    prevList: T[],
    list: T[],
    added: CurrentRecord<T>[],
    removed: PrevRecord<T>[],
    changed: MaintainedRecord<T>[],
    maintained: MaintainedRecord<T>[],
    orderPriority: number[]
  ) {
    this.prevList = prevList;
    this.list = list;
    this.added = added;
    this.removed = removed;
    this.changed = changed;
    this.maintained = maintained;
    this.orderPriority = orderPriority;
  }

  get ordered(): OrderedRecord<T>[] {
    if (!this.cacheOrdered) {
      this.caculateOrdered();
    }
    return this.cacheOrdered;
  }

  private caculateOrdered() {
    const ordered = orderChanged([...this.orderPriority], this.maintained);
    this.cacheOrdered = ordered;
  }

  public forEachAdded(fn: (record: CurrentRecord<T>) => void) {
    this.added.forEach((record) => fn(record));
  }

  public forEachAddedRight(fn: (record: CurrentRecord<T>) => void) {
    const added = this.added;
    added.forEach((_, i) => {
      const record = added[added.length - 1 - i];
      fn(record);
    });
  }

  public forEachRemoved(fn: (record: PrevRecord<T>) => void) {
    this.removed.forEach((record) => fn(record));
  }

  public forEachChanged(fn: (record: MaintainedRecord<T>) => void) {
    this.changed.forEach((record) => fn(record));
  }

  public forEachOrdered(fn: (record: OrderedRecord<T>) => void) {
    this.ordered.forEach((record) => fn(record));
  }

  public forEachMaintained(fn: (record: MaintainedRecord<T>) => void) {
    this.maintained.forEach((record) => fn(record));
  }

  public forEachMaintainedRight(fn: (record: MaintainedRecord<T>) => void) {
    const maintained = this.maintained;
    maintained.forEach((_, i) => {
      const record = maintained[maintained.length - 1 - i];
      fn(record);
    });
  }
}
