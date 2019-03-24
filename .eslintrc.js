module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "airbnb-base",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "padded-blocks": "off",
    "import/prefer-default-export": "off",
    "prefer-const": "off",
    "prefer-destructuring": "off",

    "babel/new-cap": 1,
    "babel/camelcase": 1,
    "babel/no-invalid-this": 1,
    "babel/semi": 1,
    "babel/no-unused-expressions": 1,
    "babel/valid-typeof": 1
  },
  "plugins": [
    "babel"
  ],
  "parser": "babel-eslint"
};