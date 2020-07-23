/*
个人中心界面路由容器组件
*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'
import {getRedirectTo} from '../../utils'
import {withRouter} from 'react-router-dom'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component {

  logout = () => {
    Modal.alert('退出', '确认退出登录吗?', [
      {
        text: '取消',
        onPress: () => console.log('cancel')
      },
      {
        text: '确认',
        onPress: () => {
          // 清除 cookie 中的 userid
          Cookies.remove('userid')
          // 重置 redux 中的 user 状态
          this.props.resetUser()
        }
      }
    ])
  }

  updateInfo = () => {
    const path = getRedirectTo(this.props.user.usertype, 'updateAvatar')
    this.props.history.replace(path)
  }

  render() {
    const {username, avatar, company, info, post, salary} = this.props.user  // {username, usertype, avatar, company, info, post, salary}
    return (
      <div style={{marginTop: 50}}>
        <Result 
          img={<img src={require(`../../assets/images/avatars/${avatar}.png`)} style={{width: 50}} alt="avatar"/>}
          title={username}
          message={company}
        />
        <List>
          <Item extra={<Button onClick={this.updateInfo} size="small" inline icon={require('../../assets/images/imgs/edit.png')}>修改信息</Button>}>相关信息</Item>
          <Item multipleLine>
            <Brief>职位：{post}</Brief>
            <Brief>简介：{info}</Brief>
            {salary ? <Brief>薪资：{salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace/>
        <List>
        <Button onClick={this.logout} type='warning'>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default withRouter(
  connect(
    state => ({user: state.user}),
    {resetUser}
  )(Personal)
) 
