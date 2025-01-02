export const COMM_RULES = {
  name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
  activityTimeRange: [
    { required: true, message: "请选择活动起止时间", trigger: "blur" }
  ],
  displayTimeRange: [
    { required: false, message: "请选择展示起止时间", trigger: "blur" }
  ],
  activityConditions: [
    { required: true, message: "请输入活动条件", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的数字或小数",
      trigger: "blur"
    }
  ],
  rewardLimit: [
    { required: false, message: "请输入奖励金额上限", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的奖励金额上限",
      trigger: "blur"
    }
  ],
  walletType: [{ required: true, message: "请选择派奖钱包", trigger: "blur" }],
  auditMultiple: [
    { required: false, message: "请输入稽核倍数", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的稽核倍数",
      trigger: "blur"
    }
  ],
  jumpType: [{ required: false, message: "请选择跳转类型", trigger: "blur" }],
  issueMode: [{ required: true, message: "请选择发放方式", trigger: "blur" }],
  userType: [{ required: true, message: "请选择参与会员", trigger: "blur" }],
  ipBlacklist: [
    { required: false, message: "请输入有效的IP地址", trigger: "blur" },
    {
      pattern: /^(\d+\.\d+\.\d+\.\d+)(,\d+\.\d+\.\d+\.\d+)*$/,
      message: "请输入有效的IP地址",
      trigger: "blur"
    }
  ],
  uidBlacklist: [
    { required: false, message: "请输入有效的UID", trigger: "blur" },
    {
      pattern: /^\d+(,\d+)*$/,
      message: "请输入有效的UID",
      trigger: "blur"
    }
  ],
  tagID: [{ required: true, message: "请选择活动标签", trigger: "change" }],
  sort: [
    { required: false, message: "请输入有效的排序数字", trigger: "blur" },
    {
      pattern: /^[0-9]*$/,
      message: "请输入有效的排序数字",
      trigger: "blur"
    }
  ],
  pubPic: [{ required: true, message: "请上传活动宣传图", trigger: "blur" }],
  dtls: [{ required: true, message: "请输入活动详情", trigger: "blur" }]
} as const;

export const FIRST_RULES = {
  rule: [
    { required: true, message: "请输入活动条件", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!Array.isArray(value)) {
          return callback(new Error("活动条件格式错误"));
        }
        if (value.length === 0) {
          return callback(new Error("请至少添加一条活动条件"));
        }

        const error = value.findIndex((item, index) => {
          if (!item || typeof item !== "object") {
            callback(new Error(`第 ${index + 1} 条活动条件格式错误`));
            return true;
          }

          const { amount, ratio } = item;

          if (!amount || typeof amount !== "number" || amount <= 0) {
            callback(
              new Error(`第 ${index + 1} 条活动条件的存款金额必须为大于0的数字`)
            );
            return true;
          }

          if (
            !ratio ||
            typeof ratio !== "number" ||
            ratio <= 0 ||
            ratio >= 100
          ) {
            callback(
              new Error(
                `第 ${index + 1} 条活动条件的奖励金额比例必须在0-100之间`
              )
            );
            return true;
          }

          return false;
        });

        if (error === -1) callback();
      }
    }
  ]
} as const;

export const DEPOSIT_RULES = {
  reset: [{ required: true, message: "请选择重置方式", trigger: "blur" }],
  isCumulative: [
    { required: true, message: "请选择是否累计充值", trigger: "blur" }
  ],
  rechargeMode: [
    { required: true, message: "请选择充值方式", trigger: "change" }
  ]
} as const;

export const INVIT_RULES = {
  reward: [
    { required: true, message: "请输入奖励金额", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的奖励金额",
      trigger: "blur"
    }
  ],
  firstAmount: [
    { required: true, message: "请输入首次旋转金额", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error("请输入首次旋转金额"));
        }

        const { min, max } = value;

        if (!min && min !== 0) {
          return callback(new Error("请输入最小金额"));
        }
        const minVal = Number(min);
        if (isNaN(minVal)) {
          return callback(new Error("最小金额请输入有效的数字"));
        }
        if (minVal < 0) {
          return callback(new Error("最小金额不能小于0"));
        }

        if (!max && max !== 0) {
          return callback(new Error("请输入最大金额"));
        }
        const maxVal = Number(max);
        if (isNaN(maxVal)) {
          return callback(new Error("最大金额请输入有效的数字"));
        }
        if (maxVal <= 0) {
          return callback(new Error("最大金额必须大于0"));
        }

        if (maxVal <= minVal) {
          return callback(new Error("最大金额必须大于最小金额"));
        }

        callback();
      },
      trigger: "blur"
    }
  ],
  plaids: [{ required: true, message: "请输入旋转金额配置", trigger: "blur" }],
  rule: [{ required: true, message: "请输入活动规则", trigger: "blur" }]
} as const;

export const RELIEF_RULES = {
  selectedGames: [{ required: true, message: "请选择游戏", trigger: "blur" }],
  reliefConditions: [
    { required: true, message: "请输入活动条件", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的负盈利金额",
      trigger: "blur"
    },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的返利比例",
      trigger: "blur"
    }
  ],
  rewardInterval: [
    { required: true, message: "请输入领奖时间间隔", trigger: "blur" }
  ],
  rewardLimit: [
    { required: false, message: "请输入奖励上限", trigger: "blur" },
    {
      pattern: /^[0-9]+(\.[0-9]+)?$/,
      message: "请输入有效的奖励金额上限",
      trigger: "blur"
    }
  ]
} as const;

export const DEP_RULES = {} as const;
