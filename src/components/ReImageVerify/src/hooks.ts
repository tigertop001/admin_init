import { ref, onMounted } from "vue";

/**
 * 绘制图形验证码
 * @param width - 图形宽度
 * @param height - 图形高度
 */
export const useImageVerify = (width = 180, height = 45) => {
  const domRef = ref<HTMLCanvasElement>();
  const imgCode = ref("");

  function setImgCode(code: string) {
    imgCode.value = code;
    // 如果 canvas 已存在，立即重绘验证码
    if (domRef.value) {
      draw(domRef.value, width, height, code);
    }
  }

  function getImgCode() {
    return imgCode.value;
  }

  onMounted(() => {
    // 初始挂载时，仅在有 code 的情况下绘制
    if (imgCode.value && domRef.value) {
      draw(domRef.value, width, height, imgCode.value);
    }
  });

  return {
    domRef,
    imgCode,
    setImgCode,
    getImgCode
  };
};

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomColor(min: number, max: number) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

function draw(
  dom: HTMLCanvasElement,
  width: number,
  height: number,
  code: string
) {
  const ctx = dom.getContext("2d");
  if (!ctx || !code) return;

  // 设置背景色
  ctx.fillStyle = randomColor(210, 220);
  ctx.fillRect(0, 0, width, height);

  // 底层干扰线
  drawInterferenceLines(ctx, width, height, 3, 160, 200);
  drawCurveLines(ctx, width, height, 2);
  drawZigzagLines(ctx, width, height, 2);

  // 绘制验证码字符
  const padding = width * 0.1;
  const charWidth = (width - padding * 2) / code.length;

  for (let i = 0; i < code.length; i += 1) {
    const text = code[i];
    const fontSize = randomNum(25, 30);
    const deg = randomNum(-15, 15);

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = randomColor(100, 160);

    ctx.save();
    const x = padding + charWidth * i + randomNum(-3, 3);
    const y = height / 2 + randomNum(-2, 2);
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  // 上层干扰线
  drawInterferenceLines(ctx, width, height, 3, 160, 200);
  drawWavyLines(ctx, width, height, 2);
  drawDottedLines(ctx, width, height, 2);

  // 干扰点
  drawNoise(ctx, width, height);
}

// 绘制直线干扰线
function drawInterferenceLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
  colorMin: number,
  colorMax: number
) {
  for (let i = 0; i < count; i += 1) {
    ctx.beginPath();
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.strokeStyle = randomColor(colorMin, colorMax);
    ctx.lineWidth = randomNum(1, 2);
    ctx.stroke();
  }
}

// 绘制波浪线
function drawWavyLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    let x = 0;
    let y = randomNum(0, height);
    ctx.moveTo(x, y);

    const amplitude = randomNum(5, 10);
    const frequency = randomNum(5, 10) / 100;

    while (x < width) {
      y = y + Math.sin(x * frequency) * amplitude;
      x += 5;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = randomColor(160, 200);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// 绘制贝塞尔曲线
function drawCurveLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    const startX = randomNum(0, width / 3);
    const startY = randomNum(0, height);
    const cp1x = randomNum(width / 3, width / 2);
    const cp1y = randomNum(0, height);
    const cp2x = randomNum(width / 2, (2 * width) / 3);
    const cp2y = randomNum(0, height);
    const endX = randomNum((2 * width) / 3, width);
    const endY = randomNum(0, height);

    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.strokeStyle = randomColor(160, 200);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// 绘制锯齿线
function drawZigzagLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    let x = 0;
    let y = randomNum(0, height);
    ctx.moveTo(x, y);

    const zigzagWidth = randomNum(10, 20);
    const zigzagHeight = randomNum(2, 5);

    while (x < width) {
      y = y + zigzagHeight;
      x += zigzagWidth;
      ctx.lineTo(x, y);

      y = y - zigzagHeight * 2;
      x += zigzagWidth;
      ctx.lineTo(x, y);

      y = y + zigzagHeight;
    }

    ctx.strokeStyle = randomColor(160, 200);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// 绘制虚线
function drawDottedLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = randomNum(0, height);
    const gap = randomNum(3, 7);
    const dotLength = randomNum(2, 4);

    ctx.strokeStyle = randomColor(160, 200);
    ctx.lineWidth = 1;

    while (x < width) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dotLength, y);
      ctx.stroke();
      x += dotLength + gap;
    }
  }
}

// 绘制干扰点
function drawNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // 普通圆点
  for (let i = 0; i < 20; i += 1) {
    ctx.beginPath();
    ctx.arc(randomNum(0, width), randomNum(0, height), 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = randomColor(140, 190);
    ctx.fill();
  }

  // 小方块
  for (let i = 0; i < 10; i += 1) {
    ctx.fillStyle = randomColor(140, 190);
    ctx.fillRect(
      randomNum(0, width),
      randomNum(0, height),
      randomNum(1, 2),
      randomNum(1, 2)
    );
  }
}
