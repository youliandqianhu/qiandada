<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">创建应用</h2>
    <a-form
      :model="questionContent"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用 id">{{ appId }}</a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <!--        <a-space direction="vertical" fill>-->
        <!--          <a-form-item field="posts.post1" label="Post1">-->
        <!--            <a-input v-model="questionContent.userAccount" placeholder="请输入账号" />-->
        <!--          </a-form-item>-->
        <!--          <a-form-item field="posts.post2" label="Post2">-->
        <!--            <a-input v-model="questionContent.userAccount" placeholder="请输入账号" />-->
        <!--          </a-form-item>-->
        <!--        </a-space>-->
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, watchEffect, ref, reactive } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import {
  addAppUsingPost,
  getAppVoByIdUsingGet,
  updateAppUsingPost,
} from "@/api/appController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

// 获取路由传递的参数id
interface Props {
  appId: string;
}

// 定义props
const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});
// 路由跳转
const router = useRouter();
// 题目内容结构(题目列表)
const questionContent = reactive<API.QuestionContentDTO[]>([]);

/**
 * 添加题目
 */
const addQuestion = (index: number) => {
  questionContent.splice(index, 0, {
    title: "",
    options: [],
  });
};
/**
 * 删除题目
 */
const handleDelete = (index: number) => {
  questionContent.splice(index, 1);
};
// /**
//  * 加载数据
//  */
// const loadData = async () => {
//   if (!props.id) {
//     return;
//   }
//   // 发送请求获取数据
//   const res = await getAppVoByIdUsingGet({
//     id: props.id as any,
//   });
//   // 判断数据是否正常
//   if (res.data.code === 0 && res.data.data) {
//     // 赋值
//     form.value = res.data.data;
//   } else {
//     message.error("获取数据失败" + res.data.message);
//   }
// };
// /**
//  * 监听
//  */
// watchEffect(() => {
//   // 当loadData函数中的数据发生变化时，会自动执行这个函数
//   loadData();
// });

// 创建应用函数
const handleSubmit = async () => {
  // // 将res提取出来
  // let res: any;
  // // 判断是修改还是创建
  // if (props.id) {
  //   // 调用修改接口
  //   res = await updateAppUsingPost({
  //     id: props.id as any,
  //     ...form.value,
  //   });
  // } else {
  //   // 调用创建接口
  //   res = await addAppUsingPost(form.value);
  // }
  // // 判断创建是否成功
  // if (res.data.code === 0) {
  //   message.success("操作成功, 即将跳转到应用详情页");
  //   setTimeout(() => {
  //     // 判断是修改还是新增
  //     let appId;
  //     if (props.id) {
  //       appId = props.id;
  //     } else {
  //       appId = res.data.data;
  //     }
  //     console.log(appId);
  //     router.push(`/app/detail/${appId}`);
  //   }, 3000);
  // } else {
  //   message.error("操作失败," + res.data.message);
  // }
};
</script>
