// 1. 识别常规的变量
const name = 'alex'

// 2. 原生js方法调用
const getAge = () => { return 20 }

// React实现列表渲染
// 技术方案：map
// 注意遍历列表时需要指定一个独一无二的key值，提供给react用作diff比较 
const props = [
  { id: 1, name: 'aaa' },
  { id: 2, name: 'bbb' },
  { id: 3, name: 'ccc' }
]

// 模板抽离---尽量精简
const getpage = (page) => {
  if (page === 1) {
    return <p>1111</p>
  }
  if (page === 2) {
    return <p>222</p>
  }
  if (page === 3) {
    return <p>333</p>
  }
}

// 函数组件的创建和渲染
import React from 'react'
function Hello () {
  const childHandler = () => {
    console.log('函数组件中事件被触发')
  }
  return <div onClick={childHandler}>hello</div>
}

// 类组件的创建和渲染
class HelloComponent extends React.Component {
  // 事件回调函数（标准写法 避免this指向问题）
  clickHandler = () => {
    console.log('类组件中事件被触发')
  }
  state = {
    count: 0
  }
  change = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
  render () {
    // return <div onClick={this.clickHandler}></div>
    return <button onClick={this.change}>{this.state.count}</button>
  }
}
function App () {
  return (
    <div className="App">
      <p>{name}</p>
      <p>{getAge()}</p>
      {/* 3. 三元运算 */}
      <p>{1 > 0 ? 222 : 2}</p>
      <ul>
        {props.map(prop => { return <li key={prop.id}>{prop.name}</li> })}
      </ul>
      {getpage(1)}
      <Hello />
      <HelloComponent />
    </div>
  )
}

export default App
