<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo, dicConversion } from "@/utils";
import { useDic } from "@/hooks";
import { _getRegistrationRecord } from "@/api/coreServices";

const router = useRouter();
const list = ref<any[]>([]);
const statusOptions = useDic("accept_student_status");
onMounted(() => {
  getList();
});

const getList = () => {
  const phone = getUserInfo().mobilePhone;
  _getRegistrationRecord(phone).then((res) => {
    list.value = res || [];
  });
};

const handleJump = (item: {
  checkstatus: string;
  sid: string;
  schoolId: string;
  schoolAdress: string;
}) => {
  const { checkstatus, sid, schoolId, schoolAdress } = item;
  // 审核状态 0待审核1拒绝2同意
  if (checkstatus === "2") {
    router.push({
      path: "/regisFillInfo",
      query: {
        sid,
      },
    });
  } else if (["0", "1"].includes(checkstatus)) {
    router.push({
      path: "/regisAudit",
      query: {
        checkstatus,
        schoolId,
        sid,
        schoolAdress,
      },
    });
  }
};
</script>
<template>
  <ul class="container">
    <li v-for="item in list" @click="handleJump(item)">
      <img :src="item.schoolImgUrl" alt="" />
      <div class="overflow-hidden flex-1">
        <h2>{{ item.schoolName }}</h2>
        <p class="van-ellipsis">{{ item.schoolAdress }}</p>
      </div>
      <div class="tag">{{ dicConversion(item.status, statusOptions) }}</div>
    </li>
  </ul>
  <van-empty v-if="!list.length" description="暂无数据" />
</template>

<style lang="scss" scoped>
.container {
  padding: 12px;
  li {
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    padding: 8px;
    display: flex;
    position: relative;
    overflow: hidden;
    img {
      width: 110px;
      height: 82px;
      border-radius: 13px;
      margin-right: 8px;
    }
    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin-bottom: 8px;
      margin-right: 60px;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      letter-spacing: 1px;
    }
    .tag {
      position: absolute;
      width: 57px;
      height: 24px;
      background: #ffebeb;
      top: 0;
      right: 0;
      border-radius: 0 0 0 16px;
      font-size: 12px;
      font-weight: 400;
      color: #666660;
      text-align: center;
      line-height: 24px;
    }
  }
  .status {
    margin: 0px;
    width: 57px;
    height: 24px;
    background: #ffebeb;
    border-radius: 0 13px 0 13px;
    text-align: center;
    span {
      width: 37px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #666660;
      line-height: 12px;
      letter-spacing: 1px;
    }
  }
}
</style>
