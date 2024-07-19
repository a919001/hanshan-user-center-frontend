import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '寒山出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'github',
          title: <><GithubOutlined /> 寒山 GitHub </>,
          href: 'https://github.com/a919001',
          blankTarget: true,
        },
        {
          key: 'hanshan',
          title: '苏ICP备2024116155号',
          href: 'https://beian.miit.gov.cn',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
