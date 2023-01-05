<script setup lang="ts">
import { useSlots } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const slots = useSlots();

const props = defineProps({
  navColorType: {
    type: Number,
    default: 1,
  },
  navTitle: {
    type: String,
    default: "",
  },
  navBorderColor: {
    type: String,
    default: "",
  },
  back: {
    type: Function,
  },
});
const twoBack = () => {
  if (props.back) {
    props.back();
    return;
  }
  router.go(-1);
};
</script>
<template>
  <van-config-provider
    :theme-vars="{
      navBarBackgroundColor:
        navColorType === 1 ? 'var(--bg-color)' : 'var(--nav-bg-color)',
      navBarTitleTextColor: navColorType === 1 ? '#333' : '#fff',
    }"
  >
    <van-nav-bar
      @click-left="twoBack"
      class="nav"
      :title="navTitle"
      fixed
      placeholder
      :class="navBorderColor ? 'hasBorder' : ''"
      z-index="2"
    >
      <template #left>
        <slot v-if="slots.left" name="left"></slot>
        <img
          v-else-if="navColorType === 1"
          src="@/assets/images/back.png"
          class="back"
          alt=""
        />
        <img v-else src="@/statics/entry/arrow_left.png" class="back" alt="" />
      </template>
      <template #right>
        <slot v-if="slots.right" name="right"></slot>
      </template>
    </van-nav-bar>
  </van-config-provider>
</template>

<style lang="scss" scoped>
.nav {
  .back {
    width: 25px;
  }
  :deep(.van-nav-bar__title) {
    font-size: 17px;
    font-weight: 400;
  }
}
.hasBorder {
  :deep(.van-nav-bar__content) {
    border-bottom: 1px solid v-bind(navBorderColor);
  }
}
</style>
