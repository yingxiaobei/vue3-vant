<script setup lang="ts">
import { ref, watch, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { _getCompanyList } from "@/api/schSignup";
import { useDic, useLocation } from "@/hooks";
import { Toast } from "vant";
const router = useRouter();
const imgUrl = new URL("@/assets/images/search-icon.png", import.meta.url).href;
const cityCode = import.meta.env.VITE_CITY_CODE;
const areaOptions = useDic("address_type", cityCode);
const location = useLocation();

const searchForm = reactive({
  cityCode,
  areaCode: "",
  name: "",
  busiScope: "",
  type: "1",
});

// 驾校列表
type SchItem = {
  id: string;
  name: string;
  address: string;
  grade: number;
  distance: number;
  imgDetailVO?: Record<string, any>;
};
const schList = ref<SchItem[]>([]);

watch(
  () => [searchForm.areaCode, searchForm.type, location, searchForm.busiScope],
  (val) => {
    getCompanyList();
  },
  {
    deep: true,
  }
);

const twoSchDetail = (id: string) => {
  router.push({
    path: "/schDetail",
    query: {
      id,
    },
  });
};

onMounted(() => {
  getCompanyList();
});
const getCompanyList = () => {
  const toast = Toast.loading({
    message: "加载中...",
    forbidClick: true,
    duration: 0,
  });
  _getCompanyList({ ...searchForm, ...location })
    .then((res) => {
      schList.value = res || [];
      toast.clear();
    })
    .catch(() => {
      toast.clear();
    });
};
</script>

<template>
  <van-search
    v-model="searchForm.name"
    placeholder="请输入您想要搜素的驾校"
    :left-icon="imgUrl"
    @search="getCompanyList"
  >
  </van-search>
  <van-tabs border v-model:active="searchForm.areaCode" sticky class="tab">
    <van-tab
      v-for="item in [{ value: '', label: '全城' }, ...areaOptions]"
      :title="item.label"
      :name="item.value"
      :key="item.value"
    >
      <div class="flex mb-[12px]">
        <div
          v-for="item in [
            { id: '1', label: '距离优先' },
            { id: '2', label: '评分优先' },
          ]"
          class="mr-[28px] priority-item"
          :class="searchForm.type === item.id ? 'active-priority-item' : ''"
          @click="searchForm.type = item.id"
        >
          {{ item.label }}
        </div>
      </div>

      <div class="car-type">
        <div
          v-for="item in [
            { id: '', label: '不限' },
            { id: 'C1', label: 'C1' },
            { id: 'C2', label: 'C2' },
            { id: 'C5', label: 'C5' },
            { id: 'A1', label: 'A1' },
            { id: 'A2', label: 'A2' },
            { id: 'A3', label: 'A3' },
            { id: 'B1', label: 'B1' },
            { id: 'B2', label: 'B2' },
          ]"
          class="cartype-item"
          :class="searchForm.busiScope === item.id ? 'active-cartype-item' : ''"
          @click="searchForm.busiScope = item.id"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- 驾校列表 -->

      <div
        v-for="item in schList"
        :key="item.id"
        class="sch-item flex justify-center items-center"
      >
        <img :src="item?.imgDetailVO?.url" alt="" />
        <div class="ml-[12px]">
          <h2>{{ item.name }}</h2>
          <p class="line-clamp-1">
            {{ item.address }}
          </p>
          <div class="flex justify-between items-center">
            <div>
              <van-rate v-model="item.grade" readonly class="rate" />
              <div class="van-ellipsis">
                距离:{{
                  item.distance === 13000
                    ? "--"
                    : (item.distance || 0).toFixed(1)
                }}km
              </div>
            </div>
            <van-button
              plain
              round
              type="primary"
              size="small"
              @click="twoSchDetail(item.id)"
              >报名咨询</van-button
            >
          </div>
        </div>
      </div>
      <van-empty v-if="!schList.length" description="暂无数据" />
    </van-tab>
  </van-tabs>
</template>
<style lang="scss" scoped>
.tab {
  :deep(.van-sticky--fixed) {
    top: var(--van-nav-bar-height) !important;
  }
}
.van-search {
  padding: 0;
  width: 343px;
  height: 38px;

  margin: 10px auto 20px;
}
:deep(.van-tabs__content) {
  padding: 12px;
}
.priority-item {
  font-size: 14px;
  font-weight: 600;
  color: #4d4d4d;
  line-height: 21px;
}
.active-priority-item {
  color: var(--theme-color);
}

.car-type {
  display: flex;
  margin-bottom: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}
.cartype-item {
  flex-basis: 66px;
  flex-shrink: 0;
  margin-right: 10px;
  // width: 66px;
  height: 28px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  text-align: center;
  line-height: 28px;
  font-size: 12px;
  font-weight: 500;
  color: #4c4c4c;
}
.active-cartype-item {
  background: #ff5c5c;
  color: #fff;
}
.sch-item {
  width: 351px;
  height: 117px;
  background: #ffffff;
  border-radius: 18px;
  padding: 10px;
  margin-bottom: 10px;
  img {
    width: 129px;
    height: 97px;
    border-radius: 18px;
  }
  & > div {
    height: 100%;
    flex: 1;
    overflow: hidden;
    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      letter-spacing: 1px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 4px 0 6px;
    }
  }
  .rate :deep(i) {
    font-size: 14px;
  }
}
</style>
