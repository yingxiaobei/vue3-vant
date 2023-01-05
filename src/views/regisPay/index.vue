<script setup lang="ts">
import { ref } from "vue";
const checked = ref(false);
</script>
<template>
  <div class="container">
    <div>
      <div class="box">
        <header>
          <img src="@/assets/images/order.png" alt="" />
          <div>
            <h2>报名缴费</h2>
            <p>杭州不愿驾校培训有限责任公司</p>
          </div>
        </header>
        <van-cell :border="false" title="待支付" value="¥99000" />
      </div>

      <div class="box">
        <h2 class="title">订单信息</h2>
        <van-cell :border="false" title="订单编号" value="289276783894949324" />
        <van-cell :border="false" title="收费方式" value="支付宝" />
        <van-cell
          :border="false"
          title="创建时间"
          value=" 2021-10-23 23:09:00"
        />
      </div>
    </div>

    <div class="mb-[30px] mt-[20px]">
      <div class="check">
        <van-checkbox v-model="checked">
          <template #icon="props">
            <img v-if="props.checked" src="@/assets/images/check.png" />
            <img v-else src="@/assets/images/un-check.png" />
          </template>
          <span class="a"
            >同意 <a href="">《隐私协议》</a><a href="">《用户协议》</a></span
          >
        </van-checkbox>
      </div>
      <van-button block round type="primary" class="w-[329px] mx-auto"
        >去支付</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 12px;
  height: calc(100vh - var(--van-nav-bar-height));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.box {
  padding: 0 16px;
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 12px;
}
header {
  height: 89px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  img {
    width: 45px;
    height: 45px;
    margin-right: 12px;
  }
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #4d4d4d;
    line-height: 26px;
    margin-bottom: 4px;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
}

.van-cell {
  padding: 11px 0;
  :deep(.van-cell__title) {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
  :deep(.van-cell__value) {
    flex: 2;
    font-size: 14px;
    font-weight: 500;
    color: #4d4d4d;
  }
}

.title {
  height: 52px;
  font-weight: 500;
  color: #4d4d4d;
  font-size: 16px;
  line-height: 52px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.check {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  img {
    width: 16px;
    height: 16px;
  }
  :deep(.van-checkbox__icon) {
    height: auto;
  }
  span {
    font-size: 12px;
    color: #4d4d4d;
    a {
      color: #5796eb;
    }
  }
}
</style>
