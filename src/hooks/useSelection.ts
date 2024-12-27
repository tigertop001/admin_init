import { ref } from "vue";
import type { Ref } from "vue";

export function useTableSelection(dataSource: Ref<any[]>) {
  const seldRows = ref<any[]>([]);
  const isAllSeld = ref(false);

  // 处理选择变化
  const onSelChg = (selections: any[]) => {
    seldRows.value = selections;
    isAllSeld.value = selections.length === dataSource.value.length;
  };

  // 处理全选
  const onSelAll = (selection: any[]) => {
    seldRows.value = selection;
    isAllSeld.value = selection.length > 0;
  };

  // 获取选中的行
  const getSelRws = () => seldRows.value;

  // 清空选择
  const clrSel = () => {
    seldRows.value = [];
    isAllSeld.value = false;
  };

  return {
    seldRows,
    isAllSeld,
    onSelChg,
    onSelAll,
    getSelRws,
    clrSel
  };
}
