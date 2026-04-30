# 教培机构课时管理系统 - PC管理后台

## 技术栈

- React 18
- Vite 5
- Ant Design 5
- React Router 6
- Zustand (状态管理)
- Day.js (日期处理)

## 快速开始

### 安装依赖

```bash
cd tutoring-admin
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 功能模块

### 学员管理 (`/students`)
- 学员列表（筛选、搜索、导出）
- 课时充值、赠送课时
- 冻结/解冻学员
- 学员详情（课时账户、消课记录）

### 消课管理 (`/attendance`)
- 班课批量消课
- 一对一消课
- 晚托自动消课

### 预警中心 (`/warnings`)
- 课时不足预警
- 即将过期预警
- 长期旷课预警
- 续费意向筛选

### 数据报表 (`/reports`)
- 每日/月度课消统计
- 老师业绩排行
- 财务对账

### 系统设置 (`/settings`)
- 预警阈值设置
- 微信通知开关
- 套餐管理
- 员工账号管理

### 操作日志 (`/settings/logs`)
- 全部操作记录
- 不可篡改

## 权限说明

| 角色 | 权限 |
|------|------|
| 校长 (admin) | 全部权限 |
| 教务老师 (staff) | 学员管理、消课、请假 |
| 任课老师 (teacher) | 仅查看自己学生、班课消课 |

## 测试账号

- 用户名: `admin`
- 密码: `123456`

## 目录结构

```
src/
├── main.jsx          # 入口
├── App.jsx           # 路由配置
├── components/       # 公共组件
│   └── Layout.jsx    # 页面布局
├── pages/            # 页面
│   ├── Login.jsx
│   ├── students/
│   ├── attendance/
│   ├── warnings/
│   ├── reports/
│   └── settings/
├── stores/           # Zustand状态
│   └── auth.js
├── hooks/            # 自定义hooks
├── utils/            # 工具函数
└── styles/           # 样式
    └── global.css
```
