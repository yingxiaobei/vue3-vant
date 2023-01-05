<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import PDFJS from "pdfjs-dist";
import { Toast } from "vant";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "70vh",
  },
});
const pdfDoc: any = ref();
let pages = ref(0);
const canvas = ref();

onMounted(async () => {
  const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  loadFile(props.url);
});

const renderPage = (num: number) => {
  pdfDoc.value.getPage(num).then((page: any) => {
    let canvas: any = document.getElementById("the-canvas" + num);
    var vp = page.getViewport({ scale: 1 });
    let ctx: any = canvas!.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    let ratio = dpr / bsr;
    let viewport = page.getViewport({ scale: window.innerWidth / vp.width });
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = viewport.width + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    let renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext);
    if (pages.value > num) {
      setTimeout(() => {
        renderPage(num + 1);
      }, 0);
    }
  });
};
const loadFile = (url: string) => {
  const toast = Toast.loading({
    message: "加载中...",
    forbidClick: true,
    duration: 0,
  });
  PDFJS.getDocument(url)
    .promise.then((pdf: any) => {
      toast.clear();
      pdfDoc.value = pdf;
      pages.value = pdfDoc.value.numPages;
      nextTick(() => {
        renderPage(1);
      });
    })
    .catch(() => {
      toast.clear();
    });
};

const zoomIn = () => {
  canvas.value.forEach((item: HTMLCanvasElement) => {
    const width = item.style.width.split("px")[0];
    item.style.width = parseInt(width) * 1.2 + "px";
  });
};

const zoomOut = () => {
  canvas.value.forEach((item: HTMLCanvasElement) => {
    const width = item.style.width.split("px")[0];
    item.style.width = parseInt(width) / 1.2 + "px";
  });
};
</script>
<template>
  <div class="canvas-container" :style="{ height }">
    <canvas
      v-for="page in pages"
      :id="'the-canvas' + page"
      ref="canvas"
      :key="page"
    >
    </canvas>
  </div>
  <!-- 保留 -->
  <!-- <van-button type="primary" @click="zoomIn">放大</van-button>
  <van-button type="primary" @click="zoomOut">缩小</van-button> -->
</template>

<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  overflow: auto;
}
</style>
