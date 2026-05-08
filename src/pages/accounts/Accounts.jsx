import { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Popconfirm,
  message,
  Row,
  Col,
  Grid
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { accountApi } from '../../utils/api'

const { Option } = Select
const { useBreakpoint } = Grid

// 瑙掕壊閫夐」
const ROLE_OPTIONS = [
  { value: 'teacher', label: '鑰佸笀', color: 'blue' },
  { value: 'admin', label: '绠＄悊鍛?, color: 'red' },
  { value: 'parent', label: '瀹堕暱', color: 'green' }
]

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [form] = Form.useForm()
  
  // 鍝嶅簲寮忥紙宸茬粺涓€涓?PC 鎺掔増锛屼繚鐣欏彉閲忛伩鍏嶆姤閿欙級
  const screens = useBreakpoint()
    
  // 鎼滅储鍜岀瓫閫夌姸鎬?  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 鍔犺浇璐﹀彿鍒楄〃
  useEffect(() => {
    loadAccounts()
  }, [pagination.current, pagination.pageSize, searchKeyword, filterRole])

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const result = await accountApi.getList({
        keyword: searchKeyword || undefined,
        role: filterRole !== 'all' ? filterRole : undefined,
        page: pagination.current,
        pageSize: pagination.pageSize
      })
      
      if (result.code === 0) {
        setAccounts(result.data.list)
        setPagination(prev => ({
          ...prev,
          total: result.data.total
        }))
      } else {
        message.error(result.msg || '鍔犺浇澶辫触')
      }
    } catch (err) {
      message.error('缃戠粶閿欒锛岃閲嶈瘯')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 鎵撳紑鏂板/缂栬緫寮圭獥
  const openModal = (record = null) => {
    setEditingAccount(record)
    if (record) {
      form.setFieldsValue({
        name: record.name,
        phone: record.phone,
        role: record.role,
        subjects: record.subjects || []
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 鍏抽棴寮圭獥
  const closeModal = () => {
    setModalVisible(false)
    setEditingAccount(null)
    form.resetFields()
  }

  // 淇濆瓨璐﹀彿
  const handleSave = async (values) => {
    try {
      let result
      
      if (editingAccount) {
        // 缂栬緫
        result = await accountApi.update(editingAccount.id, values)
      } else {
        // 鏂板
        result = await accountApi.create(values)
      }
      
      if (result.code === 0) {
        message.success(editingAccount ? '璐﹀彿鏇存柊鎴愬姛' : '璐﹀彿鍒涘缓鎴愬姛')
        closeModal()
        loadAccounts() // 鍒锋柊鍒楄〃
      } else {
        message.error(result.msg || '淇濆瓨澶辫触')
      }
    } catch (err) {
      message.error('缃戠粶閿欒锛岃閲嶈瘯')
      console.error(err)
    }
  }

  // 鍒犻櫎璐﹀彿
  const handleDelete = async (id) => {
    try {
      const result = await accountApi.delete(id)
      
      if (result.code === 0) {
        message.success('璐﹀彿鍒犻櫎鎴愬姛')
        loadAccounts() // 鍒锋柊鍒楄〃
      } else {
        message.error(result.msg || '鍒犻櫎澶辫触')
      }
    } catch (err) {
      message.error('缃戠粶閿欒锛岃閲嶈瘯')
      console.error(err)
    }
  }

  // 閲嶇疆鎼滅储
  const handleReset = () => {
    setSearchKeyword('')
    setFilterRole('all')
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  // 琛ㄦ牸鍒嗛〉鍙樺寲
  const handleTableChange = (newPagination) => {
    setPagination(newPagination)
  }

  // 琛ㄦ牸鍒楀畾涔夛紙妗岄潰绔級
  const desktopColumns = [
    {
      title: '濮撳悕',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '鎵嬫満鍙?,
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '瑙掕壊',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const option = ROLE_OPTIONS.find(r => r.value === role)
        return (
          <Tag color={option?.color || 'default'}>
            {option?.label || role}
          </Tag>
        )
      }
    },
    {
      title: '鏁欐巿绉戠洰',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <Space wrap>
          {subjects?.length > 0 ? subjects.map(subject => (
            <Tag key={subject} size="small">{subject}</Tag>
          )) : '-'}
        </Space>
      )
    },
    {
      title: '鍒涘缓鏃堕棿',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '鎿嶄綔',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            缂栬緫
          </Button>
          <Popconfirm
            title="纭畾鍒犻櫎姝よ处鍙凤紵"
            description="鍒犻櫎鍚庤鐢ㄦ埛灏嗘棤娉曠櫥褰曞皬绋嬪簭"
            onConfirm={() => handleDelete(record.id)}
            okText="鍒犻櫎"
            cancelText="鍙栨秷"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              鍒犻櫎
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 琛ㄦ牸鍒楀畾涔夛紙绉诲姩绔畝鍖栫増锛?  const mobileColumns = [
    {
      title: '璐﹀彿淇℃伅',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            {record.phone}
          </div>
          <div>
            <Tag color={ROLE_OPTIONS.find(r => r.value === record.role)?.color || 'default'}>
              {ROLE_OPTIONS.find(r => r.value === record.role)?.label || record.role}
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: '鎿嶄綔',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            缂栬緫
          </Button>
          <Popconfirm
            title="纭畾鍒犻櫎锛?
            onConfirm={() => handleDelete(record.id)}
            okText="鍒?
            cancelText="鍚?
            okButtonProps={{ danger: true, size: 'small' }}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />}>
              鍒犻櫎
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="璐﹀彿绠＄悊"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            size={'large'}
          >
            {'鏂板璐﹀彿'}
          </Button>
        }
        bodyStyle={{ padding: 24 }}
      >
        {/* 鎼滅储鍜岀瓫閫?*/}
        <Row 
          gutter={[12, 12]} 
          style={{ marginBottom: 16 }}
          align="middle"
        >
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="鎼滅储濮撳悕鎴栨墜鏈哄彿"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={loadAccounts}
              allowClear
              size={'large'}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              value={filterRole}
              onChange={setFilterRole}
              style={{ width: '100%' }}
              size={'large'}
            >
              <Option value="all">鍏ㄩ儴瑙掕壊</Option>
              {ROLE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              size={'large'}
              
            >
              {'閲嶇疆绛涢€?}
            </Button>
          </Col>
        </Row>

        <Table
          columns={desktopColumns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          style={{ overflowX: 'auto' }}
          style={{ overflowX: 'auto' }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `鍏?${total} 鏉,
            pageSizeOptions: [5, 10, 20, 50],
            size: 'default'
          }}
          onChange={handleTableChange}
          size={'middle'}
        />
      </Card>

      {/* 鏂板/缂栬緫寮圭獥 */}
      <Modal
        title={editingAccount ? '缂栬緫璐﹀彿' : '鏂板璐﹀彿'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="淇濆瓨"
        cancelText="鍙栨秷"
        width={500}
        style={{ top: 100 }}
        bodyStyle={{ 
          maxHeight: '60vh',
          overflow: 'auto',
          padding: '24px'
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 8 }}
          preserve={false}
        >
          <Form.Item
            name="name"
            label="濮撳悕"
            rules={[{ required: true, message: '璇疯緭鍏ュ鍚? }]}
          >
            <Input 
              placeholder="渚嬪锛氱帇鑰佸笀" 
              prefix={<UserOutlined />}
              size={'middle'}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="鎵嬫満鍙?
            rules={[
              { required: true, message: '璇疯緭鍏ユ墜鏈哄彿' },
              { pattern: /^1[3-9]\d{9}$/, message: '鎵嬫満鍙锋牸寮忎笉姝ｇ‘' }
            ]}
          >
            <Input 
              placeholder="渚嬪锛?3800138000" 
              prefix={<PhoneOutlined />} 
              maxLength={11}
              disabled={!!editingAccount}
              size={'middle'}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="瑙掕壊"
            rules={[{ required: true, message: '璇烽€夋嫨瑙掕壊' }]}
          >
            <Select 
              placeholder="璇烽€夋嫨瑙掕壊"
              size={'middle'}
            >
              {ROLE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.role !== curr.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role')
              if (role === 'teacher') {
                return (
                  <Form.Item
                    name="subjects"
                    label="鏁欐巿绉戠洰"
                    rules={[{ required: true, message: '璇疯嚦灏戦€夋嫨涓€涓鐩? }]}
                  >
                    <Select 
                      mode="multiple" 
                      placeholder="璇烽€夋嫨鏁欐巿绉戠洰"
                      size={'middle'}
                    >
                      <Option value="閽㈢惔">閽㈢惔</Option>
                      <Option value="鑸炶箞">鑸炶箞</Option>
                      <Option value="涔︽硶">涔︽硶</Option>
                      <Option value="鍥存">鍥存</Option>
                      <Option value="缇庢湳">缇庢湳</Option>
                      <Option value="鑻辫">鑻辫</Option>
                      <Option value="鏁板">鏁板</Option>
                      <Option value="璇枃">璇枃</Option>
                    </Select>
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>

          <Form.Item
            name="password"
            label={editingAccount ? '鏂板瘑鐮侊紙鐣欑┖琛ㄧず涓嶄慨鏀癸級' : '鍒濆瀵嗙爜'}
            rules={[{ required: !editingAccount, message: '璇疯緭鍏ュ瘑鐮? }]}
            extra={editingAccount ? '' : '榛樿 123456锛屽缓璁敤鎴烽娆＄櫥褰曞悗淇敼'}
          >
            <Input.Password 
              placeholder={editingAccount ? '涓嶄慨鏀硅鐣欑┖' : '璇疯緭鍏?浣嶄互涓婂瘑鐮?}
              size={'middle'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
