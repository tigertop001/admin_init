import { ref } from "vue";
import { useMemBlack } from "../../form/store";
import { message } from "@/utils/message";
import AccountTypeField from "@/components/CgDropDownSearch";

interface UserInfo {
  uid: string | number;
  account: string;
  uname: string;
}

export function useAddDialog(emit: (event: string, ...args: any[]) => void) {
  const store = useMemBlack();
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

  const onSrch = async () => {
    if (!srchAcct.value.content) {
      message("请输入搜索内容", { type: "warning" });
      return;
    }

    try {
      loading.value = true;
      const params = {
        stype: srchAcct.value.type,
        scontent: srchAcct.value.content,
        start: 0,
        limit: 10
      };

      const res = await store.cklist(params);
      if (res?.code === 0) {
        srchRes.value = srchRes.value || [];
        if (res.data.userInfo == null || srchRes.value.length >= 1) return;
        srchRes.value.push(res.data.userInfo);
      } else {
        srchRes.value = [];
        message("未找到数据", { type: "warning" });
      }
    } catch (error) {
      console.error("搜索失败:", error);
      message("搜索失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  const onSrchChg = newValue => {
    if (newValue.type !== srchAcct.value.type) {
      srchAcct.value = {
        ...newValue,
        content: null
      };
    } else {
      srchAcct.value = newValue;
    }
    onSrch();
  };

  const onDelUser = (index: number) => {
    selUsers.value.splice(index, 1);
  };

  const onAdd = (user: UserInfo) => {
    if (selUsers.value.some(item => item.uid === user.uid)) {
      message("该用户已添加", { type: "warning" });
      return;
    }
    selUsers.value.push(user);
  };

  const onSub = () => {
    if (!selUsers.value.length) {
      message("请选择需要加入黑名单的用户", { type: "warning" });
      return;
    }

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
    onSrchChg,
    onAdd,
    onDelUser,
    onSub,
    resetForm,
    AccountTypeField
  };
}
