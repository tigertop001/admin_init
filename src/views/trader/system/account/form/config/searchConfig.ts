/**
 * 搜索状态类型定义
 */
export interface SearchStateType {
  regStartTime: number; // 接受 string 或 Date 类型
  regEndTime: number; // 接受 string 或 Date 类型
  loginStartTime: number; // 接受 string 或 Date 类型
  loginEndTime: number; // 接受 string 或 Date 类型
  tagId: string | number;
  status: string | number;
  page: number;
  pageSize: number;
}

/**
 * 搜索字段配置
 */
export const SEARCH_FIELDS = {
  basic: ["tagId", "status"]
} as const;

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => {
  return {
    regStartTime: null,
    regEndTime: null,
    loginStartTime: null,
    loginEndTime: null,
    tagId: null,
    status: null,
    page: 1,
    pageSize: 10
  };
};

/**
 * 重置搜索状态
 */
export const resetSearchState = (emitReset?: () => void): SearchStateType => {
  const resetState = crtDFS();
  if (emitReset) {
    emitReset();
  }

  return resetState;
};
