module.exports = {
  "extends": ["airbnb-base"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module",
  },
  "ecmaFeatures": {
    globalReturn: true,
    impliedStrict: true,
    jsx: true,
    arrowFunction: true
  },
  "env": {
    "node": true,
  },
  "rules": {
  }
};