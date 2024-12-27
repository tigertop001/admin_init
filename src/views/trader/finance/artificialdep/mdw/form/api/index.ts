import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/mock/676d5fb3ff8dc93695040d00/mdw/api/v1/tenant/manual/get"
  },
  DEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/banned/bannedDelete"
  },
  UP: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/color/colorConfigListUpdate"
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

// 删除
export const delApi = data => {
  return http.request<Result>("post", getUrl("DEL"), { data });
};
// 解冻
export const upApi = data => {
  return http.request<Result>("post", getUrl("UP"), { data });
};
export const api = {
  list: listApi,
  del: delApi,
  up: upApi
};
