/**
 * @desc AnimationFrame简单兼容hack
 */
export const animationFrame = () => {
  window.cancelAnimationFrame = (() => {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function (id) {
        return window.clearTimeout(id);
      }
    );
  })();
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
};

/**
 * @desc 判断数组是否相等
 * @return {Boolean}
 * @param arr1
 * @param arr2
 */
export const arrayEqual = (arr1: Array<any>, arr2: Array<any>) => {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

export function copyObj() {
  if (!Array.isArray) {
    // @ts-expect-error
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
  let name,
    options,
    src,
    copy,
    copyIsArray,
    clone,
    i = 1,
    target = arguments[0] || {},
    deep = false,
    len = arguments.length;
  if (typeof target === "boolean") {
    deep = target;

    target = arguments[1] || {};
    i++;
  }
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }

  if (i === len) {
    return target;
  }
  for (; i < len; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        copyIsArray = Array.isArray(copy);
        if (deep && copy && (typeof copy === "object" || copyIsArray)) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && typeof src === "object" ? src : {};
          }
          // @ts-expect-error
          target[name] = copyObj(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}
