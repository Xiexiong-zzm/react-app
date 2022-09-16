// 登录模块
import { makeAutoObservable } from "mobx"
import { http } from '@/utils/http-request'
import tokenStorage from '@/utils/token'

class LoginStore {
  token = tokenStorage.getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ mobile, code }) => {
    // 调用登录接口
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile, code
    })
    this.token = res.data.token
    tokenStorage.setToken(res.data.token)
  }
  // 退出登录
  loginOut = () => {
    this.token = ''
    tokenStorage.clearToken()
  }
}
export default LoginStore