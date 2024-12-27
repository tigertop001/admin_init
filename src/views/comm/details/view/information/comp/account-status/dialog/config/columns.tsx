import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useAcctSt } from "../../store";

export function useColumns(uid: number) {
  const store = useAcctSt();
  const dlgVis = ref(false);
  const actTp = ref<"freeze" | "unFreeze" | "ban">("freeze");

  const onSub = async (formValues: FieldValues) => {
    try {
      const params = {
        uid,
        account: formValues.account,
        remark: formValues.remark
      };
      let res;
      if (actTp.value === "freeze") {
        res = await store.fznAmt(params);
      } else if (actTp.value === "unFreeze") {
        await store.unFznAmt(params);
      } else {
        await store.lgDis(params);
      }

      if (res?.code === 0) {
        message("操作成功", { type: "success", showClose: true });
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    dlgVis.value = false;
  };

  const onFznAmt = () => {
    actTp.value = "freeze";
    dlgVis.value = true;
  };

  const onUnFznAmt = () => {
    actTp.value = "unFreeze";
    dlgVis.value = true;
  };

  const onLgDis = () => {
    actTp.value = "ban";
    dlgVis.value = true;
  };

  return {
    dlgVis,
    actTp,
    onSub,
    onFznAmt,
    onUnFznAmt,
    onLgDis
  };
}
