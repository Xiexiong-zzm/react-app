//  React:框架核心包
//  ReactDoM 专门做渲染相关的包
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.min.css'
// 全局样式
import './index.scss'
// 根组件
import App from './App'

// 创建一个id为root的根节点
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // 去掉严格节点模式
  // useEffect的执行时机
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
)
