<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">设置题目</h2>
    <a-form
      :model="questionContent"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用 id">{{ appId }}</a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <a-space>
          <a-button @click="addQuestion(questionContent.length)">
            底部添加题目
          </a-button>
          <AiGenerateQuestionDrawer
            :appId="appId"
            :onSuccess="onAiGenerateSuccess"
            :onSSESuccess="onAiGenerateSuccessSSE"
            :onSSEStart="onSSEStart"
            :onSSEClose="onSSEClose"
          />
        </a-space>

        <div v-for="(question, index) in questionContent" :key="index">
          <a-space size="large">
            <h3>题目{{ index + 1 }}</h3>
            <a-button size="small" @click="addQuestion(index + 1)">
              添加题目
            </a-button>
            <a-button
              size="small"
              status="danger"
              @click="deleteQuestion(index)"
            >
              删除题目
            </a-button>
          </a-space>
          <a-form-item :label="`题目 ${index + 1} 标题`">
            <a-input v-model="question.title" placeholder="请输入题目标题" />
          </a-form-item>
          <a-space>
            <h4>题目 {{ index + 1 }} 选项列表</h4>
            <a-button
              @click="addQuestionOption(question, question.options.length)"
            >
              底部添加题目
            </a-button>
          </a-space>
          <a-form-item
            :label="`选项${optionIndex + 1}`"
            :content-flex="false"
            :merge-props="false"
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
          >
            <a-form-item label="选项 key">
              <a-input v-model="option.key" placeholder="请输入选项 key" />
            </a-form-item>
            <a-form-item label="选项值">
              <a-input v-model="option.value" placeholder="请输入选项值" />
            </a-form-item>
            <a-form-item label="选项结果">
              <a-input v-model="option.result" placeholder="请输入选项值" />
            </a-form-item>
            <a-form-item label="选项得分">
              <a-input v-model="option.score" placeholder="请输入选项值" />
            </a-form-item>
            <a-space size="large">
              <a-button
                size="small"
                @click="addQuestionOption(question, optionIndex + 1)"
              >
                添加选项
              </a-button>
              <a-button
                size="small"
                status="danger"
                @click="deleteQuestionOption(question, optionIndex as any)"
              >
                删除选项
              </a-button>
            </a-space>
          </a-form-item>
        </div>
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
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import AiGenerateQuestionDrawer from "@/views/add/components/AiGenerateQuestionDrawer.vue";

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
// 题目内容结构(题目列表:QuestionContentDTO)
const questionContent = ref<API.QuestionContentDTO[]>([]);
// 老内容结构(旧题目列表数据:QuestionVO)
const oldQuestionContent = ref<API.QuestionVO>();
/**
 * 添加题目
 */
const addQuestion = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: "",
    options: [],
  });
};
/**
 * 删除题目
 */
const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};

/**
 * 添加题目选项列表
 */
const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 0, {
    key: "",
    value: "",
  });
};
/**
 * 删除题目选项列表
 */
const deleteQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 1);
};
/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.appId) {
    return;
  }
  // 发送请求获取数据,(这里用listQuestionVoByPageUsingPost是因为要获取最新的题目列表,为什么不用getQuestionVoByIdUsingGet是因为题目可能会修改，这个getQuestionVoByIdUsingGet不一定能获取到最新的)
  // 为什么会有什么最新不新的呢？直接修改之前旧的不就好了？
  // 这样的话，其他用户在改之前参与过这个题目答题，那就跟之后更新的题目答案对不上了，所以每次修改都会参生不同的应用id，以此让之前的用户还能看到他自己答题时答的是什么题目
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  // 判断数据是否正常
  if (res.data.code === 0 && res.data.data?.records) {
    // 赋值给旧题目列表
    oldQuestionContent.value = res.data.data?.records[0];
    // 判断旧题目列表数据是否正常
    if (oldQuestionContent.value) {
      questionContent.value = oldQuestionContent.value.questionContent ?? [];
    }
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
  // 判断题目是否正常
  if (!props.appId || !questionContent.value) {
    return;
  }
  // 将res提取出来
  let res: any;
  // 判断是修改还是创建
  if (oldQuestionContent.value?.id) {
    // 调用修改接口
    res = await editQuestionUsingPost({
      id: oldQuestionContent.value.id,
      questionContent: questionContent.value,
    });
  } else {
    // 调用创建接口
    res = await addQuestionUsingPost({
      appId: props.appId as any,
      questionContent: questionContent.value,
    });
  }
  // 判断创建是否成功
  if (res.data.code === 0) {
    message.success("操作成功, 即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("操作失败," + res.data.message);
  }
};

/**
 * AI 自动生成题目成功后执行
 * @param result
 */
const onAiGenerateSuccess = (result: API.QuestionContentDTO[]) => {
  message.success(`AI自动生成题目成功,生成${result.length} 道题目`);
  questionContent.value = [...questionContent.value, ...result];
};

/**
 * AI 自动生成题目成功后执行(SSE)
 */
const onAiGenerateSuccessSSE = (result: API.QuestionContentDTO) => {
  questionContent.value = [...questionContent.value, result];
};

/**
 * SSE 开始生成
 */
const onSSEStart = (event: any) => {
  message.success("开始生成");
};

/**
 * SSE 关闭连接
 */
const onSSEClose = (event: any) => {
  message.success("关闭连接");
};
</script>
