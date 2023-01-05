<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

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
const preSignUp = () => {
  router.push({
    path: "/preSignUp",
    query: {
      schoolId: props.schoolId,
      packid: props.item.packid,
    },
  });
};
</script>

<template>
  <div class="van-hairline--bottom flex justify-between items-center mb-[12px]">
    <div class="flex-1 overflow-hidden">
      <h2 class="van-ellipsis">{{ item.packlabel }}</h2>
      <p>车型：{{ item.traintype }}</p>
      <div class="price text-themeColor">¥{{ item.train_price_online }}</div>
    </div>
    <van-button type="primary" round plain size="small" @click="preSignUp"
      >立即报名</van-button
    >
  </div>
</template>

<style scoped lang="scss">
h2 {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  height: 23px;
  line-height: 23px;
}
p {
  font-size: 14px;
  font-weight: 400;
  color: #666660;
  margin: 4px 0 15px;
}
.price {
  font-size: 17px;
  font-weight: bold;
  line-height: 23px;
  margin-bottom: 12px;
}
</style>
