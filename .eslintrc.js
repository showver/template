/*
 * @Author: showier
 * @since: 2020-08-25 15:24:00
 * @lastTime: 2020-09-01 17:59:04
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\.eslintrc.js
 * @Description: eslint配置文件
 */
module.exports = {
  'env': { // 支持的ES6语法
    'browser': true,
    'node': true,
    'es6': true
  },
  'extends': [
    // 'eslint:recommended',
    'plugin:vue/essential'
  ],
  'parserOptions': {
    'parser': 'babel-eslint',
    'ecmaVersion': 2019,
    'sourceType': 'module'
  },
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": [2, {
      "vars": "local",
      "args": "none"
    }],
    "semi": [0],
    "key-spacing": [0, {
      "singleLine": {
        "beforeColon": false,
        "afterColon": true
      },
      "multiLine": {
        "beforeColon": true,
        "afterColon": true,
        "align": "colon"
      },
      "no-multiple-empty-lines": [0, {
        "max": 100
      }],
      "no-mixed-spaces-and-tabs": [0],
      "indent": [1, 2]
    }]
  }
}