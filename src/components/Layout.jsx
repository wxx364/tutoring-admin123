import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Badge, Button } from 'antd'
import { 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  WarningOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  KeyOutlined
} from '@ant-design/icons'
import { useAuthStore } from '../stores/auth'

const { Header, Sider, Content } = AntLayout

const menuItems = [
  { key: '/students', icon: <TeamOutlined />, label: '学员管理' },
  { key: '/attendance', icon: <CalendarOutlined />, label: '消课管理' },
  { key: '/warnings', icon: <WarningOutlined />, label: '预警中心' },
  { key: '/reports', icon: <BarChartOutlined />, label: '数据报表' },
  { key: '/accounts', icon: <KeyOutlined />, label: '账号管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' }
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true }
  ]

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout()
      navigate('/login')
    }
  }

  const getSelectedKey = () => {
    const path = location.pathname
    if (path.startsWith('/students')) return '/students'
    if (path.startsWith('/attendance')) return '/attendance'
    if (path.startsWith('/warnings')) return '/warnings'
    if (path.startsWith('/reports')) return '/reports'
    if (path.startsWith('/accounts')) return '/accounts'
    if (path.startsWith('/settings')) return '/settings'
    return '/students'
  }

  // 侧边栏菜单内容
  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ borderRight: 0 }}
    />
  )

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 - 所有设备保持相同排版 */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{ background: '#fff', overflow: 'auto' }}
        width={200}
        collapsedWidth={80}
        breakpoint={null}
        trigger={null}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 16px'
        }}>
          <span style={{ 
            fontSize: collapsed ? 16 : 18, 
            fontWeight: 700, 
            color: '#4A7BF7',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {collapsed ? '课时' : '课时管理系统'}
          </span>
        </div>
        {menuContent}
      </Sider>

      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 500
          }}>
            {menuItems.find(m => m.key === getSelectedKey())?.label || '首页'}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={3} size="small">
              <Button 
                icon={<BellOutlined />} 
                type="text"
                style={{ fontSize: 18 }}
              />
            </Badge>
            <Menu
              mode="horizontal"
              selectable={false}
              items={[{ 
                key: 'user',
                icon: <Avatar icon={<UserOutlined />} style={{ background: '#4A7BF7' }} />,
                label: user?.name || '管理员'
              }]}
              onClick={handleUserMenuClick}
            />
          </div>
        </Header>
        
        <Content style={{ background: '#f5f6fa' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}
