import type { App } from "vue";
// import { platformConfig } from "./api/index"; // 暂时关闭 --- 等接口
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
    // const response: Result = await platformConfig(); // 暂时关闭 --- 等接口
    const response: Result = {
      msg: "请求成功",
      code: 0,
      data: {
        Version: "5.8.0",
        Title: "商户后台管理",
        FixedHeader: true,
        HiddenSideBar: false,
        MultiTagsCache: false,
        KeepAlive: true,
        Locale: "zh",
        Layout: "double",
        Theme: "light",
        DarkMode: false,
        OverallStyle: "light",
        Grey: false,
        Weak: false,
        HideTabs: false,
        HideFooter: false,
        Stretch: false,
        SidebarStatus: true,
        EpThemeColor: "#409EFF",
        ShowLogo: true,
        ShowModel: "smart",
        MenuArrowIconNoTransition: false,
        CachingAsyncRoutes: false,
        TooltipEffect: "light",
        ResponsiveStorageNameSpace: "responsivemax-",
        MenuSearchHistory: 6,
        MapConfigure: {
          amapKey: "adc139d56406f3844c8f1cf1c6b65c41",
          options: {
            resizeEnable: true,
            center: [113.6401, 34.72468],
            zoom: 12
          }
        }
      }
    };
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
