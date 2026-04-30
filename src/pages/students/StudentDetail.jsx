import { Card, Descriptions, Tabs, Table, Timeline, Statistic, Row, Col, Button, Tag } from 'antd'

// 模拟数据
const mockAttendanceRecords = [
  { id: 1, date: '2026-04-24', subject: '数学', teacher: '李老师', hours: 2, type: '班课' },
  { id: 2, date: '2026-04-22', subject: '英语', teacher: '王老师', hours: 1.5, type: '一对一' },
  { id: 3, date: '2026-04-20', subject: '物理', teacher: '陈老师', hours: 2, type: '班课' },
  { id: 4, date: '2026-04-18', subject: '化学', teacher: '张老师', hours: 1, type: '晚托' }
]

export default function StudentDetail() {
  const attendanceColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '科目', dataIndex: 'subject', key: 'subject' },
    { title: '老师', dataIndex: 'teacher', key: 'teacher' },
    { title: '课时', dataIndex: 'hours', key: 'hours', render: v => <span style={{ color: '#ff4d4f' }}>-{v}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: v => <Tag>{v}</Tag> }
  ]

  return (
    <div className="page-container">
      <Card>
        <Descriptions title="学员信息" column={2}>
          <Descriptions.Item label="姓名">张明</Descriptions.Item>
          <Descriptions.Item label="年级">四年级</Descriptions.Item>
          <Descriptions.Item label="班级">数学A班</Descriptions.Item>
          <Descriptions.Item label="家长电话">13800138001</Descriptions.Item>
        </Descriptions>
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <Tabs items={[
          {
            key: 'hours',
            label: '课时账户',
            children: (
              <Row gutter={16}>
                <Col span={6}><Statistic title="总购买" value={120} /></Col>
                <Col span={6}><Statistic title="已用" value={87} /></Col>
                <Col span={6}><Statistic title="剩余" value={33} valueStyle={{ color: '#3f8600' }} /></Col>
                <Col span={6}><Statistic title="赠课" value={12} valueStyle={{ color: '#1890ff' }} /></Col>
              </Row>
            )
          },
          {
            key: 'records',
            label: '消课记录',
            children: <Table columns={attendanceColumns} dataSource={mockAttendanceRecords} rowKey="id" pagination={false} />
          }
        ]} />
      </Card>
    </div>
  )
}
