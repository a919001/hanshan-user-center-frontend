import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable, TableDropdown} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useRef, useState} from 'react';
import {Image, message, Modal} from 'antd';
import {deleteUser, searchUsers} from "@/services/ant-design-pro/api";
import UserInfoModel from "@/components/CustomComponents/UserInfoModel";

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

const UserManage: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.CurrentUser | null>(null);

  // 点击查看时打开Modal
  // @ts-ignore
  const handleView = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 关闭Modal
  const handleModalCancel = () => {
    setViewModalVisible(false);
    setCurrentRecord(null);
  };

  // 删除用户
  const handleDelete = async (id) => {
    // 弹出确认框询问用户是否确认删除
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这条记录吗？',
      async onOk() {
        // 发起删除请求到后端
        const res = await deleteUser(id);
        if (res.data) {
          message.success('删除成功！');
        } else {
          message.error('删除失败，请重试。');
        }
      },
      onCancel() {
        // 用户取消删除，不做任何操作
      },
    });
  };

  // @ts-ignore
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
          <Image src={record.avatar} width={75}/>
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
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: "dateTime",
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a href="#" onClick={() => handleView(record)} key="view">查看</a>,
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => {
            if (key === 'delete') {
              handleDelete(record.id).then(() => action?.reload())
            }
          }}
          menus={[
            {key: 'delete', name: '删除'},
          ]}
        />,
      ],
    },
  ];

  return (
    <>
      <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
        <ProTable<API.CurrentUser>
          columns={columns}
          search={false}
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
          // search={{
          //   labelWidth: 'auto',
          // }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          // @ts-ignore
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
        />
      </PageContainer>
      <UserInfoModel
        visible={viewModalVisible}
        record={currentRecord}
        onCancel={handleModalCancel}
      />
    </>
  );
};
export default UserManage;
