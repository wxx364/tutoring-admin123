import { Card, Tabs, Table, DatePicker, Button, Row, Col, Statistic } from 'antd'
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons'

const dailyData = [
  { date: '2026-04-24', classCount: 3, oneOnOneCount: 2, eveningCount: 5, totalHours: 18, totalStudents: 10 },
  { date: '2026-04-23', classCount: 4, oneOnOneCount: 1, eveningCount: 6, totalHours: 21, totalStudents: 11 },
  { date: '2026-04-22', classCount: 2, oneOnOneCount: 3, eveningCount: 4, totalHours: 15, totalStudents: 9 }
]

const teacherData = [
  { rank: 1, name: '李老师', hours: 45, students: 12 },
  { rank: 2, name: '王老师', hours: 38, students: 10 },
  { rank: 3, name: '张老师', hours: 32, students: 8 }
]

const columns = {
  daily: [
    { title: '日期', dataIndex: 'date' },
    { title: '班课', dataIndex: 'classCount' },
    { title: '一对一', dataIndex: 'oneOnOneCount' },
    { title: '晚托', dataIndex: 'eveningCount' },
    { title: '总课时', dataIndex: 'totalHours', render: v => <b>{v}</b> },
    { title: '学员数', dataIndex: 'totalStudents' }
  ],
  teacher: [
    { title: '排名', dataIndex: 'rank', render: v => <b>#{v}</b> },
    { title: '老师', dataIndex: 'name' },
    { title: '耗课课时', dataIndex: 'hours', render: v => <b style={{ color: '#1890ff' }}>{v}</b> },
    { title: '学员数', dataIndex: 'students' }
  ]
}

export default function Reports() {
  return (
    <div className="page-container">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="本月耗课" value={156} suffix="课时" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="本月营收" value={23400} prefix="¥" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="剩余库存" value={1250} suffix="课时" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="续费转化率" value={68} suffix="%" /></Card>
        </Col>
      </Row>

      <Card>
        <Tabs 
          items={[
            { 
              key: 'daily', 
              label: '每日课消', 
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <DatePicker.RangePicker style={{ marginRight: 16 }} />
                    <Button>导出Excel</Button>
                  </div>
                  <Table columns={columns.daily} dataSource={dailyData} rowKey="date" />
                </div>
              ) 
            },
            { 
              key: 'teacher', 
              label: '老师业绩', 
              children: <Table columns={columns.teacher} dataSource={teacherData} rowKey="rank" /> 
            },
            { 
              key: 'finance', 
              label: '财务对账', 
              children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>财务报表开发中...</div> 
            }
          ]} 
        />
      </Card>
    </div>
  )
}
