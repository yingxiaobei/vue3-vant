<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { _getUserStudentInfo, _getSuccessStageRecord } from "@/api/appraise";
import { getUserInfo } from "@/utils";
const router = useRouter();
const params = ref<any>({});
const list = ref<any>([]);
const sch = ref<any>({});
// 0驾校 1-4科目一到科目四
const options = [
  { part: "1", label: "一" },
  { part: "2", label: "二" },
  { part: "3", label: "三" },
  { part: "4", label: "四" },
];

onMounted(() => {
  getUserStudentInfo();
});

const getUserStudentInfo = () => {
  _getUserStudentInfo(getUserInfo().mobilePhone).then((res) => {
    params.value = res || {};
    getSuccessStageRecord();
  });
};
const getSuccessStageRecord = () => {
  _getSuccessStageRecord(params.value.sid, params.value.schoolid).then(
    (res) => {
      const arr = res || [];
      list.value = options.map((m) => {
        const obj = arr.find((f) => f.part === m.part) || {};
        return {
          ...m,
          ...obj,
        };
      });
      sch.value = arr.find((f) => f.part === "0") || {};
    }
  );
};
</script>
<template>
  <div class="box">
    <h2>阶段评价</h2>
    <ul>
      <li
        v-for="item in list"
        @click="
          params.sid &&
            router.push({
              path: `/stageAppraise/${item.part}`,
              query: {
                sid: params.sid,
                schoolid: params.schoolid,
                eid: item.eid,
              },
            })
        "
      >
        科目{{ item.label }}阶段评价
        <div>
          <span v-if="item.evaStatus === '0'">未评价</span>
          <span v-else class="text-themeColor">已评价</span>
          <img src="@/assets/images/arrow.png" alt="" />
        </div>
      </li>
    </ul>
  </div>

  <div class="box">
    <h2>驾校评价</h2>
    <ul>
      <li
        @click="
          params.sid &&
            router.push({
              path: '/schAppraise',
              query: {
                sid: params.sid,
                schoolid: params.schoolid,
                eid: sch.eid,
                schoolName: sch.schoolName,
              },
            })
        "
        class="flex justify-between overflow-hidden"
      >
        <span class="flex-1 van-ellipsis mr-[10px]">
          {{ sch.schoolName }}
        </span>
        <div class="w-[70px]">
          <span v-if="sch.evaStatus === '0'">未评价</span>
          <span v-if="sch.evaStatus === '1'" class="text-themeColor"
            >已评价</span
          >
          <img src="@/assets/images/arrow.png" alt="" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.box {
  background: #fff;
  border-radius: 16px;
  padding: 14px 20px;
  width: 351px;
  margin: 12px auto 0;
  h2 {
    font-weight: 500;
    color: #4d4d4d;
    line-height: 24px;
    font-size: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  li {
    display: flex;
    justify-content: space-between;
    height: 47px;
    line-height: 47px;
    & > div {
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      justify-content: flex-end;
      img {
        width: 13px;
        height: 13px;
        margin-left: 4px;
      }
    }
  }
}
</style>
