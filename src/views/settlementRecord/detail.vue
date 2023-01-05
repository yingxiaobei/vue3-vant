<script setup lang="ts">
import { useRoute } from "vue-router";
import { getUserInfo, dicConversion } from "@/utils";
import moment from "moment";
import { useDic } from "@/hooks";

const route = useRoute();
const settlementStatus = useDic("settlement_status");
const settlementType = useDic("settlement_type");
const detail: AnyObject = route.query || {};
</script>
<template>
  <div class="box">
    <van-field
      label="证件号"
      :model-value="detail.idNumber"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="结算方式"
      :model-value="dicConversion(detail.settleType, settlementType)"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="结算依据"
      :model-value="detail.settleNote"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="结算金额"
      :model-value="'¥' + detail.settleAmout"
      input-align="right"
      readonly
      :border="false"
    />
  </div>

  <div class="box">
    <van-field
      label="订单号"
      :model-value="detail.orderCode"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="交易号"
      :model-value="detail.payFlowId"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="备注"
      :model-value="detail.note"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="创建时间"
      :model-value="moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss')"
      input-align="right"
      readonly
      :border="false"
    />
    <van-field
      label="结算完成时间"
      :model-value="
        moment(detail.finishedSettleTime).format('YYYY-MM-DD HH:mm:ss')
      "
      input-align="right"
      readonly
      :border="false"
    />
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 351px;
  overflow: hidden;
  background: #fff;
  border-radius: 16px;
  padding: 13px 20px;
  margin: 12px auto 0;
  .van-cell {
    padding: 13px 0;
    :deep(.van-cell__title) {
      font-size: 14px;
      color: #999999;
    }
    :deep(.van-field__control) {
      font-size: 14px;
      color: #4d4d4d;
    }
  }
}
</style>
