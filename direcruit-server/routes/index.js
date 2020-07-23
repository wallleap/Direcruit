var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
// const UserModel = require('../db/models').UserModel
const {UserModel, ChatModel} = require('../db/models') // 解构赋值
const filter = {password: 0, _v: 0} // 指定过滤password、_v属性

/* GET home page. */
/* 注册路由 get请求 path为'/' (后台)渲染index，传了title变量 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由：用户注册
/*
提供一个用户注册的接口
a) path 为: /register
b) 请求方式为: POST
c) 接收 username 和 password 参数
d) admin 是已注册用户
e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}}
f) 注册失败返回: {code: 1, msg: '此用户已存在'}
*/
/*
 *(回调函数：处理请求、返回响应)
 * 1、获取请求参数
post请求放在body
get请求放在query
 * 2、处理
 * 3、返回响应数据
 */
/* router.post('/register', function (req, res) {
  // 1、获取请求参数
  const {username, password} = req.body
  // 2、处理
  if(username==='admin'){ // 注册会失败
    // 3、返回响应数据(失败)
    res.send({code: 1, msg: '此用户已存在'})
  } else{ // 注册会成功
    // 3、返回响应数据(成功)
    res.send({code: 0, data: {_id: 'abc', username, password}})
  }
}) */


/* 注册的路由 */
router.post('/register', function (req, res) {
  // 1、读取请求参数
  const {username, password, usertype} = req.body
  // 2、处理：判断用户是否已经存在 3、返回响应数据如果存在，返回提示错误的信息，如果不存在，保存
  // 查询
  UserModel.findOne({username}, function(err, user){
    if(user){ // 如果user有值(已存在)
      res.send({code: 1, msg: '此用户已存在'})
    }else{ // user没值(不存在)
      new UserModel({username, usertype, password: md5(password)}).save(function (error, user) {
        // 生成一个 cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化 cookie, 浏览器会保存在本地文件
        // 返回包含user的json数据
        const data = {username, usertype, _id: user._id} // 响应数据中不要携带password
        res.send({code: 0, data})
      })
    }
  })
})

/* 登录的路由 */
router.post('/login', function (req, res) {
  const {username, password} = req.body
  // 根据username和password查询数据库users，如果没有，返回提示错误的信息，如果有，返回登录成功信息(包含user)
  UserModel.findOne({username}, filter,function (err, user) { // 过滤了密码
    if(user){
      UserModel.findOne({username, password: md5(password)}, filter, function (err, user) { // 过滤了密码
        if (user) { // 登录成功
          // 生成一个 cookie(userid: user._id), 并交给浏览器保存
          res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
          // 返回成功的信息(包含user)
          res.send({code: 0, data: user})
        } else { // 登录失败
          res.send({code: 1, msg: '密码不正确！'})
        }
      })
    }else{
      res.send({code: 1, msg: '用户不存在！'})
    }
  })
})

// 更新用户信息的路由
router.post('/update',function (req,res) {
  // 先从请求得cookie中得到userid
  const userid = req.cookies.userid // cookies是对象
  if(!userid){ // 如果不存在，直接返回提示信息，并结束
    return res.send({code: 1, msg: '请先登录'})
  }
  // 根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body // 提交过来的user，没有_id
  UserModel.findByIdAndUpdate({_id:userid}, user, function (error, oldUser) {
    if(!oldUser){ // 数据库中不能找到，因此通知浏览器删除userid cookie
      res.clearCookie('userid')
      // 返回提示信息
      res.send({code: 1, msg: '请先登录'})
    }else {
      const {_id, username, usertype} = oldUser // 从oldUer中取出
      const data = Object.assign(user, {_id, username, usertype}) // 合并数据，assign可以合并多个对象数据
      res.send({code: 0, data})
    }
  })
})

// 获取用户信息的路由(根据cookie中的userid)
router.get('/user', function (req, res) {
  // 先从请求得cookie中得到userid
  const userid = req.cookies.userid
  // 判断
  if(!userid){ // 如果不存在，直接返回提示信息，并结束
    return res.send({code: 1, msg: '请先登录'})
  }
  // 根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code: 0, data: user})
  })
})

/* 根据类型获取用户列表 */
router.get('/userlist', function(req, res){
  const {usertype} = req.query
  UserModel.find({usertype}, filter, function (error, users){
    res.send({code: 0, data: users})
  })
})

/*获取当前用户所有相关聊天信息列表*/
router.get('/msglist', function (req, res) {
// 获取 cookie 中的 userid
  const userid = req.cookies.userid
// 查询得到所有 user 文档数组
  UserModel.find(function (err, userDocs) {
// 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 avatar 组成的 user 对象
    /*const users = {} // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, avatar: doc.avatar}
    })*/

    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, avatar: user.avatar}
      return users
    }, {})
    /*查询 userid 相关的所有聊天信息
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]},
      filter,
      function (err, chatMsgs) {
        // 返回包含所有用户和当前用户相关的所有聊天消息的数据
        res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})
/* 修改指定消息为已读 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from
  const to = req.cookies.userid
  /*更新数据库中的 chat 数据
  参数 1: 查询条件
  参数 2: 更新为指定的数据对象
  参数 3: 是否 1 次更新多条, 默认只更新一条
  参数 4: 更新完成的回调函数
  */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})

module.exports = router;
