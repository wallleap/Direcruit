/*
选择用户头像的UI组件
*/

import React, { Component } from 'react';
import {
  List,
  Grid
} from 'antd-mobile'
import PropTypes from 'prop-types'

import '../../assets/css/avatar-selector.less'

export default class AvatarSelector extends Component {
  static propTypes = {
    setAvatar: PropTypes.func.isRequired

  }

  state = {
    icon: null // 图片对象，默认没有值
  }

  constructor(props){
    super(props)
    // 准备需要显示的数据
    this.avatars = []
    for (let i = 0; i < 20; i++) {
      this.avatars.push({
        text: '头像'+(i+1),
        icon: require(`../../assets/images/avatars/头像${i+1}.png`) // 不能用import
      })
    }
  }

  handleClick = ({text, icon}) => {
    // 更新当前组件状态
    this.setState({icon})
    // 调用函数更新父组件状态
    this.props.setAvatar(text)
  }

  render() {
    // 列表头部文本
    const {icon} = this.state
    const listHeader = !this.state.icon ? "请选择头像" : (
      <div className="avatar-selected">
        已选择头像: <img src={icon} alt="头像"/>
      </div>
    )

    return (
      <List renderHeader={() => listHeader}>
        <Grid data={this.avatars} 
              columnNum={5}
              onClick={this.handleClick}
        />
      </List>
    )
  }
}