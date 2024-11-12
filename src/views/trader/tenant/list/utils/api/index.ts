import { http } from "@/utils/http";

/** 获取租户管理-租户列表 */
export const getTenantList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-list",
    { data }
  );
};
