<template>
  <div id="doAnswerPage">
    <a-card>
      <h1 style="margin-bottom: 32px">{{ app.appName }}</h1>
      <p>{{ app.appDesc }}</p>
      <h2>{{ currentQuestion?.title }}</h2>
      <a-radio-group
        direction="vertical"
        v-model="currentQuestionAnswer"
        :options="questionOptions"
        @change="doRadioChange"
      />
      <div style="margin-top: 24px">
        <a-space size="large">
          <a-button
            type="primary"
            circle
            v-if="current < questionContent.length"
            :disabled="!currentQuestionAnswer"
            @click="current += 1"
            >下一题
          </a-button>
          <a-button
            type="primary"
            circle
            v-if="current === questionContent.length"
            :disabled="!currentQuestionAnswer"
            @click="doSubmit"
            :loading="submitting"
            >{{ submitting ? "分析中..." : "一键生成" }}
          </a-button>
          <a-button
            type="primary"
            circle
            v-if="current > 1"
            @click="current -= 1"
            >上一题
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  withDefaults,
  defineProps,
  watchEffect,
  ref,
  reactive,
  computed,
  toRef,
} from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import {
  addAppUsingPost,
  getAppVoByIdUsingGet,
  updateAppUsingPost,
} from "@/api/appController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import { off } from "@arco-design/web-vue/es/_utils/dom";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  getQuestionVoByIdUsingGet,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import { addUserAnswerUsingPost } from "@/api/userAnswerController";

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
// 加载显示
const submitting = ref(false);
// 路由跳转
const router = useRouter();
// app应用
const app = ref<API.AppVO>({});
// 题目内容结构(题目列表:QuestionContentDTO)
const questionContent = ref<API.QuestionContentDTO[]>([]);
// 当前题目序号(从1开始)
const current = ref(1);
// 当前题目
const currentQuestion = ref<API.QuestionContentDTO>({});
// 当前题目选项
const questionOptions = computed(() => {
  // 判断当前题目是否存在,如果存在则遍历题目选项，否则返回空数组
  return currentQuestion.value?.options
    ? currentQuestion.value.options.map((option) => {
        return {
          label: `${option.key}.${option.value}`,
          value: option.key,
        };
      })
    : [];
});
// 当前题目答案
const currentQuestionAnswer = ref<string>();
// 当前题目回答列表
const answerList = reactive<string[]>([]);
/**
 * 加载数据
 */
const loadData = async () => {
  let res: any;
  if (!props.appId) {
    return;
  }
  // 获取app应用数据
  res = await getAppVoByIdUsingGet({
    id: props.appId as any,
  });
  // 判断数据是否正常
  if (res.data.code === 0 && res.data.data) {
    // 赋值给app应用
    app.value = res.data.data;
  } else {
    message.error("获取应用失败" + res.data.message);
  }
  // 发送请求获取数据,(这里用listQuestionVoByPageUsingPost是因为要获取最新的题目列表,为什么不用getQuestionVoByIdUsingGet是因为题目可能会修改，这个getQuestionVoByIdUsingGet不一定能获取到最新的)
  // 为什么会有什么最新不新的呢？直接修改之前旧的不就好了？
  // 这样的话，其他用户在改之前参与过这个题目答题，那就跟之后更新的题目答案对不上了，所以每次修改都会参生不同的应用id，以此让之前的用户还能看到他自己答题时答的是什么题目
  res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  // 判断数据是否正常
  if (res.data.code === 0 && res.data.data?.records) {
    // 赋值给题目列表
    questionContent.value = res.data.data?.records[0].questionContent;
  } else {
    message.error("获取题目失败" + res.data.message);
  }
};
/**
 * 设置当前答案到答案列表中
 */
const doRadioChange = (value: string) => {
  answerList[current.value - 1] = value;
};

/**
 * 监听
 */
watchEffect(() => {
  // 当loadData函数中的数据发生变化时，会自动执行这个函数
  loadData();
});

/**
 * 监听题目变更
 */
watchEffect(() => {
  currentQuestion.value = questionContent.value[current.value - 1];
  currentQuestionAnswer.value = answerList[current.value - 1];
});
// 创建应用函数
const doSubmit = async () => {
  // 判断appId和答案列表是否有值
  if (!props.appId || !answerList) {
    return;
  }
  // 显示加载中
  submitting.value = true;
  const res = await addUserAnswerUsingPost({
    appId: props.appId as any,
    choices: answerList,
  });
  // 判断响应是否成功
  if (res.data.code === 0 && res.data.data) {
    router.push(`/answer/result/${res.data.data}`);
  } else {
    message.error("提交答案失败," + res.data.message);
  }
  // 取消加载中
  submitting.value = false;
};
</script>
<style scoped>
#doAnswerPage {
  margin: 0px;
}
</style>
