<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Toast } from "vant";
import { base64toFile } from "@/utils";

const props = defineProps({
  callback: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const canvasRef = ref();
// 是否签名
const hasSign = ref(false);

onMounted(() => {
  init();
});

const writing = (
  beginX: number,
  beginY: number,
  stopX: number,
  stopY: number,
  ctx: any
) => {
  ctx.beginPath(); // 开启一条新路径
  ctx.globalAlpha = 1; // 设置图片的透明度
  ctx.lineWidth = 3; // 设置线宽
  ctx.strokeStyle = "#000"; // 设置路径颜色
  ctx.moveTo(beginX, beginY); // 从(beginX, beginY)这个坐标点开始画图
  ctx.lineTo(stopX, stopY); // 定义从(beginX, beginY)到(stopX, stopY)的线条（该方法不会创建线条）
  ctx.closePath(); // 创建该条路径
  ctx.stroke(); // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
};

const init = () => {
  let beginX: number, beginY: number;
  const canvas: HTMLCanvasElement = canvasRef.value;
  canvas.width = window.innerWidth - 16;
  canvas.height = window.innerHeight - 200;
  const ctx = canvas.getContext("2d");
  //   ctx!.fillStyle = "#fff";
  //   ctx!.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener("touchstart", function (event: any) {
    event.preventDefault(); // 阻止在canvas画布上签名的时候页面跟着滚动
    beginX = event.touches[0].clientX - this.offsetLeft;
    beginY = event.touches[0].pageY - this.offsetTop;
  });
  canvas.addEventListener("touchmove", (event: any) => {
    event.preventDefault(); // 阻止在canvas画布上签名的时候页面跟着滚动
    event = event.touches[0];
    const stopX = event.clientX - canvas.offsetLeft;
    const stopY = event.pageY - canvas.offsetTop;
    writing(beginX, beginY, stopX, stopY, ctx);
    beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
    beginY = stopY;
    hasSign.value = true;
  });
};

const clear = () => {
  const canvas: HTMLCanvasElement = canvasRef.value;
  const canvasTxt = canvas.getContext("2d");
  canvasTxt!.clearRect(0, 0, canvas.width, canvas.height);
  hasSign.value = false;
};

const save = () => {
  console.log(hasSign.value);
  if (!hasSign.value) {
    return Toast("请完成签字");
  }
  const canvas: HTMLCanvasElement = canvasRef.value;
  //   const imgdata = canvas.toDataURL("image/png");

  imgCrop().then((res) => {
    const file = base64toFile(res);
    props.callback(file);
    // const img = new Image();
    // img.src = res;
    // document.body.append(img);
  });
};

// 去除留白
const imgCrop = (): Promise<string> => {
  return new Promise((resolve) => {
    const canvas: HTMLCanvasElement = canvasRef.value;
    const imgdata = canvas.toDataURL("image/png");
    const ctx = canvas.getContext("2d");
    const imgData = ctx!.getImageData(0, 0, canvas.width, canvas.height).data;

    let lOffset = canvas.width,
      rOffset = 0,
      tOffset = canvas.height,
      bOffset = 0;

    for (let i = 0; i < canvas.width; i++) {
      for (let j = 0; j < canvas.height; j++) {
        let pos = (i + canvas.width * j) * 4;
        if (
          imgData[pos] > 0 ||
          imgData[pos + 1] > 0 ||
          imgData[pos + 2] ||
          imgData[pos + 3] > 0
        ) {
          // 说第j行第i列的像素不是透明的
          // 楼主貌似底图是有背景色的,所以具体判断RGBA的值可以根据是否等于背景色的值来判断
          bOffset = Math.max(j, bOffset); // 找到有色彩的最底部的纵坐标
          rOffset = Math.max(i, rOffset); // 找到有色彩的最右端

          tOffset = Math.min(j, tOffset); // 找到有色彩的最上端
          lOffset = Math.min(i, lOffset); // 找到有色彩的最左端
        }
      }
    }
    // 由于循环是从0开始的,而我们认为的行列是从1开始的
    lOffset++;
    rOffset++;
    tOffset++;
    bOffset++;

    const img = new Image();
    img.src = imgdata;
    img.onload = () => {
      const newCanvas = document.createElement("canvas");
      newCanvas.width = rOffset - lOffset;
      newCanvas.height = bOffset - tOffset;
      const newCtx = newCanvas.getContext("2d");
      //  TODO 是否需要白底
      //   newCtx!.fillStyle = "#fff";
      //   newCtx!.fillRect(0, 0, canvas.width, canvas.height);
      newCtx!.drawImage(
        img,
        lOffset,
        tOffset,
        newCanvas.width,
        newCanvas.height,
        0,
        0,
        newCanvas.width,
        newCanvas.height
      );
      resolve(newCanvas.toDataURL("image/png"));
    };
  });
};
</script>
<template>
  <div class="canvas">
    <canvas ref="canvasRef" width="350" height="150"></canvas>
    <div class="clear" @click="clear">清除</div>
  </div>
  <div class="submit">
    <p>本人大雄承诺以上签名真实可信</p>
    <van-button block round type="primary" @click="save" :loading="loading"
      >确认签字</van-button
    >
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  background: #fff;
  padding-top: 8px;
  overflow: hidden;
  canvas {
    margin: 0 auto;
    border: 2px dashed #979797;
    border-radius: 16px;
  }
  .clear {
    width: 64px;
    height: 28px;
    text-align: center;
    line-height: 26px;
    background: #ffffff;
    border-radius: 30px;
    opacity: 1;
    border: 1px solid #5796eb;
    margin: 16px auto 20px;
    font-size: 12px;
    color: #5796eb;
  }
}

.submit {
  background: #fff;
  padding: 15px 23px;
  text-align: center;
  margin-top: 8px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: #666660;
    margin-bottom: 12px;
  }
}
</style>
