import { http } from "@/utils/http";

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/menu",
    { data }
  );
};
