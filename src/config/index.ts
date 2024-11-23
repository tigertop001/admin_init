import type { App } from "vue";
import { platformConfig } from "./api/index";
let config: object = {};

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();

  try {
    const response: Result = await platformConfig();
    let $config = app.config.globalProperties.$config;
    // 自动注入系统配置
    if (app && $config && response.code === 0) {
      $config = Object.assign($config, response.data);
      app.config.globalProperties.$config = $config;
      // 设置全局配置
      setConfig($config);
    }
    return $config;
  } catch (error) {
    throw "获取平台配置信息失败";
  }
};

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

export { getConfig, setConfig, responsiveStorageNameSpace };
