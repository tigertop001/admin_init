import { message } from "@/utils/message";
import { ref } from "vue";
import { useAgBind } from "../../form/store";

const store = useAgBind();

interface CheckResponse {
  parentUid: number;
  parentAccount: string;
  account: string;
  agentState: string;
  agentIdentity: number;
}

interface UserInfo {
  username: string;
  status: string;
  identity: string;
  parentUid?: number;
  parentAccount?: string;
}

const transformCheckData = (data: CheckResponse): UserInfo => ({
  username: data.account || "--",
  status: data.agentState || "--",
  identity: data.agentIdentity === 1 ? "代理" : "会员",
  parentUid: data.parentUid,
  parentAccount: data.parentAccount
});

export function useColumns() {
  const mUid = ref("");
  const mInf = ref<UserInfo>({
    username: "",
    status: "",
    identity: ""
  });

  const agUid = ref("");
  const agInf = ref<UserInfo>({
    username: "",
    status: "",
    identity: ""
  });

  const ckMem = async () => {
    if (!mUid.value) return;
    try {
      const uid = Number(mUid.value);
      const res = await store.ck({ uid });
      if (res?.code === 0) {
        mInf.value = transformCheckData(res.data);
        if (mInf.value.parentUid || mInf.value.parentAccount) {
          message("该会员已有上级", { type: "warning" });
        }
      } else {
        message(res?.msg || "获取会员信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("检查失败:", error);
      message("获取会员信息失败", { type: "error" });
    }
  };

  const ckAg = async () => {
    if (!agUid.value) return;
    try {
      const uid = Number(agUid.value);
      const res = await store.ck({ uid });
      if (res?.code === 0) {
        const agentData = transformCheckData(res.data);
        // 验证是否是代理
        if (agentData.identity !== "代理") {
          message("该用户不是代理", { type: "warning" });
          return;
        }
        agInf.value = agentData;
      } else {
        message(res?.msg || "获取代理信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("检查失败:", error);
      message("获取代理信息失败", { type: "error" });
    }
  };

  const onCfm = async () => {
    if (!mUid.value || !agUid.value) {
      message("请输入完整信息", { type: "warning" });
      return;
    }

    if (!mInf.value.username || !agInf.value.username) {
      message("请先检查会员和代理信息", { type: "warning" });
      return;
    }

    try {
      const params = {
        uid: Number(mUid.value),
        parentUid: Number(agUid.value)
      };

      const res = await store.bind(params);
      if (res?.code === 0) {
        message("绑定成功", { type: "success" });
        onCxl(); // 成功后重置表单
      } else {
        message(res?.msg || "绑定失败", { type: "error" });
      }
    } catch (error) {
      console.error("绑定失败:", error);
      message("绑定失败", { type: "error" });
    }
  };

  const onCxl = () => {
    mUid.value = "";
    agUid.value = "";
    mInf.value = { username: "", status: "", identity: "" };
    agInf.value = { username: "", status: "", identity: "" };
  };

  return {
    mUid,
    mInf,
    agUid,
    agInf,
    ckMem,
    ckAg,
    onCfm,
    onCxl
  };
}
