/*
求职者信息完善的路由容器组件
*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
  NavBar,
  InputItem,
  TextareaItem,
  WhiteSpace,
  Button
} from 'antd-mobile'

import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {updateUser} from '../../redux/actions'
import {getRedirectTo} from '../../utils'

class JobhunterInfo extends Component {
  
  state = {
    avatar: '', //头像名称
    post: '', //职位
    info: '', //个人或职位简介
  }

  // 更新avatar状态
  setAvatar = (avatar) => {
    this.setState({
      avatar
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value  // 取得是name的值
    })
  }

  save = () => {
    // console.log(this.state)
    this.props.updateUser(this.state)
  }

  render() {
    const {avatar, usertype} = this.props.user
    if(avatar){ // 有值，用户信息已完善，应该重定向到相应主页面
      // const path = usertype==='boss' ? '/boss' : '/jobhunter'
      const path = getRedirectTo(usertype, avatar)
      return <Redirect to={path}/>
    }

    return (
      <div>
        <NavBar>求职者信息完善</NavBar>
        <AvatarSelector setAvatar={this.setAvatar} />
        <WhiteSpace/>
        <InputItem onChange={val => {this.handleChange('post', val)}} placeholder="请输入求职岗位">求职岗位:</InputItem>
        <TextareaItem onChange={val => {this.handleChange('info', val)}} title="个人介绍:" 
                      rows={3}
                      placeholder="请输入个人介绍"
        />
        <Button onClick={this.save} type="primary">保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(JobhunterInfo)