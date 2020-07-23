/* 
包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from 'redux'
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
import {getRedirectTo} from '../utils/index'

const initUser = {
  username: '', // 用户名
  usertype: '', // 用户类型 jobhunter/boss
  msg: '', // 错误提示信息
  redirectTo: '' // 需要自动重定向的路由路径
}

// 产生user状态的reducer
function user(state=initUser, action){
  switch(action.type){
    case AUTH_SUCCESS: // data是user 应该跳转到某个页面
      const {usertype, avatar} = action.data
      return {...action.data, redirectTo: getRedirectTo(usertype, avatar)}
    case ERROR_MSG: // data是msg
      return {...state, msg: action.data}
    case RECEIVE_USER: // data是user
      return action.data
    case RESET_USER: // data是msg
      return {...initUser, msg: action.data} // 更新失败(前台数据有问题)
    default:
      return state
  }
}

const initUserList = []
// 产生userlist状态的reducer
function userList(state=initUserList, action){
  switch(action.type){
    case RECEIVE_USER_LIST: // data为userlist
      return action.data
    default:
      return state
  }
}

const initChat = {
  users: {},
  chatMsgs: [],
  unReadCount: 0
}
// 产生聊天状态的reducer
function chat(state=initChat, action){
  switch(action.type){
    case RECEIVE_MSG_LIST: // data: {users, chatMsgs}
      const {users, chatMsgs, userid} = action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid?1:0) ,0)
      }
    case RECEIVE_MSG: // data: chatMsg
      const {chatMsg} = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
      }
    case MSG_READ:
      const {from, to, count} = action.data
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if(msg.from===from && msg.to===to && !msg.read){ // 需要更新
            // msg.read = true // 不能直接修改状态
            return {...msg, read: true}
          }else{ // 不需要
            return msg
          }
        }),
        unReadCount: state.unReadCount-count
      }
    default:
      return state
  }
}

export default combineReducers({
  user,
  userList,
  chat
})
// 向外暴露的状态的结构： {user: {}, userList: [], chat: {}}