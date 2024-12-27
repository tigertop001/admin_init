/**
 * 搜索字段接口
 */
interface SearchField {
  content: string;
  type: string;
  label: string;
}

/**
 * 基础字段配置
 */
interface FieldConfig {
  type: string;
  label: string;
}

/**
 * 创建默认搜索状态
 * @param customFields - 自定义字段的默认配置
 * @param basicFields - 基础字段列表
 */
export const crtDFS = (
  customFields: Record<string, FieldConfig>,
  basicFields: string[] = []
) => {
  const state: Record<string, SearchField | string> = {};

  // 处理自定义字段
  Object.entries(customFields).forEach(([key, config]) => {
    state[key] = {
      content: "",
      type: config.type,
      label: config.label
    };
  });

  // 处理基础字段 - 直接赋值空字符串
  basicFields.forEach(field => {
    state[field] = "";
  });

  return state;
};

/**
 * 重置搜索状态
 */
export const onSrchRes = (
  customFields: Record<string, FieldConfig>,
  basicFields: string[] = [],
  emitReset?: () => void
) => {
  const resetState = crtDFS(customFields, basicFields);

  if (emitReset) {
    emitReset();
  }

  return resetState;
};
