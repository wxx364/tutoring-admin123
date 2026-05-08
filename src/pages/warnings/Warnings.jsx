import { Card, Table, Tag, Button, Tabs, Statistic, Row, Col, Progress } from 'antd'
import { WarningOutlined, ClockCircleOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons'

const lowHoursData = [
  { id: 1, name: '王芳', grade: '高一', subject: '化学', remaining: 2, expireDate: '2026-05-31' },
  { id: 2, name: '赵六', grade: '初三', subject: '英语', remaining: 0, expireDate: '2026-04-30' },
  { id: 3, name: '张明', grade: '四年级', subject: '物理', remaining: 3, expireDate: '2026-07-31' }
]

const expireData = [
  { id: 1, name: '赵六', grade: '初三', remaining: 0, expireDate: '2026-04-30', daysLeft: 5 },
  { id: 2, name: '王芳', grade: '高一', remaining: 2, expireDate: '2026-05-31', daysLeft: 36 }
]

const absentData = [
  { id: 1, name: '李华', grade: '初二', lastAttendance: '2026-04-10', daysAbsent: 15 },
  { id: 2, name: '张伟', grade: '高二', lastAttendance: '2026-04-05', daysAbsent: 20 }
]

const columns = {
  low: [
    { title: '姓名', dataIndex: 'name' },
    { title: '年级', dataIndex: 'grade' },
    { title: '科目', dataIndex: 'subject' },
    { title: '剩余', dataIndex: 'remaining', render: v => <Tag color="error">{v}节</Tag> },
    { title: '有效期', dataIndex: 'expireDate' },
    { title: '操作', render: () => <Button type="link" size="small">发送提醒</Button> }
  ],
  expire: [
    { title: '姓名', dataIndex: 'name' },
    { title: '年级', dataIndex: 'grade' },
    { title: '剩余课时', dataIndex: 'remaining' },
    { title: '到期日', dataIndex: 'expireDate' },
    { title: '剩余天数', dataIndex: 'daysLeft', render: v => <Tag color={v <= 7 ? 'error' : 'warning'}>{v}天</Tag> },
    { title: '操作', render: () => <Button type="link" size="small">通知续费</Button> }
  ],
  absent: [
    { title: '姓名', dataIndex: 'name' },
    { title: '年级', dataIndex: 'grade' },
    { title: '最后上课', dataIndex: 'lastAttendance' },
    { title: '旷课天数', dataIndex: 'daysAbsent', render: v => <Tag color="warning">{v}天</Tag> },
    { title: '操作', render: () => <Button type="link" size="small">标记回访</Button> }
  ]
}

export default function Warnings() {
  return (
    <div className="page-container">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="课时不足" value={3} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="即将过期" value={2} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="长期旷课" value={2} prefix={<UserOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待续费意向" value={5} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs items={[
          { key: 'low', label: '课时不足预警', children: <Table columns={columns.low} dataSource={lowHoursData} rowKey="id" pagination={false} scroll={{ x: 800 }} style={{ overflowX: 'auto' }} /> },
          { key: 'expire', label: '即将过期', children: <Table columns={columns.expire} dataSource={expireData} rowKey="id" pagination={false} scroll={{ x: 800 }} style={{ overflowX: 'auto' }} /> },
          { key: 'absent', label: '长期旷课', children: <Table columns={columns.absent} dataSource={absentData} rowKey="id" pagination={false} scroll={{ x: 800 }} style={{ overflowX: 'auto' }} /> }
        ]} />
      </Card>
    </div>
  )
}
