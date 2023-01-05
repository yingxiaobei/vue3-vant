<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { dicConversion } from "@/utils";
import { _getOrderList } from "@/api/payRecord";
import moment from "moment";
const router = useRouter();
const activeTab = ref("");
const tabs = [
  { label: "全部", value: "" },
  { label: "待支付", value: "0" },
  { label: "支付中", value: "3" },
  { label: "已支付", value: "1" },
  { label: "已取消", value: "2" },
];

const businessTypeOptions = [{ label: "报名缴费", value: "1" }];

// 订单列表
type OrderItem = {
  orderId: string;
  schoolName: string;
  createdTime: string;
  payStatus: string;
  orderPrice: string;
  businessType: number;
};
const orderList = ref<OrderItem[]>([]);
const pageParams = reactive({
  page: 1,
  limit: 10,
});
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const onLoad = () => {
  if (refreshing.value) {
    orderList.value = [];
    refreshing.value = false;
  }
  getList();
};

const onRefresh = () => {
  // 清空列表数据
  orderList.value = [];
  pageParams.page = 1;
  finished.value = false;
  // 重新加载数据
  onLoad();
};

const getList = () => {
  loading.value = true;
  _getOrderList({ ...pageParams, payStatus: activeTab.value })
    .then((res) => {
      console.log(111, res);
      orderList.value.push(...(res?.rows || []));
      loading.value = false;
      if (orderList.value.length >= (res?.total || 0)) {
        finished.value = true;
      } else {
        // 没有请求完成
        pageParams.page++;
      }
    })
    .catch(() => {
      loading.value = false;
      finished.value = true;
    });
};
watch(activeTab, () => {
  onRefresh();
});

const twoDetail = (orderId: string) => {
  router.push({
    path: "/orderDetail",
    query: {
      orderId,
    },
  });
};
</script>
<template>
  <ul class="tabs">
    <li
      v-for="(item, index) in tabs"
      :key="item.value"
      :class="activeTab === item.value ? 'active-tab' : ''"
      @click="activeTab = item.value"
    >
      {{ item.label }}
    </li>
  </ul>
  <div class="pisition"></div>
  <div class="box">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="box-item"
          v-for="item in orderList"
          :key="item.orderId"
          @click="twoDetail(item.orderId)"
        >
          <header class="flex">
            <h2 class="van-ellipsis w-[240px]">{{ item.schoolName }}</h2>
            <div
              :class="`status-${item.payStatus}`"
              class="status flex-1 text-right"
            >
              {{ dicConversion(item.payStatus + "", tabs) }}
            </div>
          </header>
          <div class="content mb-[9px]">
            <img src="@/assets/images/order.png" alt="" />
            <div>
              <h3>
                {{ dicConversion(item.businessType + "", businessTypeOptions) }}
              </h3>
              <p>
                订单时间：{{
                  moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss")
                }}
              </p>
            </div>
          </div>
          <div class="price">
            总价<a>¥</a><span>{{ item.orderPrice }}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  height: 81px;
  background: var(--nav-bg-color);
  padding: 22px 16px 0;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: var(--van-nav-bar-height);
  z-index: 1;
  li {
    font-size: 16px;
    color: rgba($color: #fff, $alpha: 0.8);
  }
  .active-tab {
    color: #fff;
    font-size: 18px;
  }
}
.pisition {
  height: 81px;
}
:deep(.van-sticky--fixed) {
  top: var(--van-nav-bar-height) !important;
}
.box {
  background: var(--bg-color);
  // margin-top: -12px;
  position: relative;
  z-index: 2;
  top: -12px;
  border-radius: 12px;
  padding: 12px;
  max-height: calc(100vh - var(--van-nav-bar-height) - 81px);
  overflow: auto;

  .box-item {
    width: 100%;
    background: #fff;
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 16px 12px 12px;
    header {
      padding-bottom: 15px;
      padding-left: 4px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .status {
      font-size: 14px;
      font-weight: 400;
      color: #666660;
    }
    .status-1 {
      color: var(--theme-color);
    }
    .content {
      margin-top: 11px;
      display: flex;
      padding-left: 4px;
      img {
        width: 45px;
        height: 45px;
        margin-right: 12px;
      }
      h3 {
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
    .price {
      text-align: right;
      padding-right: 8px;
      font-size: 12px;
      color: #666660;
      a {
        color: #4d4d4d;
        font-size: 12px;
        font-weight: bold;
        margin-left: 4px;
      }
      span {
        color: #4d4d4d;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
