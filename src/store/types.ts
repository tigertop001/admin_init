import type { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  isShowDouble: boolean;
  viewportSize: { width: number; height: number };
  sortSwap: boolean;
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  // avatar?: string;
  username?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  verifyCode?: string;
  currentPage?: number; //  0 登入页， 4 忘记密码
  isRemembered?: boolean; // 是否记住密码
  // needGoogleAuth?: boolean;
  // needBindGoogle?: boolean;
  // googleQrCode?: string; // 谷歌二维码
  // googleSecretKey?: string; // 谷歌密钥
  tempLoginData?: any | null;
};
