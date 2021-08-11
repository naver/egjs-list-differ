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
    fn: (record: { item: T; currentIndex: CurrentIndex }) => void
  ) {
    this.added.forEach((currentIndex) =>
      fn({
        item: this.list[currentIndex],
        currentIndex,
      })
    );
  }

  public forEachAddedRight(
    fn: (record: { item: T; currentIndex: CurrentIndex }) => void
  ) {
    this.added.forEach((_, i) => {
      const currentIndex = this.added[this.added.length - 1 - i];
      fn({
        item: this.list[currentIndex],
        currentIndex,
      });
    });
  }

  public forEachRemoved(
    fn: (record: { item: T; prevIndex: PrevIndex }) => void
  ) {
    this.removed.forEach((prevIndex) =>
      fn({
        item: this.prevList[prevIndex],
        prevIndex,
      })
    );
  }

  public forEachChanged(
    fn: (record: {
      item: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.changed.forEach(([prevIndex, currentIndex]) =>
      fn({
        item: this.list[currentIndex],
        prevIndex,
        currentIndex,
      })
    );
  }

  public forEachOrdered(
    fn: (record: {
      item: T;
      anchor: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
      beforeOrderIndex: BeforeOrderIndex;
      afterOrderIndex: AfterOrderIndex;
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
          item: this.prevList[prevIndex],
          anchor: this.list[anchorIndex],
          prevIndex,
          currentIndex,
          beforeOrderIndex,
          afterOrderIndex,
        })
    );
  }

  public forEachMaintained(
    fn: (record: {
      item: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.maintained.forEach(([prevIndex, currentIndex]) =>
      fn({
        item: this.list[currentIndex],
        prevIndex,
        currentIndex,
      })
    );
  }

  public forEachMaintainedRight(
    fn: (record: {
      item: T;
      prevIndex: PrevIndex;
      currentIndex: CurrentIndex;
    }) => void
  ) {
    this.maintained.forEach((_, i) => {
      const [prevIndex, currentIndex] =
        this.maintained[this.maintained.length - 1 - i];
      fn({
        item: this.list[currentIndex],
        prevIndex,
        currentIndex,
      });
    });
  }
}
