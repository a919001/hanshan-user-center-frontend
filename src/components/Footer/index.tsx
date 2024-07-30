import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import {Image} from "antd";

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
          key: 'ICP备案',
          title: '苏ICP备2024116155号',
          href: 'https://beian.miit.gov.cn',
          blankTarget: true,
        },
        {
          key: '公安备案',
          title: <><Image alt={"备案图标"} src={"/备案图标.png"} width={16} preview={false}/> 贵公网安备52022202000280 </>,
          href: 'https://beian.mps.gov.cn/#/query/webSearch?code=52022202000280',
          rel: 'noreferrer',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
