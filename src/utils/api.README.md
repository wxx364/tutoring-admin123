# PC 后台 API 连接说明

## 文件结构

```
src/utils/
├── api.js           # API 封装（当前使用演示模式）
└── api.README.md    # 本说明文件
```

## 当前模式：演示模式

`api.js` 中设置了 `DEMO_MODE = true`，所有数据都是本地模拟的：

- 账号管理：内存中的 mockAccounts 数组
- 学员管理：内存中的 mockStudents 数组
- 打卡记录：内存中的 mockCheckins 数组

**特点：**
- ✅ 无需配置云开发环境
- ✅ 刷新页面数据重置
- ✅ 适合本地开发和演示

---

## 切换到真实云函数

### 步骤 1：开通微信云开发

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发」→「云开发」
3. 点击「开通」按指引完成

### 步骤 2：获取环境 ID

在云开发控制台首页，复制「环境 ID」：
```
示例：tutoring-xxx
```

### 步骤 3：修改 api.js

```javascript
// 修改前
const CLOUD_ENV = 'your-env-id'
const DEMO_MODE = true

// 修改后
const CLOUD_ENV = '你的真实环境ID'  // 如：tutoring-abc123
const DEMO_MODE = false
```

### 步骤 4：部署云函数

在微信开发者工具中：

1. 右键 `cloudfunctions/account` →「创建并部署：云端安装依赖」
2. 右键 `cloudfunctions/student` →「创建并部署：云端安装依赖」
3. 右键 `cloudfunctions/checkin` →「创建并部署：云端安装依赖」
4. 右键 `cloudfunctions/auth` →「创建并部署：云端安装依赖」

### 步骤 5：创建数据库集合

在云开发控制台 → 数据库 → 创建集合：

```
users      # 用户/账号
students   # 学员
courses    # 课程
checkins   # 打卡记录
```

### 步骤 6：初始化管理员账号

在 `users` 集合中添加第一条记录：

```json
{
  "name": "系统管理员",
  "phone": "admin",
  "role": "admin",
  "roles": ["admin"],
  "password": "admin123",
  "createTime": { "$date": "2026-04-28T00:00:00Z" }
}
```

---

## 真实环境调用流程

```
PC 后台 (React)
    ↓
调用 callCloudFunction('account', { action: 'getList' })
    ↓
HTTP POST 到微信云开发 API
    ↓
云函数 account 执行
    ↓
查询数据库 users 集合
    ↓
返回数据给 PC 后台
```

---

## API 模块说明

### accountApi - 账号管理

```javascript
import { accountApi } from './utils/api'

// 获取账号列表
const result = await accountApi.getList({
  keyword: '王',      // 可选：搜索关键词
  role: 'teacher',    // 可选：角色筛选
  page: 1,
  pageSize: 10
})

// 创建账号
await accountApi.create({
  name: '李老师',
  phone: '13900139001',
  role: 'teacher',
  subjects: ['钢琴'],
  password: '123456'
})

// 更新账号
await accountApi.update('user_id', { name: '新名字' })

// 删除账号
await accountApi.delete('user_id')

// 重置密码
await accountApi.resetPassword('user_id', 'newpassword')
```

### studentApi - 学员管理

```javascript
import { studentApi } from './utils/api'

// 搜索学员（模糊匹配）
const result = await studentApi.searchByName('张')

// 获取学员列表
const result = await studentApi.getList()
```

### checkinApi - 打卡管理

```javascript
import { checkinApi } from './utils/api'

// 执行打卡
await checkinApi.doCheckin({
  studentId: 's001',
  studentName: '张小明',
  subject: '钢琴'
})

// 获取今日打卡记录
const result = await checkinApi.getTodayList()
```

---

## 常见问题

### Q: 调用云函数报错 "access_token expired"

A: 需要实现 access_token 获取逻辑，或直接使用小程序的云开发 SDK。

**简化方案：** 使用小程序云开发的 HTTP API 免鉴权调用（仅限云开发控制台配置的 IP）。

### Q: 跨域问题

A: PC 后台部署到云开发的静态网站托管，或配置 CORS。

### Q: 数据不实时同步

A: 演示模式下数据在内存中，刷新页面会重置。切换到真实环境后数据持久化在数据库中。

---

## 生产环境建议

1. **使用独立后端服务**：考虑使用 Node.js + MongoDB 搭建独立后端
2. **接入微信开放平台**：使用微信官方提供的 PC 端登录能力
3. **数据迁移**：从小程序云开发导出数据，导入到独立数据库

当前方案（微信云开发）适合：
- 快速验证 MVP
- 小型机构（<1000用户）
- 预算有限

独立后端方案适合：
- 大型机构
- 需要复杂报表分析
- 多平台扩展（APP、Web）
