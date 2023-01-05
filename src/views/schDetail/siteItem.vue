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
</script>
<template>
  <div class="van-hairline--bottom flex justify-between mb-[10px] pb-[10px]">
    <img :src="item.photoUrl" alt="" />
    <div class="flex-1 overflow-hidden ml-[10px]">
      <h2 class="van-ellipsis">{{ item.name }}</h2>
      <div>
        <van-tag color="rgba(23,191,130,0.08)" class="tag" text-color="#4D9960"
          >场地</van-tag
        >
      </div>
      <p class="van-ellipsis">
        {{ item.address }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  width: 120px;
  height: 89px;
  border-radius: 12px;
}
h2 {
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  line-height: 23px;
  margin-bottom: 8px;
}
p {
  margin-top: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #4d4d4d;
}
.tag {
  padding: 4px 7px 4px 6px;
  margin-right: 8px;
}
</style>
