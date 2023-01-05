<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import PdfViewer from "@/components/PdfViewer.vue";

const route = useRoute();
const navTitle = (route.query.navTitle as string) || "查看合同";
const navColorType = (route.query.navColorType as string) || "1";
const url = route.query.url as string;
</script>
<template>
  <Header
    v-if="navTitle"
    :navColorType="Number(navColorType)"
    :navTitle="navTitle"
  />
  <PdfViewer class="pdf" v-if="url" :url="url" />
</template>

<style lang="scss" scoped>
.pdf {
  height: calc(100vh - var(--van-nav-bar-height)) !important;
}
</style>
