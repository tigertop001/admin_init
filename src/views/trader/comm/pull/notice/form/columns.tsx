import { ref } from "vue";
import { useMP } from "../store";
import { storeToRefs } from "pinia";

interface PullParams {
  stype?: string;
  [key: string]: any;
}

export function usPullCols() {
  const store = useMP();
  const { cfgDt } = storeToRefs(store);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  let isInitialized = false;

  const getPullData = async (params?: PullParams) => {
    if (isInitialized && cfgDt.value) {
      return cfgDt.value;
    }

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

  const refreshPullData = async (params?: PullParams) => {
    isInitialized = false;
    return getPullData(params);
  };

  return {
    getPullData,
    refreshPullData,
    cfgDt,
    loading,
    error
  };
}
