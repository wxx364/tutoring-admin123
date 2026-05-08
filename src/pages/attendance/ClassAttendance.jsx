import { useState } from 'react'
import { Card, Table, Button, DatePicker, Select, Space, Tag, Modal, Form, InputNumber, message, Tabs, Checkbox, Divider } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

// 模拟班级学员数据
const mockClassStudents = [
  { id: 1, name: '张明', subject: '数学', remainingHours: 33, checked: true },
  { id: 2, name: '李华', subject: '数学', remainingHours: 15, checked: true },
  { id: 3, name: '王芳', subject: '数学', remainingHours: 2, checked: false },
  { id: 4, name: '赵六', subject: '数学', remainingHours: 8, checked: true }
]

export default function ClassAttendance() {
  const [date, setDate] = useState(dayjs())
  const [selectedClass, setSelectedClass] = useState('math-a')
  const [students, setStudents] = useState(mockClassStudents)
  const [confirmModal, setConfirmModal] = useState(false)
  const [hoursPerClass, setHoursPerClass] = useState(2)

  const classOptions = [
    { value: 'math-a', label: '周六数学A班' },
    { value: 'math-b', label: '周六数学B班' },
    { value: 'physics', label: '周日物理班' },
    { value: 'english', label: '周日英语班' }
  ]

  const columns = [
    { 
      title: '出勤', 
      key: 'check', 
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={record.checked}
          onChange={(e) => {
            setStudents(students.map(s => s.id === record.id ? { ...s, checked: e.target.checked } : s))
          }}
        />
      )
    },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '科目', dataIndex: 'subject', key: 'subject' },
    { 
      title: '剩余课时', 
      dataIndex: 'remainingHours', 
      key: 'remainingHours',
      render: v => <span style={{ color: v <= 3 ? '#ff4d4f' : '#333' }}>{v}</span>
    },
    { 
      title: '本次扣课', 
      key: 'deduct',
      render: (_, record) => record.checked ? <Tag color="red">-{hoursPerClass}节</Tag> : <Tag>请假</Tag>
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => record.checked 
        ? <Tag color="success" icon={<CheckCircleOutlined />}>出勤</Tag>
        : <Tag color="warning" icon={<CloseCircleOutlined />}>请假</Tag>
    }
  ]

  const handleConfirm = () => {
    const checkedCount = students.filter(s => s.checked).length
    const totalHours = checkedCount * hoursPerClass
    message.success(`消课成功！共 ${checkedCount} 人出勤，扣除 ${totalHours} 课时`)
    setConfirmModal(false)
  }

  const checkedCount = students.filter(s => s.checked).length
  const totalHours = checkedCount * hoursPerClass

  return (
    <div className="page-container">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>日期：</span>
          <DatePicker value={date} onChange={setDate} style={{ width: 150 }} />
          <span>班级：</span>
          <Select value={selectedClass} onChange={setSelectedClass} options={classOptions} style={{ width: 200 }} />
          <span>单节课时：</span>
          <InputNumber min={0.5} max={4} step={0.5} value={hoursPerClass} onChange={setHoursPerClass} />
        </div>
        
        <Divider />
        
        <Table 
          columns={columns} 
          dataSource={students} 
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
          style={{ overflowX: 'auto' }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <b>汇总</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <b>{checkedCount} 人出勤</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Tag color="red">-{totalHours}节</Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
            </Table.Summary.Row>
          )}
        />
        
        <Divider />
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setStudents(students.map(s => ({ ...s, checked: true })))}>
              全选出勤
            </Button>
            <Button onClick={() => setStudents(students.map(s => ({ ...s, checked: false })))}>
              全部请假
            </Button>
            <Button type="primary" onClick={() => setConfirmModal(true)}>
              确认消课
            </Button>
          </Space>
        </div>
      </Card>

      <Modal 
        title="确认消课" 
        open={confirmModal} 
        onCancel={() => setConfirmModal(false)}
        onOk={handleConfirm}
      >
        <p>日期：<b>{date.format('YYYY-MM-DD')}</b></p>
        <p>班级：<b>{classOptions.find(c => c.value === selectedClass)?.label}</b></p>
        <p>出勤人数：<b>{checkedCount}</b> 人</p>
        <p>单节课时：<b>{hoursPerClass}</b> 节</p>
        <p>合计扣课：<b style={{ color: '#ff4d4f' }}>{totalHours}</b> 节</p>
      </Modal>
    </div>
  )
}
