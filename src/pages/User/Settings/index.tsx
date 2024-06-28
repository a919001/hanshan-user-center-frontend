// noinspection TypeScriptValidateTypes

import React, {useRef, useState} from 'react';
import {
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import {Button, Card, Col, Form, GetProp, Layout, Menu, message, Row, theme, Upload, UploadProps} from 'antd';
import {
  ProForm,
  ProFormCascader,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-form";
import areaData from 'china-area-data';
import {useModel} from "@@/exports";
import ImgCrop from 'antd-img-crop';
import type {ProFormInstance} from '@ant-design/pro-components';
import {updatePersonalInfo} from "@/services/ant-design-pro/api";
import {flushSync} from "react-dom";

const {Header, Content, Sider} = Layout;

const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  }),
);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt5M = file.size / 1024 / 1024 < 10;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!');
  }
  return isJpgOrPng && isLt5M;
};

const Settings: React.FC = () => {

  // 当前用户信息
  const {initialState, setInitialState} = useModel('@@initialState');
  let currentUserInfo = initialState.currentUser;

  const {
    token: {colorBgContainer},
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(currentUserInfo.avatar);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
        window.location.reload();
      });
    }
  };

  const uploadButton = (
    <button style={{border: 0, background: 'none'}} type="button">
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </button>
  );

  /**
   * areaData json解析
   * @param data areaData
   */
  function convertDataToJsonTree(data) {
    const result = [];

    // 处理顶层国家编码，由于这里只有一个国家，我们可以直接获取其子节点
    const provinces = data['86'];

    // eslint-disable-next-line guard-for-in
    for (let provinceCode in provinces) {
      const provinceName = provinces[provinceCode];

      // 创建省份对象
      const province = {
        value: provinceCode,
        label: provinceName,
        children: [],
      };

      // 获取该省份下的所有城市
      const cities = data[provinceCode];
      if (cities) {
        // eslint-disable-next-line guard-for-in
        for (let cityCode in cities) {
          const cityName = cities[cityCode];

          // 创建城市对象
          const city = {
            value: cityCode,
            label: cityName,
            children: [],
          };

          // 获取该城市下的所有区县
          const districts = data[cityCode];
          if (districts) {
            // eslint-disable-next-line guard-for-in
            for (let districtCode in districts) {
              const districtName = districts[districtCode];

              // 创建区县对象
              city.children.push({
                value: districtCode,
                label: districtName,
              });
            }
          }

          // 将城市添加到省份的 children 数组中
          province.children.push(city);
        }
      }

      // 将省份添加到结果数组中
      result.push(province);
    }

    return result;
  }

  const areaOptions = convertDataToJsonTree(areaData);


  const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();


  /**
   * 性别枚举
   */
  const GenderEnum = {
    0: '男',
    1: '女',
  };

  // region 处理，用于根据选中的值数组找到对应的地区文本
  const getRegionText = (selectedValues, options) => {
    let text = '';
    const findOption = (path, opts) => {
      for (let opt of opts) {
        if (opt.value === path[0]) {
          text += opt.label;
          if (path.length > 1) {
            text += ' / ';
            findOption(path.slice(1), opt.children || []);
          }
          break;
        }
      }
    };
    findOption(selectedValues, options);
    return text;
  };

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
  /**
   * 保存修改
   */
  const handleSave = async () => {
    try {
      await formRef.current?.validateFields();
      const values = await formRef.current?.getFieldFormatValue();
      // 处理 gender 字段
      let genderValue = values.gender;
      if (values.gender === '男') {
        genderValue = '0';
      }
      if (values.gender === '女') {
        genderValue = '1';
      }
      // 特别处理 region 字段，转换为文本
      console.log(values.region);
      console.log(Array.isArray(values.region))
      let regionText;
      if (Array.isArray(values.region)) {
        regionText = getRegionText(values.region)
      } else {
        regionText = values.region;
      }

      // 将处理后的内容放入最终要提交的数据中
      const finalValues = {...values, gender: genderValue, region: regionText};

      const res = await updatePersonalInfo(finalValues);
      if (res.message === 'ok') {
        message.success("保存成功");
        await fetchUserInfo();
        currentUserInfo = initialState.currentUser;
        // 使用新的用户信息重置表单字段的初始值
        formRef.current?.setFieldsValue({
          nickname: currentUserInfo.nickname,
          gender: GenderEnum[currentUserInfo.gender],
          birthday: currentUserInfo.birthday,
          region: currentUserInfo.region,
          signature: currentUserInfo.signature,
        });

        formRef.current?.resetFields();
      } else {
        message.error(res.message);
      }

    } catch (e) {
      message.error('请检查表单项，确保所有必填项已填写无误');
    }

  };

  return (

    <Layout>
      <Header style={{padding: 0, background: colorBgContainer}}/>
      <Layout>
        <Sider style={{background: colorBgContainer, height: 600, margin: '24px 0'}}>
          <Menu mode="inline" defaultSelectedKeys={['4']} items={items}/>
        </Sider>
        <Content style={{margin: '24px 16px 0'}}>
          <Card title="个人资料">
            <Row gutter={16}>
              <Col span={12}>
                <ProForm
                  form={form}
                  layout="horizontal"
                  colon={false}
                  labelCol={{span: 4}}
                  wrapperCol={{span: 14}}
                  submitter={false}
                  formRef={formRef}
                >
                  <ProFormText
                    name="nickname"
                    label="昵称"
                    initialValue={currentUserInfo.nickname}
                    placeholder="请输入昵称"
                    rules={[
                      {
                        required: true,
                        message: '请输入昵称',
                      },
                      {
                        max: 20,
                        message: '昵称长度不能超过20个字符',
                      },
                    ]}
                  />
                  <ProFormSelect
                    name="gender"
                    label="性别"
                    initialValue={GenderEnum[currentUserInfo.gender]}
                    placeholder="请选择"
                    options={[
                      {value: '0', label: '男'},
                      {value: '1', label: '女'},
                    ]}
                    rules={[{required: true, message: '请选择性别'}]}
                  />
                  <ProFormDatePicker
                    name="birthday"
                    label="生日"
                    initialValue={currentUserInfo.birthday}
                    format={{
                      format: 'YYYY-MM-DD',
                    }}
                    fieldProps={{
                      style: {width: '100%'}, // 设置内部DatePicker的宽度
                    }}
                    rules={[{required: true, message: '请选择出生日期'}]}
                  />
                  <ProFormCascader
                    name="region"
                    label="地区"
                    initialValue={currentUserInfo.region}
                    fieldProps={{
                      showSearch: true,
                      allowClear: true,
                      placeholder: '请选择地区',
                      changeOnSelect: true,
                      options: areaOptions
                    }}
                    // rules={[{required: true, message: '请选择地区'}]}
                  />
                  <ProFormTextArea
                    name="signature"
                    label="个性签名"
                    initialValue={currentUserInfo.signature}
                    placeholder="编辑个签，展示我的独特态度"
                    maxLength={100}
                  />
                </ProForm>
              </Col>
              <Col>
                <ImgCrop rotationSlider>
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/user/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                  </Upload>
                </ImgCrop>
                <p>上传头像</p>
                <p>格式：支持JPG、PNG、JPEG</p>
                <p>大小：5M以内</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={26} offset={2}>
                <Button type="primary" icon={<SaveOutlined/>} onClick={handleSave}>
                  保存修改
                </Button>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Settings;
