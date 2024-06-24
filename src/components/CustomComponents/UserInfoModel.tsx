import React from 'react';
import {Modal} from 'antd';

const UserInfoModel = ({record, visible, onCancel }) => {
  // 添加对record是否为null的检查
  if (!record) {
    return null;
  }

  // 这里可以根据record展示用户详情
  return (
    <Modal
      title={`用户信息 - ${record.nickname}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <p><strong>id：</strong>{record.id}</p>
      <p><strong>用户名：</strong>{record.username}</p>
      <p><strong>头像：</strong>{record.avatar}</p>
      <p><strong>昵称：</strong>{record.nickname}</p>
      <p><strong>性别：</strong>{record.gender}</p>
      <p><strong>生日：</strong>{record.birthday}</p>
      <p><strong>地区：</strong>{record.region}</p>
      <p><strong>个性签名：</strong>{record.signature}</p>
      <p><strong>手机：</strong>{record.phone}</p>
      <p><strong>邮箱：</strong>{record.email}</p>
      <p><strong>用户状态：</strong>{record.userStatus}</p>
      <p><strong>用户权限：</strong>{record.userRole}</p>
      <p><strong>创建时间：</strong>{record.createTime}</p>
      <p><strong>更新时间：</strong>{record.updateTime}</p>
      {/* 其他字段根据需要添加 */}
    </Modal>
  );

};

export default UserInfoModel;
