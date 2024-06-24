import {Footer} from '@/components';
import {getVerifyCode, register} from '@/services/ant-design-pro/api';
import {LockOutlined, MobileOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, Image, message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {Link} from "react-router-dom";

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});


const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Register: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.RegisterParams) => {
    // 密码校验
    const {password, checkPassword} = values;
    if (password !== checkPassword) {
      message.error('两次输入密码不一致');
      return;
    }
    try {
      // 注册
      const res = await register(values);
      if (res.message === 'ok') {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      console.log(res);
      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType} = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<Image alt="logo" src="/logo.svg"/>}
          title="与山寒"
          subTitle={'因寄所托，放浪形骸'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '新用户注册',
              }
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content="验证码错误"/>
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 6,
                    type: "string",
                    message: '长度不能小于6',
                  },
                  {
                    max: 32,
                    type: 'string',
                    message: '长度不能大于32',
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min: 6,
                    type: "string",
                    message: '长度不能小于6',
                  },
                  {
                    max: 32,
                    type: 'string',
                    message: '长度不能大于32',
                  }
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined/>,
                }}
                name="phone"
                placeholder={'请输入手机号'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                name="verifyCode"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                // onGetCaptcha={async (phone) => {
                //   const result = await getFakeCaptcha({
                //     phone,
                //   });
                //   if (!result) {
                //     return;
                //   }
                //   message.success('获取验证码成功！验证码为：1234');
                // }}
                onGetCaptcha={async (phone) => {
                  const result = await getVerifyCode({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link
              style={{
                float: 'right',
                fontSize: 14,
                fontStyle: 'oblique',
                textDecoration: 'underline',
                marginBottom: 14
              }}
              to="/user/login"
            >
              已有账号，去登录
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
