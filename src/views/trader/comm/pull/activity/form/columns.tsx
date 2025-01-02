import { ref, computed } from "vue";
import { useAgpul } from "../store";
import { storeToRefs } from "pinia";
import { type PullType, API_CONFIG } from "../api/config";

interface PullParams {
  stype?: string;
  fields?: string;
  [key: string]: any;
}

export function usePullData(type: PullType) {
  const store = useAgpul();
  const { pullData } = storeToRefs(store);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentData = computed(() => pullData.value[type]);
  let isInitialized = false;

  // 将配置数据转换为选项格式
  const formatOptions = (data: any[]) => {
    const config = API_CONFIG[type];
    const [labelField, valueField] = config.fields;

    return data.map(item => ({
      label: item[labelField],
      value: item[valueField]
    }));
  };

  const getPullData = async (params?: PullParams) => {
    if (isInitialized && currentData.value) {
      return currentData.value;
    }

    if (loading.value) {
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const defaultParams = {
        start: 0,
        limit: 1000,
        fields: API_CONFIG[type].fields.join(","),
        ...params
      };

      const res = await store.pull(type, defaultParams);

      if (res?.code === 0) {
        isInitialized = true;
        return res;
      } else {
        throw new Error(res?.msg || "请求失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("未知错误");
      console.error(`获取${type}数据失败:`, err);
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
    currentData,
    formatOptions,
    loading,
    error
  };
}
