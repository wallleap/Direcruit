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
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from './action-types'
// 引入接口请求函数
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg
} from '../api'
// 引入客户端 io
import io from 'socket.io-client'

// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg}) // 或省略data
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
// 读取了某个聊天消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

/*
单例对象：
1、创建对象之前：判断对象是否已经存在，只有不存在才创建
2、创建对象之后：保存对象
*/
function initIO(dispatch, userid) {
  if(!io.socket){
    // 连接服务器, 得到代表连接的 socket 对象
    io.socket = io('ws://localhost:5000')
    // 绑定'receiveMessage'的监听, 来接收服务器发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('浏览器端接收到消息:', chatMsg)
      // 只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
      if(userid===chatMsg.from || userid===chatMsg.to){
        dispatch(receiveMsg(chatMsg, userid))
      }
    })
  }
}

// 异步获取消息列表数据
async function getMsgList(dispatch, userid){
  initIO(dispatch, userid)
  const response = await reqChatMsgList()
  const result = response.data
  if(result.code===0){
    const {users, chatMsgs} = result.data
    // 分发同步action
    dispatch(receiveMsgList({users, chatMsgs, userid}))
  }
}

// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('发送消息', {from, to, content})
    // 发消息
    io.socket.emit('sendMsg', {from, to, content})
  }
}

// 读取消息的异步action
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from)
    const result = response.data
    if(result.code===0){
      const count = result.data
      dispatch(msgRead({count, from, to}))
    }
  }
}

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
      getMsgList(dispatch, result.data._id)
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
      getMsgList(dispatch, result.data._id)
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
      getMsgList(dispatch, result.data._id)
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
