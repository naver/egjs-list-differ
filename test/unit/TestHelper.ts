export type KeyType = number | string;
export function makeArray(arr: KeyType[], arr2: KeyType[]): any[] {
  return [arr, arr2];
}
export function makeKeyObject(arr: KeyType[], arr2: KeyType[]): any[] {
  return [
    arr.map(key => ({key})),
    arr2.map(key => ({key})),
  ];
}
export function makeCloneKeyObject(arr: KeyType[], arr2: KeyType[]): any[] {
  const obj: {[key in KeyType]: {key: KeyType}} = {};
  const obj1 = arr.map(key => ({key}));

  obj1.forEach(value => {
    obj[value.key] = value;
  });
  const obj2 = arr2.map(key => (obj[key] || {key}));
  return [
    obj1,
    obj2,
  ];
}
