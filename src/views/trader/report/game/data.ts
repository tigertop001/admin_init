export interface SubTab {
  name: string;
  label: string;
}

export interface TopTab {
  name: string;
  label: string;
  subTabs: SubTab[];
}

export const topTabs: TopTab[] = [
  {
    name: "all",
    label: "全部",
    subTabs: [{ name: "all-sub", label: "全部" }]
  },
  {
    name: "lottery",
    label: "彩票",
    subTabs: [
      { name: "cp-1", label: "澳门六合彩" },
      { name: "cp-2", label: "腾讯分分彩" },
      { name: "cp-3", label: "一分飞艇" },
      { name: "cp-4", label: "一分快三" },
      { name: "cp-5", label: "极速六合彩(新)" },
      { name: "cp-6", label: "阿里分分彩" },
      { name: "cp-7", label: "比特分分彩" },
      { name: "cp-8", label: "荷兰三分彩" },
      { name: "cp-9", label: "六合彩-香港" },
      { name: "cp-10", label: "澳洲三分彩" },
      { name: "cp-11", label: "澳洲骰宝" },
      { name: "cp-12", label: "香港赛马" },
      { name: "cp-13", label: "澳洲幸运彩" },
      { name: "cp-14", label: "幸运快三" },
      { name: "cp-15", label: "幸运飞艇" },
      { name: "cp-16", label: "俄勒冈KENO" },
      { name: "cp-17", label: "加拿大卑诗" }
    ]
  },
  {
    name: "28",
    label: "28",
    subTabs: [
      { name: "28-1", label: "秒秒28" },
      { name: "28-2", label: "加拿大28" },
      { name: "28-3", label: "比特28" },
      { name: "28-4", label: "俄勒冈28" },
      { name: "28-5", label: "百人牛牛" },
      { name: "28-6", label: "分分28" }
    ]
  },
  {
    name: "redPacket",
    label: "红包",
    subTabs: [{ name: "rp-1", label: "红包接龙" }]
  },
  {
    name: "sports",
    label: "体育",
    subTabs: [
      { name: "sp-1", label: "NG体育" },
      { name: "sp-2", label: "熊猫体育" },
      { name: "sp-3", label: "IM体育" }
    ]
  },
  {
    name: "esports",
    label: "电竞",
    subTabs: [
      { name: "es-1", label: "IM电竞" },
      { name: "es-2", label: "雷火电竞" }
    ]
  },
  {
    name: "live",
    label: "真人",
    subTabs: [
      { name: "live-1", label: "EBET真人" },
      { name: "live-2", label: "BG真人" },
      { name: "live-3", label: "PP真人" },
      { name: "live-4", label: "AG真人" },
      { name: "live-5", label: "DB真人" }
    ]
  },
  {
    name: "electronic",
    label: "电子",
    subTabs: [
      { name: "el-1", label: "PP电子游戏" },
      { name: "el-2", label: "PT电子游戏" },
      { name: "el-3", label: "JDB电子游戏" },
      { name: "el-4", label: "PG电子" },
      { name: "el-5", label: "PP电子" },
      { name: "el-6", label: "CG电子" },
      { name: "el-7", label: "MG电子" },
      { name: "el-8", label: "759电子" },
      { name: "el-9", label: "AG电子" },
      { name: "el-10", label: "MWG捕鱼游戏" },
      { name: "el-11", label: "IM电玩城" }
    ]
  },
  {
    name: "chess",
    label: "棋牌",
    subTabs: [
      { name: "chess-1", label: "开元棋牌" },
      { name: "chess-2", label: "DB棋牌" },
      { name: "chess-3", label: "NG扑克" }
    ]
  },
  {
    name: "fishing",
    label: "捕鱼",
    subTabs: [
      { name: "fish-1", label: "DB捕鱼" },
      { name: "fish-2", label: "AG捕鱼" },
      { name: "fish-3", label: "BG捕鱼" }
    ]
  }
];
