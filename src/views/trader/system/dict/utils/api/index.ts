import { http } from "@/utils/http";
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
