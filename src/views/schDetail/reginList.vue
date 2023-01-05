<script setup lang="ts">
import { ref, reactive } from "vue";
import SiteItem from "./siteItem.vue";
import { _getSchReginList } from "@/api/coreServices";
import { useRoute } from "vue-router";

const route = useRoute();
const schoolId = route.query.schoolId as string;

// 列表
type Item = {
  rid: string;
  name: string;
  address: string;
  // rate: number;
  // distance: number;
};
const list = ref<Item[]>([]);
const pageParams = reactive({
  page: 1,
  limit: 10,
});
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const onLoad = () => {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
  }
  getSchSchoolRegin();
};

const onRefresh = () => {
  // 清空列表数据
  list.value = [];
  pageParams.page = 1;
  finished.value = false;
  // 重新加载数据
  onLoad();
};

// 获取班级
const getSchSchoolRegin = () => {
  loading.value = true;
  _getSchReginList<Item>({ schoolId, ...pageParams })
    .then((res) => {
      console.log(res);
      list.value.push(...(res?.rows || []));
      loading.value = false;
      if (list.value.length >= (res?.total || 0)) {
        finished.value = true;
      } else {
        // 没有请求完成
        pageParams.page++;
      }
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>
<template>
  <div class="list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <SiteItem
          :schoolId="schoolId"
          :item="item"
          v-for="item in list"
          :key="item.rid"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: 100%;
  overflow: hidden;
  background: #fff;
  padding: 12px;
  margin-top: 16px;
}
</style>
