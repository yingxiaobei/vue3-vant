<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, onMounted, defineComponent } from "vue";
import { Dialog } from "vant";
import { _getCompanyDetail } from "@/api/schSignup";
import {
  _getSchSchoolPackageDetail,
  _schStudentAcceptinfoSave,
} from "@/api/coreServices";
import { getUserInfo, dicConversion } from "@/utils";
import rules from "@/utils/rules";

const route = useRoute();
const router = useRouter();

const schoolId = route.query.schoolId as string;
const packid = route.query.packid as string;
const leaderPhone = ref();
const vDialog = Dialog.Component;
const formData = reactive<Record<string, any>>({
  phone: getUserInfo().mobilePhone,
  applyerschoolid: schoolId,
  package_id: packid,
  userid: getUserInfo().id,
  acceptStudentType: "",
  package_name: "",
  cardtype: "1",
});
const showTransferPicker = ref(false);
const confirmShow = ref(false);
const studentType = [
  { label: "非转校", value: "0" },
  { label: "市内转校", value: "1" },
  { label: "省内转校", value: "2" },
  { label: "省外转校", value: "3" },
];
const onTransferConfirm = (value: any) => {
  formData.acceptStudentType = value.value;
  showTransferPicker.value = false;
};
const onSubmit = () => {
  confirmShow.value = true;
};
const confirm = () => {
  _schStudentAcceptinfoSave(formData).then((res) => {
    console.log(res);
    router.push({
      path: "/preSuccess",
      query: {
        phone: leaderPhone.value,
        schName: formData.schName,
      },
    });
  });
};
onMounted(() => {
  getSchInfo();
  getSchSchoolPackageDetail();
});

const getSchInfo = () => {
  _getCompanyDetail(schoolId as string).then((res) => {
    formData.schName = res?.basicInfo?.name;
    leaderPhone.value = res?.basicInfo?.leaderPhone;
  });
};

// 获取班级
const getSchSchoolPackageDetail = () => {
  _getSchSchoolPackageDetail({ id: packid }).then((res) => {
    formData.traintype = res?.traintype;
    formData.package_name = res?.packlabel;
  });
};
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="formData.schName"
        name="驾校名称"
        label="驾校名称"
        placeholder="驾校名称"
        disabled
        input-align="right"
        error-message-align="right"
        :rules="[{ required: true, message: '请填写驾校名称' }]"
      />
      <van-field
        v-model="formData.traintype"
        name="课程类型"
        label="课程类型"
        placeholder="课程类型"
        disabled
        input-align="right"
        error-message-align="right"
        :rules="[{ required: true, message: '请填写课程类型' }]"
      />
      <van-field
        v-model="formData.package_name"
        name="班级类型"
        label="班级类型"
        placeholder="班级类型"
        disabled
        input-align="right"
        error-message-align="right"
        :rules="[{ required: true, message: '请填写班级类型' }]"
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-field
        v-model="formData.name"
        name="学员姓名"
        label="学员姓名"
        placeholder="学员姓名"
        input-align="right"
        error-message-align="right"
        required
        :rules="[
          { required: true, message: '请填写学员姓名' },
          rules.studentName,
        ]"
      />
      <van-field
        v-model="formData.phone"
        name="手机号码"
        label="手机号码"
        placeholder="手机号码"
        disabled
        input-align="right"
        error-message-align="right"
        :rules="[{ required: true, message: '请填写手机号码' }, rules.mobile]"
      />
      <van-field
        v-model="formData.idcard"
        name="身份证号"
        label="身份证号"
        placeholder="身份证号"
        input-align="right"
        error-message-align="right"
        required
        :rules="[{ required: true, message: '请填写身份证号' }, rules.idCard]"
      />
    </van-cell-group>

    <van-cell-group inset class="transfer">
      <van-field
        v-model="formData.acceptStudentType"
        name="是否为转校生"
        label="是否为转校生"
        placeholder="是否为转校生"
        input-align="right"
        error-message-align="right"
        required
        is-link
        readonly
        @click="showTransferPicker = true"
        :rules="[{ required: true, message: '请选择是否为转校生' }]"
      >
        <template #input>
          {{ dicConversion(formData.acceptStudentType, studentType) }}
        </template>
      </van-field>
      <van-popup v-model:show="showTransferPicker" position="bottom">
        <van-picker
          :columns="studentType"
          @confirm="onTransferConfirm"
          @cancel="showTransferPicker = false"
          :columns-field-names="{ text: 'label' }"
        />
      </van-popup>
    </van-cell-group>
    <div class="note">
      <h2>备注</h2>
      <van-field
        v-model="formData.note"
        rows="3"
        autosize
        type="textarea"
        maxlength="200"
        placeholder="（选填）填一下您想说的话吧～"
        show-word-limit
        :rules="[rules.anyChar({ max: 200 })]"
      />
    </div>
    <div class="submit">
      <van-button round block> 返回 </van-button>
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

  <v-dialog
    v-model:show="confirmShow"
    title="是否提交报名？"
    show-cancel-button
    cancel-button-text="返回"
    confirm-button-text="确定提交"
    @confirm="confirm"
    class="confirm-dialog"
  >
    <van-field
      label="姓名："
      :model-value="formData.name"
      readonly
      :border="false"
    />
    <van-field
      label="手机号码："
      :model-value="formData.phone"
      readonly
      :border="false"
    />
    <van-field
      label="身份证号："
      :model-value="formData.idcard"
      readonly
      :border="false"
    />
    <van-field
      label="是否转校："
      :model-value="dicConversion(formData.acceptStudentType, studentType)"
      readonly
      :border="false"
    />
    <van-field
      label="驾校名称："
      :model-value="formData.schName"
      readonly
      :border="false"
    />
    <van-field
      label="课程类型："
      :model-value="formData.traintype"
      readonly
      :border="false"
    />
    <van-field
      label="班级类型："
      :model-value="formData.package_name"
      readonly
      :border="false"
    />
    <van-field
      label="备注："
      :model-value="formData.note"
      readonly
      :border="false"
    />
  </v-dialog>
</template>
<style scoped lang="scss">
.van-cell-group {
  margin-top: 12px;
}
.transfer {
  margin-top: 24px;
  :deep(.van-field__label) {
    width: 120px;
  }
}
.note {
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 19px;
    margin-top: 28px;
    margin-left: 24px;
  }
  .van-field {
    width: 343px;
    margin: 12px auto 0;
    border-radius: 10px;
  }
}
.submit {
  padding: 0 20px;
  margin: 28px 0;
  display: flex;
  justify-content: space-between;
  .van-button {
    &:nth-of-type(1) {
      margin-right: 15px;
      background: transparent;
    }
  }
}
</style>
<style lang="scss">
.confirm-dialog {
  .van-field__label {
    font-size: 14px;
    color: #999999;
    width: 70px;
  }
}
</style>
