import { useState } from 'react'
import { Card, Form, Select, DatePicker, InputNumber, Table, Tag, Button, Space, message, Modal, Divider, TimePicker } from 'antd'
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

// 模拟一对一课程数据
const mockTeachers = [
  { value: 'li', label: '李老师', subjects: ['数学', '物理'] },
  { value: 'wang', label: '王老师', subjects: ['英语', '语文'] },
  { value: 'zhang', label: '张老师', subjects: ['化学', '生物'] }
]

const mockStudents = [
  { id: 1, name: '张明', grade: '四年级', subject: '数学', remainingHours: 33 },
  { id: 2, name: '李华', grade: '初二', subject: '英语', remainingHours: 15 },
  { id: 3, name: '王芳', grade: '高一', subject: '物理', remainingHours: 8 },
  { id: 4, name: '赵六', grade: '初三', subject: '化学', remainingHours: 20 }
]

const mockRecords = [
  { id: 1, date: '2026-04-28', time: '10:00', teacher: '李老师', student: '张明', subject: '数学', hours: 2, status: 'completed' },
  { id: 2, date: '2026-04-27', time: '14:00', teacher: '王老师', student: '李华', subject: '英语', hours: 1.5, status: 'completed' },
  { id: 3, date: '2026-04-26', time: '16:00', teacher: '李老师', student: '王芳', subject: '物理', hours: 2, status: 'completed' }
]

export default function OneOnOneAttendance() {
  const [form] = Form.useForm()
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [confirmModal, setConfirmModal] = useState(false)
  const [pendingRecord, setPendingRecord] = useState(null)
  const [records] = useState(mockRecords)

  const teacherOptions = mockTeachers.map(t => ({ value: t.value, label: t.label }))
  
  const selectedTeacherInfo = mockTeachers.find(t => t.value === selectedTeacher)
  const subjectOptions = selectedTeacherInfo 
    ? selectedTeacherInfo.subjects.map(s => ({ value: s, label: s }))
    : []

  const studentColumns = [
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '年级', dataIndex: 'grade', width: 80 },
    { title: '科目', dataIndex: 'subject', width: 80 },
    { 
      title: '剩余课时', 
      dataIndex: 'remainingHours', 
      width: 100,
      render: v => <Tag color={v <= 3 ? 'error' : 'default'}>{v}节</Tag>
    }
  ]

  const recordColumns = [
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '时间', dataIndex: 'time', width: 80 },
    { title: '老师', dataIndex: 'teacher', width: 80 },
    { title: '学生', dataIndex: 'student', width: 80 },
    { title: '科目', dataIndex: 'subject', width: 80 },
    { title: '课时', dataIndex: 'hours', width: 80, render: v => <Tag color="red">-{v}节</Tag> },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: v => v === 'completed' 
        ? <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
        : <Tag>进行中</Tag>
    }
  ]

  const handleConfirm = () => {
    message.success('一对一消课成功！')
    setConfirmModal(false)
    form.resetFields()
  }

  return (
    <div className="page-container">
      <Card title="新增一对一课程记录" style={{ marginBottom: 16 }}>
        <Form 
          form={form} 
          layout="vertical"
          onFinish={(values) => {
            setPendingRecord(values)
            setConfirmModal(true)
          }}
        >
          <Space size="large" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item label="上课日期" name="date" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="上课时间" name="time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" minuteStep={30} />
            </Form.Item>
            <Form.Item label="授课老师" name="teacher" rules={[{ required: true }]}>
              <Select 
                placeholder="选择老师" 
                options={teacherOptions}
                onChange={setSelectedTeacher}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="科目" name="subject" rules={[{ required: true }]}>
              <Select 
                placeholder="选择科目" 
                options={subjectOptions}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="课时数" name="hours" rules={[{ required: true }]} initialValue={2}>
              <InputNumber min={0.5} max={4} step={0.5} style={{ width: 100 }} addonAfter="节" />
            </Form.Item>
          </Space>

          <Divider>选择学员</Divider>

          <Table 
            dataSource={mockStudents} 
            columns={studentColumns}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 500 }}
            rowSelection={{
              type: 'radio',
              onChange: (selectedRowKeys, selectedRows) => {
                form.setFieldValue('studentId', selectedRows[0]?.id)
                form.setFieldValue('studentName', selectedRows[0]?.name)
              }
            }}
          />

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" htmlType="submit" icon={<ClockCircleOutlined />}>
                确认消课
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      <Card title="历史记录">
        <Table 
          dataSource={records} 
          columns={recordColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal 
        title="确认消课" 
        open={confirmModal} 
        onCancel={() => setConfirmModal(false)}
        onOk={handleConfirm}
      >
        <p>日期：<b>{pendingRecord?.date?.format('YYYY-MM-DD')}</b></p>
        <p>时间：<b>{pendingRecord?.time?.format('HH:mm')}</b></p>
        <p>老师：<b>{mockTeachers.find(t => t.value === pendingRecord?.teacher)?.label}</b></p>
        <p>科目：<b>{pendingRecord?.subject}</b></p>
        <p>课时：<b style={{ color: '#ff4d4f' }}>{pendingRecord?.hours}节</b></p>
      </Modal>
    </div>
  )
}