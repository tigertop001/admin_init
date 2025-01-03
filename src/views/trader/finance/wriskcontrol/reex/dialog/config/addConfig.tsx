import { ref, computed, watch } from "vue";
import type { FieldValues } from "plus-pro-components";
import { useFinReex } from "../../form/store/";
import { message } from "@/utils/message";

interface AddDialogProps {
  type?: number;
  editData?: FieldValues;
}

export function useAddDialog(
  props: AddDialogProps,
  emit: (event: string, ...args: any[]) => void
) {
  const store = useFinReex();
  const walletInfo = ref<any>(null);

  // 表单验证规则
  const FORM_RULES = {
    operationType: [
      { required: true, message: "请选择操作类型", trigger: "change" }
    ],
    account: [{ required: true, message: "请输入账户名称", trigger: "blur" }],
    password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
    uname: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
    leftMoney: [
      { required: true, message: "请输入钱包余额", trigger: "blur" },
      { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式" }
    ]
  } as const;

  const formData = ref<FieldValues>({
    operationType: 1,
    account: "",
    password: "",
    uname: "",
    leftMoney: ""
  });

  // 获取钱包信息
  const getWalletInfo = async (account: string | number) => {
    if (!account) return;
    try {
      const res = await store.getMny({ account });
      if (res?.code === 0 && res.data?.data) {
        walletInfo.value = res.data.data;
      } else {
        message(res?.msg || "获取钱包信息失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取钱包信息失败:", error);
      message("获取钱包信息失败", { type: "error" });
    }
  };

  // 账号输入框失焦事件
  const onAcctBlr = async () => {
    if (formData.value.operationType === 2) {
      await getWalletInfo(String(formData.value.account));
    }
  };

  const columns = computed(() => {
    if (props.type === 1) {
      return [
        {
          label: "账户名称",
          labelWidth: 100,
          prop: "account",
          valueType: "input",
          rules: FORM_RULES.account
        },
        {
          label: "真实姓名",
          labelWidth: 100,
          prop: "uname",
          valueType: "input",
          rules: FORM_RULES.uname
        },
        {
          label: "钱包余额",
          labelWidth: 100,
          prop: "leftMoney",
          valueType: "input",
          fieldProps: {
            type: "text",
            placeholder: "请输入钱包余额"
          },
          rules: FORM_RULES.leftMoney
        }
      ];
    }

    // 新增/添加模式
    return [
      {
        label: "操作类型",
        labelWidth: 100,
        prop: "operationType",
        valueType: "radio",
        options: [
          { label: "新增陪玩账号", value: 1 },
          { label: "添加已有账号", value: 2 }
        ],
        rules: FORM_RULES.operationType
      },
      ...(formData.value.operationType === 1
        ? [
            {
              label: "账户名称",
              labelWidth: 100,
              prop: "account",
              valueType: "input",
              rules: FORM_RULES.account
            },
            {
              label: "登录密码",
              labelWidth: 100,
              prop: "password",
              valueType: "input",
              fieldProps: {
                type: "password",
                placeholder: "请输入登录密码"
              },
              rules: FORM_RULES.password
            },
            {
              label: "真实姓名",
              labelWidth: 100,
              prop: "uname",
              valueType: "input",
              rules: FORM_RULES.uname
            },
            {
              label: "钱包余额",
              labelWidth: 100,
              prop: "leftMoney",
              valueType: "input",
              fieldProps: {
                type: "text",
                placeholder: "请输入钱包余额"
              },
              rules: FORM_RULES.leftMoney
            }
          ]
        : [
            {
              label: "账户名称",
              labelWidth: 100,
              prop: "account",
              valueType: "input",
              rules: FORM_RULES.account,
              fieldProps: {
                onBlur: onAcctBlr
              }
            },
            {
              labelWidth: 100,
              prop: "walletInfo",
              valueType: "custom",
              hasLabel: false,
              renderField: () =>
                walletInfo.value ? (
                  <div class="mt-2 text-sm">
                    账号总余额：
                    <span class="text-yellow-500">
                      ¥ {Number(walletInfo.value.total).toFixed(2)}
                    </span>
                    （主钱包余额
                    <span class="text-yellow-500">
                      ¥ {Number(walletInfo.value.mainLeft).toFixed(2)}
                    </span>{" "}
                    + 三方钱包余额
                    <span class="text-yellow-500">
                      ¥ {Number(walletInfo.value.thirdLeft).toFixed(2)}
                    </span>{" "}
                    + 代充钱包余额
                    <span class="text-yellow-500">
                      ¥ {Number(walletInfo.value.chargeLeft).toFixed(2)}
                    </span>
                    ）
                  </div>
                ) : null
            }
          ])
    ];
  });

  const rstFrm = () => {
    walletInfo.value = null;
    if (props.type === 1 && props.editData) {
      formData.value = { ...props.editData };
    } else {
      formData.value = {
        operationType: 1,
        account: "",
        password: "",
        uname: "",
        leftMoney: ""
      };
    }
  };

  const onCfm = () => {
    if (props.type === 1) {
      // 编辑模式
      emit("submit", {
        type: "edit",
        data: {
          ...formData.value,
          leftMoney: Number(formData.value.leftMoney)
        }
      });
    } else {
      // 新增/添加模式
      const subData = {
        ...(formData.value.operationType === 1
          ? {
              account: formData.value.account,
              password: formData.value.password,
              uname: formData.value.uname,
              leftMoney: Number(formData.value.leftMoney)
            }
          : {
              account: formData.value.account
            })
      };

      emit("submit", {
        type: formData.value.operationType,
        data: subData
      });
    }

    emit("update:visible", false);
    rstFrm();
  };

  const onCls = () => {
    rstFrm();
    emit("update:visible", false);
  };

  // 监听操作类型变化
  watch(
    () => formData.value.operationType,
    () => {
      walletInfo.value = null;
    }
  );

  // 监听编辑数据变化
  watch(
    () => props.editData,
    newData => {
      if (newData && props.type === 1) {
        formData.value = { ...newData };
      }
    },
    { immediate: true }
  );

  const dialogTitle = computed(() => {
    if (props.type === 1) return "编辑陪玩账号";
    return "陪玩账号操作";
  });

  const formConfig: any = computed(() => ({
    columns: columns.value
  }));

  return {
    formData,
    dialogTitle,
    formConfig,
    onCfm,
    onCls,
    rstFrm
  };
}
