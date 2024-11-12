import { http } from "@/utils/http";

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/role",
    { data }
  );
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/role-menu",
    { data }
  );
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/role-menu-ids",
    { data }
  );
};
