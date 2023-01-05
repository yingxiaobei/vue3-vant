<script setup lang="ts">
import { defineProps, computed } from "vue";
const props = defineProps({
  activeStep: {
    type: Number,
    default: 1,
  },
  // 类型，1线上、2线下
  type: {
    type: Number,
    default: 1,
  },
});

const steps = computed(() => {
  const arr = [
    { label: "预报名", step: 1 },
    { label: "填报名信息", step: 2 },
    { label: "签合同", step: 3 },
  ];
  if (props.type === 1) {
    arr.push({ label: "付学费", step: 4 });
  }
  return arr;
});
</script>

<template>
  <div class="steps">
    <div class="content" :class="type === 2 ? 'offline' : ''">
      <template v-for="item in steps" :key="item.step">
        <div class="item" :class="activeStep >= item.step ? 'active-item' : ''">
          <div class="number">{{ item.step }}</div>
          <div class="label">{{ item.label }}</div>
        </div>
        <div class="arrow" v-if="item.step !== steps[steps.length - 1].step">
          <template v-if="type === 1">
            <img
              v-if="activeStep >= item.step"
              src="@/assets/images/step_arrow_light.png"
              alt=""
            />
            <img v-else src="@/assets/images/step_arrow_dark.png" alt="" />
          </template>
          <!-- TODO -->
          <template v-if="type === 2">
            <img
              v-if="activeStep >= item.step"
              src="@/assets/images/step_arrow_light2.png"
              alt=""
            />
            <img v-else src="@/assets/images/step_arrow_dark2.png" alt="" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.steps {
  height: 157px;
  background: var(--nav-bg-color);
  overflow: hidden;
  .content {
    margin-top: 28px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    .item {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      .number {
        width: 45px;
        height: 45px;
        background: no-repeat url(@/assets/images/step_dark.png);
        background-size: cover;
        line-height: 45px;
        font-size: 20px;
        font-weight: 900;
        color: var(--nav-bg-color);
        line-height: 45px;
        margin-bottom: 8px;
      }
      .label {
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        line-height: 13px;
      }
    }

    .active-item {
      .number {
        background: no-repeat url(@/assets/images/step_light.png);
        background-size: cover;
      }
      .label {
        color: #ffffff;
      }
    }
    .arrow {
      height: 45px;
      display: flex;
      align-items: center;
      img {
        width: 33px;
        height: 5px;
      }
    }
  }
  .offline {
    .arrow {
      img {
        width: 80px;
        height: 5px;
      }
    }
  }
}
</style>
