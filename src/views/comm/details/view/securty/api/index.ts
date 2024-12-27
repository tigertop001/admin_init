import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  DHGINFO: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/changeInfo"
  },
  CHECK: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/checkAdminPwd"
  },
  RELOGIN: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/checkAdminPwd"
  },
  REPPAY: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/user/checkAdminPwd"
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

//用户信息修改
export const chgInfoApi = data => {
  return http.request<Result>("post", getUrl("DHGINFO"), { data });
};

//检查密码的正确性
export const checkApi = data => {
  return http.request<Result>("post", getUrl("CHECK"), { data });
};
//重置登录密码
export const reLogApi = data => {
  return http.request<Result>("post", getUrl("RELOGIN"), { data });
};
//重置支付密码
export const rePayApi = data => {
  return http.request<Result>("post", getUrl("REPPAY"), { data });
};

export const api = {
  chgInfo: chgInfoApi,
  check: checkApi,
  rePay: rePayApi,
  reLog: reLogApi
};
