import { ref } from "vue";
import { message } from "@/utils/message";
import AccountTypeField from "@/components/CgDropDownSearch";

interface UserInfo {
  uid: string | number;
  account: string;
  uname: string;
}

export function useAddDialog(emit: (event: string, ...args: any[]) => void) {
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

  // 添加用户
  const onAdd = (user: UserInfo) => {
    if (selUsers.value.some(item => item.uid === user.uid)) {
      message("该用户已添加", { type: "warning" });
      return;
    }
    selUsers.value.push(user);
  };

  // 提交
  const onSub = () => {
    if (!remark.value) {
      message("请输入备注", { type: "warning" });
      return;
    }

    const subData = {
      uids: selUsers.value.map(user => user.uid).join(","),
      remark: remark.value
    };

    emit("submit", subData);
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
