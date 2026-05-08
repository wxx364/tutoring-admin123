import { useState } from 'react'
import { Card, Table, Tag, Button, Space, DatePicker, message, Modal, List, Checkbox, Divider, Statistic, Row, Col } from 'antd'
import { CheckCircleOutlined, UnorderedListOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

// 模拟晚托学员数据
const mockEveningStudents = [
  { id: 1, name: '张明', grade: '四年级', classroom: '晚托A班', checkInTime: '18:30', hours: 2, remainingHours: 45, status: 'checked_in' },
  { id: 2, name: '李华', grade: '三年级', classroom: '晚托A班', checkInTime: '18:25', hours: 2, remainingHours: 30, status: 'checked_in' },
  { id: 3, name: '王芳', grade: '二年级', classroom: '晚托B班', checkInTime: null, hours: 1.5, remainingHours: 20, status: 'not_checked_in' },
  { id: 4, name: '赵六', grade: '一年级', classroom: '晚托B班', checkInTime: null, hours: 2, remainingHours: 15, status: 'not_checked_in' }
]

// 模拟已消课记录
const mockCompletedRecords = [
  { id: 1, date: '2026-04-28', classroom: '晚托A班', count: 15, hours: 30, operator: '李老师' },
  { id: 2, date: '2026-04-27', classroom: '晚托A班', count: 14, hours: 28, operator: '李老师' },
  { id: 3, date: '2026-04-26', classroom: '晚托B班', count: 12, hours: 24, operator: '王老师' }
]

const classroomOptions = [
  { value: 'all', label: '全部班级' },
  { value: 'evening-a', label: '晚托A班' },
  { value: 'evening-b', label: '晚托B班' }
]

export default function EveningCareAttendance() {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [students, setStudents] = useState(mockEveningStudents)
  const [confirmModal, setConfirmModal] = useState(false)

  const checkedInStudents = students.filter(s => s.status === 'checked_in')
  const notCheckedInStudents = students.filter(s => s.status === 'not_checked_in')

  const columns = [
    { 
      title: '状态', 
      key: 'status', 
      width: 80,
      render: (_, record) => record.status === 'checked_in'
        ? <Tag color="success" icon={<CheckCircleOutlined />}>已到校</Tag>
        : <Tag color="default">未到校</Tag>
    },
    { title: '姓名', dataIndex: 'name', width: 80 },
    { title: '年级', dataIndex: 'grade', width: 80 },
    { title: '班级', dataIndex: 'classroom', width: 100 },
    { 
      title: '签到时间', 
      dataIndex: 'checkInTime', 
      width: 100,
      render: v => v || '-'
    },
    { title: '今日课时', dataIndex: 'hours', width: 80, render: v => `${v}节` },
    { 
      title: '剩余课时', 
      dataIndex: 'remainingHours', 
      width: 100,
      render: v => <Tag color={v <= 5 ? 'error' : 'default'}>{v}节</Tag>
    }
  ]

  const recordColumns = [
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '班级', dataIndex: 'classroom', width: 100 },
    { title: '到校人数', dataIndex: 'count', width: 100 },
    { title: '总课时', dataIndex: 'hours', width: 100, render: v => <Tag color="red">-{v}节</Tag> },
    { title: '操作人', dataIndex: 'operator', width: 100 }
  ]

  const handleAutoCheckIn = (classroom) => {
    const updated = students.map(s => {
      if (classroom === 'all' || s.classroom === classroom) {
        return { ...s, status: 'checked_in', checkInTime: '18:00' }
      }
      return s
    })
    setStudents(updated)
    message.success('批量签到成功！')
  }

  const handleBatchDeduct = () => {
    const count = checkedInStudents.length
    const totalHours = checkedInStudents.reduce((sum, s) => sum + s.hours, 0)
    message.success(`晚托消课成功！共 ${count} 人签到，扣除 ${totalHours} 课时`)
    setConfirmModal(false)
  }

  return (
    <div className="page-container">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="今日到校" value={checkedInStudents.length} suffix={`/ ${students.length}`} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日总课时" value={checkedInStudents.reduce((sum, s) => sum + s.hours, 0)} suffix="节" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="晚托A班" value={students.filter(s => s.classroom === '晚托A班').length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="晚托B班" value={students.filter(s => s.classroom === '晚托B班').length} /></Card>
        </Col>
      </Row>

      <Card title="今日到校情况" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>日期：</span>
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <span style={{ marginLeft: 16 }}>快速操作：</span>
          <Button onClick={() => handleAutoCheckIn('evening-a')}>晚托A班批量签到</Button>
          <Button onClick={() => handleAutoCheckIn('evening-b')}>晚托B班批量签到</Button>
          <Button onClick={() => handleAutoCheckIn('all')}>全部批量签到</Button>
        </div>

        <Table 
          dataSource={students} 
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 700 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5}>
                <b>汇总</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Tag color="success">{checkedInStudents.length} 人到校</Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <Tag color="red">-{checkedInStudents.reduce((sum, s) => sum + s.hours, 0)}节</Tag>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setStudents(students.map(s => ({ ...s, status: 'checked_in', checkInTime: s.checkInTime || '18:00' })))}>
              全选到校
            </Button>
            <Button onClick={() => setStudents(students.map(s => ({ ...s, status: 'not_checked_in', checkInTime: null })))}>
              全选未到
            </Button>
            <Button 
              type="primary" 
              onClick={() => setConfirmModal(true)}
              disabled={checkedInStudents.length === 0}
              icon={<CheckCircleOutlined />}
            >
              确认消课 ({checkedInStudents.length}人)
            </Button>
          </Space>
        </div>
      </Card>

      <Card title="历史消课记录">
        <Table 
          dataSource={mockCompletedRecords} 
          columns={recordColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal 
        title="确认晚托消课" 
        open={confirmModal} 
        onCancel={() => setConfirmModal(false)}
        onOk={handleBatchDeduct}
      >
        <p>日期：<b>{selectedDate.format('YYYY-MM-DD')}</b></p>
        <p>到校人数：<b>{checkedInStudents.length}</b> 人</p>
        <p>合计课时：<b style={{ color: '#ff4d4f' }}>-{checkedInStudents.reduce((sum, s) => sum + s.hours, 0)}节</b></p>
      </Modal>
    </div>
  )
}