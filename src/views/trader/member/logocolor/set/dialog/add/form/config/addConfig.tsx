import { ref } from "vue";
import { message } from "@/utils/message";
import AccountTypeField from "@/components/CgDropDownSearch";
import { useMemLogAdd } from "../store";
const store = useMemLogAdd();

interface UserInfo {
  uid: string | number;
  account: string;
  uname: string;
}

export function useAddDialog(
  emit: (event: string, ...args: any[]) => void,
  props: any
) {
  const srchAcct = ref({
    content: null,
    type: "uid",
    label: "UID"
  });

  const selUsers = ref<UserInfo[]>([]);
  const remark = ref("");
  const srchRes = ref<any[]>([]);
  const loading = ref(false);

  const tblCols = [
    {
      label: "UID",
      prop: "uid",
      width: 120
    },
    {
      label: "用户名",
      prop: "account",
      width: 150
    },
    {
      label: "真实姓名",
      prop: "uname"
    },
    {
      label: "操作",
      width: 80,
      fixed: "right",
      slot: "operation"
    }
  ];

  const onAdd = (user: UserInfo) => {
    if (selUsers.value.some(item => item.uid === user.uid)) {
      message("该用户已添加", { type: "warning" });
      return;
    }
    selUsers.value.push(user);
  };

  const onSub = async () => {
    if (!remark.value) {
      message("请输入用户名", { type: "warning" });
      return;
    }

    try {
      const params = {
        id: props.rowDt?.id, // 从父组件传入的行数据中获取 id
        account: remark.value // 用户名输入框的值
      };

      const res = await store.add(params);
      if (res?.code === 0) {
        message("添加成功", { type: "success" });
        emit("submit", params);
        emit("update:visible", false); // 关闭弹窗
      } else {
        message(res?.msg || "添加失败", { type: "error" });
      }
    } catch (error) {
      console.error("添加失败:", error);
      message("添加失败", { type: "error" });
    }
  };

  // 重置
  const resetForm = () => {
    srchAcct.value = {
      content: null,
      type: "uid",
      label: "UID"
    };
    selUsers.value = [];
    srchRes.value = [];
    remark.value = "";
  };

  return {
    srchAcct,
    selUsers,
    srchRes,
    remark,
    loading,
    tblCols,
    onAdd,
    onSub,
    resetForm,
    AccountTypeField
  };
}
