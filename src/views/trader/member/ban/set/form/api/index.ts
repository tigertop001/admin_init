import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  SET: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/banned/bannedSet"
  },
  DEL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/banned/bannedDelete"
  }
} as const;

const getUrl = (api: keyof typeof API_URLS) => {
  let str = "";
  switch (apiTp) {
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

// 配置
export const setApi = data => {
  return http.request<Result>("post", getUrl("SET"), { data });
};

// 删除
export const delApi = data => {
  return http.request<Result>("post", getUrl("DEL"), { data });
};

export const api = {
  set: setApi,
  del: delApi
};
