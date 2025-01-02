import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  INFO: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/withdrawSettingList"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/pay/withdrawSettingEdit"
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

export const infoApi = () => {
  return http.request<Result>("post", getUrl("INFO"));
};
export const addApi = data => {
  return http.request<Result>("post", getUrl("ADD"), { data });
};

export const api = {
  add: addApi,
  info: infoApi
};
