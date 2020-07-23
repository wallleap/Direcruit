/*
消息界面路由容器组件
*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

/*得到所有聊天的最后 msg 组成的数组[msg1, msg2, msg3..]
1. 使用{}进行分组(chat_id), 只保存每个组最后一条 msg: {chat_id1: lastMsg1, chat_id2:lastMsg2}
2. 得到所有分组的 lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
3. 对数组排序(create_time, 降序)
*/
function getLastMsgs(chatMsgs, userid) {
  // 1. 使用{}进行分组(chat_id), 只保存每个组最后一条 msg: {chat_id1: lastMsg1,chat_id2: lastMsg2}
  const lastMsgsObj = {}
  chatMsgs.forEach(msg => {
    // 对msg进行个体的统计(是否未读)
    if(msg.to===userid && !msg.read){
      msg.unReadCount = 1
    }else{
      msg.unReadCount = 0
    }
    // 判断当前 msg 对应的 lastMsg 是否存在
    const chatId = msg.chat_id
    const lastMsg = lastMsgsObj[chatId]
    // 不存在
    if(!lastMsg) {
      // 将 msg 保存为 lastMsg
      lastMsgsObj[chatId] = msg
    } else {// 存在
      // 累加unReadCount=已经统计的+当前msg的
      const unReadCount = lastMsg.unReadCount + msg.unReadCount
      // 如果 msg 的创建时间晚于 lastMsg 的创建时间, 替换
      if (msg.create_time>lastMsg.create_time) {
        lastMsgsObj[chatId] = msg
      }
      // 将unReadCount保存在最新的lastMsg上
      lastMsgsObj[chatId].unReadCount = unReadCount 
    }
  })
  // 2. 得到所有分组的 lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
  const lastMsgs = Object.values(lastMsgsObj)
  // 3. 对数组排序(create_time, 降序)
  lastMsgs.sort(function (msg1, msg2) { // 结果<0，msg1在前
    return msg2.create_time-msg1.create_time
  })
  return lastMsgs
}

class Message extends Component {
  render() {
    // 得到 props 中的 user 和 chat
    const {user, chat} = this.props
    // 得到当前用户的 id
    const meId = user._id
    // 得到所用用户的集合对象 users 和所有聊天的数组
    const {users, chatMsgs} = chat
    // 得到所有聊天的最后消息的数组
    const lastMsgs = getLastMsgs(chatMsgs, meId)

    return (
      <List style={{marginTop:50, marginBottom:50}}>
        {
          lastMsgs.map(msg => {
            const targetUserId = msg.to===user._id ? msg.from : msg.to
            const targetUser = users[targetUserId]
            return (
              <Item
                key={msg._id}
                extra={<Badge text={msg.unReadCount}/>}
                thumb={targetUser.avatar ? require(`../../assets/images/avatars/${targetUser.avatar}.png`) : null}
                arrow='horizontal'
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
              >
                {targetUser.username}
                <Brief>
                  {msg.content}
                </Brief>
              </Item>
            )
          })
        }
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)