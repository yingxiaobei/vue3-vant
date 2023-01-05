<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const phone = route.query.phone;
const schName = route.query.schName;

const twoRecord = () => {
  router.push("/regisRecord");
};
</script>
<template>
  <div
    class="flex flex-col items-center justify-between h-screen page-container"
  >
    <div class="flex flex-col items-center top">
      <img src="@/assets/images/success.png" alt="" />
      <p>您已报名{{ schName }}</p>
      <div class="info">请联系驾校及时确认</div>
      <a :href="`tel:${phone}`" class="phone">{{ phone }}</a>
    </div>
    <div class="bottom">
      <p>请前往报名记录查看</p>
      <van-button
        round
        block
        type="primary"
        color="#FF5C5C"
        native-type="submit"
        @click="twoRecord"
      >
        返回报名记录
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  padding: 80px 0;
}
.top {
  img {
    width: 71px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    margin: 16px 0;
  }
  .info {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 26px;
  }
  .phone {
    font-size: 16px;
    color: #5796eb;
  }
}

.bottom {
  p {
    font-size: 16px;
    font-weight: 400;
    color: #999999;
    margin-bottom: 30px;
  }
}
</style>
