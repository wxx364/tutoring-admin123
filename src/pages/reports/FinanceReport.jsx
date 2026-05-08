import { useState } from 'react'
import { Card, Table, DatePicker, Button, Row, Col, Statistic, Tag, Space, Tabs, Modal, message } from 'antd'
import { DollarOutlined, ExportOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

// 模拟收入数据
const incomeData = [
  { id: 1, date: '2026-04-28', student: '张明', subject: '数学', hours: 20, price: 600, amount: 600, paymentMethod: '微信', status: 'paid' },
  { id: 2, date: '2026-04-27', student: '李华', subject: '英语', hours: 30, price: 25, amount: 750, paymentMethod: '支付宝', status: 'paid' },
  { id: 3, date: '2026-04-26', student: '王芳', subject: '物理', hours: 15, price: 30, amount: 450, paymentMethod: '现金', status: 'paid' },
  { id: 4, date: '2026-04-25', student: '赵六', subject: '化学', hours: 10, price: 35, amount: 350, paymentMethod: '微信', status: 'paid' },
  { id: 5, date: '2026-04-24', student: '孙七', subject: '数学', hours: 40, price: 28, amount: 1120, paymentMethod: '银行转账', status: 'pending' }
]

// 模拟支出数据
const expenseData = [
  { id: 1, date: '2026-04-28', category: '教师工资', description: '李老师 4月工资', amount: 8000, status: 'paid' },
  { id: 2, date: '2026-04-28', category: '场地租金', description: '5月租金', amount: 5000, status: 'paid' },
  { id: 3, date: '2026-04-27', category: '教材采购', description: '数学教材 50本', amount: 1500, status: 'paid' },
  { id: 4, date: '2026-04-20', category: '教师工资', description: '王老师 4月工资', amount: 7000, status: 'paid' },
  { id: 5, date: '2026-04-15', category: '运营支出', description: '水电费', amount: 800, status: 'pending' }
]

// 模拟对账数据
const reconciliationData = [
  { id: 1, date: '2026-04-28', income: 600, expense: 13000, profit: -12400, note: '支付教师工资' },
  { id: 2, date: '2026-04-27', income: 750, expense: 0, profit: 750, note: '' },
  { id: 3, date: '2026-04-26', income: 450, expense: 1500, profit: -1050, note: '采购教材' },
  { id: 4, date: '2026-04-25', income: 350, expense: 0, profit: 350, note: '' },
  { id: 5, date: '2026-04-24', income: 1120, expense: 7000, profit: -5880, note: '支付王老师工资' }
]

const incomeColumns = [
  { title: '日期', dataIndex: 'date', width: 100 },
  { title: '学员', dataIndex: 'student', width: 80 },
  { title: '科目', dataIndex: 'subject', width: 80 },
  { title: '购买课时', dataIndex: 'hours', width: 100 },
  { title: '单价', dataIndex: 'price', width: 80, render: v => `¥${v}/节` },
  { title: '金额', dataIndex: 'amount', width: 100, render: v => <b style={{ color: '#52c41a' }}>¥{v}</b> },
  { title: '支付方式', dataIndex: 'paymentMethod', width: 100 },
  { 
    title: '状态', 
    dataIndex: 'status', 
    width: 80,
    render: v => v === 'paid' 
      ? <Tag color="success" icon={<CheckCircleOutlined />}>已收款</Tag>
      : <Tag color="warning">待收款</Tag>
  }
]

const expenseColumns = [
  { title: '日期', dataIndex: 'date', width: 100 },
  { title: '类别', dataIndex: 'category', width: 100 },
  { title: '说明', dataIndex: 'description', width: 200 },
  { title: '金额', dataIndex: 'amount', width: 120, render: v => <b style={{ color: '#ff4d4f' }}>-¥{v}</b> },
  { 
    title: '状态', 
    dataIndex: 'status', 
    width: 80,
    render: v => v === 'paid' 
      ? <Tag color="success">已支付</Tag>
      : <Tag color="warning">待支付</Tag>
  }
]

const reconciliationColumns = [
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '收入', dataIndex: 'income', width: 120, render: v => <span style={{ color: '#52c41a' }}>¥{v}</span> },
  { title: '支出', dataIndex: 'expense', width: 120, render: v => <span style={{ color: '#ff4d4f' }}>¥{v}</span> },
  { 
    title: '利润', 
    dataIndex: 'profit', 
    width: 120,
    render: v => <b style={{ color: v >= 0 ? '#52c41a' : '#ff4d4f' }}>¥{v}</b>
  },
  { title: '备注', dataIndex: 'note', width: 200 }
]

export default function FinanceReport() {
  const [activeTab, setActiveTab] = useState('income')

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0)
  const totalProfit = totalIncome - totalExpense

  const handleExport = () => {
    message.success('财务数据导出成功！')
  }

  return (
    <div className="page-container">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="总收入" value={totalIncome} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总支出" value={totalExpense} prefix="¥" valueStyle={{ color: '#ff4d4f' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="净利润" value={totalProfit} prefix="¥" valueStyle={{ color: totalProfit >= 0 ? '#52c41a' : '#ff4d4f' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待收款" value={incomeData.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)} prefix="¥" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
      </Row>

      <Card>
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button icon={<ExportOutlined />} onClick={handleExport}>导出报表</Button>
          }
          items={[
            { key: 'income', label: '收入记录', children: (
              <Table dataSource={incomeData} columns={incomeColumns} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
            )},
            { key: 'expense', label: '支出记录', children: (
              <Table dataSource={expenseData} columns={expenseColumns} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
            )},
            { key: 'reconciliation', label: '收支汇总', children: (
              <Table dataSource={reconciliationData} columns={reconciliationColumns} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}><b>合计</b></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}><b style={{ color: '#52c41a' }}>¥{totalIncome}</b></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}><b style={{ color: '#ff4d4f' }}>¥{totalExpense}</b></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}><b style={{ color: totalProfit >= 0 ? '#52c41a' : '#ff4d4f' }}>¥{totalProfit}</b></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            )}
          ]} 
        />
      </Card>
    </div>
  )
}