import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { UserAddOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons'

// 模拟员工数据
const mockStaff = [
  { id: 1, name: '李老师', phone: '13800138001', role: 'teacher', subjects: ['数学', '物理'], status: 'active', joinDate: '2024-03-01' },
  { id: 2, name: '王老师', phone: '13800138002', role: 'teacher', subjects: ['英语', '语文'], status: 'active', joinDate: '2024-05-15' },
  { id: 3, name: '张老师', phone: '13800138003', role: 'teacher', subjects: ['化学', '生物'], status: 'active', joinDate: '2024-08-20' },
  { id: 4, name: '赵教务', phone: '13800138004', role: 'admin', subjects: [], status: 'active', joinDate: '2023-12-01' },
  { id: 5, name: '孙助理', phone: '13800138005', role: 'assistant', subjects: [], status: 'inactive', joinDate: '2025-01-10' }
]

const roleOptions = [
  { value: 'teacher', label: '老师' },
  { value: 'admin', label: '教务管理员' },
  { value: 'assistant', label: '助理' }
]

const subjectOptions = [
  { value: '数学', label: '数学' },
  { value: '英语', label: '英语' },
  { value: '语文', label: '语文' },
  { value: '物理', label: '物理' },
  { value: '化学', label: '化学' },
  { value: '生物', label: '生物' }
]

const columns = [
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '手机号', dataIndex: 'phone', width: 130 },
  { 
    title: '角色', 
    dataIndex: 'role', 
    width: 100,
    render: v => {
      const map = { teacher: '老师', admin: '教务管理员', assistant: '助理' }
      return <Tag color={v === 'admin' ? 'blue' : v === 'teacher' ? 'green' : 'default'}>{map[v]}</Tag>
    }
  },
  { 
    title: '科目', 
    dataIndex: 'subjects', 
    width: 180,
    render: v => v.length > 0 ? v.join('、') : '-'
  },
  { 
    title: '状态', 
    dataIndex: 'status', 
    width: 80,
    render: v => v === 'active' ? <Tag color="success">在职</Tag> : <Tag color="default">离职</Tag>
  },
  { title: '入职日期', dataIndex: 'joinDate', width: 110 },
  { 
    title: '操作', 
    width: 180,
    render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => handleResetPassword(record)}>重置密码</Button>
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    )
  }
]

export default function StaffManagement() {
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      role: record.role,
      subjects: record.subjects
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingId) {
        message.success('员工信息已更新')
      } else {
        message.success('新员工已添加')
      }
      setModalOpen(false)
      form.resetFields()
    })
  }

  const handleResetPassword = (record) => {
    message.success(`${record.name} 的密码已重置为 123456`)
  }

  const handleDelete = (id) => {
    message.success('员工已删除')
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>新增员工</Button>
      </div>

      <Table 
        dataSource={mockStaff} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingId ? '编辑员工' : '新增员工'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入员工姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" options={roleOptions} />
          </Form.Item>
          <Form.Item label="科目（仅老师）" name="subjects">
            <Select mode="multiple" placeholder="可多选科目" options={subjectOptions} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}