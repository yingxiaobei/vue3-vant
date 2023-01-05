<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomFieldValue } from "@vant/use";
import { base64toFile } from "@/utils";
import { _uploadFile } from "@/api";
import TakePhoto from "@/components/TakePhoto.vue";
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultVal: {
    type: String,
  },
  callback: {
    type: Function,
    default: () => {},
  },
});
const photoData = ref("");
const visible = ref(false);

watch(
  () => props.defaultVal,
  (val) => {
    photoData.value = val || "";
  },
  {
    immediate: true,
  }
);

const onChange = (val: any) => {
  const file = base64toFile(val);
  const formData = new FormData();
  formData.append("file", file);
  _uploadFile(formData).then((res) => {
    props.callback(res);
  });
};

const view = () => {
  if (props.disabled) {
    return;
  }
  visible.value = true;
};

// 此处传入的值会替代 Field 组件内部的 value
// useCustomFieldValue(() => photoData.value);
</script>
<template>
  <div class="box">
    <img
      v-if="!photoData"
      src="@/assets/images/no-photo.png"
      @click="view"
      alt=""
    />
    <img v-else :src="photoData" alt="" />
    <div>
      <p>（点击旁边虚线框图片进行采集）</p>
      <div>
        <van-button
          v-if="photoData"
          plain
          type="primary"
          @click="view"
          round
          color="#5796EB"
          :disabled="disabled"
          >重新采集</van-button
        >
      </div>
    </div>
  </div>
  <TakePhoto
    v-if="visible"
    :onChange="onChange"
    @update:visible="visible = $event"
    :visible="visible"
  />
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  & > div {
    margin-left: 17px;
    display: flex;
    flex-direction: column-reverse;
    p {
      font-size: 12px;
      color: #f54040;
      line-height: 18px;
      margin-top: 12px;
    }
  }
}
img {
  width: 100px;
  height: 100px;
}
</style>
