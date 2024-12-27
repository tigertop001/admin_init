import { ref, computed } from "vue";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { message } from "@/utils/message";
import { useSecurty } from "../../store";
const store = useSecurty();

export function useColumns(uid: number) {
  const state = ref({});

  const getColumns = (): PlusColumn[] => {
    const baseColumns: PlusColumn[] = [
      {
        label: "真实姓名",
        labelWidth: 100,
        prop: "uname",
        valueType: "input"
      },
      {
        label: "绑定手机号",
        labelWidth: 100,
        prop: "phoneNum",
        valueType: "input"
      }
    ];
    return baseColumns;
  };
  const columns = computed(() => getColumns());
  const onSub = async (formValues: FieldValues) => {
    try {
      const params = {
        uid,
        phoneNum: formValues.phoneNum,
        uname: formValues.uname
      };
      const res = await store.chgInfo(params);
      if (res?.code == 0) {
        message("操作成功", { type: "success", showClose: true });
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onSubErr = (err: any) => {
    console.log(err, "err");
  };

  const onReset = () => {
    console.log("handleReset");
  };

  return {
    state,
    columns,
    onSub,
    onSubErr,
    onReset
  };
}
