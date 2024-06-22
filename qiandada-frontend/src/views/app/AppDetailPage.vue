<template>
  <div id="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col flex="auto" class="content-wrapper">
          <h2>{{ data.appName }}</h2>
          <p>{{ data.appDesc }}</p>
          <p>应用类型:{{ APP_TYPE_MAP[data.appType] }}</p>
          <p>评分策略:{{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy] }}</p>
          <p>
            <a-space>
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="data.user?.userAvatar"
                  :style="{ marginRight: '8px' }"
                />
                <a-typography-text
                  >{{ data.user?.userName ?? "无名" }}
                </a-typography-text>
              </div>
            </a-space>
          </p>
          <p>
            创建时间: {{ dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </p>
          <a-space>
            <a-button type="primary">开始答题</a-button>
            <a-button>分享应用</a-button>
            <a-button v-if="isMy" :href="`/add/app/${data.id}`"
              >修改应用
            </a-button>
            <a-button v-if="isMy" :href="`/add/question/${data.id}`"
              >创建题目
            </a-button>
            <a-button v-if="isMy" :href="`/add/scoring_result/${data.id}`"
              >创建评分
            </a-button>
          </a-space>
        </a-col>
        <a-col flex="400px">
          <a-image width="100%" :src="data.appIcon" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, watchEffect, computed } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { getAppVoByIdUsingGet } from "@/api/appController";
import { useRouter } from "vue-router";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import { useLoginUserStore } from "@/store/userStore";
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

const router = useRouter();

// 存储查询到的数据
const data = ref<API.AppVO>({});

/**
 * 根据用户权限判断用户是否拥有设置题目、评分和修改应用的权限
 */
const loginUserId = useLoginUserStore().loginUser.id;
const isMy = computed(() => {
  return loginUserId && data.value.userId === loginUserId;
});

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
    data.value = res.data.data;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

/**
 * 监听searchParams变量,改变时触发数据的重新加载
 */
watchEffect(() => {
  // 当loadData函数中的数据发生变化时，会自动执行这个函数
  loadData();
});
</script>
<style scoped>
#appDetailPage {
}

#appDetailPage .content-wrapper > * {
  margin-bottom: 16px;
}
</style>
