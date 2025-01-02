import { http } from "@/utils/http";

const apiTp = import.meta.env.VITE_APITYPE;

const API_URLS = {
  FZNAMT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/fronzenMoney"
  },
  UNFZNAMT: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/unFronzenMoney"
  },
  LGDIS: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/banLogin"
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

// 资金冻结
export const fznAmtApi = data => {
  return http.request<Result>("post", getUrl("FZNAMT"), { data });
};

// 资金解冻
export const unFznAmtApi = data => {
  return http.request<Result>("post", getUrl("UNFZNAMT"), { data });
};

// 禁止登录
export const lgDisApi = data => {
  return http.request<Result>("post", getUrl("LGDIS"), { data });
};
export const api = {
  fznAmt: fznAmtApi,
  unFznAmt: unFznAmtApi,
  lgDis: lgDisApi
};
