<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">创建应用</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="appName" label="应用名称">
        <a-input v-model="form.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input v-model="form.appDesc" placeholder="请输入应用描述" />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标">
        <a-input v-model="form.appIcon" placeholder="请输入应用图标" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          placeholder="请选择应用类型"
          :style="{ width: '320px' }"
          allow-clear
        >
          <a-option
            v-for="(value, key) of APP_TYPE_MAP"
            :key="key"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item field="appType" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          placeholder="请选择评分策略"
          :style="{ width: '320px' }"
          allow-clear
        >
          <a-option
            v-for="(value, key) of APP_SCORING_STRATEGY_MAP"
            :key="key"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
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
  editAppUsingPost,
  getAppVoByIdUsingGet,
  updateAppUsingPost,
} from "@/api/appController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

// 获取路由传递的参数id
interface Props {
  id: string;
}

// 定义props
const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return "";
  },
});
// 路由跳转
const router = useRouter();

// 创建表单
const form = ref({
  appName: "",
  appDesc: "",
  appIcon: "",
  appType: 0,
  scoringStrategy: 0,
} as API.AppAddRequest);
/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.id) {
    return;
  }
  // 发送请求获取数据
  const res = await getAppVoByIdUsingGet({
    id: props.id as any,
  });
  // 判断数据是否正常
  if (res.data.code === 0 && res.data.data) {
    // 赋值
    form.value = res.data.data;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};
/**
 * 监听
 */
watchEffect(() => {
  // 当loadData函数中的数据发生变化时，会自动执行这个函数
  loadData();
});

// 创建应用函数
const handleSubmit = async () => {
  // 将res提取出来
  let res: any;
  // 判断是修改还是创建
  if (props.id) {
    // 调用修改接口
    res = await editAppUsingPost({
      id: props.id as any,
      ...form.value,
    });
  } else {
    // 调用创建接口
    res = await addAppUsingPost(form.value);
  }
  // 判断创建是否成功
  if (res.data.code === 0) {
    message.success("操作成功, 即将跳转到应用详情页");
    setTimeout(() => {
      // 判断是修改还是新增
      router.push(`/app/detail/${props.id ?? res.data.data}`);
    }, 3000);
  } else {
    message.error("操作失败," + res.data.message);
  }
};
</script>
