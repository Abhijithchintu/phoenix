module.exports = {
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["react-hooks"],
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: "[A-Z]",
        caughtErrors: "none",
      },
    ],
  },
};
