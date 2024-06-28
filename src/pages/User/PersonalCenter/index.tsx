import React from 'react';
import {Avatar, Button, Card, Col, Flex, Layout, Row, Space, Typography} from 'antd';
import {history, useModel} from 'umi';

const {Content} = Layout;
const {Title, Text} = Typography;

const PersonalCenter: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const handleSettingsClick = () => {
    history.push('/user/settings');
  };
  return (
    <Flex justify={"center"}>
      <Space direction="vertical" size={16}>
        <Card style={{width: 708, height: 208}}>
          <Content style={{padding: '24px', minHeight: 280}}>
            <Row gutter={16} justify="space-between">
              <Col span={32}>
                {/* 用户头像及基本信息 */}
                <Space size="large">
                  <Avatar size={96} src={initialState.currentUser.avatar}/>
                  <div>
                    <Title level={4}>{initialState.currentUser.nickname}</Title>
                    <Text>{initialState.currentUser.signature}</Text>
                  </div>
                </Space>
              </Col>
              <Col span={32}>
                {/* 用户统计数据展示 */}
                <Space direction="vertical" size="middle" style={{width: '100%'}}>
                  <Space>
                    <Text strong>关注</Text>
                    <Text type="secondary">1234</Text>
                  </Space>
                  <Space>
                    <Text strong>粉丝</Text>
                    <Text type="secondary">5678</Text>
                  </Space>
                  <Space>
                    <Text strong>获赞</Text>
                    <Text type="secondary">91011</Text>
                  </Space>
                </Space>
              </Col>
            </Row>
            <Row justify={"end"}>
              <Button type="primary" ghost style={{width: 118, height: 34}} onClick={handleSettingsClick}>
                设置
              </Button>
            </Row>
          </Content>
        </Card>
      </Space>
    </Flex>
  );
}

export default PersonalCenter;
