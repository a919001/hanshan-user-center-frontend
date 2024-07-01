// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 密码登录接口 POST /api/user/passwordLogin */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  let url = '/api/user/passwordLogin';
  if (body.type === 'phone') {
    url = '/api/user/phoneLogin'
  }
  return request<API.LoginResult>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 get /api/user/verify-code */
export async function getVerifyCode(
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/user/verify-code', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除普通用户 Post /api/user/delete */
export async function deleteUser(id: string) {
  const requestBody = {
    id,
  };
  return request<API.FakeCaptcha>('/api/user/delete', {
    method: 'POST',
    data: requestBody,
  });
}

/** 查询用户列表 GET /api/user/search */
export async function searchUsers (options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/user/search', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新个人信息接口 POST /api/user/update-personal-info */
export async function updatePersonalInfo(body: API.UpdatePersonalInfoParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<any>>('/api/user/update-personal-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
