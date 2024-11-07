import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

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

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/role",
    { data }
  );
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/menu",
    { data }
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

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c9f71cb7443249e01511c/sysMonit/online-logs",
    { data }
  );
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c9f71cb7443249e01511c/sysMonit/login-logs",
    { data }
  );
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c9f71cb7443249e01511c/sysMonit/operation-logs",
    { data }
  );
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c9f71cb7443249e01511c/sysMonit/system-logs",
    { data }
  );
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>(
    "post",
    "/mock/672c9f71cb7443249e01511c/sysMonit/system-logs-detail",
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

/** 字典管理-左侧树 */
export const getDictTree = () => {
  return http.request<Result>(
    "get",
    "/mock/672c6855cb7443249e015111/sysadmin/dict-tree"
  );
};

/** 字典管理-根据字典 dictId 查字典详情 */
export const getDictDetail = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c6855cb7443249e015111/sysadmin/dict-detail",
    { data }
  );
};

/** 获取租户管理-租户列表 */
export const getTenantList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-list",
    { data }
  );
};

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

/** 获取租户套餐列表（用于下拉选择） */
export const getTenantPackageSimple = () => {
  return http.request<Result>(
    "get",
    "/mock/672c637ecb7443249e01510a/tenants/tenant-package-simple"
  );
};
