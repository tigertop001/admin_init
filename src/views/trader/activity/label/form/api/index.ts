import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/tag/list"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/tag/create"
  },
  EDIT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/tag/update"
  },
  DEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/activity/tag/delete"
  }
} as const;

// 获取URL
const getUrl = (api: keyof typeof API_URLS) => {
  let str = "";
  switch (isApiType) {
    case "1":
      str = API_URLS[api].mock;
      break;
    case "2":
      str = API_URLS[api].real;
      break;
    default:
      break;
  }
  return str;
};

// 列表
export const listApi = data => {
  return http.request<Result>("post", getUrl("LIST"), { data });
};

// 添加
export const addApi = data => {
  return http.request<Result>("post", getUrl("ADD"), { data });
};
// 编辑
export const editlApi = data => {
  return http.request<Result>("post", getUrl("EDIT"), { data });
};
// 删除
export const delApi = data => {
  return http.request<Result>("post", getUrl("DEL"), { data });
};
export const api = {
  list: listApi,
  add: addApi,
  edit: editlApi,
  del: delApi
};
