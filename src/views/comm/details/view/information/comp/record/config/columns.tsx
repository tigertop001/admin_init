import { ref } from "vue";
import { message } from "@/utils/message";
import { useRec } from "../store";

export function useColumns(data: { uid: string | number }) {
  const store = useRec();
  const isEdit = ref(false);
  const textarea = ref("");

  const onEdit = (remark?: string) => {
    isEdit.value = true;
    // 如果有备注值,设置到输入框
    if (remark) {
      textarea.value = remark;
    }
  };

  const save = async () => {
    try {
      const params = {
        uid: data.uid,
        remark: textarea.value
      };
      const res = await store.up(params);
      if (res?.code === 0) {
        message("修改成功", { type: "success" });
        isEdit.value = false;
      } else {
        message("修改失败", { type: "error" });
      }
    } catch (error) {
      console.error("修改失败:", error);
      message("修改失败", { type: "error" });
    }
  };

  const cancel = () => {
    isEdit.value = false;
    textarea.value = "";
  };

  return {
    isEdit,
    textarea,
    onEdit,
    save,
    cancel
  };
}
