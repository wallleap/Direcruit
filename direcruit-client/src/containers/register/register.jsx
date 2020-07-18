/*
  注册路由组件
*/

import React, { Component } from 'react';
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'

const ListItem = List.Item

class Register extends Component {
  state = {
    username: '', // 用户名
    password: '', // 密码
    repassword: '', // 确认密码
    usertype: 'jobhunter', // 用户类型 jobhunter/boss
  }

  // 点击注册调用
  register = () => {
    // console.log(this.state);
    this.props.register(this.state)
  }

  // 处理输入数据的改变：更新对应的状态
  handleChange = (name, val) => {
    // 更新状态
    this.setState({
      [name]: val // 属性名不是name，而是name变量的值，这里[]并不是数组
    })
  }

  toLogin = () => {
    this.props.history.replace('./login')
  }

  render() {
    const {usertype} = this.state
    const {msg, redirectTo} = this.props.user
    // 如果redirectTo有值(注册/登录成功)，就要重定向到指定的路由
    if(redirectTo){
      return <Redirect to={redirectTo} />
    }
    return (
      <div>
        <NavBar>某&nbsp;某&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          <List>
            {msg ? <div className='error-msg'>{msg}</div> : null}
            <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username', val)}}>用户名 : </InputItem>
            <WhiteSpace />
            <InputItem placeholder='请输入密码' type="password" onChange={val => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码 : </InputItem>
            <WhiteSpace />
            <InputItem placeholder='请再次输入密码' type="password" onChange={val => {this.handleChange('repassword', val)}}>确认密码 : </InputItem>
            <WhiteSpace />
            <ListItem>
              <span>用户类型 : </span>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={usertype==='jobhunter'} onChange={() => this.handleChange('usertype', 'jobhunter')}>求职者</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={usertype==='boss'} onChange={() => this.handleChange('usertype', 'boss')}>老板</Radio>
            </ListItem>
            <WhiteSpace />
            <Button type="primary" onClick={this.register}>注册</Button>
            <WhiteSpace />
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {register}
)(Register)