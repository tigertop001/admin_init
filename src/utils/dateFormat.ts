import dayjs from "dayjs";

/**
 * 时间戳格式化函数
 * @param timestamp 时间戳
 * @param format 格式化模板
 * @param tz 时区，默认使用 "Asia/Shanghai"
 */
export const fmtTs = (
  timestamp: string | number,
  format: string = "YYYY-MM-DD HH:mm:ss.SSS",
  tz: string = "Asia/Shanghai"
): string => {
  if (!timestamp) return "--";

  const time =
    String(timestamp).length === 10
      ? Number(timestamp) * 1000
      : Number(timestamp);

  try {
    return dayjs(time).tz(tz).format(format);
  } catch {
    return "--";
  }
};
