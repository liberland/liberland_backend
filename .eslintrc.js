module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  env: {
    node: true,
  },
  rules: {
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    "import/prefer-default-export": 0
  }
};