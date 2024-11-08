module.exports = {
  // 使用自定义的规则
  rules: {
    // 提交类型不能为空
    "type-empty": [2, "never"],
    // 提交主题不能为空
    "subject-empty": [2, "never"],
    // 可以自定义类型（例如 `feat`、`fix`）
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore"]
    ]
    // 自定义其他规则...
  }
};
