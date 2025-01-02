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

      const checkRes = await store.check(params);

      if (checkRes?.code === 0) {
        let res;
        const p = {
          uid: formValues.uid
        };
        if (actTp.value === "reLog") {
          res = await store.reLog(p);
        } else if (actTp.value === "rePay") {
          res = await store.rePay(p);
        }

        if (res?.code === 0) {
          message("操作成功", { type: "success", showClose: true });
        } else {
          message("操作失败", { type: "error" });
        }
      } else {
        message("校验失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    } finally {
      dlgVis.value = false;
    }
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
