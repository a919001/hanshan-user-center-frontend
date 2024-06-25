import React from 'react';
import {Avatar, Divider, Modal, Flex} from 'antd';
import dayjs from "dayjs";

const UserInfoModel = ({record, visible, onCancel}) => {
  // 添加对record是否为null的检查
  if (!record) {
    return null;
  }

  // 这里可以根据record展示用户详情
  return (
    <Modal
      title={`用户信息 - ${record.username}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{
        textAlign: "center",
      }}
    >
      <Divider/>
      <div>
        <Flex align={"center"} justify={"space-between"}>
          <strong>头像</strong>
          <Avatar src={record.avatar} shape="square" size={64}/>
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>昵称</strong>
          {record.nickname}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>性别</strong>
          {record.gender === 0 ? "男" : "女"}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>生日</strong>
          {record.birthday}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>地区</strong>
          {record.region}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>个性签名</strong>
          {record.signature}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>邮箱</strong>
          {record.email}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>创建时间</strong>
          {dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Flex>
        <Divider/>
        <Flex align={"center"} justify={"space-between"}>
          <strong>更新时间</strong>
          {dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Flex>
        <Divider/>
      </div>
    </Modal>
  );
};

export default UserInfoModel;
