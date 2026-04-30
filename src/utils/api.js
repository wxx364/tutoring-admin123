// utils/api.js
// PC 后台调用独立 API 服务器

// API 服务器地址（json-server）
const API_BASE_URL = 'http://localhost:3001/api'

// 是否使用演示模式
// 'demo' - 内存模拟（不推荐，数据不持久化）
// 'local' - 调用本地 json-server（推荐，数据持久化到 db.json）
// 'cloud' - 调用微信云开发（需要 AppID 和云开发环境）
const API_MODE = 'demo'

// 模拟延迟（仅用于 demo 模式）
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 调用 REST API
 * @param {string} endpoint - API 端点（如 /accounts）
 * @param {object} options - fetch 选项
 * @returns {Promise}
 */
async function callApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API 调用失败:', error)
    throw error
  }
}

/**
 * 调用云函数（仅 demo/ cloud 模式使用）
 * @param {string} name - 云函数名称
 * @param {object} data - 请求数据
 * @returns {Promise}
 */
export async function callCloudFunction(name, data) {
  if (API_MODE === 'demo') {
    return callDemoFunction(name, data)
  }
  
  if (API_MODE === 'cloud') {
    return callCloudApi(name, data)
  }
  
  // local 模式：转换为 REST API 调用
  return callRestApi(name, data)
}

/**
 * REST API 适配器
 * 将云函数风格的调用转换为 REST API 调用
 */
async function callRestApi(name, data) {
  const { action, ...params } = data
  
  await delay(200) // 模拟网络延迟
  
  switch (name) {
    case 'account':
      return handleAccountRest(action, params)
    case 'student':
      return handleStudentRest(action, params)
    case 'checkin':
      return handleCheckinRest(action, params)
    default:
      return { code: -1, msg: '未知 API' }
  }
}

/**
 * 演示模式：模拟云函数返回
 */
async function callDemoFunction(name, data) {
  await delay(500) // 模拟网络延迟

  switch (name) {
    case 'account':
      return handleAccountDemo(data)
    case 'student':
      return handleStudentDemo(data)
    case 'checkin':
      return handleCheckinDemo(data)
    default:
      return { code: -1, msg: '未知云函数' }
  }
}

// 账号管理模拟数据
let mockAccounts = [
  { 
    id: '1', 
    name: '王老师', 
    phone: '13800138001', 
    role: 'teacher',
    subjects: ['钢琴', '舞蹈'],
    createdAt: '2026-04-20 10:30'
  },
  { 
    id: '2', 
    name: '李主任', 
    phone: '13900139001', 
    role: 'admin',
    subjects: [],
    createdAt: '2026-04-18 14:20'
  },
  { 
    id: '3', 
    name: '张老师', 
    phone: '13700137001', 
    role: 'teacher',
    subjects: ['书法'],
    createdAt: '2026-04-22 09:15'
  },
  {
    id: '4',
    name: '陈家长',
    phone: '13600136001',
    role: 'parent',
    subjects: [],
    createdAt: '2026-04-25 16:45'
  }
]

// 账号管理演示逻辑
function handleAccountDemo(data) {
  const { action } = data

  switch (action) {
    case 'getList': {
      const { keyword, role, page = 1, pageSize = 20 } = data
      
      let list = [...mockAccounts]
      
      // 关键词搜索
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase()
        list = list.filter(item => 
          item.name.toLowerCase().includes(lowerKeyword) ||
          item.phone.includes(keyword)
        )
      }
      
      // 角色筛选
      if (role && role !== 'all') {
        list = list.filter(item => item.role === role)
      }
      
      const total = list.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      list = list.slice(start, end)
      
      return {
        code: 0,
        data: { list, total, page, pageSize }
      }
    }

    case 'create': {
      const { name, phone, role, subjects } = data
      
      // 检查手机号是否已存在
      if (mockAccounts.some(item => item.phone === phone)) {
        return { code: -1, msg: '该手机号已注册' }
      }
      
      const newAccount = {
        id: Date.now().toString(),
        name,
        phone,
        role,
        subjects: subjects || [],
        createdAt: new Date().toLocaleString()
      }
      
      mockAccounts.unshift(newAccount)
      
      return {
        code: 0,
        msg: '账号创建成功',
        data: newAccount
      }
    }

    case 'update': {
      const { id, name, phone, role, subjects } = data
      const index = mockAccounts.findIndex(item => item.id === id)
      
      if (index === -1) {
        return { code: -1, msg: '账号不存在' }
      }
      
      // 检查手机号冲突
      if (phone && phone !== mockAccounts[index].phone) {
        if (mockAccounts.some(item => item.phone === phone && item.id !== id)) {
          return { code: -2, msg: '该手机号已被其他账号使用' }
        }
      }
      
      mockAccounts[index] = {
        ...mockAccounts[index],
        name: name || mockAccounts[index].name,
        phone: phone || mockAccounts[index].phone,
        role: role || mockAccounts[index].role,
        subjects: subjects || mockAccounts[index].subjects,
        updatedAt: new Date().toLocaleString()
      }
      
      return { code: 0, msg: '账号更新成功' }
    }

    case 'delete': {
      const { id } = data
      const index = mockAccounts.findIndex(item => item.id === id)
      
      if (index === -1) {
        return { code: -1, msg: '账号不存在' }
      }
      
      // 保护最后一个管理员
      const account = mockAccounts[index]
      if (account.role === 'admin') {
        const adminCount = mockAccounts.filter(item => item.role === 'admin').length
        if (adminCount <= 1) {
          return { code: -2, msg: '不能删除最后一个管理员' }
        }
      }
      
      mockAccounts.splice(index, 1)
      
      return { code: 0, msg: '账号删除成功' }
    }

    case 'resetPassword': {
      return { code: 0, msg: '密码重置成功' }
    }

    default:
      return { code: -1, msg: '未知操作' }
  }
}

// 学员管理演示逻辑
const mockStudents = [
  { id: 's001', name: '张小明', subject: '钢琴', remainingHours: 48 },
  { id: 's002', name: '张小华', subject: '钢琴', remainingHours: 42 },
  { id: 's003', name: '李小红', subject: '舞蹈', remainingHours: 36 },
  { id: 's004', name: '王小军', subject: '书法', remainingHours: 24 }
]

function handleStudentDemo(data) {
  const { action } = data

  switch (action) {
    case 'searchByName': {
      const { name } = data
      const list = mockStudents.filter(item => 
        item.name.includes(name)
      )
      return { code: 0, data: list }
    }

    case 'getList':
      return { code: 0, data: mockStudents }

    default:
      return { code: -1, msg: '未知操作' }
  }
}

// 打卡演示逻辑
const mockCheckins = []

function handleCheckinDemo(data) {
  const { action } = data

  switch (action) {
    case 'doCheckin': {
      const { studentId, studentName, subject } = data
      const checkin = {
        id: 'ck' + Date.now(),
        studentId,
        studentName,
        subject,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      mockCheckins.unshift(checkin)
      
      return {
        code: 0,
        msg: '打卡成功',
        data: {
          checkinId: checkin.id,
          time: checkin.time,
          remainingHours: 47
        }
      }
    }

    case 'getTodayList': {
      const today = new Date().toLocaleDateString()
      const list = mockCheckins.filter(item => item.date === today)
      return { code: 0, data: list }
    }

    default:
      return { code: -1, msg: '未知操作' }
  }
}

// 账号管理 API =====

// ===== REST API 处理器（local 模式）=====

/**
 * 账号 REST API
 */
async function handleAccountRest(action, params) {
  switch (action) {
    case 'getList': {
      const { keyword, role, page = 1, pageSize = 20 } = params
      let data = await callApi('/accounts')
      
      // 搜索
      if (keyword) {
        data = data.filter(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.phone.includes(keyword)
        )
      }
      
      // 筛选
      if (role && role !== 'all') {
        data = data.filter(item => item.role === role)
      }
      
      const total = data.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = data.slice(start, end)
      
      return { code: 0, data: { list, total, page, pageSize } }
    }

    case 'create': {
      const newAccount = {
        id: 'u' + Date.now(),
        name: params.name,
        phone: params.phone,
        role: params.role,
        subjects: params.subjects || [],
        createdAt: new Date().toLocaleString()
      }
      await callApi('/accounts', {
        method: 'POST',
        body: JSON.stringify(newAccount)
      })
      return { code: 0, msg: '账号创建成功', data: newAccount }
    }

    case 'update': {
      const updated = {
        ...params,
        updatedAt: new Date().toLocaleString()
      }
      await callApi(`/accounts/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated)
      })
      return { code: 0, msg: '账号更新成功' }
    }

    case 'delete': {
      await callApi(`/accounts/${params.id}`, {
        method: 'DELETE'
      })
      return { code: 0, msg: '账号删除成功' }
    }

    case 'resetPassword': {
      return { code: 0, msg: '密码重置成功' }
    }

    default:
      return { code: -1, msg: '未知操作' }
  }
}

/**
 * 学员 REST API
 */
async function handleStudentRest(action, params) {
  switch (action) {
    case 'getList': {
      const data = await callApi('/students')
      return { code: 0, data }
    }

    case 'searchByName': {
      const data = await callApi('/students')
      const list = data.filter(item => 
        item.name.toLowerCase().includes(params.name.toLowerCase())
      )
      return { code: 0, data: list }
    }
    default:
      return { code: -1, msg: '未知操作' }
  }
}

/**
 * 打卡 REST API
 */
async function handleCheckinRest(action, params) {
  switch (action) {
    case 'doCheckin': {
      const checkin = {
        id: 'c' + Date.now(),
        studentId: params.studentId,
        studentName: params.studentName,
        subject: params.subject,
        checkinAt: new Date().toLocaleString(),
        status: 'present'
      }
      await callApi('/checkins', {
        method: 'POST',
        body: JSON.stringify(checkin)
      })
      return { code: 0, msg: '打卡成功', data: checkin }
    }
    default:
      return { code: -1, msg: '未知操作' }
  }
}

// ===== 账号管理 API =====

export const accountApi = {
  // 获取账号列表
  getList: (params = {}) => callCloudFunction('account', { 
    action: 'getList', 
    ...params 
  }),

  // 创建账号
  create: (data) => callCloudFunction('account', { 
    action: 'create', 
    ...data 
  }),

  // 更新账号
  update: (id, data) => callCloudFunction('account', { 
    action: 'update', 
    id, 
    ...data 
  }),

  // 删除账号
  delete: (id) => callCloudFunction('account', { 
    action: 'delete', 
    id 
  }),

  // 重置密码
  resetPassword: (id, newPassword) => callCloudFunction('account', {
    action: 'resetPassword',
    id,
    newPassword
  })
}

// ===== 学员管理 API =====

export const studentApi = {
  // 搜索学员（模糊匹配）
  searchByName: (name) => callCloudFunction('student', {
    action: 'searchByName',
    name
  }),

  // 获取学员列表
  getList: () => callCloudFunction('student', {
    action: 'getList'
  })
}

// ===== 打卡 API =====

export const checkinApi = {
  // 执行打卡
  doCheckin: (data) => callCloudFunction('checkin', {
    action: 'doCheckin',
    ...data
  }),

  // 获取今日打卡记录
  getTodayList: () => callCloudFunction('checkin', {
    action: 'getTodayList',
    date: new Date().toLocaleDateString()
  })
}
