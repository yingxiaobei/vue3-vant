<script setup lang="ts">
import { ref, onMounted } from "vue";
import RegisStep from "@/components/RegisStep.vue";
import { useRoute } from "vue-router";
import { _getSchStudentAcceptinfo } from "@/api/coreServices";
import { _handleIdCard } from "@/utils/hidePrivacyInfo";

const activeStep = ref(1);
const detail = ref<Record<string, any>>({});
const route = useRoute();
// 审核状态 0待审核1拒绝2同意
const checkstatus = route.query.checkstatus as string;
const id = route.query.sid as string;
const schoolId = route.query.schoolId as string;
const schoolAdress = route.query.schoolAdress as string;

onMounted(() => {
  _getSchStudentAcceptinfo(schoolId, { id }).then((res) => {
    detail.value = res || {};
  });
});
</script>
<template>
  <RegisStep :active-step="activeStep" :type="2" />
  <div class="container">
    <div class="status">
      <img src="@/assets/images/time.png" alt="" />
      <div v-if="checkstatus === '0'" class="ml-[10px]">
        <h2>等待驾校审核</h2>
        <p>驾校正马不停蹄审核中...</p>
      </div>
      <div v-if="checkstatus === '1'" class="ml-[10px]">
        <h2>审核信息驾校已拒绝</h2>
        <p>您的信息填报有误，请核对信息～</p>
      </div>
    </div>

    <div class="box">
      <h2>报名信息</h2>
      <van-cell
        :border="false"
        title="驾校名称"
        :value="detail.applyerschoolname"
      />
      <van-cell :border="false" title="驾校地址" :value="schoolAdress" />
      <van-cell
        class="class-cell"
        :border="false"
        title="班级名称"
        :value="detail.package_name"
      />
      <van-cell :border="false" title="报名车型" :value="detail.traintype" />
      <van-cell
        :border="false"
        title="学费价格"
        :value="`¥${detail.train_price_online || ''}`"
      />
    </div>

    <div class="box">
      <h2>个人信息</h2>
      <van-cell :border="false" title="姓名" :value="detail.name" />
      <van-cell
        :border="false"
        title="身份证号"
        :value="_handleIdCard({ value: detail.idcard })"
      />
      <van-cell :border="false" title="联系方式" :value="detail.phone" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding: 0 12px;
}
.status {
  display: flex;
  align-items: center;

  height: 77px;
  background: #ffffff;
  border-radius: 16px;
  margin: -38px auto 0;
  padding-left: 20px;
  img {
    width: 20px;
    height: 20px;
  }
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #4d4d4d;
    line-height: 24px;
  }
  p {
    font-size: 13px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.box {
  padding: 14px 12px 12px;
  background: #ffffff;
  border-radius: 16px;
  margin: 12px 0;
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #4d4d4d;
    line-height: 24px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
.class-cell {
  :deep(.van-cell__value) {
    color: #cccccc;
  }
}
</style>
