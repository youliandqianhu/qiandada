<template>
  <div id="homePage">
    <div class="searchBar">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="快速发现答题应用"
        button-text="搜索"
        search-button
        size="large"
      />
    </div>
    <a-list
      :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      class="list-demo-action-layout"
      :bordered="false"
      :data="dataList"
      :pagination-props="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #item="{ item }">
        <a-list-item class="list-demo-item" action-layout="vertical">
          <AppCard :app="item">item</AppCard>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import AppCard from "@/components/AppCard.vue";
import { ref, watchEffect } from "vue";
import API from "@/api";
import { REVIEW_STATUS_ENUM } from "@/constant/app";
import message from "@arco-design/web-vue/es/message";
import { listAppVoByPageUsingPost } from "@/api/appController";

// 初始化搜索条件(避免搜索条件不断递加,需要自己手动清除很麻烦)
const initSearchParams = {
  current: 1,
  pageSize: 12,
};
// 真正用于搜索的变量
const searchParams = ref<API.UserQueryRequest>({
  // 以解构形式编写是为了initSearchParams不被修改
  ...initSearchParams,
});
// 存储查询到的数据
const dataList = ref<API.AppVO[]>([]);
// 总条数
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const params = {
    reviewStatus: REVIEW_STATUS_ENUM.PASS,
    ...searchParams.value,
  };
  // 发送请求获取数据
  const res = await listAppVoByPageUsingPost(params);
  // 判断数据是否正常
  if (res.data.code === 0) {
    // 赋值
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

// 分页查询函数
const onPageChange = async (page: number) => {
  // 不知道是否必须要这么写，不然会无法触发下面watchEffect函数
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
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
#homePage {
}

.searchBar {
  margin-bottom: 28px;
  text-align: center;
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  overflow: hidden;
  border-radius: 2px;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0 !important;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>
