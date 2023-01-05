<script lang="ts" setup>
import { watch, ref } from "vue";
import { RouterView, useRoute } from "vue-router";
import Header from "@/components/Header.vue";

const route = useRoute();
const navTitle = ref<string>("");
const navColorType = ref(1);
const navBorderColor = ref("");

watch(
  () => route.path,
  () => {
    navTitle.value = (route.meta?.navTitle as string) || "";
    navColorType.value = (route.meta?.navColorType as number) || 1;
    navBorderColor.value = (route.meta?.navBorderColor as string) || "";
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <Header
    v-if="navTitle"
    :navColorType="navColorType"
    :navTitle="navTitle"
    :navBorderColor="navBorderColor"
  />

  <RouterView />
</template>

<style scoped lang="scss"></style>
