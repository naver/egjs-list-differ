/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import {
  AfterOrderIndex,
  BeforeOrderIndex,
  Change,
  CurrentIndex,
  Order,
  PrevIndex,
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

function orderChanged(priorityList: AfterOrderIndex[], maintained: Change[]) {
  const confirmed: Record<number, boolean> = {};
  const ordered: Order[] = [];
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
    ordered.push([
      from,
      to - 1,
      maintained[priority][0],
      maintained[priority][1],
      to < length ? maintained[priorityList[to]][1] : -1,
    ]);
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
  public added: CurrentIndex[];
  public removed: PrevIndex[];
  public changed: Change[];
  public maintained: Change[];

  private orderPriority: AfterOrderIndex[];
  private cacheOrdered: Order[];

  constructor(
    prevList: T[],
    list: T[],
    added: CurrentIndex[],
    removed: PrevIndex[],
    changed: Change[],
    maintained: Change[],
    orderPriority: AfterOrderIndex[]
  ) {
    this.prevList = prevList;
    this.list = list;
    this.added = added;
    this.removed = removed;
    this.changed = changed;
    this.maintained = maintained;
    this.orderPriority = orderPriority;
  }

  get ordered(): Order[] {
    if (!this.cacheOrdered) {
      this.caculateOrdered();
    }
    return this.cacheOrdered;
  }

  private caculateOrdered() {
    const ordered = orderChanged([...this.orderPriority], this.maintained);
    this.cacheOrdered = ordered;
  }

  public forEachAdded(
    fn: (record: { currentItem: T; currentIndex: CurrentIndex }) => void
  ) {
    this.added.forEach((currentIndex) =>
      fn({
        currentItem: this.list[currentIndex],
        currentIndex,
      })
    );
  }

  public forEachAddedRight(
    fn: (record: { currentItem: T; currentIndex: CurrentIndex }) => void
  ) {
    this.added.forEach((_, i) => {
      const currentIndex = this.added[this.added.length - 1 - i];
      fn({
        currentItem: this.list[currentIndex],
        currentIndex,
      });
    });
  }

  public forEachRemoved(
    fn: (record: { prevItem: T; prevIndex: PrevIndex }) => void
  ) {
    this.removed.forEach((prevIndex) =>
      fn({
        prevItem: this.prevList[prevIndex],
        prevIndex,
      })
    );
  }

  public forEachChanged(
    fn: (record: {
      prevItem: T;
      currentItem: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.changed.forEach(([prevIndex, currentIndex]) =>
      fn({
        prevItem: this.prevList[prevIndex],
        currentItem: this.list[currentIndex],
        prevIndex,
        currentIndex,
      })
    );
  }

  public forEachOrdered(
    fn: (record: {
      prevItem: T;
      currentItem: T;
      anchor: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
      beforeOrderIndex: BeforeOrderIndex;
      afterOrderIndex: AfterOrderIndex;
      anchorIndex: CurrentIndex;
    }) => void
  ) {
    this.ordered.forEach(
      ([
        beforeOrderIndex,
        afterOrderIndex,
        prevIndex,
        currentIndex,
        anchorIndex,
      ]) =>
        fn({
          prevItem: this.prevList[prevIndex],
          currentItem: this.list[currentIndex],
          anchor: this.list[anchorIndex],
          prevIndex,
          currentIndex,
          beforeOrderIndex,
          afterOrderIndex,
          anchorIndex,
        })
    );
  }

  public forEachMaintained(
    fn: (record: {
      prevItem: T;
      currentItem: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.maintained.forEach(([prevIndex, currentIndex]) =>
      fn({
        prevItem: this.list[currentIndex],
        currentItem: this.list[currentIndex],
        prevIndex,
        currentIndex,
      })
    );
  }

  public forEachMaintainedRight(
    fn: (record: {
      prevItem: T;
      currentItem: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.maintained.forEach((_, i) => {
      const [prevIndex, currentIndex] =
        this.maintained[this.maintained.length - 1 - i];
      fn({
        prevItem: this.list[currentIndex],
        currentItem: this.list[currentIndex],
        prevIndex,
        currentIndex,
      });
    });
  }
}
