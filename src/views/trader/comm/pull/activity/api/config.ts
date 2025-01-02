export const API_CONFIG = {
  ACT: {
    key: "ACT",
    urls: {
      mock: "/mock/activity/list",
      real: "/api/v1/tenant/activity/list"
    },
    fields: ["name", "id"] // 默认字段
  },
  TAG: {
    key: "TAG",
    urls: {
      mock: "/mock/tag/list",
      real: "/api/v1/tenant/activity/tag/list"
    },
    fields: ["name", "id"]
  }
} as const;

export type PullType = keyof typeof API_CONFIG;
