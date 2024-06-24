import React from 'react';
import { Modal, Button } from 'antd';

const UserInfoModel = ({ record, visible, onClose }) => {
  return (
    <Modal
      title="查看记录详情"
      visible={visible}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      onCancel={onClose}
    >
      {/* 根据record展示具体内容，这里以URL为例 */}
      <p>URL: {record?.url}</p>
      {/* 可以根据需要添加更多展示内容 */}
    </Modal>
  );
};

export default UserInfoModel;
