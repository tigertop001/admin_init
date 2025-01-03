import { ref, watch, onMounted, computed } from "vue";
import { usePfin } from "../store";

interface TypeOption {
  label: string;
  value: number;
}

interface SubTypeOption extends TypeOption {
  inOut: 1 | 2;
}

export function useDropdownRelation() {
  const store = usePfin();
  const typeOptionsData = ref<TypeOption[]>([{ label: "全部类型", value: 0 }]);
  const subOptionsData = ref<SubTypeOption[]>([
    { label: "全部类型", value: 0, inOut: 1 }
  ]);
  const curTp = ref<number | null>(null);
  const curSub = ref<number | null>(null);

  const typeOptions = computed(() => typeOptionsData.value);
  const subOptions = computed(() => subOptionsData.value);

  const fetchTypes = async () => {
    try {
      const res = await store.mpt();
      if (res?.code === 0) {
        typeOptionsData.value = res.data.list.map((item: any) => ({
          label: item.typeName,
          value: item.type
        }));
      }
    } catch (error) {
      console.error("获取交易类型失败:", error);
    }
  };

  const fetchSubTypes = async (type: number) => {
    try {
      const res = await store.spt({ type });
      if (res?.code === 0) {
        subOptionsData.value = [
          { label: "全部类型", value: 0, inOut: 1 },
          ...res.data.list.map((item: any) => ({
            label: item.snName,
            value: item.sn,
            inOut: item.inOut
          }))
        ];
      }
    } catch (error) {
      console.error("获取子类型失败:", error);
    }
  };

  watch(curTp, async newType => {
    curSub.value = 0;
    if (newType !== null) {
      await fetchSubTypes(newType);
    }
  });

  onMounted(() => {
    fetchTypes();
  });

  return {
    typeOptions,
    subOptions,
    curTp,
    curSub,
    fetchTypes,
    fetchSubTypes
  };
}
