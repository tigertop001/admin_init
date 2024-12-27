import { ref } from "vue";
import { message } from "@/utils/message";
import { useActiveList } from "../../../form/store";

export interface SearchEmits {
  "update:modelValue": (param: Record<string, any>) => void;
}

export function useColumns(emit: (event: string, ...args: any[]) => void) {
  const store = useActiveList();
  const onUplod = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message("只能上传图片文件", { type: "error" });
      return false;
    }
    if (!isLt2M) {
      message("图片大小不能超过2M", { type: "error" });
      return false;
    }
    return true;
  };

  const onUplodSucc = (response: any, row: any) => {
    if (response.code === 0 && response.data) {
      const imageUrl = response.data.url;
      const index = dataList.value.indexOf(row);
      if (index !== -1) {
        dataList.value[index].icon = imageUrl;
        onChg(row);
      }
    }
  };

  const openUplod = async (row: any) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (onUplod(file)) {
        try {
          const response = await store.upload(file);
          onUplodSucc(response, row);
        } catch (error) {
          message("上传失败", { type: "error" });
        }
      }
    };
    fileInput.click();
  };

  const dataList = ref([
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "未中奖",
      type: 1
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "奖金1",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "随机金额",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "奖金50",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "随机金额",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "奖金",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "奖金1000",
      type: 2
    },
    {
      icon: null,
      amount: { min: null, max: null },
      weight: null,
      title: "立即提现",
      type: 2
    }
  ]);

  // 处理输入值变化
  const onInpChg = (value: string, row: any, field?: string) => {
    const index = dataList.value.indexOf(row);
    if (index !== -1) {
      // 根据字段更新值
      if (field === "amount.min" || field === "amount.max") {
        const [parent, child] = field.split(".");
        dataList.value[index][parent][child] = value;
      } else {
        dataList.value[index][field] = value;
      }
      onChg(row); // 传入对应的参数
    }
  };

  const onChg = (row: any) => {
    const index = dataList.value.indexOf(row);
    if (index !== -1) {
      const formattedData = dataList.value.map(
        ({ amount, icon, weight, title, type }) => ({
          icon: Number(icon) || 0,
          amount: {
            min: Number(amount.min) || 0,
            max: Number(amount.max) || 0
          },
          weight: Number(weight) || 0,
          title: title,
          type: type
        })
      );
      emit("update:modelValue", formattedData);
    }
  };

  const columns = [
    {
      label: "图标",
      prop: "icon",
      width: 75,
      cellRenderer: ({ row }) => (
        <div class="flex items-center justify-center">
          {row.icon ? (
            <div class="relative group">
              <img
                src={row.icon}
                class="w-10 h-10 object-cover cursor-pointer"
                onClick={() => openUplod(row)}
              />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span class="text-white text-xs">修改</span>
              </div>
            </div>
          ) : (
            <el-button
              size="small"
              type="primary"
              onClick={() => openUplod(row)}
            >
              上传
            </el-button>
          )}
        </div>
      )
    },
    {
      label: "随机金额范围",
      prop: "amount",
      width: 230,
      cellRenderer: ({ row }) => (
        <div class="flex items-center gap-2">
          <el-input
            v-model={row.amount.min}
            type="number"
            class="w-[115px]"
            placeholder="最小金额"
            onInput={value => onInpChg(value, row, "amount.min")}
          />
          <span>-</span>
          <el-input
            v-model={row.amount.max}
            type="number"
            class="w-[115px]"
            placeholder="最大金额"
            onInput={value => onInpChg(value, row, "amount.max")}
          />
        </div>
      )
    },
    {
      label: "权重",
      prop: "weight",
      width: 75,
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.weight}
          type="copy"
          placeholder="权重"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "标题",
      prop: "title",
      width: 110,
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.title}
          type="input"
          placeholder="权重"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "类型",
      prop: "type",
      width: 56
    }
  ];

  return {
    columns,
    dataList,
    onChg
  };
}
