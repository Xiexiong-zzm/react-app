import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { http } from '@/utils/http-request'

const { Option } = Select

const Publish = () => {
  const { channelStore } = useStore()

  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 暂存图片
  const cacheImgList = useRef([])
  const onUploadChange = ({ fileList }) => {
    // 做数据格式化
    const formatList = fileList.map(file => {
      // 上传完毕进行数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 否则在上传中，不做处理
      return file
    })
    setFileList(formatList)
    // 同时把图片列表存入仓库一份
    cacheImgList.current = formatList
  }
  // 切换图片
  const [imgCount, setImageCount] = useState(1)
  const radioChange = (e) => {
    // 获取元素值
    const rawValue = e.target.value
    setImageCount(rawValue)
    // 无图模式
    if (cacheImgList.current.length === 0) {
      return false
    }
    // 单图模式
    if (rawValue === 1) {
      const img = cacheImgList.current[0]
      setFileList([img])
      // 多图模式
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current)
    }
  }

  // 提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    // 判断type fileList 是匹配的才能正常提交
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)

      }
    }

    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }
    // 跳转列表 提示用户
    navigate('/article')
    message.success(`${id ? '更新成功' : '发布成功'}`)
  }

  // 编辑功能
  const [params] = useSearchParams()
  const id = params.get('id')

  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const data = res.data

      // 表单数据回填
      form.setFieldsValue({ ...data, type: data.cover.type })
      // 回填upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)

      // 暂存列表里也存一份
      cacheImgList.current = formatImgList
      // 图片type
      setImageCount(data.cover.type)
    }
    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail()
    }
  }, [id, form])
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>发布文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map(item => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item>
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              multiple={imgCount > 1}
              maxCount={imgCount}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish