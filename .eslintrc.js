module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'linebreak-style': 'off',
    'guard-for-in': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 120 }],
    'no-restricted-syntax': [
      'off', 'FunctionExpression',
      'WithStatement', "BinaryExpression[operator='in']"],
  },
};
