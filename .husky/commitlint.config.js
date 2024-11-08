// @ts-check

/** @type {import("@commitlint/types").UserConfig} */
export default {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "style",
        "docs",
        "test",
        "refactor",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release",
        "新功能",
        "修复",
        "性能优化",
        "样式修改",
        "文档修改",
        "测试",
        "重构",
        "构建",
        "配置修改",
        "杂项",
        "撤销",
        "工作进行中",
        "工作流",
        "发布"
      ]
    ]
  }
};
