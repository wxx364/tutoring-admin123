import { Card, Tabs, Form, Input, InputNumber, Switch, Select, Button, Table, Divider, message } from 'antd'
import StaffManagement from './StaffManagement'

const packageData = [
  { id: 1, name: '期中衔接班', subjects: '数学、物理', hours: 20, price: 600, validMonths: 3, status: 'active' },
  { id: 2, name: '期末冲刺班', subjects: '全科', hours: 30, price: 800, validMonths: 2, status: 'active' },
  { id: 3, name: '暑假强化班', subjects: '数学、英语', hours: 40, price: 1200, validMonths: 2, status: 'inactive' }
]

const packageColumns = [
  { title: '套餐名称', dataIndex: 'name' },
  { title: '科目', dataIndex: 'subjects' },
  { title: '课时', dataIndex: 'hours' },
  { title: '价格', dataIndex: 'price', render: v => `¥${v}` },
  { title: '有效期', dataIndex: 'validMonths', render: v => `${v}个月` },
  { title: '状态', dataIndex: 'status', render: v => v === 'active' ? '上架' : '下架' },
  { title: '操作', render: () => <Button type="link" size="small">编辑</Button> }
]

export default function Settings() {
  const [warningForm] = Form.useForm()
  const [notifyForm] = Form.useForm()

  const handleSave = () => {
    message.success('设置已保存')
  }

  return (
    <div className="page-container">
      <Card>
        <Tabs items={[
          {
            key: 'warning',
            label: '预警设置',
            children: (
              <Form form={warningForm} layout="vertical" style={{ maxWidth: 500 }} onFinish={handleSave}>
                <Form.Item label="课时不足预警阈值" name="warningThreshold" initialValue={3}>
                  <InputNumber min={1} max={10} addonAfter="节" />
                </Form.Item>
                <Form.Item label="过期提前提醒" name="expireWarningDays" initialValue={30}>
                  <InputNumber min={7} max={90} addonAfter="天" />
                </Form.Item>
                <Form.Item label="旷课回访触发" name="absentWarningDays" initialValue={14}>
                  <InputNumber min={7} max={30} addonAfter="天" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">保存设置</Button>
                </Form.Item>
              </Form>
            )
          },
          {
            key: 'notify',
            label: '微信通知',
            children: (
              <Form form={notifyForm} layout="vertical" style={{ maxWidth: 500 }} onFinish={handleSave}>
                <Form.Item label="课时不足提醒" name="lowNotify" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
                <Form.Item label="过期提醒" name="expireNotify" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
                <Form.Item label="消课通知" name="attendanceNotify" valuePropName="checked" initialValue={false}>
                  <Switch />
                </Form.Item>
                <Form.Item label="续费成功提醒" name="renewNotify" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">保存设置</Button>
                </Form.Item>
              </Form>
            )
          },
          {
            key: 'package',
            label: '套餐管理',
            children: (
              <div>
                <Button type="primary" style={{ marginBottom: 16 }}>新增套餐</Button>
                <Table columns={packageColumns} dataSource={packageData} rowKey="id" pagination={false} scroll={{ x: 800 }} style={{ overflowX: 'auto' }} />
              </div>
            )
          },
          {
            key: 'staff',
            label: '员工管理',
            children: <StaffManagement />
          }
        ]} />
      </Card>
    </div>
  )
}