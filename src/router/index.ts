import { createRouter, createWebHistory } from "vue-router";
import HomeView from "~/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 海口培训
    {
      path: "/",
      name: "entry",
      component: () => import("../views/EntryViews/index.vue"),
    },
    // 登录页面
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView/index.vue"),
    },
    // 报名记录
    {
      path: "/regisRecord",
      name: "regisRecord",
      component: () => import("../views/regisRecord/index.vue"),
      meta: {
        navTitle: "报名记录",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    // 报名记录-等待驾校审核
    {
      path: "/regisAudit",
      name: "regisAudit",
      component: () => import("../views/regisAudit/index.vue"),
      meta: {
        navTitle: "报名记录",
        navColorType: 2,
        navBorderColor: "rgba(255,255,255,0.1)",
      },
    },
    // 报名记录-填写报名信息
    {
      path: "/regisFillInfo",
      name: "regisFillInfo",
      component: () => import("../views/regisFillInfo/index.vue"),
      meta: {
        navTitle: "报名记录",
        navColorType: 2,
        navBorderColor: "rgba(255,255,255,0.1)",
      },
    },
    // 签合同
    {
      path: "/contract",
      name: "contract",
      component: () => import("../views/contract/index.vue"),
    },
    // 报名缴费
    {
      path: "/regisPay",
      name: "regisPay",
      component: () => import("../views/regisPay/index.vue"),
      meta: {
        navTitle: "报名缴费",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    // 驾校报名
    {
      path: "/schSignup",
      name: "schSignup",
      component: () => import("../views/schSignup/index.vue"),
      meta: {
        navTitle: "驾校报名",
      },
    },
    // 驾校详情
    {
      path: "/schDetail",
      name: "schDetail",
      component: () => import("../views/schDetail/index.vue"),
      meta: {
        navTitle: "驾校详情",
      },
    },
    // 班型列表
    {
      path: "/classList",
      name: "classList",
      component: () => import("../views/schDetail/classList.vue"),
      meta: {
        navTitle: "班型",
      },
    },
    // 教练列表
    {
      path: "/coachList",
      name: "coachList",
      component: () => import("../views/schDetail/coachList.vue"),
      meta: {
        navTitle: "教练",
      },
    },
    // 区域列表
    {
      path: "/reginList",
      name: "reginList",
      component: () => import("../views/schDetail/reginList.vue"),
      meta: {
        navTitle: "场地",
      },
    },
    // 预报名信息
    {
      path: "/preSignUp",
      name: "preSignUp",
      component: () => import("../views/preSignUp/index.vue"),
      meta: {
        navTitle: "预报名信息",
      },
    },
    // 预报名提交成功
    {
      path: "/preSuccess",
      name: "preSuccess",
      component: () => import("../views/preSignUp/preSuccess.vue"),
      meta: {
        navTitle: "报名成功",
      },
    },
    // 缴费记录
    {
      path: "/payRecord",
      name: "payRecord",
      component: () => import("../views/payRecord/index.vue"),
      meta: {
        navTitle: "缴费记录",
        navColorType: 2,
        navBorderColor: "rgba(255,255,255,0.1)",
      },
    },
    // 订单详情
    {
      path: "/orderDetail",
      name: "orderDetail",
      component: () => import("../views/payRecord/orderDetail.vue"),
      meta: {
        navTitle: "订单详情",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    // 结算记录
    {
      path: "/settlementRecord",
      name: "settlementRecord",
      component: () => import("../views/settlementRecord/index.vue"),
      meta: {
        navTitle: "结算记录",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    {
      path: "/settlementRecordDetail",
      name: "settlementRecordDetail",
      component: () => import("../views/settlementRecord/detail.vue"),
      meta: {
        navTitle: "结算记录",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    {
      path: "/appraise",
      name: "appraise",
      component: () => import("../views/appraise/index.vue"),
      meta: {
        navTitle: "学车评价",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    {
      path: "/schAppraise",
      name: "schAppraise",
      component: () => import("../views/appraise/schAppraise.vue"),
      meta: {
        navTitle: "驾校评价",
        navBorderColor: "rgba(0,0,0,0.1)",
      },
    },
    {
      path: "/stageAppraise/:id",
      name: "stageAppraise",
      component: () => import("../views/appraise/stageAppraise.vue"),
    },
    {
      path: "/pdfViewer",
      name: "pdfViewer",
      component: () => import("../views/pdfViewer/index.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth");
  const whitelist = ["/", "/login", "/schDetail"];
  // console.log(to.path);
  // console.log(to.fullPath);
  if (whitelist.includes(to.path)) {
    next();
  } else if (!token) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
export default router;
