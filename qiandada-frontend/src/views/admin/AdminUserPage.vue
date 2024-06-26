<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    layout="inline"
    @submit="doSearch"
  >
    <a-form-item field="userName" label="用户名">
      <a-input
        :allow-clear="true"
        v-model="formSearchParams.userName"
        placeholder="请输入用户名"
      />
    </a-form-item>
    <a-form-item field="userProfile" label="用户简介">
      <a-input
        :allow-clear="true"
        v-model="formSearchParams.userProfile"
        placeholder="请输入用户简介"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width: 100px">
        查询
      </a-button>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      total: total,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
    }"
    @page-change="onPageChange"
  >
    <template #userAvatar="{ record }">
      <a-image width="64px" :src="record.userAvatar" />
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #option="{ record }">
      <a-space>
        <a-button status="danger" @click="doDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";

// 搜索条件（防止watchEffect监听事件，避免因为不断更改searchParams值而不断发请求）
const formSearchParams = ref<API.UserQueryRequest>({});
// 初始化搜索条件(避免搜索条件不断递加,需要自己手动清除很麻烦)
const initSearchParams = {
  current: 1,
  pageSize: 10,
};
// 真正用于搜索的变量
const searchParams = ref<API.UserQueryRequest>({
  // 以解构形式编写是为了initSearchParams不被修改
  ...initSearchParams,
});
// 存储查询到的数据
const dataList = ref<API.User[]>([]);
// 总条数
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  // 发送请求获取数据
  const res = await listUserByPageUsingPost(searchParams.value);
  // 判断数据是否正常
  if (res.data.code === 0) {
    // 赋值
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value,
  };
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
 * 删除操作
 */
const doDelete = async (record: API.User) => {
  const res = await deleteUserUsingPost({
    id: record.id,
  });
  // 判断是否删除成功
  if (res.data.code === 0) {
    // 重新加载数据
    loadData();
  } else {
    message.error("删除失败" + res.data.message);
  }
};

/**
 * 监听searchParams变量,改变时触发数据的重新加载
 */
watchEffect(() => {
  // 当loadData函数中的数据发生变化时，会自动执行这个函数
  loadData();
});

// 表格列表
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "用户头像",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
  },
  {
    title: "用户简介",
    dataIndex: "userProfile",
  },
  {
    title: "权限",
    dataIndex: "userRole",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "option",
  },
];
</script>
<style scoped></style>
