import ListDiffer from "../../src/ListDiffer";
import { DiffResult } from "../../src/types";
import { makeArray, makeKeyObject, makeCloneKeyObject } from "./TestHelper";

describe("describe ListDiffer", () => {

  describe("Added, Removed, Changed", () => {

    [
      {
        title: "",
        func: makeArray,
        callback: undefined,
      },
      {
        title: "for object key",
        func: makeKeyObject,
        callback: ({ key }) => key,
      },
      {
        title: "for object",
        func: makeCloneKeyObject,
        callback: undefined
      }
    ].forEach(({ title, func, callback }) => {
      it(`test added ${title}`, () => {
        // Given
        const [prevList, list] = func([1, 2], [1, 2, 3, 4]);
        const detector = new ListDiffer(prevList as any, callback);
        // When
        const e = detector.update(list as any);
        // Then
        expect(e.prevList).toEqual(prevList);
        expect(e.list).toEqual(list);
        expect(e.added).toEqual([2, 3]);
        expect(e.removed).toEqual([]);

      });
      it(`test removed ${title}`, () => {
        // Given
        const [prevList, list] = func([1, 2, 3, 4], [2, 3]);
        const detector = new ListDiffer(prevList as any, callback);
        // When
        const e = detector.update(list as any);
        // Then
        expect(e.prevList).toEqual(prevList);
        expect(e.list).toEqual(list);
        expect(e.added).toEqual([]);
        expect(e.removed).toEqual([3, 0]);
      });
      it(`test changed ${title}`, () => {
        // Given
        const [prevList, list] = func([1, 2, 3, 4], [1, 3, 2, 4]);
        const detector = new ListDiffer(prevList as any, callback);
        // When
        const e = detector.update(list as any);
        // Then
        expect(e.prevList).toEqual(prevList);
        expect(e.list).toEqual(list);
        expect(e.added).toEqual([]);
        expect(e.removed).toEqual([]);
      });
      it(`test added, removed, changed ${title}`, () => {
        // Given
        const [prevList, list] = func([1, 2, 3, 4, 5, 6, 7, 8], [8, 5, 3, 9, 2, 1]);
        const detector = new ListDiffer(prevList as any, callback);
        // When
        const e = detector.update(list as any);
        // Then
        expect(e.prevList).toEqual(prevList);
        expect(e.list).toEqual(list);
        // 9
        expect(e.added).toEqual([3]);
        // 4, 7, 8
        expect(e.removed).toEqual([6, 5, 3]);
      });
    });
  });
  describe("test changed, maintained of multiple cases (prevList: [0, 1, 2, 3, 4, 5, 6, 7])", () => {
    const prevList = [0, 1, 2, 3, 4, 5, 6, 7];
    [
      {
        list: [1, 0],
        changed: [[1, 0], [0, 1]],
        pureChanged: [[1, 0]],
        ordered: [[1, 0]],
        maintained: [[1, 0], [0, 1]],
      },
      {
        list: [8],
        changed: [],
        pureChanged: [],
        ordered: [],
        maintained: [],
      },
      {
        list: [3, 7],
        changed: [[3, 0], [7, 1]],
        pureChanged: [],
        ordered: [],
        maintained: [[3, 0], [7, 1]],
      },
      {
        list: [7, 3],
        changed: [[7, 0], [3, 1]],
        pureChanged: [[7, 0]],
        ordered: [[1, 0]],
        maintained: [[7, 0], [3, 1]],
      },
      {
        list: [7, 6],
        changed: [[7, 0], [6, 1]],
        pureChanged: [[7, 0]],
        ordered: [[1, 0]],
        maintained: [[7, 0], [6, 1]],
      },
      {
        list: [8, 9, 10, 0, 1, 11, 12, 13, 2, 3],
        changed: [[0, 3], [1, 4], [2, 8], [3, 9]],
        pureChanged: [],
        ordered: [],
        maintained: [[0, 3], [1, 4], [2, 8], [3, 9]],
      },
      {
        list: [1, 0],
        changed: [[1, 0], [0, 1]],
        pureChanged: [[1, 0]],
        ordered: [[1, 0]],
        maintained: [[1, 0], [0, 1]],
      },
      {
        list: [8, 1, 0],
        changed: [[0, 2]],
        pureChanged: [[0, 2]],
        ordered: [[0, 1]],
        maintained: [[1, 1], [0, 2]],
      },
      {
        list: [2, 1, 0],
        changed: [[2, 0], [0, 2]],
        pureChanged: [[2, 0], [0, 2]],
        ordered: [[2, 0], [1, 2]],
        maintained: [[2, 0], [1, 1], [0, 2]],
      },
      {
        list: [4, 5, 6],
        changed: [[4, 0], [5, 1], [6, 2]],
        pureChanged: [],
        ordered: [],
        maintained: [[4, 0], [5, 1], [6, 2]],
      },
      {
        list: [8, 9],
        changed: [],
        pureChanged: [],
        ordered: [],
        maintained: [],
      },
      {
        list: [0, 8, 2, 9, 3, 10, 5, 11, 4, 12],
        changed: [[3, 4], [5, 6], [4, 8]],
        pureChanged: [[5, 6]],
        ordered: [[4, 3]],
        maintained: [[0, 0], [2, 2], [3, 4], [5, 6], [4, 8]],
      },
      {
        list: [2, 1, 7, 3, 4],
        changed: [[2, 0], [7, 2]],
        pureChanged: [[2, 0], [7, 2]],
        ordered: [[1, 0], [4, 2]],
        maintained: [[2, 0], [1, 1], [7, 2], [3, 3], [4, 4]],
      },
      {
        list: [8, 3, 2, 1],
        changed: [[3, 1], [1, 3]],
        pureChanged: [[3, 1], [1, 3]],
        ordered: [[2, 0], [1, 2]],
        maintained: [[3, 1], [2, 2], [1, 3]],
      },
      {
        list: [7, 4, 2, 8, 1, 0],
        changed: [[7, 0], [4, 1], [1, 4], [0, 5]],
        pureChanged: [[7, 0], [4, 1], [1, 4], [0, 5]],
        ordered: [[4, 0], [4, 1], [3, 4], [2, 4]],
        maintained: [[7, 0], [4, 1], [2, 2], [1, 4], [0, 5]],
      },
      {
        list: [2, 1, 0, 8, 7, 6, 3, 4, 5],
        changed: [[2, 0], [0, 2], [7, 4], [6, 5], [3, 6], [4, 7], [5, 8]],
        pureChanged: [[2, 0], [0, 2], [7, 4], [6, 5]],
        ordered: [[2, 0], [1, 2], [7, 3], [7, 4]],
        maintained: [[2, 0], [1, 1], [0, 2], [7, 4], [6, 5], [3, 6], [4, 7], [5, 8]],
      },
      {
        list: [2, 3, 0, 4, 1],
        changed: [[2, 0], [3, 1], [0, 2], [4, 3], [1, 4]],
        pureChanged: [[2, 0], [3, 1], [4, 3]],
        ordered: [[2, 0], [3, 1], [4, 3]],
        maintained: [[2, 0], [3, 1], [0, 2], [4, 3], [1, 4]],
      },
      {

        list: [5, 6, 7, 0, 1, 2, 3, 4],
        changed: [[5, 0], [6, 1], [7, 2], [0, 3], [1, 4], [2, 5], [3, 6], [4, 7]],
        pureChanged: [[5, 0], [6, 1], [7, 2]],
        ordered: [[5, 0], [6, 1], [7, 2]],
        maintained: [[5, 0], [6, 1], [7, 2], [0, 3], [1, 4], [2, 5], [3, 6], [4, 7]],
      },
      {
        list: [7, 6, 2, 3, 4, 8, 1, 0],
        changed: [[7, 0], [6, 1], [1, 6], [0, 7]],
        pureChanged: [[7,0], [6, 1], [1, 6], [0, 7]],
        ordered: [[6, 0], [6, 1], [3, 6], [2, 6]],
        maintained: [[7, 0], [6, 1], [2, 2], [3, 3], [4, 4], [1, 6], [0, 7]],
      },
      {
        list: [2, 1, 0, 3, 4, 7, 6, 5],
        changed: [[2, 0], [0, 2], [7, 5], [5, 7]],
        pureChanged: [[2, 0], [0, 2], [7, 5], [5, 7]],
        ordered: [[2, 0], [1, 2], [7, 5], [6, 7]],
        maintained: [[2, 0], [1, 1], [0, 2], [3, 3], [4, 4], [7, 5], [6, 6], [5, 7]],
      },
      {
        list: [1, 2, 3, 4, 0],
        changed: [[1, 0], [2, 1], [3, 2], [4, 3], [0, 4]],
        maintained: [[1, 0], [2, 1], [3, 2], [4, 3], [0, 4]],
        pureChanged: [[1, 0], [2, 1], [3, 2], [4, 3]],
        ordered: [[1, 0], [2, 1], [3, 2], [4, 3]],
      },
      {
        list: [2, 3, 4, 0, 1],
        changed: [[2, 0], [3, 1], [4, 2], [0, 3], [1, 4]],
        maintained: [[2, 0], [3, 1], [4, 2], [0, 3], [1, 4]],
        pureChanged: [[2, 0], [3, 1], [4, 2]],
        ordered: [[2, 0], [3, 1], [4, 2]],
      },
    ].forEach(({
      list,
      maintained,
      changed,
      pureChanged,
      ordered,
    }) => {
      describe(`test update list (list: ${list})`, () => {
        let detector: ListDiffer<number>;
        let result: DiffResult<number>;
        beforeEach(() => {
          detector = new ListDiffer(prevList, (v: number) => v);
          result = detector.update(list);
        })
        it(`test changed(list: [${list}])`, () => {
          // Given // When // Then
          expect(result.changed).toEqual(changed);
          expect(result.pureChanged).toEqual(pureChanged);
          expect(result.ordered).toEqual(ordered);
          expect(result.maintained).toEqual(maintained);
        });
        it(`test ordering before added(list: [${list}])`, () => {
          // Given
          const orderedList = prevList.slice();
          // When
          result.removed.forEach(index => {
            orderedList.splice(index, 1);
          });
          result.ordered.forEach(([from, to]) => {
            // remove
            const list = orderedList.splice(from, 1);
            // insert
            orderedList.splice(to, 0, list[0]);
          });

          result.added.forEach(index => {
            orderedList.splice(index, 0, list[index]);
          });
          // Then
          // Complet Sync
          expect(orderedList).toEqual(list);
        });
        it(`test ordering with maintained, added(list: [${list}])`, () => {
          // Given
          const nextList: number[] = [];
          // When
          result.maintained.forEach(([from, to]) => {
            nextList[to] = list[to];
          });
          result.added.forEach(index => {
            nextList[index] = list[index];
          });
          // Then
          expect(nextList).toEqual(list);
        });
        it(`test ordering with maintained => added(list: [${list}])`, () => {
          // Given
          const nextList: number[] = [];
          // When
          result.maintained.forEach(([from, to]) => {
            nextList.push(list[to]);
          });
          result.added.forEach(index => {
            nextList.splice(index, 0, list[index]);
          });
          // Then
          expect(nextList).toEqual(list);
        });
        it(`test ordering with added => maintained(list: [${list}])`, () => {
          // Given
          const nextList: number[] = [];
          // When
          result.added.forEach(index => {
            nextList.push(list[index]);
          });
          result.maintained.forEach(([from, to]) => {
            nextList.splice(to, 0, list[to]);
          });
          // Then
          expect(nextList).toEqual(list);
        });
      });
      describe(`test synchronize DOM (list: ${list})`, () => {
        let detector: ListDiffer<number>;
        let listDiffer: ListDiffer<Element>;
        let result: DiffResult<number>;
        let parentElement: HTMLElement;
        let children: HTMLCollection;

        beforeEach(() => {
          detector = new ListDiffer(prevList, (v: number) => v);
          result = detector.update(list);
          parentElement = document.createElement("div");
          parentElement.innerHTML = prevList.map((i) => `<div>${i}</div>`).join("");
          children = parentElement.children;
          listDiffer = new ListDiffer(children);
        });
        it(`test ordering before added(list: [${list}])`, () => {
          // Given
          // When
          result.removed.forEach(index => {
            children[index].remove();
          });
          result.ordered.forEach(([from, to]) => {
            parentElement.insertBefore(children[from], children[from < to ? to + 1 : to]);
          });
          result.added.forEach(index => {
            parentElement.insertBefore(document.createElement("div"), children[index]);
          });
          // Then
          const childrenResult = listDiffer.update(children);
          expect(result.added).toEqual(childrenResult.added);
          expect(result.removed).toEqual(childrenResult.removed);
          expect(result.changed).toEqual(childrenResult.changed);
          expect(result.maintained).toEqual(childrenResult.maintained);
        });
        it(`test ordering with maintained => added(list: [${list}])`, () => {
          // Given
          const prevChildren: Element[] = [].slice.call(parentElement.children);
          // When
          result.removed.forEach(index => {
            prevChildren[index].remove();
          });
          result.maintained.forEach(([from, to]) => {
            parentElement.appendChild(prevChildren[from]);
          });
          result.added.forEach(index => {
            parentElement.insertBefore(document.createElement("div"), children[index]);
          });
          // Then
          const childrenResult = listDiffer.update(children);
          expect(result.added).toEqual(childrenResult.added);
          expect(result.removed).toEqual(childrenResult.removed);
          expect(result.changed).toEqual(childrenResult.changed);
          expect(result.maintained).toEqual(childrenResult.maintained);
        });
        it(`test ordering with added => maintained(list: [${list}])`, () => {
          // Given
          const prevChildren: Element[] = [].slice.call(parentElement.children);
          const fragment = document.createDocumentFragment();
          // When
          result.removed.forEach(index => {
            prevChildren[index].remove();
          });
          result.added.forEach(() => {
            fragment.appendChild(document.createElement("div"));
          });
          result.maintained.forEach(([from, to]) => {
            fragment.insertBefore(prevChildren[from], fragment.children[to]);
          });
          parentElement.appendChild(fragment);
          // Then
          const childrenResult = listDiffer.update(children);
          expect(result.added).toEqual(childrenResult.added);
          expect(result.removed).toEqual(childrenResult.removed);
          expect(result.changed).toEqual(childrenResult.changed);
          expect(result.maintained).toEqual(childrenResult.maintained);
        });
      });
    });
  });
  [
    {
      prevList: [1, 7, 5, 8, 3, 4, 6, 2],
      list: [1, 4, 2, 8, 7, 3, 5, 6],
    },
    {
      prevList: [4, 5, 1, 2, 3, 6, 8, 7],
      list: [3, 2, 1, 6, 5, 4, 8, 7],
    },
    {
      prevList: [8, 6, 7, 1, 2, 3, 4, 5],
      list: [2, 6, 3, 1, 4, 5, 7, 8],
    },
    {
      prevList: [1, 2, 3, 4, 5, 6, 7, 8],
      list: [5, 4, 3, 6, 2, 1, 7, 8]
    }
  ].forEach(({ prevList, list }) => {
    it(`test ordering with custom(prevList: [${prevList}], list: [${list}])`, () => {
      const detector = new ListDiffer(prevList, (v: number) => v);
      const result = detector.update(list);
      // Given
      const orderedList = prevList.slice();
      // When
      result.removed.forEach(index => {
        orderedList.splice(index, 1);
      });

      result.ordered.forEach(([from, to]) => {
        // remove
        const list = orderedList.splice(from, 1);
        // insert
        orderedList.splice(to, 0, list[0]);
      });

      // Then
      // Complet Sync
      expect(orderedList).toEqual(list);
    });
  });
});
