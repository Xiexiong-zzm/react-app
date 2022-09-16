import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'

const { Header, Sider } = Layout

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to='/'>数据概览</Link>,
  },
  {
    key: '/article',
    icon: <DiffOutlined />,
    label: <Link to="/article">内容管理</Link>,
  },
  {
    key: '/publish',
    icon: <EditOutlined />,
    label: <Link to='/publish'> 发布文章</Link>,
  },
]
const PCLayout = () => {
  const location = useLocation()
  const selectedKey = location.pathname
  const { userStore } = useStore()
  const { loginStore } = useStore()
  // 获取用户数据
  useEffect(() => {
    try {
      userStore.getUserInfo()
    } catch (e) {
      throw new Error(e)
    }
  }, [useStore])
  const navigate = useNavigate()
  const onLoginout = () => {
    loginStore.loginOut()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={onLoginout}
              title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            items={menuItems}
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(PCLayout)