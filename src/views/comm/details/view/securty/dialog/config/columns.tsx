import { ref } from "vue";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { useSecurty } from "../../store";
const store = useSecurty();

export function useConfColumns() {
  const dlgVis = ref(false);
  const actTp = ref<"reLog" | "rePay">("reLog");
  const onChgSub = async (formValues: FieldValues) => {
    try {
      const params = {
        password: formValues.password
      };
      let res;
      if (actTp.value === "reLog") {
        res = await store.check(params);
      } else if (actTp.value === "rePay") {
        await store.reLog(params);
      }

      if (res?.code == 0) {
        if ((actTp as any) == "reLog") {
          const logRes = await store.reLog(params);
          if (logRes?.code == 0) {
            message("操作成功", { type: "success", showClose: true });
          }
        }
        if ((actTp as any) == "rePay") {
          const payRes = await store.rePay(params);
          if (payRes?.code == 0) {
            message("操作成功", { type: "success", showClose: true });
          }
        }
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
    dlgVis.value = false;
  };

  const onReLog = () => {
    actTp.value = "reLog";
    dlgVis.value = true;
  };

  const onRePay = () => {
    actTp.value = "rePay";
    dlgVis.value = true;
  };

  return {
    dlgVis,
    actTp,
    onReLog,
    onRePay,
    onChgSub
  };
}
