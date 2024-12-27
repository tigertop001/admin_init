import { ref } from "vue";
import { useMP } from "../store";
import { storeToRefs } from "pinia";

interface PullParams {
  stype?: string;
  [key: string]: any;
}

export function usPullCols() {
  const store = useMP();
  const { configData } = storeToRefs(store);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 初始化标志移到函数内部，避免多个实例共享
  let isInitialized = false;

  const getPullData = async (params?: PullParams) => {
    // 如果已经初始化且有数据，直接返回
    if (isInitialized && configData.value) {
      return configData.value;
    }

    // 如果正在加载中，防止重复请求
    if (loading.value) {
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const defaultParams = { stype: "all", ...params };
      const res = await store.pull(defaultParams);

      if (res?.code === 0) {
        isInitialized = true;
        return res;
      } else {
        throw new Error(res?.message || "请求失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("未知错误");
      console.error("获取数据失败:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 强制重新获取数据的方法
  const refreshPullData = async (params?: PullParams) => {
    isInitialized = false;
    return getPullData(params);
  };

  return {
    getPullData,
    refreshPullData,
    configData,
    loading,
    error
  };
}
