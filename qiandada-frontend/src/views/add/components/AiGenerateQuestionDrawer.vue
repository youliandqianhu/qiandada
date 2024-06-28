<template>
  <a-button type="outline" @click="handleClick">AI 生成题目</a-button>
  <a-drawer
    :width="340"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>AI 生成题目</template>
    <div>
      <a-form
        :model="form"
        label-align="left"
        auto-label-width
        @submit="handleSubmit"
      >
        <a-form-item label="应用 id">{{ props.appId }}</a-form-item>
        <a-form-item field="questionNumber" label="题目数量">
          <a-input-number
            min="0"
            max="20"
            v-model="form.questionNumber"
            placeholder="请输入题目数量"
          />
        </a-form-item>
        <a-form-item field="optionNumber" label="选项数量">
          <a-input-number
            min="0"
            max="6"
            v-model="form.optionNumber"
            placeholder="请输入选项数量"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="submitting"
            type="primary"
            html-type="submit"
            style="width: 120px"
          >
            {{ submitting ? "生成中..." : "一键生成" }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
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
import AiGenerateQuestionDrawer from "@/views/add/components/AiGenerateQuestionDrawer.vue";
import { aiGenerateQuestionUsingPost } from "@/api/questionController";

// 获取路由传递的参数id
interface Props {
  appId: string;
  onSuccess?: (result: API.QuestionContentDTO[]) => void;
}

// 定义props
const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});
// 路由跳转
const router = useRouter();

// 创建表单
const form = reactive({
  optionNumber: 2,
  questionNumber: 10,
} as API.AiGenerateQuestionRequest);

const visible = ref(false);
const submitting = ref(false);

const handleClick = () => {
  visible.value = true;
};

const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};

// 创建应用函数
const handleSubmit = async () => {
  // 判断参数是否存在
  if (!props.appId) {
    return;
  }
  // 显示加载中
  submitting.value = true;
  // 调用获取Ai接口
  const res = await aiGenerateQuestionUsingPost({
    appId: props.appId as any,
    ...form,
  });
  if (res.data.code === 0 && res.data.data.length > 0) {
    if (props.onSuccess) {
      props.onSuccess(res.data.data);
    } else {
      message.success("AI生成题目成功");
    }
    // 关闭抽屉
    handleCancel();
  } else {
    message.error("AI生成题目失败" + res.data.message);
  }
  // 结束加载中
  submitting.value = false;
};
</script>
