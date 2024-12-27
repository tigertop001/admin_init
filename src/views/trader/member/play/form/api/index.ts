import { http } from "@/utils/http";

// 读取环境变量判断是否使用 mock
const isApiType = import.meta.env.VITE_APITYPE;

// API 路径配置
const API_URLS = {
  LIST: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/virtrualAccountList"
  },
  ADD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/addNewAccount"
  },
  ADDNOW: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/addExistccount"
  },
  ADD3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/AddThirdAccount"
  },
  QT3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/quitThirdAccount"
  },
  GETMONEY: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/getMoneyByAccount"
  },
  ENT3RD: {
    mock: "/mock/6740733ee0641e1205ae5b92/member/membership/list",
    real: "/api/v1/tenant/usercenter/vitrural/isEnterThird"
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

// 添加现有
export const addNowApi = data => {
  return http.request<Result>("post", getUrl("ADDNOW"), { data });
};

// 加入三方账户
export const add3rdApi = data => {
  return http.request<Result>("post", getUrl("ADD3RD"), { data });
};

// 退出三方账户
export const qt3rdApi = data => {
  return http.request<Result>("post", getUrl("QT3RD"), { data });
};

// 获取用户钱包信息
export const getMnyApi = data => {
  return http.request<Result>("post", getUrl("GETMONEY"), { data });
};

// 是否进三方
export const ent3rdApi = data => {
  return http.request<Result>("post", getUrl("ENT3RD"), { data });
};
export const api = {
  list: listApi,
  add: addApi,
  addNow: addNowApi,
  add3rd: add3rdApi,
  qt3rd: qt3rdApi,
  getMny: getMnyApi,
  ent3rd: ent3rdApi
};
