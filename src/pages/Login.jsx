import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuthStore } from '../stores/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    try {
      // TODO: 实际调用登录API
      // const res = await api.login(values)
      
      // 模拟登录
      if (values.username === 'admin' && values.password === '123456') {
        login({ id: 1, name: '管理员', role: 'admin' }, 'mock-token')
        message.success('登录成功')
        navigate('/')
      } else {
        message.error('用户名或密码错误')
      }
    } catch (err) {
      message.error('登录失败')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4A7BF7, #6C5CE7)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#4A7BF7' }}>
            教培课时管理系统
          </div>
          <div style={{ color: '#999', marginTop: 8 }}>
            PC管理后台
          </div>
        </div>
        <Form form={form} onFinish={handleSubmit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
          测试账号：admin / 123456
        </div>
      </Card>
    </div>
  )
}
