// 用户信息
import { makeAutoObservable } from "mobx"
import { http } from "@/utils/http-request"

class UserStore {
  userInfo = {};
  constructor() {
    makeAutoObservable(this)
  }
  async getUserInfo () {
    const res = await http.get('/user/profile')
    this.userInfo = res.data
  }
}

export default UserStore
