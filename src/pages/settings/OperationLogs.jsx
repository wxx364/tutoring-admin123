import { Card, Table, Tag, DatePicker } from 'antd'

const logData = [
  { id: 1, time: '2026-04-24 21:30:15', operator: '管理员', action: '课时充值', target: '张明', detail: '充值20课时', ip: '192.168.1.100' },
  { id: 2, time: '2026-04-24 20:15:32', operator: '教务李老师', action: '消课', target: '李华', detail: '数学班课扣2课时', ip: '192.168.1.101' },
  { id: 3, time: '2026-04-24 19:45:00', operator: '系统', action: '自动消课', target: '晚托学员', detail: '晚托自动扣课15人次', ip: '-' },
  { id: 4, time: '2026-04-24 18:20:45', operator: '教务王老师', action: '撤销消课', target: '赵六', detail: '撤销误扣2课时，原因：重复消课', ip: '192.168.1.102' }
]

const columns = [
  { title: '时间', dataIndex: 'time', width: 180 },
  { title: '操作人', dataIndex: 'operator', width: 120 },
  { 
    title: '操作类型', 
    dataIndex: 'action', 
    width: 120,
    render: v => {
      const colorMap = {
        '课时充值': 'blue',
        '消课': 'green',
        '撤销消课': 'orange',
        '自动消课': 'default'
      }
      return <Tag color={colorMap[v] || 'default'}>{v}</Tag>
    }
  },
  { title: '对象', dataIndex: 'target', width: 120 },
  { title: '详情', dataIndex: 'detail' },
  { title: 'IP', dataIndex: 'ip', width: 140 }
]

export default function OperationLogs() {
  return (
    <div className="page-container">
      <Card 
        title="操作日志"
        extra={<DatePicker.RangePicker />}
      >
        <Table 
          columns={columns} 
          dataSource={logData} 
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}
