<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { _getstuOrderSettlementList } from "@/api/settlementRecord";
import { _getUserStudentInfo, _getSuccessStageRecord } from "@/api/appraise";
import { getUserInfo, dicConversion } from "@/utils";
import moment from "moment";
import { useDic } from "@/hooks";

const router = useRouter();
const settlementStatus = useDic("settlement_status");
const settlementType = useDic("settlement_type");
// 结算列表
type OrderItem = {
  id: number | string;
  studentName: string;
  status: string;
  finishedSettleTime: string;
  settleAmout: number;
  settleType: string;
};
const orderList = ref<OrderItem[]>([]);
const params = ref<any>({});
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
  _getstuOrderSettlementList({
    ...pageParams,
    sid: params.value.sid,
    schoolId: params.value.schoolid,
  })
    .then((res) => {
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
onMounted(() => {
  getUserStudentInfo();
});
const getUserStudentInfo = () => {
  _getUserStudentInfo(getUserInfo().mobilePhone).then((res) => {
    console.log(res);
    params.value = res || {};
  });
};
const twoDetail = (item: any) => {
  router.push({
    path: "/settlementRecordDetail",
    query: item,
  });
};
</script>
<template>
  <van-pull-refresh
    v-if="params.sid && params.schoolid"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="box-item"
        v-for="item in orderList"
        :key="item.id"
        @click="twoDetail(item)"
      >
        <div class="flex justify-between header">
          <span class="van-ellipsis">{{ item.studentName }}</span>
          <span>¥{{ item.settleAmout }}</span>
        </div>
        <div class="flex justify-between content">
          <span>{{ dicConversion(item.settleType, settlementType) }}</span>
          <span :class="item.status === '未结算' ? 'not-settlement' : ''">{{
            dicConversion(item.status, settlementStatus)
          }}</span>
        </div>
        <div class="time">
          {{ moment(item.finishedSettleTime).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.box-item {
  width: 351px;
  margin: 0 auto 12px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  padding: 12px 20px;
  &:nth-of-type(1) {
    margin-top: 12px;
  }
  .header {
    span {
      font-size: 16px;
      font-weight: 500;
      color: #4d4d4d;
      line-height: 24px;
      margin-bottom: 4px;
      &:nth-of-type(1) {
        flex: 1;
        margin-right: 10px;
      }
    }
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    margin-bottom: 12px;
    .not-settlement {
      color: var(--theme-color);
    }
  }
  .time {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
  }
}
</style>
