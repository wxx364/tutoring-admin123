import { Card, Tabs } from 'antd'
import ClassAttendance from './ClassAttendance'

export default function Attendance() {
  return (
    <div className="page-container">
      <Card>
        <Tabs 
          items={[
            { key: 'class', label: '班课消课', children: <ClassAttendance /> },
            { key: 'one_on_one', label: '一对一消课', children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>一对一消课功能开发中...</div> },
            { key: 'evening', label: '晚托消课', children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>晚托自动消课功能开发中...</div> }
          ]} 
        />
      </Card>
    </div>
  )
}
