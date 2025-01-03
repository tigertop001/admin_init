import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  PULL: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/tenant/option"
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

// 轮播图管理下拉
export const pullApi = (data: Record<string, any>) => {
  return http.request<Result>("post", getUrl("PULL"), { data });
};

export const api = {
  pull: pullApi
};
