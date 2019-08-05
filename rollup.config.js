
const buildHelper = require("@egjs/build-helper");
const defaultOptions = {
  name: "eg.ListDiffer",
  input: "./src/index.umd.ts",
  sourcemap: true,
}

export default buildHelper([
  {
    ...defaultOptions,
    input: "./src/index.ts",
    output: "./dist/list-differ.esm.js",
    format: "es",
    exports: "named",
  },
  {
    ...defaultOptions,
    output: "./dist/list-differ.js",
  },
  {
    ...defaultOptions,
    output: "./dist/list-differ.min.js",
    uglify: true,
  },
]);

