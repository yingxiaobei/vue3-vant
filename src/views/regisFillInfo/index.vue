<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { FormInstance } from "vant";
import RegisStep from "@/components/RegisStep.vue";
import moment from "moment";
import { useDic } from "@/hooks";
import { dicConversion } from "@/utils";
import Photo from "./photo.vue";
import { _handleIdCard } from "@/utils/hidePrivacyInfo";
import {
  _getStudentInfoByKey,
  _updateStudent,
  _getSchoolBusiScopeCombo,
  _getPreviewContractFile,
} from "@/api/coreServices";
import router from "@/router";

const loading = ref(false);
const route = useRoute();
// 合同状态标志 0未生成 1已生成学员未签订 2学员已签订-未上传 3已上传
const contractflag = ref("");
// 支付状态 0未缴费 1已缴费  为空则不需要缴费
const paystatus = ref("");
const sid = route.query.sid as string;
const detail = ref<Record<string, any>>({});
const sexOptions = useDic("gender_type");
const nationalityOptions = useDic("nationality_type");
const busiOptions = useDic("busi_type");

const minDate = ref(new Date("2000/01/01"));
const formRef = ref<FormInstance>();
const formData = reactive({
  head_img_oss_id: "",
  head_img_url: "",
  address: "",
  busitype: "",
  pxdnumcode: "",
  perdritype: "",
  fstdrilicdate: "",
});
const businessTypePicker = ref(false);
const oldCarTypePicker = ref(false);
const firstTimePicker = ref(false);

const oldCarTypeOptions = ref([]);

onMounted(() => {
  getDetailInfo();
});

const getDetailInfo = () => {
  _getStudentInfoByKey({ id: sid }).then((res) => {
    detail.value = res || {};
    contractflag.value = res?.contractflag || "";
    paystatus.value = res?.paystatus || "";

    res?.schoolid && getCarType(res?.schoolid);
    formData.address = res?.address || "";
    formData.busitype = res?.busitype || "";
    formData.pxdnumcode = res?.pxdnumcode || "";
    formData.perdritype = res?.perdritype || "";
    formData.fstdrilicdate = res?.fstdrilicdate || "";
    formData.head_img_url = res?.headImgVO?.head_img_url_show || "";
  });
};
const getCarType = (id: string) => {
  _getSchoolBusiScopeCombo(id).then((res) => {
    console.log(res);
    oldCarTypeOptions.value = res || [];
  });
};
// 合同状态标志 0未生成 1已生成学员未签订 2学员已签订-未上传 3已上传
// 0已通过审核 1合同已经生成 2已完成缴费（报名完成） 3已退学
const status = computed(() => {
  if (["2", "3"].includes(contractflag.value)) {
    if (paystatus.value === "1" || !paystatus.value) {
      return 2;
    }
    return 1;
  } else if (["0", "1"].includes(contractflag.value)) {
    return 0;
  }
  return null;
});
const onSubmit = () => {
  const params: any = { ...detail.value, ...formData, sid };
  delete params.head_img_url;
  if (!params.head_img_oss_id) {
    delete params.head_img_oss_id;
  }
  loading.value = true;
  _updateStudent(params)
    .then((res) => {
      loading.value = false;
      getDetailInfo();
      router.push({
        path: "/contract",
        query: {
          sid,
          schoolid: detail.value.schoolid,
        },
      });
    })
    .catch(() => {
      loading.value = false;
    });
};
const businessTypeConfirm = (val: any) => {
  formData.busitype = val.value;
  businessTypePicker.value = false;
};
const oldCarTypeConfirm = (val: any) => {
  formData.perdritype = val.value;
  oldCarTypePicker.value = false;
};
const firstTimeConfirm = (val: any) => {
  console.log(val);
  formData.fstdrilicdate = moment(val).format("YYYY-MM-DD");
  firstTimePicker.value = false;
};
const photoCallback = (res: any) => {
  formData.head_img_oss_id = res.id;
  formData.head_img_url = res.url;
};
const statusList = [
  { status: 0, h2: "驾校已通过审核", p: "请尽快补充完整信息～" },
  {
    status: 1,
    h2: "合同已经生成",
    p: "您可以去缴纳报名缴费啦～",
    btn: "去缴费",
  },
  {
    status: 2,
    h2: "您已完成报名",
    p: "可以联系驾校进行学习啦～",
    btn: "查看合同",
    key: "viewContract",
  },
  {
    status: 3,
    h2: "您已完成退学",
  },
];

const currentStatus = computed(() =>
  statusList.find((f) => f.status === status.value)
);
const handleStatus = (key?: string) => {
  if (key === "viewContract") {
    // 查看合同
    _getPreviewContractFile(sid).then((res) => {
      router.push({
        path: "/pdfViewer",
        query: {
          url: res,
        },
      });
    });
  }
};
</script>
<template>
  <RegisStep :active-step="2" :type="!!paystatus ? 1 : 2" />
  <div class="container">
    <div class="status">
      <img src="@/assets/images/success2.png" alt="" />
      <div class="ml-[10px] flex justify-between flex-1 items-center">
        <div>
          <h2>{{ currentStatus?.h2 }}</h2>
          <p>{{ currentStatus?.p }}</p>
        </div>
        <van-button
          v-if="currentStatus?.btn"
          type="primary"
          size="small"
          @click="handleStatus(currentStatus?.key)"
          round
          >{{ currentStatus?.btn }}</van-button
        >
      </div>
    </div>
    <van-form ref="formRef" @submit="onSubmit">
      <div class="box">
        <h2>个人信息</h2>
        <van-cell :border="false" title="姓名" :value="detail.name" />
        <van-cell :border="false" title="联系方式" :value="detail.phone" />
        <van-cell
          :border="false"
          title="国籍"
          :value="dicConversion(detail.nationality, nationalityOptions)"
        />
        <van-cell
          :border="false"
          title="身份证号"
          :value="_handleIdCard({ value: detail.idcard })"
        />
        <van-cell
          :border="false"
          title="性别"
          :value="dicConversion(detail.sex, sexOptions)"
        />
        <van-field
          v-model="formData.head_img_url"
          label="采集档案相片"
          :border="false"
          required
          readonly
          class="photo"
          :rules="[{ required: true, message: '请完成采集档案相片' }]"
        >
          <template #input>
            <Photo
              :callback="photoCallback"
              :disabled="status !== 0"
              :default-val="formData.head_img_url"
            />
          </template>
        </van-field>
        <van-field
          v-model="formData.address"
          input-align="right"
          error-message-align="right"
          label="当前住址"
          required
          placeholder="请输入您的详细地址"
          :rules="[{ required: true, message: '请输入您的详细地址' }]"
          :disabled="status !== 0"
        />
      </div>

      <div class="box">
        <h2>报名信息</h2>
        <van-cell :border="false" title="驾校名称" :value="detail.schoolname" />
        <van-cell
          :border="false"
          title="驾校地址"
          :value="detail.schooladress"
        />
        <van-cell
          :border="false"
          title="班级名称"
          :value="detail.package_name"
        />
        <van-cell :border="false" title="报名车型" :value="detail.traintype" />
        <van-cell
          :border="false"
          title="学费价格"
          :value="`¥${detail?.train_price_online || ''}`"
        />
        <van-field
          v-model="formData.busitype"
          readonly
          label="业务类型"
          placeholder="请选择"
          input-align="right"
          error-message-align="right"
          class="placeholder"
          :border="false"
          required
          is-link
          :rules="[{ required: true, message: '请选择业务类型' }]"
          @click="status === 0 && (businessTypePicker = true)"
          :disabled="status !== 0"
        >
          <template #input>
            <span v-if="formData.busitype">{{
              dicConversion(formData.busitype, busiOptions)
            }}</span>
            <span v-else class="sel">请选择</span>
          </template>
          <!-- <template #right-icon>
            <img class="arrow" src="@/assets/images/arrow.png" alt="" />
          </template> -->
        </van-field>
        <van-popup v-model:show="businessTypePicker" position="bottom">
          <van-picker
            :columns="busiOptions"
            :columns-field-names="{ text: 'label' }"
            @confirm="businessTypeConfirm"
            @cancel="businessTypePicker = false"
          />
        </van-popup>

        <template v-if="formData.busitype === '1'">
          <van-field
            v-model="formData.pxdnumcode"
            input-align="right"
            error-message-align="right"
            label="原驾驶证号"
            required
            placeholder="请输入原驾驶证号"
            :rules="[{ required: true, message: '请输入原驾驶证号' }]"
            :border="false"
            :disabled="status !== 0"
          />

          <van-field
            v-model="formData.perdritype"
            readonly
            class="placeholder"
            label="原准驾车型"
            placeholder="请选择"
            input-align="right"
            error-message-align="right"
            :border="false"
            required
            is-link
            :rules="[{ required: true, message: '请选择原准驾车型' }]"
            @click="status === 0 && (oldCarTypePicker = true)"
            :disabled="status !== 0"
          >
            <!-- <template #right-icon>
              <img class="arrow" src="@/assets/images/arrow.png" alt="" />
            </template> -->
          </van-field>
          <van-popup v-model:show="oldCarTypePicker" position="bottom">
            <van-picker
              :columns="oldCarTypeOptions"
              @confirm="oldCarTypeConfirm"
              @cancel="oldCarTypePicker = false"
            />
          </van-popup>

          <van-field
            v-model="formData.fstdrilicdate"
            readonly
            class="placeholder"
            label="初领日期"
            placeholder="请选择"
            input-align="right"
            error-message-align="right"
            :border="false"
            required
            is-link
            :rules="[{ required: true, message: '请选择初领日期' }]"
            @click="status === 0 && (firstTimePicker = true)"
            :disabled="status !== 0"
          >
            <!-- <template #right-icon>
              <img class="arrow" src="@/assets/images/arrow.png" alt="" />
            </template> -->
          </van-field>
          <van-popup v-model:show="firstTimePicker" position="bottom">
            <van-datetime-picker
              type="date"
              @confirm="firstTimeConfirm"
              @cancel="firstTimePicker = false"
              :min-date="minDate"
            />
          </van-popup>
        </template>
      </div>
    </van-form>
  </div>

  <div class="submit" v-if="status === 0 || (paystatus && status === 1)">
    <van-button
      v-if="status === 0"
      type="primary"
      block
      round
      :disabled="false"
      @click="formRef?.submit()"
      :loading="loading"
      >提交</van-button
    >
    <van-button v-if="paystatus && status === 1" type="primary" block round
      >去缴费</van-button
    >
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 0 12px;
  .status {
    display: flex;
    align-items: center;

    height: 77px;
    background: #ffffff;
    border-radius: 16px;
    margin: -38px auto 0;
    padding-left: 20px;
    padding-right: 16px;
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
      display: flex;
      justify-content: space-between;
      .re-edit {
        display: flex;
        align-items: center;
        i {
          color: #333;
          font-size: 18px;
          margin-right: 4px;
        }
        span {
          font-size: 12px;
          font-weight: 400;
          color: #5796eb;
        }
      }
    }
  }
  .van-cell {
    padding: 11px 0;
    :deep(.van-cell__title) {
      font-size: 14px;
      font-weight: 400;
      color: #cccccc;
    }
    :deep(.van-cell__value) {
      flex: 2;
      font-size: 14px;
      font-weight: 400;
      color: #cccccc;
    }
    &.van-field {
      :deep(.van-cell__title) {
        color: #4d4d4d;
      }
    }
  }
  .placeholder {
    :deep(input) {
      &::placeholder {
        color: #999999;
      }
    }
    .arrow {
      width: 13px;
      height: 13px;
    }
    &.van-field--disabled {
      :deep(.van-field__control) {
        color: #cccccc;
        -webkit-text-fill-color: #cccccc;
      }
    }

    .sel {
      color: #ccc;
    }
  }
}
.photo {
  display: block;
  :deep(.van-field__label) {
    width: 100%;
    margin-bottom: 8px;
  }
}
.submit {
  height: 84px;
  background: #fff;
  padding: 8px 23px 0;
}
</style>
