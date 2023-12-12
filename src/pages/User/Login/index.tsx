import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { FcGoogle } from "react-icons/fc";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProForm,
  ModalForm
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, ConfigProvider, message, Tabs, Button, Space, Form } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Image } from 'antd';
import register from '../../../api/auth'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import api from '@/api';
const ActionIcons = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
    </>
  );
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
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

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm<{ email: string }>();
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const auth = await getAuth();
    if (auth.currentUser) {
      const userInfo = await api.authApi.findByEmail(auth.currentUser?.email)
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User", user)
        const userInfo = await api.authApi.findByEmail(user?.email)
        console.log(userInfo)
        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: userInfo,
          }));
        });
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        setUserLoginState({ status: "success", type: "account", currentAuthority: "admin" });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log("gooogle", result);
        // The signed-in user info.
        const user = result.user;
        const findUser = await register.findByEmail(user.email)
        if (!findUser) {

        }
        await fetchUserInfo();

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  const handleSubmit = async (values: API.LoginParams) => {
    console.log("handle", values);
    if (type === 'register') {
      const res = await register.register({ ...values })
      if (res !== null) {
        message.success("Đăng kí tài khoản thành công!")
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!")
      }
    } else {
      let user = await register.login({ ...values })
      if (user) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Đăng nhập thành công',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        setUserLoginState({ status: "success", type: "account", currentAuthority: "admin" });
        return;

      }
    }
    try {
      // 登录
      const msg = await login({ ...values, type });
      console.log(msg);
      // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#7942FE',
        },
      }}
    >
      <div className={containerClassName}>
        <Helmet>
          <title>
            {intl.formatMessage({
              id: 'menu.login',
              defaultMessage: 'Đăng nhập',
            })}
            - {Settings.title}
          </title>
        </Helmet>
        <Lang />
        <div
          style={{
            flex: '1',
            padding: '32px 0',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingInline: '32px',
            paddingBlock: '24px'
            , alignItems: 'center'
          }}>
            <Form
              style={{
                width: '328px',
                maxWidth: '75vw',
                minWidth: '280px'
              }
              }


              onFinish={async (values) => {
                await handleSubmit(values as API.LoginParams);
              }}
            >
              <div className='d-flex justify-center align-center mb-16'>
                <Space direction='vertical' align='center'>

                  <Image src="/todo.svg" preview={false}> </Image>
                  {type == "account" ? <h1>Đăng nhập</h1> : <h1>Đăng kí</h1>}
                </Space>
              </div>

              {status === 'error' && loginType === 'account' && (
                <LoginMessage
                  content={intl.formatMessage({
                    id: 'pages.login.accountLogin.errorMessage',
                    defaultMessage: 'Tài khoản hoặc mật khẩu không đúng',
                  })}
                />
              )}
              {type === 'account' ?
                <  >
                  <ProFormText
                    name="email"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.username.placeholder',
                      defaultMessage: 'Nhập tài khoản',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.username.required"
                            defaultMessage="Tài khoản là trường bắt buộc!"
                          />
                        ),
                      },
                      {
                        required: true,
                        type: 'email',
                        message: (
                          <FormattedMessage
                            id="pages.login.username.invalid"
                            defaultMessage="Email vừa nhập không hợp lệ!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: 'Nhập mật khẩu',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="Mật khẩu là trường bắt buộc"
                          />
                        ),
                      },
                    ]}
                  />
                </> :

                <>
                  <ProFormText
                    name="displayName"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.display.placeholder',
                      defaultMessage: 'Nhập tên hiển thị',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.display.required"
                            defaultMessage="Tên hiển thị là trường bắt buộc!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText
                    name="email"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.username.placeholder',
                      defaultMessage: 'Nhập email',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.username.required"
                            defaultMessage="Email là trường bắt buộc!"
                          />
                        ),
                      },
                      {
                        type: 'email',
                        message: (
                          <FormattedMessage
                            id="pages.login.username.invalid"
                            defaultMessage="Email không hợp lệ!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: 'Nhập mật khẩu',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="Mật khẩu là trường bắt buộc"
                          />
                        ),
                      },
                    ]}
                  />
                </>

              }


              <div
                style={{
                  marginBottom: 24,
                }}
              >

              </div>
              <Button type="primary" htmlType="submit" size='large' style={{ width: '100%' }}>{type === 'account' ? 'Đăng nhập' : 'Đăng kí'}</Button>

              <div>
                <div className='mb-16'>
                  {
                    type == 'account' && <ModalForm<{
                      email: string;
                    }>
                      title="Đặt lại mật khẩu"
                      trigger={

                        <a style={{ color: '#7942FE' }} className='hover mb-16' onClick={() => setType('forget')}>

                          Quên mật khẩu
                        </a>
                      }
                      autoFocusFirstInput
                      modalProps={{
                        destroyOnClose: true,
                        onCancel: () => console.log('run'),
                      }}
                      onFinish={async (values) => {
                        const auth = getAuth();
                        sendPasswordResetEmail(auth, values.email)
                          .then(() => {
                            // Password reset email sent!
                            message.success('Mật khẩu mới đã được gửi đến email của bạn!');
                            // ..
                          }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            message.error(errorMessage);
                            // ..
                          });
                        return true;
                      }}
                      width="500px"
                    >

                      <ProFormText
                        name="email"
                        fieldProps={{
                          size: 'large',
                          prefix: <UserOutlined />,
                        }}
                        placeholder="Hãy nhập email bạn muốn đặt lại mật khẩu"
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.username.required"
                                defaultMessage="Tài khoản là trường bắt buộc!"
                              />
                            ),
                          },
                          {
                            required: true,
                            type: 'email',
                            message: (
                              <FormattedMessage
                                id="pages.login.username.invalid"
                                defaultMessage="Email vừa nhập không hợp lệ!"
                              />
                            ),
                          },
                        ]}
                      />

                    </ModalForm>
                  }

                  {
                    type == 'account' ?
                      <div
                        style={{
                          float: 'right',
                          fontSize: 14

                        }}
                        className='mb-16'
                      >

                        Chưa có tài khoản? {' '}
                        <a style={{ color: '#7942FE' }} className='hover' onClick={() => setType('register')}>

                          <FormattedMessage id="pages.login.register" />
                        </a>

                      </div> :
                      <div
                        style={{
                          float: 'right',
                          fontSize: 14

                        }}
                        className='mb-16'
                      >

                        Đã có tài khoản {' '}
                        <a style={{ color: '#7942FE' }} className='hover' onClick={() => setType('account')}>

                          <FormattedMessage id="pages.login.signin" />
                        </a>


                      </div>
                  }
                </div>

                {
                  type == 'account' && <div style={{ fontSize: 16 }} >

                    <p className=''>  Đăng nhập bằng cách khác :</p>
                    <Button size='large' style={{ width: '100%' }} icon={<FcGoogle />} onClick={loginWithGoogle}> Đăng nhập với Google</Button>
                  </div>
                }

              </div>
            </Form>
          </div>
        </div>
      </div>

    </ConfigProvider>
  );
};

export default Login;
