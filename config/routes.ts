export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'},
    ],
  },
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome'},
  {path: '/user/personal-center', component: './User/PersonalCenter'},
  {path: '/user/settings', component: './User/Settings'},
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {path: '/admin', redirect: '/admin/sub-page'},
      {path: '/admin/sub-page', name: '二级管理页', component: './Admin'},
      {path: '/admin/user-manage', name: '用户管理', component: './Admin/UserManage'},
    ],
  },
  {name: '查询表格', icon: 'table', path: '/list', component: './TableList'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
