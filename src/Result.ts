/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import {
  Change,
  ChangeBeforeAdd,
  CurrentIndex,
  Order,
  PrevIndex,
} from "./types";

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

function orderChanged(
  changedBeforeAdded: ChangeBeforeAdd[],
  maintained: Change[]
) {
  const priorityList: number[] = [];
  const confirmed: Record<number, boolean> = {};
  const ordered: Order[] = [];
  const length = changedBeforeAdded.length;

  changedBeforeAdded.forEach(([from, to]) => {
    priorityList[from] = to;
  });
  LIS(priorityList).forEach((x) => {
    confirmed[x] = true;
  });

  for (let from = 0; from < length; from += 1) {
    const fromValue = priorityList[from];
    if (confirmed[fromValue]) {
      continue;
    }

    let to = 0;
    while (to < length) {
      if (confirmed[priorityList[to]] && priorityList[to] > fromValue) {
        break;
      }
      to += 1;
    }
    to < from && (to += 1);

    confirmed[fromValue] = true;
    ordered.push([
      from,
      to - 1,
      maintained[fromValue][0],
      maintained[fromValue][1],
    ]);
    priorityList.splice(from, 1);
    priorityList.splice(to - 1, 0, fromValue);

    if (to > from) {
      from -= 1;
    }
  }
  return ordered;
}

export default class Result<T = any> {
  public prevList: T[];
  public list: T[];
  public added: CurrentIndex[];
  public removed: PrevIndex[];
  public changed: Change[];
  public maintained: Change[];
  private changedBeforeAdded: ChangeBeforeAdd[];

  private cacheOrdered: Order[];
  constructor(
    prevList: T[],
    list: T[],
    added: CurrentIndex[],
    removed: PrevIndex[],
    changed: Change[],
    maintained: Change[],
    changedBeforeAdded: ChangeBeforeAdd[]
  ) {
    this.prevList = prevList;
    this.list = list;
    this.added = added;
    this.removed = removed;
    this.changed = changed;
    this.maintained = maintained;
    this.changedBeforeAdded = changedBeforeAdded;
  }

  get ordered(): Order[] {
    if (!this.cacheOrdered) {
      this.caculateOrdered();
    }
    return this.cacheOrdered;
  }

  private caculateOrdered() {
    const ordered = orderChanged(this.changedBeforeAdded, this.maintained);
    this.cacheOrdered = ordered;
  }

  public forEachAdded(fn: (item: T, index: CurrentIndex) => void) {
    this.added.forEach((currentIndex) =>
      fn(this.list[currentIndex], currentIndex)
    );
  }

  public forEachRemoved(fn: (item: T, index: PrevIndex) => void) {
    this.removed.forEach((prevIndex) =>
      fn(this.prevList[prevIndex], prevIndex)
    );
  }

  public forEachChanged(fn: (item: T, change: Change) => void) {
    this.changed.forEach(([prevIndex, currentIndex]) =>
      fn(this.list[currentIndex], [prevIndex, currentIndex])
    );
  }

  public forEachOrdered(fn: (item: T, order: Order) => void) {
    this.ordered.forEach(
      ([beforeOrderIndex, afterOrderIndex, prevIndex, currentIndex]) =>
        fn(this.list[currentIndex], [
          beforeOrderIndex,
          afterOrderIndex,
          prevIndex,
          currentIndex,
        ])
    );
  }

  public forEachMaintained(fn: (item: T, change: Change) => void) {
    this.maintained.forEach(([prevIndex, currentIndex]) =>
      fn(this.list[currentIndex], [prevIndex, currentIndex])
    );
  }
}
