import { http } from "@/utils/http";
/** 获取租户套餐列表（用于下拉选择） */
export const getTenantPackageSimple = () => {
  return http.request<Result>(
    "get",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-package-simple"
  );
};
