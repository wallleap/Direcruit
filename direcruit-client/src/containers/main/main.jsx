/*
  主界面路由组件
*/

import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie' // 可以操作前端cookie的对象 set()/get()/remove()
import {NavBar} from 'antd-mobile'

import BossInfo from '../bossinfo/bossinfo'
import JobhunterInfo from '../jobhunterinfo/jobhunterinfo'
import Boss from '../boss/boss'
import Jobhunter from '../jobhunter/jobhunter'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

  // 给组件对象添加属性
  navList = [ // 包含所有导航组件的相关信息数据
    {
      path: '/boss', // 路由路径
      component: Boss,
      title: '求职者列表',
      icon: 'home',
      text: '主页',
    },
    {
      path: '/jobhunter', // 路由路径
      component: Jobhunter,
      title: '职位列表',
      icon: 'position',
      text: '职位',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]

  componentDidMount(){
    // 如果登录过(cookie中有userid)，但现在没登录(redux管理的user中没有_id)发送请求获取对应的user
    const userid = Cookies.get('userid')
    const {_id} = this.props.user
    if(userid && !_id){
      // 发送异步请求，获取user
      // console.log('发送ajax请求，获取user');
      this.props.getUser()
    }
  }

  render() {
    /*// 检查用户是否登录，如果没有，自动重定向到登录界面
    const {user} = this.props
    if(!user._id){
      return <Redirect to='/login' />
    }*/
    /*
    1、实现自动登录：
    componentDidMount中：
      1)如果登录过(cookie中有userid)，但现在没登录(redux管理的user中没有_id)发送请求获取对应的user，暂时不做任何显示
    render中：
      2)如果cookie中没有userid，自动进入(重定向)login界面
      3)判断redux管理的user中是否有_id，如果没有，暂时不做任何显示
      4)如果有，说明当前已经登录，显示对应的界面
      5）如果已经登录，且想要请求根路径：根据user的avatar和usertype计算出一个重定向的路由路径，并自动重定向
    */
    // 1读取cookie中的userid
    const userid = Cookies.get('userid')
    // 1.1如果没有，自动重定向到登录界面
    if(!userid){
      return <Redirect to='/login' />
    }
    // 1.2如果有，读取redux中的user状态
    const {user, unReadCount} = this.props
    // 1.2.1如果user没有_id，返回null(不做任何显示)
    // debugger // 打断，调试请求过程
    if(!user._id){
      return null
    }else{
      // 1.2.2如果有_id，显示对应的界面
      // 1.2.3访问根路径，根据user的avatar和usertype计算出一个重定向的路由路径，并自动重定向
      let path = this.props.location.pathname
      if(path==='/'){
        path = getRedirectTo(user.usertype, user.avatar)
        return <Redirect to={path} />
      }
    }

    // 确定当前所在路径，并得到对应导航信息
    const {navList} = this
    const path = this.props.location.pathname // 请求的路径
    const currentNav = navList.find(nav => nav.path===path) // 得到当前的nav，可能没有

    if(currentNav){
      // 决定哪个路由需要隐藏
      if(user.usertype==='boss'){
        // 隐藏数组的第2个
        navList[1].hide = true
      }else{
        // 隐藏数组的第1个
        navList[0].hide = true
      }
    }
    
    return (
      <div>
        {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map(nav => (
               <Route key={nav.path} //可省略
                    path={nav.path} 
                    component={nav.component}
                    ></Route>
          ))}
          <Route path='/bossinfo' component={BossInfo}></Route>
          <Route path='/jobhunterinfo' component={JobhunterInfo}></Route>
          <Route path='/chat/:userid' component={Chat} />
          <Route component={NotFound} />
        </Switch>
        {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount} /> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main)