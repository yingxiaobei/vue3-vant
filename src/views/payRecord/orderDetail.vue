<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { _getOrderDetail } from "@/api/payRecord";
import { dicConversion } from "@/utils";
import moment from "moment";

const route = useRoute();
const orderId = route.query.orderId as string;
const detail: any = ref({});

const tabs = [
  { label: "全部", value: "" },
  { label: "待支付", value: "0" },
  { label: "支付中", value: "3" },
  { label: "已支付", value: "1" },
  { label: "已取消", value: "2" },
];

const businessTypeOptions = [{ label: "报名缴费", value: "1" }];
const payAccountTypeOptions = [
  { label: "钱包支付", value: "1" },
  { label: "支付宝支付", value: "2" },
  { label: "免支付", value: "3" },
  { label: "线下支付", value: "4" },
];

onMounted(() => {
  getDetail();
});
const getDetail = () => {
  _getOrderDetail({ orderId }).then((res) => {
    detail.value = res || {};
  });
};
const formatDate = (date: string) => {
  if (date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
  return "";
};
</script>
<template>
  <div class="container">
    <div class="box-item">
      <header class="flex">
        <img src="@/assets/images/order.png" alt="" />
        <div class="flex-1 overflow-hidden">
          <h2>
            {{ dicConversion(detail.businessType + "", businessTypeOptions) }}
          </h2>
          <p class="van-ellipsis">{{ detail.schoolName }}</p>
        </div>
      </header>
      <van-field
        label="订单金额"
        :model-value="'¥' + (detail.orderPrice || 0)"
        input-align="right"
        readonly
        :border="false"
      />
      <van-field
        label="实付金额"
        :model-value="'¥' + (detail.paymentAmount || 0)"
        input-align="right"
        readonly
        :border="false"
      />
    </div>

    <div class="box-item pl-[20px] pr-[20px]">
      <h3>订单信息</h3>
      <van-field
        label="订单编号"
        :model-value="detail.orderNo"
        input-align="right"
        readonly
        :border="false"
      />
      <van-field
        label="创建时间"
        :model-value="formatDate(detail.createdTime)"
        input-align="right"
        readonly
        :border="false"
      />
      <van-field
        label="付款时间"
        :model-value="formatDate(detail.paymentTime)"
        input-align="right"
        readonly
        :border="false"
      />
      <van-field
        label="付款方式"
        :model-value="
          dicConversion(detail.payAccountType, payAccountTypeOptions)
        "
        input-align="right"
        readonly
        :border="false"
      />
    </div>

    <!-- <div class="box-item pl-[20px] pr-[20px]">
      <h3>温馨提示</h3>
      <p class="tip">
        这里是描述描述大家诶待解决的的亟待解决叠加低价诶待解的姐姐碟机大家诶记得大家诶记得的阶级大家爱的姐姐叠加低价诶的姐姐碟机大家诶哦大姐基地
      </p>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 12px;
  .box-item {
    border-radius: 16px;
    background: #fff;
    padding: 16px;
    overflow: hidden;
    margin-bottom: 12px;

    header {
      padding-bottom: 21px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 7px;
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
        letter-spacing: 1px;
      }
      p {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }
    }
    .van-cell {
      padding: 13px 4px;
      :deep(.van-cell__title) {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
      :deep(.van-field__control) {
        font-size: 14px;
        font-weight: 500;
        color: #4d4d4d;
      }
    }

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #4d4d4d;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .tip {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      margin-top: 12px;
    }
  }
}
</style>
