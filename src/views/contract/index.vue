<script setup lang="ts">
import PdfViewer from "@/components/PdfViewer.vue";
import Header from "@/components/Header.vue";
import Signature from "./signature.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  _getSchContractTemp,
  _stuSigncontractPreviewDoing,
  _submitStuSignature,
  _stuSigncontractSave,
  _getPreviewContractFile,
} from "@/api/coreServices";
import { _uploadImg } from "@/api/index";

const router = useRouter();
const route = useRoute();
const sid = route.query.sid as string;
const schoolid = route.query.schoolid as string;
const tempParams = ref({});
const preUrl = ref("");
const beforeSubmitPdf = ref("");
const loading = ref(false);

const step = ref(0);
const navTitle = computed(() => {
  const m = new Map([
    [0, "合同预览"],
    [1, "签字"],
    [2, "确认合同"],
  ]);
  return m.get(step.value);
});
const back = () => {
  if (step.value > 0) {
    step.value--;
  } else {
    router.go(-1);
  }
};

const twoSignature = () => {
  loading.value = true;
  _stuSigncontractSave({ ...tempParams.value, sid, schoolid })
    .then((res) => {
      step.value = 1;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};
const signatureCallback = async (file: File) => {
  loading.value = true;
  const formData = new FormData();
  formData.append("file", file);
  const imgRes = await _uploadImg(formData, schoolid).catch(() => {
    loading.value = false;
  });

  _submitStuSignature({ sid, fileid: imgRes.id, schoolId: schoolid })
    .then((res) => {
      step.value = 2;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const getTempParams = () => {
  _getSchContractTemp(sid).then((res) => {
    tempParams.value = res || {};
    getTempPdf();
  });
};

const getObjectURL = (file: Blob) => {
  let url = null;
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    try {
      url = window.webkitURL.createObjectURL(file);
    } catch (err) {
      console.info(err);
    }
  } else if (window.URL !== undefined) {
    try {
      url = window.URL.createObjectURL(file);
    } catch (err) {
      console.info(err);
    }
  }
  return url;
};

const getPdfData = (file: File) => {
  const blob = new Blob([file], { type: "application/pdf;charset-UTF-8" });
  return getObjectURL(blob);
  // const reader = new FileReader();
  // reader.readAsDataURL(blob);
  // reader.onload = (evt: any) => {
  //   const fileData: string = evt.target.result;
  // };
};
const getTempPdf = () => {
  _stuSigncontractPreviewDoing({ ...tempParams.value, sid, schoolid }).then(
    (file: File) => {
      if (file) {
        preUrl.value = getPdfData(file);
        console.log(preUrl.value);
      }
    }
  );
};

watch(step, (val) => {
  if (val === 2) {
    // 签名后预览
    _getPreviewContractFile(sid).then((res) => {
      console.log(res);
      beforeSubmitPdf.value = res || "";
    });
  }
});

onMounted(() => {
  getTempParams();
});
const submit = () => {
  router.replace({
    path: "/regisFillInfo",
    query: {
      sid,
    },
  });
};
</script>
<template>
  <Header :navTitle="navTitle" navBorderColor="rgba(0,0,0,0.1)" :back="back" />
  <template v-if="step === 0">
    <PdfViewer v-if="preUrl" :url="preUrl" />
    <div class="bottom">
      <van-button
        type="primary"
        block
        round
        @click="twoSignature"
        :loading="loading"
        >去签字</van-button
      >
    </div>
  </template>
  <Signature
    v-if="step === 1"
    :callback="signatureCallback"
    :loading="loading"
  />
  <template v-if="step === 2">
    <PdfViewer
      v-if="beforeSubmitPdf"
      :key="beforeSubmitPdf"
      :url="beforeSubmitPdf"
    />
    <div class="bottom">
      <van-button block round @click="step = 1" class="mr-[9px]"
        >重新签字</van-button
      >
      <van-button type="primary" block round @click="submit"
        >确认提交</van-button
      >
    </div>
  </template>
</template>

<style lang="scss" scoped>
.bottom {
  width: 100%;
  height: 66px;
  position: fixed;
  bottom: 0;
  background: #fff;
  padding: 0 23px;
  display: flex;
  align-items: center;
}
</style>
