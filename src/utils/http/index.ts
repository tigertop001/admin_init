import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer
} from "axios";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
// import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStoreHook } from "@/views/comm/login/store/user";

const API_BASE_CONFIG = JSON.parse(import.meta.env.VITE_API_BASE_URL);

const getBaseUrl = (url: string) => {
  if (JSON.parse(import.meta.env.VITE_APITYPE) <= 1) {
    return "/";
  }
  // 获取配置中所有的前缀路径
  const prefixes = Object.keys(API_BASE_CONFIG);

  // 查找匹配的前缀
  const matchedPrefix = prefixes.find(prefix => url.startsWith(prefix));

  // 如果找到匹配的前缀，返回对应的baseUrl，否则返回默认值
  if (matchedPrefix) {
    return API_BASE_CONFIG[matchedPrefix];
  }

  return "/";
};

const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  baseURL: "/",
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Device-Type": 1,
    "X-Tenant-Id": "1000010",
    "X-Device-Id": "fdfdfdfweq334",
    "X-Web-Terminal-Id": "WINDOWS",
    "X-Platform-Id": "B",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};
console.log("------999, config9---");
class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** `token`过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新`token` */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        console.log("-token过期刷新00---", token);
        config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 优先判断post/get等方法是否传入回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }

        /** 请求白名单，放置不需要token的接口 */
        const whiteList = ["/refresh-token", "/login"];
        if (whiteList.some(url => config.url.endsWith(url))) {
          return config;
        }

        // 获取token
        const tokenData = getToken();
        if (!tokenData) return config;

        const now = new Date().getTime();
        const expired = parseInt(String(tokenData.expireAt)) - now <= 0;

        if (expired) {
          // token已过期，需要刷新
          if (!PureHttp.isRefreshing) {
            PureHttp.isRefreshing = true;
            try {
              const res = await useUserStoreHook().handRefreshToken({
                refreshToken: tokenData.refreshToken
              });
              const newToken = res.data.token;
              // 设置新的token到请求头
              config.headers["Authorization"] = formatToken(newToken);
              // 处理队列中的请求
              PureHttp.requests.forEach(cb => cb(newToken));
              PureHttp.requests = [];
            } finally {
              PureHttp.isRefreshing = false;
            }
          }
          // 将请求添加到队列
          return PureHttp.retryOriginalRequest(config);
        } else {
          // token未过期，直接使用
          config.headers["Authorization"] = formatToken(tokenData.token);
        }

        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        // NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        // NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
      baseURL: getBaseUrl(url)
    } as PureHttpRequestConfig;
    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }
}

export const http = new PureHttp();
