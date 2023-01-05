<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Toast } from "vant";
import {
  _schEvaluationAdd,
  _getCoalist,
  _getschEvaluationInfo,
} from "@/api/appraise";

const route = useRoute();
const router = useRouter();
const params: AnyObject = route.query || {};

const formData = reactive({
  overall: 0,
  teachlevel: "",
  isAnonymous: false,
});
onMounted(() => {
  if (params.eid) {
    getDetail();
  }
});
// 获取评价详情
const getDetail = () => {
  _getschEvaluationInfo({ id: params.eid }).then((res) => {
    formData.teachlevel = res?.teachlevel || "";
    formData.overall = res?.overall || 0;
    formData.isAnonymous = res?.isAnonymous === "1";
  });
};
const submit = () => {
  if (!formData.overall) {
    return Toast("请评分");
  }
  _schEvaluationAdd({
    ...formData,
    isAnonymous: formData.isAnonymous ? "1" : "0",
    sid: params.sid,
    type: "2",
    schoolId: params.schoolid,
    part: "1",
  }).then((res) => {
    router.go(-1);
  });
};
</script>

<template>
  <div class="container">
    <div>
      <div class="box">
        <h2 class="has-bottom van-ellipsis">{{ params?.schoolName }}</h2>
        <div class="population">
          总体评价<van-rate
            class="ml-[12px]"
            :disabled="!!params.eid"
            v-model="formData.overall"
          />
        </div>
      </div>

      <div class="box mt-[12px]">
        <h2>评价内容</h2>
        <van-field
          v-model="formData.teachlevel"
          rows="4"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="（选填）"
          show-word-limit
          :disabled="!!params.eid"
        />
      </div>

      <div class="check">
        <van-checkbox
          class="float-right"
          :disabled="!!params.eid"
          v-model="formData.isAnonymous"
        >
          <span class="a">匿名评价</span>
          <template #icon="props">
            <img v-if="props.checked" src="@/assets/images/check.png" />
            <img v-else src="@/assets/images/un-check.png" />
          </template>
        </van-checkbox>
      </div>
    </div>

    <van-button v-if="!params.eid" @click="submit" type="primary" round
      >提交</van-button
    >
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 13px 16px 15px;
  height: calc(100vh - var(--van-nav-bar-height));
  .box {
    background: #fff;
    border-radius: 16px;
    padding-top: 16px;
    overflow: hidden;
    h2 {
      margin: 0 12px 0 20px;
      padding-bottom: 16px;
      &.has-bottom {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
  }
  .population {
    margin: 28px 20px;
    font-size: 16px;
    font-weight: 500;
    color: #4d4d4d;
    display: flex;
    align-items: center;
  }
  .van-field {
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 327px;
    margin: 0 auto 8px;
    border-radius: 16px;
  }
  .check {
    margin-top: 15px;
    overflow: hidden;
    img {
      width: 16px;
      height: 16px;
    }
    .a {
      font-size: 14px;
      color: #666660;
    }
    :deep(.van-checkbox__icon) {
      height: auto;
    }
  }
}
</style>
