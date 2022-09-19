import img404 from '@/assets/error.png'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
// 语言文件
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from "react"
import { Popconfirm, Table, Tag, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import { http } from '@/utils/http-request'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()

  const [articleData, setArticleData] = useState({
    list: [], // 文章列表
    count: 0 // 文章数量
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  // 获取文章列表
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data

      setArticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])
  // 列表部分
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => formatStatus(data)
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>

          </Space>
        )
      },
      fixed: 'right'
    }
  ]

  /* 表单筛选功能实现 */
  const onFinish = (values) => {
    const { channel_id, date, status } = values
    // 数据处理
    const _params = {}
    // 格式化status
    _params.status = status

    // 初始化频道
    if (channel_id) {
      _params.channel_id = channel_id
    }

    // 初始化时间
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }

    // 修改params数据，副作用函数执行，请求接口
    setParams({
      ...params,
      ..._params
    })
  }

  // 翻页实现
  const pageChange = (page, per_page) => {
    setParams({
      ...params,
      page,
      per_page
    })
  }

  const formatStatus = (type) => {
    const TYPES = {
      1: <Tag color="red">审核失败</Tag>,
      2: <Tag color="green">审核成功</Tag>
    }
    return TYPES[type]
  }

  // 编辑文章
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }
  // 删除文章
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: '' }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={
            {
              pageSize: params.per_page,
              total: articleData.count,
              onChange: pageChange,
              current: params.page
            }
          }
          bordered
        />
      </Card>
    </div>
  )
}
export default observer(Article)