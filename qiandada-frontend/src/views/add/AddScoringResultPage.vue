<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">设置评分</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用 id">
        {{ appId }}
      </a-form-item>
      <a-form-item label="修改评分 id" v-if="updateId">
        {{ updateId }}
      </a-form-item>
      <a-form-item field="resultName" label="结果名称">
        <a-input v-model="form.resultName" placeholder="请输入结果名称" />
      </a-form-item>
      <a-form-item field="resultDesc" label="结果描述">
        <a-input v-model="form.resultDesc" placeholder="请输入结果描述" />
      </a-form-item>
      <a-form-item field="resultPicture" label="结果图标">
        <a-input v-model="form.resultPicture" placeholder="请输入结果图标" />
      </a-form-item>
      <a-form-item field="resultProp" label="结果集">
        <a-input-tag
          v-model="form.resultProp"
          :style="{ width: '320px' }"
          placeholder="请输出结果集，按回车确认"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="resultScoreRange" label="结果得分范围">
        <a-input-number
          v-model="form.resultScoreRange"
          placeholder="请输入结果得分范围"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          提交
        </a-button>
      </a-form-item>
    </a-form>
    <h2 style="margin-bottom: 16px">评分管理</h2>
    <ScoringResultTable :appId="appId" :doUpdate="doUpdate" ref="tableRef" />
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, watchEffect, ref, reactive } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import {
  addScoringResultUsingPost,
  editScoringResultUsingPost,
  getScoringResultVoByIdUsingGet,
  updateScoringResultUsingPost,
} from "@/api/scoringResultController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import ScoringResultTable from "@/views/add/components/ScoringResultTable.vue";
import ScoringResultVO = API.ScoringResultVO;

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
// 获取到子组件的实例
const tableRef = ref();

// 创建表单
const form = ref({
  resultDesc: "",
  resultName: "",
  resultPicture: "",
} as API.ScoringResultAddRequest);

// 获取修改评分的id
const updateId = ref<number>();
// 修改评分的回显
const doUpdate = (scoringResult: ScoringResultVO) => {
  updateId.value = scoringResult.id;
  form.value = scoringResult;
};

// 创建应用函数
const handleSubmit = async () => {
  let res: any;
  // 判断参数是否正常
  if (!props.appId) {
    return;
  }
  // 判断是修改还是创建
  if (updateId.value) {
    // 调用修改接口
    res = await editScoringResultUsingPost({
      id: updateId.value as any,
      ...form.value,
    });
  } else {
    // 调用创建接口
    res = await addScoringResultUsingPost({
      appId: props.appId as any,
      ...form.value,
    });
  }
  // 判断创建是否成功
  if (res.data.code === 0) {
    message.success("操作成功");
  } else {
    message.error("操作失败," + res.data.message);
  }
  if (tableRef.value) {
    tableRef.value.loadData();
    updateId.value = undefined;
  }
};
</script>
