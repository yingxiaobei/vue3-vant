<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Toast } from "vant";
import Header from "@/components/Header.vue";
import { dicConversion } from "@/utils";
import {
  _schEvaluationAdd,
  _getCoalist,
  _getschEvaluationInfo,
} from "@/api/appraise";

const route = useRoute();
const router = useRouter();
const params: AnyObject = route.query || {};
console.log(params);
const titleHash = new Map([
  [1, "一"],
  [2, "二"],
  [3, "三"],
  [4, "四"],
]);
const navTitle = `科目${titleHash.get(Number(route.params.id))}阶段评价`;
const formData = reactive({
  cid: "",
  coateachlevel: 0,
  coateachattitude: 0,
  carstatus: 0,
  overall: 0,
  teachlevel: "",
  isAnonymous: false,
});
const coaList = ref([]);

const showCoachPicker = ref(false);
const onConfirm = (val: { value: string }) => {
  formData.cid = val.value;
  showCoachPicker.value = false;
};

onMounted(() => {
  getCoalist();
  if (params.eid) {
    getDetail();
  }
});
const getCoalist = () => {
  _getCoalist(params.schoolid).then((res) => {
    coaList.value = (res.rows || []).map((m) => ({
      label: m.coachname,
      value: m.cid,
    }));
  });
};
// 获取评价详情
const getDetail = () => {
  _getschEvaluationInfo({ id: params.eid }).then((res) => {
    formData.teachlevel = res?.teachlevel || "";
    formData.cid = res?.objectnum || "";
    formData.coateachlevel = res?.coateachlevel || 0;
    formData.coateachattitude = res?.coateachattitude || 0;
    formData.carstatus = res?.carstatus || 0;
    formData.overall = res?.overall || 0;
    formData.isAnonymous = res?.isAnonymous === "1";
  });
};
const submit = () => {
  if (!formData.cid) {
    return Toast("请选择教练");
  }
  if (
    !formData.coateachlevel ||
    !formData.coateachattitude ||
    !formData.carstatus ||
    !formData.overall
  ) {
    return Toast("请评分");
  }
  const reqParams = { ...formData };

  _schEvaluationAdd({
    ...reqParams,
    part: route.params.id,
    isAnonymous: formData.isAnonymous ? "1" : "0",
    sid: params.sid,
    type: "1",
    schoolId: params.schoolid,
  }).then((res) => {
    router.go(-1);
  });
};
</script>
<template>
  <Header :navTitle="navTitle" navBorderColor="rgba(0,0,0,0.1)" />
  <div class="box">
    <div class="coach" @click="!params.eid && (showCoachPicker = true)">
      <label>教练</label>
      <span
        >{{ formData.cid ? dicConversion(formData.cid, coaList) : "未选择"
        }}<img class="arrow" src="@/assets/images/arrow.png" alt=""
      /></span>
    </div>
    <van-popup v-model:show="showCoachPicker" position="bottom">
      <van-picker
        :columns="coaList"
        @confirm="onConfirm"
        @cancel="showCoachPicker = false"
        :columns-field-names="{ text: 'label' }"
      />
    </van-popup>
    <div class="rate">
      <label>教学水平</label>
      <van-rate
        class="ml-[12px]"
        :disabled="!!params.eid"
        v-model="formData.coateachlevel"
      />
    </div>
    <div class="rate">
      <label>教学态度</label>
      <van-rate
        class="ml-[12px]"
        :disabled="!!params.eid"
        v-model="formData.coateachattitude"
      />
    </div>
    <div class="rate">
      <label>车辆状况</label>
      <van-rate
        class="ml-[12px]"
        :disabled="!!params.eid"
        v-model="formData.carstatus"
      />
    </div>
  </div>

  <div class="box overall">
    <div class="rate">
      <label>总体评价</label>
      <van-rate
        class="ml-[12px]"
        :disabled="!!params.eid"
        v-model="formData.overall"
      />
    </div>
  </div>

  <div class="box note">
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
      v-model="formData.isAnonymous"
      :disabled="!!params.eid"
    >
      <span class="a">匿名评价</span>
      <template #icon="props">
        <img v-if="props.checked" src="@/assets/images/check.png" />
        <img v-else src="@/assets/images/un-check.png" />
      </template>
    </van-checkbox>
  </div>

  <van-button
    v-if="!params.eid"
    class="submit"
    type="primary"
    block
    round
    @click="submit"
    >提交</van-button
  >
</template>

<style lang="scss" scoped>
.box {
  background: #fff;
  border-radius: 16px;
  width: 343px;
  margin: 12px auto 0;
  padding: 0 20px;
  label {
    font-size: 16px;
    font-weight: 600;
    color: #4d4d4d;
  }
  .coach {
    display: flex;
    height: 51px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    span {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #666660;
    }
    .arrow {
      width: 13px;
      height: 13px;
      margin-left: 7px;
    }
  }
  .rate {
    height: 55px;
    align-items: center;
    display: flex;
  }
}
.overall {
  padding: 12px 20px;
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
  padding-right: 20px;
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

.note {
  padding: 0;
  overflow: hidden;
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    height: 49px;
    line-height: 49px;
    padding-left: 16px;
  }
}

.submit {
  width: 329px;
  margin: 30px auto 20px;
}
</style>
