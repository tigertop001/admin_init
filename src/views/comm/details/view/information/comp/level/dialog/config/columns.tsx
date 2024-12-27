import { ref, computed } from "vue";
import { message } from "@/utils/message";
import type { PlusColumn, FieldValues } from "plus-pro-components";
import { useInfoLevel } from "../../store";
import { usPullCols } from "@/views/comm/details/comm/form/columns";
const { getPullData, configData } = usPullCols();
let initialized = false;

export function useColumns(uid: number, closeDialog?: () => void) {
  const store = useInfoLevel();
  const dlgVis = ref(false);
  const formData = ref<FieldValues>({
    levelId: "",
    peopleLevel: ""
  });

  const FORM_RULES = {
    levelSign: [
      { required: true, message: "请选择分层类别", trigger: "change" }
    ],
    peopleLevel: [
      { required: true, message: "请选择人工分层", trigger: "change" }
    ]
  } as const;

  const levelOptions = computed(() => {
    if (!configData.value?.data?.levelList) return [];
    return configData.value.data.levelList.map(item => ({
      label: item.levelName,
      value: item.id
    }));
  });

  const onUp = async () => {
    if (!initialized) {
      await getPullData();
      initialized = true;
    }
    dlgVis.value = true;
  };
  const columns = computed<PlusColumn[]>(() => [
    {
      label: "将会员调整为",
      labelWidth: 120,
      prop: "levelId",
      valueType: "select",
      options: levelOptions.value,
      rules: FORM_RULES.levelSign
    },
    {
      label: "人工分层",
      labelWidth: 120,
      prop: "peopleLevel",
      valueType: "radio",
      options: [
        { label: "否", value: 1 },
        { label: "是", value: 2 }
      ],
      tooltip: "选择人工分层开启，则以下条件全部不可选",
      rules: FORM_RULES.peopleLevel
    }
  ]);

  const formConfig = computed(() => ({
    columns: columns.value
  }));

  const dlgTit = computed(() => "修改层级");

  const rstFrm = () => {
    formData.value = {
      levelId: "",
      peopleLevel: ""
    };
  };

  const onSub = async (formValues: FieldValues) => {
    try {
      const params = {
        uid,
        levelId: formValues.levelId
      };
      const res = await store.up(params);
      console.log("---res--", res);
      if (res?.code == 0) {
        message("操作成功", { type: "success", showClose: true });
        closeDialog?.();
      } else {
        message("操作失败", { type: "error" });
      }
    } catch (error) {
      console.error("操作失败:", error);
      message("操作失败", { type: "error" });
    }
  };

  const onClose = () => {
    rstFrm();
    dlgVis.value = false;
  };

  return {
    dlgVis,
    formData,
    formConfig,
    dlgTit,
    onSub,
    onUp,
    onClose,
    rstFrm
  };
}
