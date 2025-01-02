import { computed, ref, onMounted } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";
import EditorBase from "@/views/comm/editor/editor-base.vue";
import { COMM_RULES } from "../../../comm/utils/rules";

import { usPullCols } from "@/views/trader/comm/pull/member/form/columns";
const { getPullData, cfgDt } = usPullCols();

import { usePullData } from "@/views/trader/comm/pull/activity/form/columns";
const {
  getPullData: getTagData,
  currentData: tagData,
  formatOptions: formatTagOptions
} = usePullData("TAG");

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}
export function useColumns(emit: (event: string, ...args: any[]) => void) {
  const state = ref<FieldValues>({
    issueMode: null,
    userType: null,
    ipBlacklist: null,
    uidBlacklist: null,
    tagID: null,
    sort: null,
    publicityPicture: null,
    details: null
  });
  const rules = {
    name: [
      {
        required: true,
        message: "请输入名称"
      }
    ]
  };
  const computedDetails = computed({
    get: () => state.value.details ?? "", // 如果为 null 则传递空字符串
    set: (val: string) => {
      state.value.details = val; // 更新 details 的值
    }
  });

  onMounted(async () => {
    await getPullData();
    await getTagData();
  });

  const lvlOp = computed(() => {
    if (!cfgDt.value?.data?.levelList) return [];
    return cfgDt.value.data.levelList.map(item => ({
      label: item.levelName,
      value: item.id
    }));
  });

  const getColumns = (): PlusColumn[] => {
    const baseColumns: PlusColumn[] = [
      {
        label: "发放方式",
        labelWidth: 100,
        prop: "issueMode",
        valueType: "select",
        rules: COMM_RULES.issueMode,
        options: [
          {
            label: "系统发放",
            value: 1
          },
          {
            label: "审核发放",
            value: 2
          }
        ]
      },
      {
        label: "参与会员",
        labelWidth: 100,
        prop: "userType",
        valueType: "radio",
        rules: COMM_RULES.userType,
        options: [
          {
            label: "全部会员",
            value: 1,
            color: "red"
          },
          {
            label: "会员层级",
            value: 2,
            color: "blue"
          }
        ]
      }
    ];

    if (state.value.userType === 2) {
      baseColumns.push({
        label: "会员层级",
        labelWidth: 100,
        prop: "userLevel",
        valueType: "checkbox",
        options: lvlOp.value
      });
    }

    baseColumns.push(
      {
        label: "IP黑名单",
        labelWidth: 100,
        prop: "ipBlacklist",
        valueType: "copy"
      },
      {
        label: "UID黑名单",
        labelWidth: 100,
        prop: "uidBlacklist",
        valueType: "copy"
      },
      {
        label: "活动标签",
        labelWidth: 100,
        prop: "tagID",
        valueType: "radio",
        rules: COMM_RULES.tagID,
        options: computed(() => {
          if (!tagData.value?.data?.list) return [];
          return formatTagOptions(tagData.value.data.list);
        }).value
      },
      {
        label: "排序",
        labelWidth: 100,
        prop: "sort",
        valueType: "copy",
        rules: COMM_RULES.sort
      },
      {
        label: "活动宣传图",
        labelWidth: 100,
        prop: "publicityPicture",
        valueType: "copy",
        rules: COMM_RULES.pubPic,
        fieldProps: { precision: 2, step: 2 }
      },
      {
        label: "活动详情",
        labelWidth: 100,
        prop: "details",
        rules: COMM_RULES.dtls,
        renderField: () => (
          <div class="w-full">
            <EditorBase
              v-model={computedDetails.value}
              onUpdate:modelValue={val => {
                computedDetails.value = val;
              }}
            />
          </div>
        )
      }
    );

    return baseColumns;
  };

  const columns = computed(() => getColumns());

  const onChg = (values, prop) => {
    if (prop.prop === "userType" && values.userType === 1) {
      state.value.userLevel = null;
    }
    const formattedData = state.value;

    emit("update:modelValue", formattedData);
  };
  return {
    state,
    rules,
    columns,
    onChg
  };
}
