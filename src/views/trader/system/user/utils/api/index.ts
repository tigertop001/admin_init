import { http } from "@/utils/http";
/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/user",
    { data }
  );
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>(
    "get",
    "/mock/672c6855cb7443249e015111/sysadmin/list-all-role"
  );
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/dept",
    { data }
  );
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};
