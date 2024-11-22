// 获取操作系统信息 (浏览器环境)
export function getOperatingSystem(): { code: number; name: string } {
  const userAgent = navigator.userAgent;

  let osCode = 8; // 默认值：Unknown OS
  let osName = "Unknown OS";

  if (userAgent.indexOf("Windows NT") !== -1) {
    osCode = 1;
    osName = "Windows";
  } else if (userAgent.indexOf("Mac OS X") !== -1) {
    osCode = 2;
    osName = "Mac OS";
  } else if (userAgent.indexOf("Linux") !== -1) {
    osCode = 3;
    osName = "Linux";
  } else if (userAgent.indexOf("Android") !== -1) {
    osCode = 4;
    osName = "Android";
  } else if (
    userAgent.indexOf("iPhone") !== -1 ||
    userAgent.indexOf("iPad") !== -1
  ) {
    osCode = 5;
    osName = "iOS";
  } else if (
    userAgent.indexOf("HarmonyOS") !== -1 ||
    userAgent.indexOf("HMOS") !== -1
  ) {
    osCode = 6;
    osName = "HarmonyOS";
  } else if (
    userAgent.indexOf("BlackBerry") !== -1 ||
    userAgent.indexOf("BB10") !== -1
  ) {
    osCode = 7;
    osName = "BlackBerry OS";
  }

  return { code: osCode, name: osName };
}
