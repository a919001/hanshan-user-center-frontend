import {PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Dropdown, Image, Space, Tag} from 'antd';
import {useRef} from 'react';
import request from 'umi-request';
import {searchUsers} from "@/services/ant-design-pro/api";
import {record} from "@umijs/utils/compiled/zod";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    ellipsis: true,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    render: (_, record) => (
      <div>
        <Image src={record.avatar} width={75} />
      </div>
    )
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    ellipsis: true,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {text: '男'},
      1: {text: '女'}
    },
  },
  {
    title: '生日',
    dataIndex: 'birthday',
    valueType: "date",
    ellipsis: true,
  },
  {
    title: '地区',
    dataIndex: 'region',
    ellipsis: true,
  },
  {
    title: '个性签名',
    dataIndex: 'signature',
    ellipsis: true,
  },
  {
    title: '手机',
    dataIndex: 'phone',
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    valueType: 'select',
    valueEnum: {
      0: {text: '正常', status: 'Success'},
      1: {text: '禁用', status: 'Error'}
    },
  },
  {
    title: '用户权限',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {text: '普通用户', status: 'Default'},
      1: {text: '管理员', status: 'Success'}
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: "dateTime",
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: "dateTime",
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          {key: 'copy', name: '复制'},
          {key: 'delete', name: '删除'},
        ]}
      />,
    ],
  },
];


const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);
          const res = await searchUsers();
          return {
            data: res.data
          }
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: {fixed: 'right', disable: true},
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
export default UserManage;
