module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'linebreak-style': 0,
    'no-param-reassign': [2, { props: false }],
  },
};
