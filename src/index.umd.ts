/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import ListDiffer, { diff } from "./index";

(ListDiffer as any).diff = diff;
export default ListDiffer;
