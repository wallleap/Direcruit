/**
 * 包含n个工具函数的模块
 */
/*
跳转的
- 用户主界面路由
  - boss：/boss
  - jobhunter：/jobhunter
- 用户信息完善界面路由
  - boss：/bossinfo
  - jobhunter：jobhunterinfo
判断是否已经完善信息：user.avatar是否有值
判断用户类型：user.usertype
*/
// 返回对应的路由路径
export function getRedirectTo(usertype, avatar){
  let path = ''
  // usertype
  if(usertype==='boss'){
    path = '/boss'
  }else{
    path = '/jobhunter'
  }
  // avatar
  if(!avatar || avatar==='updateAvatar'){// 没有值，返回信息完善界面的path
    path += 'info'
  }
  return path
}
