import { http } from "@/utils/http";
/** 获取租户管理-租户套餐列表 */
export const getTenantPackage = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-package",
    { data }
  );
};

/** 获取租户套餐-权限-菜单权限 */
export const getTenantPackageMenu = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-package-menu",
    { data }
  );
};

/** 获取租户套餐-权限-菜单权限-根据角色 id 查对应菜单 */
export const getTenantPackageMenuIds = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-package-menu-ids",
    { data }
  );
};
