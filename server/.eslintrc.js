module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ["node_modules/**", "dist/**"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "no-console": [
      "error",
      {
        allow: ["error", "warn", "info"]
      }
    ]
  }
};
