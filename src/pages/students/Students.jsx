import { useState, useEffect } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, InputNumber, DatePicker, message, Popconfirm, Tabs, Timeline, Descriptions, Statistic, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined, GiftOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

// 模拟数据
const mockStudents = [
  { id: 1, name: '张明', grade: '四年级', className: '数学A班', parentPhone: '13800138001', totalHours: 120, usedHours: 87, remainingHours: 33, giftHours: 12, expireDate: '2026-07-31', status: 'active' },
  { id: 2, name: '李华', grade: '初二', className: '物理班', parentPhone: '13800138002', totalHours: 60, usedHours: 45, remainingHours: 15, giftHours: 0, expireDate: '2026-06-30', status: 'active' },
  { id: 3, name: '王芳', grade: '高一', className: '化学班', parentPhone: '13800138003', totalHours: 80, usedHours: 78, remainingHours: 2, giftHours: 5, expireDate: '2026-05-31', status: 'warning' },
  { id: 4, name: '赵六', grade: '初三', className: '英语班', parentPhone: '13800138004', totalHours: 100, usedHours: 100, remainingHours: 0, giftHours: 0, expireDate: '2026-04-30', status: 'expired' }
]

const gradeOptions = [
  { value: '一年级', label: '一年级' },
  { value: '二年级', label: '二年级' },
  { value: '三年级', label: '三年级' },
  { value: '四年级', label: '四年级' },
  { value: '初二', label: '初二' },
  { value: '初三', label: '初三' },
  { value: '高一', label: '高一' },
  { value: '高二', label: '高二' },
  { value: '高三', label: '高三' }
]

export default function Students() {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState(mockStudents)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchText, setSearchText] = useState('')
  const [gradeFilter, setGradeFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  
  // 弹窗
  const [rechargeModal, setRechargeModal] = useState(false)
  const [giftModal, setGiftModal] = useState(false)
  const [freezeModal, setFreezeModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  
  const [rechargeForm] = Form.useForm()
  const [giftForm] = Form.useForm()

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '年级', dataIndex: 'grade', key: 'grade', width: 80 },
    { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
    { title: '家长电话', dataIndex: 'parentPhone', key: 'parentPhone', width: 130 },
    { 
      title: '总课时', 
      dataIndex: 'totalHours', 
      key: 'totalHours', 
      width: 80,
      align: 'center'
    },
    { 
      title: '已用', 
      dataIndex: 'usedHours', 
      key: 'usedHours', 
      width: 70,
      align: 'center'
    },
    { 
      title: '剩余', 
      dataIndex: 'remainingHours', 
      key: 'remainingHours', 
      width: 70,
      align: 'center',
      render: (v, r) => (
        <span style={{ color: v <= 3 ? '#ff4d4f' : v <= 10 ? '#faad14' : '#52c41a', fontWeight: 600 }}>
          {v}
        </span>
      )
    },
    { 
      title: '赠课', 
      dataIndex: 'giftHours', 
      key: 'giftHours', 
      width: 70,
      align: 'center',
      render: v => v > 0 ? <Tag color="blue">{v}</Tag> : '-'
    },
    { 
      title: '有效期', 
      dataIndex: 'expireDate', 
      key: 'expireDate', 
      width: 110,
      render: (v, r) => {
        const days = dayjs(v).diff(dayjs(), 'day')
        const color = days <= 7 ? '#ff4d4f' : days <= 30 ? '#faad14' : '#333'
        return <span style={{ color }}>{v}</span>
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 80,
      render: v => {
        const map = {
          active: { color: 'success', text: '正常' },
          warning: { color: 'warning', text: '预警' },
          frozen: { color: 'default', text: '冻结' },
          expired: { color: 'error', text: '过期' }
        }
        const item = map[v] || map.active
        return <Tag color={item.color}>{item.text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="link" size="small" onClick={() => handleRecharge(record)}>充值</Button>
          <Button type="link" size="small" onClick={() => handleGift(record)}>赠课</Button>
          <Button type="link" size="small" onClick={() => handleFreeze(record)}>冻结</Button>
        </Space>
      )
    }
  ]

  const handleViewDetail = (student) => {
    setCurrentStudent(student)
    setDetailModal(true)
  }

  const handleRecharge = (student) => {
    setCurrentStudent(student)
    rechargeForm.resetFields()
    setRechargeModal(true)
  }

  const handleGift = (student) => {
    setCurrentStudent(student)
    giftForm.resetFields()
    setGiftModal(true)
  }

  const handleFreeze = (student) => {
    setCurrentStudent(student)
    setFreezeModal(true)
  }

  const handleRechargeSubmit = () => {
    rechargeForm.validateFields().then(values => {
      message.success(`为 ${currentStudent.name} 充值 ${values.hours} 课时成功`)
      setRechargeModal(false)
    })
  }

  const handleGiftSubmit = () => {
    giftForm.validateFields().then(values => {
      message.success(`为 ${currentStudent.name} 赠送 ${values.hours} 课时成功`)
      setGiftModal(false)
    })
  }

  const filteredStudents = students.filter(s => {
    if (searchText && !s.name.includes(searchText) && !s.parentPhone.includes(searchText)) return false
    if (gradeFilter && s.grade !== gradeFilter) return false
    if (statusFilter && s.status !== statusFilter) return false
    return true
  })

  return (
    <div className="page-container">
      <Card>
        <div className="table-actions">
          <div className="table-actions-left">
            <Input 
              placeholder="搜索姓名/电话" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }} 
            />
            <Select 
              placeholder="年级" 
              allowClear 
              options={gradeOptions}
              value={gradeFilter}
              onChange={setGradeFilter}
              style={{ width: 120 }} 
            />
            <Select 
              placeholder="状态" 
              allowClear 
              options={[
                { value: 'active', label: '正常' },
                { value: 'warning', label: '预警' },
                { value: 'frozen', label: '冻结' },
                { value: 'expired', label: '过期' }
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 100 }} 
            />
          </div>
          <div className="table-actions-right">
            <Button icon={<ExportOutlined />}>导出Excel</Button>
            <Button type="primary" icon={<PlusOutlined />}>新增学员</Button>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredStudents} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
        />
      </Card>

      {/* 充值弹窗 */}
      <Modal title="课时充值" open={rechargeModal} onCancel={() => setRechargeModal(false)} onOk={handleRechargeSubmit}>
        <Form form={rechargeForm} layout="vertical">
          <Form.Item label="学员姓名">
            <Input value={currentStudent?.name} disabled />
          </Form.Item>
          <Form.Item name="hours" label="充值课时" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expireDate" label="有效期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* 赠课弹窗 */}
      <Modal title="赠送课时" open={giftModal} onCancel={() => setGiftModal(false)} onOk={handleGiftSubmit}>
        <Form form={giftForm} layout="vertical">
          <Form.Item label="学员姓名">
            <Input value={currentStudent?.name} disabled />
          </Form.Item>
          <Form.Item name="hours" label="赠送课时" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="赠送原因">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* 冻结弹窗 */}
      <Modal title="冻结课时" open={freezeModal} onCancel={() => setFreezeModal(false)} onOk={() => { message.success('冻结成功'); setFreezeModal(false) }}>
        <p>确定冻结学员 <b>{currentStudent?.name}</b> 的课时账户吗？</p>
        <p style={{ color: '#999' }}>冻结后该学员将无法消课，直到解冻。</p>
      </Modal>

      {/* 详情弹窗 */}
      <Modal 
        title={`学员详情 - ${currentStudent?.name}`} 
        open={detailModal} 
        onCancel={() => setDetailModal(false)}
        width={700}
        footer={null}
      >
        {currentStudent && (
          <Tabs items={[
            {
              key: 'info',
              label: '基本信息',
              children: (
                <Descriptions column={2}>
                  <Descriptions.Item label="姓名">{currentStudent.name}</Descriptions.Item>
                  <Descriptions.Item label="年级">{currentStudent.grade}</Descriptions.Item>
                  <Descriptions.Item label="班级">{currentStudent.className}</Descriptions.Item>
                  <Descriptions.Item label="家长电话">{currentStudent.parentPhone}</Descriptions.Item>
                  <Descriptions.Item label="有效期">{currentStudent.expireDate}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={currentStudent.status === 'active' ? 'success' : 'error'}>
                      {currentStudent.status === 'active' ? '正常' : '异常'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              )
            },
            {
              key: 'hours',
              label: '课时账户',
              children: (
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="总购买" value={currentStudent.totalHours} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="已用" value={currentStudent.usedHours} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="剩余" value={currentStudent.remainingHours} valueStyle={{ color: '#3f8600' }} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="赠课" value={currentStudent.giftHours} valueStyle={{ color: '#1890ff' }} />
                  </Col>
                </Row>
              )
            },
            {
              key: 'records',
              label: '消课记录',
              children: (
                <Timeline items={[
                  { children: '2026-04-24 数学 李老师 -2节' },
                  { children: '2026-04-22 英语 王老师 -1.5节' },
                  { children: '2026-04-20 物理 陈老师 -2节' }
                ]} />
              )
            }
          ]} />
        )}
      </Modal>
    </div>
  )
}
