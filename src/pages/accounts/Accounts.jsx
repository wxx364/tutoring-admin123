import { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Popconfirm,
  message,
  Row,
  Col
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { accountApi } from '../../utils/api'

const { Option } = Select

// 角色选项
const ROLE_OPTIONS = [
  { value: 'teacher', label: '老师', color: 'blue' },
  { value: 'admin', label: '管理员', color: 'red' },
  { value: 'parent', label: '家长', color: 'green' }
]

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [form] = Form.useForm()
  
  // 搜索和筛选状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 加载账号列表
  useEffect(() => {
    loadAccounts()
  }, [pagination.current, pagination.pageSize, searchKeyword, filterRole])

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const result = await accountApi.getList({
        keyword: searchKeyword || undefined,
        role: filterRole !== 'all' ? filterRole : undefined,
        page: pagination.current,
        pageSize: pagination.pageSize
      })
      
      if (result.code === 0) {
        setAccounts(result.data.list)
        setPagination(prev => ({
          ...prev,
          total: result.data.total
        }))
      } else {
        message.error(result.msg || '加载失败')
      }
    } catch (err) {
      message.error('网络错误，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 打开新增/编辑弹窗
  const openModal = (record = null) => {
    setEditingAccount(record)
    if (record) {
      form.setFieldsValue({
        name: record.name,
        phone: record.phone,
        role: record.role,
        subjects: record.subjects || []
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false)
    setEditingAccount(null)
    form.resetFields()
  }

  // 保存账号
  const handleSave = async (values) => {
    try {
      let result
      
      if (editingAccount) {
        // 编辑
        result = await accountApi.update(editingAccount.id, values)
      } else {
        // 新增
        result = await accountApi.create(values)
      }
      
      if (result.code === 0) {
        message.success(editingAccount ? '账号更新成功' : '账号创建成功')
        closeModal()
        loadAccounts() // 刷新列表
      } else {
        message.error(result.msg || '保存失败')
      }
    } catch (err) {
      message.error('网络错误，请重试')
      console.error(err)
    }
  }

  // 删除账号
  const handleDelete = async (id) => {
    try {
      const result = await accountApi.delete(id)
      
      if (result.code === 0) {
        message.success('账号删除成功')
        loadAccounts() // 刷新列表
      } else {
        message.error(result.msg || '删除失败')
      }
    } catch (err) {
      message.error('网络错误，请重试')
      console.error(err)
    }
  }

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('')
    setFilterRole('all')
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  // 表格分页变化
  const handleTableChange = (newPagination) => {
    setPagination(newPagination)
  }

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const option = ROLE_OPTIONS.find(r => r.value === role)
        return (
          <Tag color={option?.color || 'default'}>
            {option?.label || role}
          </Tag>
        )
      }
    },
    {
      title: '教授科目',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <Space wrap>
          {subjects?.length > 0 ? subjects.map(subject => (
            <Tag key={subject} size="small">{subject}</Tag>
          )) : '-'}
        </Space>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此账号？"
            description="删除后该用户将无法登录小程序"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="账号管理"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新增账号
          </Button>
        }
      >
        {/* 搜索和筛选 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="搜索姓名或手机号"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={loadAccounts}
              allowClear
            />
          </Col>
          <Col>
            <Select
              value={filterRole}
              onChange={setFilterRole}
              style={{ width: 120 }}
            >
              <Option value="all">全部角色</Option>
              {ROLE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: [10, 20, 50]
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingAccount ? '编辑账号' : '新增账号'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="保存"
        cancelText="取消"
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 16 }}
          preserve={false}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="例如：王老师" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]}
          >
            <Input 
              placeholder="例如：13800138000" 
              prefix={<PhoneOutlined />} 
              maxLength={11}
              disabled={!!editingAccount} // 编辑时禁止修改手机号
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {ROLE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.role !== curr.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role')
              if (role === 'teacher') {
                return (
                  <Form.Item
                    name="subjects"
                    label="教授科目"
                    rules={[{ required: true, message: '请至少选择一个科目' }]}
                  >
                    <Select mode="multiple" placeholder="请选择教授科目">
                      <Option value="钢琴">钢琴</Option>
                      <Option value="舞蹈">舞蹈</Option>
                      <Option value="书法">书法</Option>
                      <Option value="围棋">围棋</Option>
                      <Option value="美术">美术</Option>
                      <Option value="英语">英语</Option>
                      <Option value="数学">数学</Option>
                      <Option value="语文">语文</Option>
                    </Select>
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>

          <Form.Item
            name="password"
            label={editingAccount ? '新密码（留空表示不修改）' : '初始密码'}
            rules={[{ required: !editingAccount, message: '请输入密码' }]}
            extra={editingAccount ? '' : '默认 123456，建议用户首次登录后修改'}
          >
            <Input.Password placeholder={editingAccount ? '不修改请留空' : '请输入6位以上密码'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
