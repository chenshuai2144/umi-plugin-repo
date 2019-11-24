
export default [
  {
    cjs: 'babel',
  },
  {
    entry: 'ui/index.tsx',
    typescriptOpts: {
      check: false,
    },
    umd: {
      name: 'umi-plugin-repo',
      minFile: false,
    },
  },
];
