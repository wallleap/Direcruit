/* 
包含n个action creator
同步action
异步action
*/
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST
} from './action-types'
// 引入接口请求函数
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList
} from '../api'

// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg}) // 或省略data
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

// 注册异步action
export const register = (user) => {
  const {username, password, repassword, usertype} = user
  // 前端验证，如果不通过，返回/分发一个errMsg
  if(!username){
    return errorMsg('请输入用户名')
  }
  if(!password){
    return errorMsg('请输入密码')
  }
  if(!repassword){
    return errorMsg('请输入确认密码')
  }
  if(password!==repassword){
    return errorMsg('两次输入的密码不一致，请检查！') 
    // 如果放到dispatch中应该不是return而是dispatch
  }
  // 表单数据合法，返回一个发ajax请求得异步action函数
  return async dispatch => {
    // 发送注册的异步ajax请求
    /*const promise = reqRegister(user) // 应该把repassword去掉
    promise.then(response => {
      const result = response.data // {code: 0/1, data: user, msg: ''}
    })*/
    // await等，这个函数必须声明为async
    const response = await reqRegister({username, password, usertype})
    const result = response.data
    if(result.code===0){ // 成功
      // 分发授权成功的action
      dispatch(authSuccess(result.data))
    }else{ // 失败
      // 分发错误提示信息的action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 登录异步action
export const login = (user) => {
  const {username, password} = user
  // 前端验证，如果不通过，返回/分发一个errMsg
  if(!username){
    return errorMsg('请输入用户名')
  }
  if(!password){
    return errorMsg('请输入密码')
  }

  return async dispatch => {
    // 发送注册的异步ajax请求
    // await等，这个函数必须声明为async
    const response = await reqLogin(user)
    const result = response.data
    if(result.code===0){ // 成功
      // 分发授权成功的action
      dispatch(authSuccess(result.data))
    }else{ // 失败
      // 分发错误提示信息的action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 更新用户异步action
export const updateUser = (user) => {
  return async dispath => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code===0){ // 更新成功：data
      // 分发同步action
      dispath(receiveUser(result.data))
    }else{ // 更新失败：msg
      dispath(resetUser(result.msg))
    }
  }
}

// 获取用户异步action
export const getUser = () => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUser()
    const result = response.data
    if(result.code===0){// 成功
      dispatch(receiveUser(result.data))
    }else{// 失败
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户列表的异步action
export const getUserList = (usertype) => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUserList(usertype)
    const result = response.data
    // 得到结果后，分发一个同步action
    if(result.code===0){
      dispatch(receiveUserList(result.data))
    }
  }
}