<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClassTypeItem from "./classTypeItem.vue";
import SiteItem from "./siteItem.vue";
import CoachItem from "./coacItem.vue";
import { GPS } from "@/utils/gps";
import { useDic, useLocation } from "@/hooks";
import { _getCompanyDetail } from "@/api/schSignup";
import {
  _getCoachList,
  _getSchReginList,
  _getSchSchoolPackage,
} from "@/api/coreServices";
import { get } from "lodash";
const route = useRoute();
const router = useRouter();
const schoolId = route.query.id as string;

// 班级列表
const classList = ref([]);
const reginList = ref<{}>([]);
const coachList = ref<{}>([]);

const activeTab = ref("a");
const location = useLocation(true);
const detail: any = ref({});
const noSchImg = new URL(
  `../../assets/images/no-sch-photo.png`,
  import.meta.url
).href;
const schLocation = reactive<{ lon?: number; lat?: number }>({
  lon: undefined,
  lat: undefined,
});

function getfacilitiesUrl(name: string) {
  return new URL(`../../assets/images/schDetail/${name}.png`, import.meta.url)
    .href;
}
onMounted(() => {
  getCompanyDetail();
  getSchSchoolPackage();
  getSchReginList();
  getCoachList();
});
const getCompanyDetail = () => {
  if (schoolId) {
    _getCompanyDetail(schoolId as string).then((res) => {
      detail.value = res || {};
      if (detail.value?.basicInfo?.lat && detail.value?.basicInfo?.lon) {
        const { lat, lon } = GPS.gcj_encrypt(
          detail.value?.basicInfo?.lat,
          detail.value?.basicInfo?.lon
        );
        schLocation.lat = lat;
        schLocation.lon = lon;
      }
    });
  }
};

// 获取班级
const getSchSchoolPackage = () => {
  _getSchSchoolPackage({
    schoolid: schoolId,
    page: 1,
    limit: 3,
    isEnabled: 1,
    studentCd: 2,
    orderType: 2,
    isDisplay: 1,
  }).then((res) => {
    console.log(res);
    classList.value = res?.rows || [];
  });
};

// 获取场地
const getSchReginList = async () => {
  try {
    const reginListRes = await _getSchReginList<{}>({
      schoolId,
      page: 1,
      limit: 3,
    });
    reginList.value = get(reginListRes, ["rows"], []);
    console.log(reginListRes);
  } catch (e: any) {
    console.error(e.message);
  }
};
// 获取教练
const getCoachList = async () => {
  try {
    const coachListRes = await _getCoachList<{}>({
      schoolId,
      page: 1,
      limit: 3,
      type: 1,
    });
    coachList.value = get(coachListRes, ["rows"], []);
    console.log(reginList);
  } catch (e: any) {
    console.log(e.message);
  }
};

const viewMore = (path: string) => {
  router.push({
    path,
    query: {
      schoolId,
    },
  });
};
</script>

<template>
  <van-swipe>
    <van-swipe-item
      v-for="img in detail?.assistInfoVO?.promotionImg?.length
        ? detail?.assistInfoVO?.promotionImg
        : [{ url: noSchImg }]"
      ><img :src="img.url" alt=""
    /></van-swipe-item>
    <template #indicator="{ active, total }">
      <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
    </template>
  </van-swipe>

  <div class="sch-info mb-[28px]">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="flex items-center">
          {{ detail?.basicInfo?.name }}
          <!-- <img
            src="@/assets/images/dunpai.png"
            alt=""
            class="w-[14px] ml-[10px]"
          /> -->
        </h2>
        <div class="mt-[8px]">
          <!-- <van-tag
            color="rgba(23,191,130,0.08)"
            class="tag"
            text-color="#4D9960"
            >营业执照认证</van-tag
          >
          <van-tag
            color="rgba(23,191,130,0.08)"
            class="tag"
            text-color="#4D9960"
            >备案驾校</van-tag
          > -->
        </div>
      </div>
      <a :href="`tel:${detail?.basicInfo?.leaderPhone}`"
        ><img class="phone" src="@/assets/images/call.png" alt=""
      /></a>
    </div>
    <a
      class="address"
      :href="`//uri.amap.com/navigation?from=${location.lon},${
        location.lat
      },我的位置&to=${schLocation.lon},${schLocation.lat},${
        detail?.basicInfo?.name || '终点'
      }&mode=car&policy=1&src=mypage&coordinate=gaode`"
    >
      <img src="@/assets/images/map.png" alt="" />
      <p>{{ detail?.basicInfo?.address }}</p>
    </a>
  </div>

  <van-tabs v-model:active="activeTab" shrink>
    <van-tab title="班型" name="a">
      <div class="list">
        <template v-if="classList.length">
          <ClassTypeItem
            :schoolId="schoolId"
            :item="item"
            v-for="item in classList"
            :key="item.packid"
          />
          <div class="view-more" @click="viewMore('/classList')">
            查看更多<van-icon name="arrow" />
          </div>
        </template>

        <van-empty v-else description="暂无数据" />
      </div>
    </van-tab>
    <van-tab title="场地" name="b">
      <div class="list">
        <template v-if="reginList.length">
          <SiteItem
            :schoolId="schoolId"
            :item="regin"
            v-for="regin in reginList"
            :key="regin.rid"
          />
          <div class="view-more" @click="viewMore('/reginList')">
            查看更多<van-icon name="arrow" />
          </div>
        </template>
        <van-empty v-else description="暂无数据" />
      </div>
    </van-tab>
    <van-tab title="教练" name="c">
      <div class="list">
        <template v-if="coachList.length">
          <CoachItem
            :schoolId="schoolId"
            :item="coach"
            v-for="coach in coachList"
            :key="coach.cid"
          />
          <div class="view-more" @click="viewMore('/coachList')">
            查看更多<van-icon name="arrow" />
          </div>
        </template>
        <van-empty v-else description="暂无数据" />
      </div>
    </van-tab>
  </van-tabs>

  <div class="box mt-[16px]">
    <h2>驾校概况</h2>
    <ul class="flex flex-wrap text-center">
      <li>
        <img src="@/assets/images/schDetail/1.png" alt="" />
        <div class="name">教练</div>
        <div class="number">{{ detail?.basicInfo?.coachNumber }}名</div>
      </li>
      <li>
        <img src="@/assets/images/schDetail/1.png" alt="" />
        <div class="name">车辆</div>
        <div class="number">{{ detail?.basicInfo?.tracarNum }}辆</div>
      </li>
      <li>
        <img src="@/assets/images/schDetail/1.png" alt="" />
        <div class="name">场地</div>
        <div class="number">{{ detail?.basicInfo?.classroom }}㎡</div>
      </li>
    </ul>
  </div>

  <div class="box">
    <h2 style="margin-bottom: 0">配套设施</h2>
    <div class="flex flex-wrap text-center">
      <div
        v-for="item in [
          { img: 4, label: '食堂', field: 'canteen' },
          { img: 5, label: '免费wifi', field: 'freeNet' },
          { img: 6, label: '商店', field: 'shop' },
          { img: 7, label: '储物箱', field: 'locker' },
          { img: 8, label: '休息厅', field: 'restArea' },
          { img: 9, label: '网吧', field: 'internetBar' },
          { img: 10, label: '咖啡厅', field: 'internetBar' },
          { img: 11, label: '浴室', field: 'bathroom' },
        ]"
        class="facilities-item"
      >
        <img
          :src="
            getfacilitiesUrl(
              detail?.schFacilityDetailVO?.[item.field]
                ? `${item.img}`
                : `${item.img}_dis`
            )
          "
          alt=""
        />
        <p
          class="text-themeColor"
          :class="detail?.schFacilityDetailVO?.[item.field] ? '' : 'label_dis'"
        >
          {{ item.label }}
        </p>
      </div>
    </div>
  </div>

  <div class="box">
    <h2 class="sch-h2">驾校简介</h2>
    <div class="sch-p" v-bind:innerHTML="detail?.basicInfo?.desc"></div>
  </div>
</template>

<style scoped lang="scss">
.custom-indicator {
  position: absolute;
  right: 12px;
  bottom: 53px;
  width: 44px;
  height: 24px;
  background: #000000;
  border-radius: 28px;
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
}
.van-swipe {
  img {
    width: 100%;
    height: 280px;
  }
}
.sch-info {
  width: 100%;
  min-height: 160px;
  background: #ffffff;
  border-radius: 18px;
  opacity: 1;
  margin-top: -40px;
  padding: 20px 12px 26px;
  position: relative;
  h2 {
    font-size: 21px;
    font-weight: 600;
    color: #1a1a1a;
    height: 28px;
  }
}
.tag {
  padding: 6px !important;
  margin-right: 8px;
}
.phone {
  width: 36px;
  height: 36px;
}
.address {
  width: 351px;
  min-height: 70px;
  background: var(--bg-color);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 47px;
    height: 47px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    letter-spacing: 1px;
    margin-left: 12px;
  }
}
.van-tabs {
  :deep(.van-tab) {
    color: #999;
    font-size: 15px;
    font-weight: 400;
    &.van-tab--active {
      color: #1a1a1a;
      font-size: 21px;
      font-weight: 500;
    }
  }
  :deep(.van-tabs__line) {
    width: 17px;
    height: 6px;
    border-radius: 3px;
  }
  .list {
    width: 100%;
    overflow: hidden;
    border-radius: 18px;
    background: #fff;
    padding: 12px;
    margin-top: 16px;
    .view-more {
      width: 351px;
      height: 44px;
      background: var(--bg-color);
      border-radius: 10px;
      text-align: center;
      line-height: 44px;
    }
    .no-data {
      width: 115px;
      height: 158px;
      margin: 58px auto;
    }
  }
}

.box {
  width: 100%;
  overflow: hidden;
  background: #fff;
  margin-bottom: 16px;
  padding: 20px;
  border-radius: 18px;
  h2 {
    font-size: 19px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 24px;
    &.sch-h2 {
      margin-bottom: 16px;
    }
  }
  .sch-p {
    font-size: 14px;
    font-weight: 400;
    color: #666660;
    line-height: 23px;
    letter-spacing: 1px;
  }
  img {
    width: 41px;
    height: 41px;
    display: inline-block;
  }
  .name {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 15px;
    letter-spacing: 1px;
    margin: 8px 0 4px;
  }
  .number {
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    line-height: 13px;
    letter-spacing: 1px;
  }
  li {
    margin-right: 33px;
  }
  // 设施
  .facilities-item {
    width: calc((100% - 120px) / 5);
    text-align: center;
    margin-right: 30px;
    margin-top: 24px;
    &:nth-of-type(5) {
      margin-right: 0;
    }
    p {
      font-size: 12px;
      color: #1a1a1a;
      line-height: 15px;
      &.label_dis {
        color: #cccccc;
      }
    }
  }
}
</style>
