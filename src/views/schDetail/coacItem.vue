<script setup lang="ts">
const props = defineProps({
  schoolId: {
    type: String,
    default: "",
  },
  item: {
    type: Object,
    default: () => ({}),
  },
});
console.log(props.item);
</script>
<template>
  <div class="van-hairline--bottom flex items-center mb-[15px] pb-[15px]">
    <img :src="item.HEAD_IMG_URL" alt="" />
    <div class="ml-[12px]">
      <h2>{{ item.coachname }}</h2>
      <van-rate :model-value="item.overall" readonly size="14px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  width: 60px;
  height: 60px;
  border-radius: 100%;
}
h2 {
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  line-height: 23px;
  margin-bottom: 16px;
}
</style>
