import { Card, Tabs } from 'antd'
import ClassAttendance from './ClassAttendance'
import OneOnOneAttendance from './OneOnOneAttendance'
import EveningCareAttendance from './EveningCareAttendance'

export default function Attendance() {
  return (
    <div className="page-container">
      <Card>
        <Tabs 
          items={[
            { key: 'class', label: '班课消课', children: <ClassAttendance /> },
            { key: 'one_on_one', label: '一对一消课', children: <OneOnOneAttendance /> },
            { key: 'evening', label: '晚托消课', children: <EveningCareAttendance /> }
          ]} 
        />
      </Card>
    </div>
  )
}