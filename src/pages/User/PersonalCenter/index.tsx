import React from 'react';
import {Avatar, Card, Col, Flex, Layout, Row, Space, Typography} from 'antd';

const {Content} = Layout;
const {Title, Text} = Typography;

const PersonalCenter: React.FC = () => {
  return (
    <Flex justify={"center"}>
      <Space direction="vertical" size={16}>
        <Card style={{ width: 708 }}>
          <Content style={{ padding: '24px', minHeight: 280 }}>
            <Row gutter={16} justify="space-between"> {/* 已经正确设置justify为space-between */}
              <Col span={8}>
                {/* 用户头像及基本信息 */}
                <Space size="large">
                  <Avatar size={96} src="https://juejin.cn/your-avatar-url"/>
                  <div>
                    <Title level={4}>用户名</Title>
                    <Text>简介信息</Text>
                  </div>
                </Space>
              </Col>
              <Col span={32}>
                {/* 用户统计数据展示 */}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                  {/* 可以继续添加其他统计项 */}
                </Space>
              </Col>
            </Row>
          </Content>
        </Card>
      </Space>
    </Flex>
  );
}

export default PersonalCenter;
