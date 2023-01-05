<template>
  <BgPic>
    <template #content>
      <div class="form">
        <van-space direction="vertical" fill :size="12">
          <van-row gutter="20">
            <van-col span="12">
              <div class="smallItem bigItem" @click="routeTo('/schSignup')">
                <img src="@/statics/entry/car_entry.png" class="smallIcon" />
                <span>驾校报名</span>
              </div>
            </van-col>

            <van-col span="12">
              <van-space direction="vertical" fill :size="12">
                <div class="smallItem" @click="routeTo('/regisRecord')">
                  <img src="@/statics/entry/log_entry.png" class="smallIcon" />
                  <span>报名记录</span>
                </div>
                <div @click="routeTo('/payRecord')" class="smallItem">
                  <img
                    src="@/statics/entry/expenses_entry.png"
                    class="smallIcon"
                  />
                  <span>缴费记录</span>
                </div>
              </van-space>
            </van-col>
          </van-row>
          <van-row gutter="20">
            <van-col span="12">
              <div @click="routeTo('/settlementRecord')" class="smallItem">
                <img src="@/statics/entry/order_entry.png" class="smallIcon" />
                <span>结算记录</span>
              </div>
            </van-col>
            <van-col span="12">
              <div @click="todo" class="smallItem">
                <img src="@/statics/entry/handsr_entry.png" class="smallIcon" />
                <span>培训信息</span>
              </div>
            </van-col>
          </van-row>
          <van-row gutter="20">
            <van-col span="12">
              <div class="smallItem" @click="routeTo('/appraise')">
                <img src="@/statics/entry/star_entry.png" class="smallIcon" />
                <span>学员评价</span>
              </div>
            </van-col>
          </van-row>
        </van-space>
      </div>
    </template>
  </BgPic>
</template>

<script lang="ts">
import BgPic from "@/components/BgPic.vue";
import { Toast } from "vant";
export default {
  name: "EntryViews",
  created() {},
  data() {
    return {
      username: "",
      sms: "",
    };
  },
  methods: {
    onSubmit() {},
    routeTo(route: string) {
      console.log(123);
      this.$router.push(route);
    },
    todo() {
      Toast("正在建设中");
    },
  },
};
</script>

<style scoped>
.content .form {
  background-color: #f5f5f5;
}
.form .bigItem {
  height: 140px;
}

.smallItem {
  width: 156px;
  height: 64px;
  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smallItem .smallIcon {
  height: 25px;
  width: 25px;
  margin-right: 9px;
}
</style>
