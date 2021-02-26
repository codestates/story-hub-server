module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/eslint-recommended'],
  rules: {
    'no-console': ['off'],
    'comma-dangle': ['off'],
    'no-underscore-dangle': ['off'],
    'import/no-unresolved': ['off'],
    'import/extensions': ['off'],
  },
};
