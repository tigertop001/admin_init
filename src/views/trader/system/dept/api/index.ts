import { http } from "@/utils/http";

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/dept",
    { data }
  );
};
