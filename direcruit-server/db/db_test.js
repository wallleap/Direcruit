/*
使用 mongoose 操作 mongodb 的测试文件
*/
// 引入md5
const md5 = require('blueimp-md5') // md5加密的函数

/* 1. 连接数据库 */
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/direcruit_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () { // 连接成功回调
  console.log('数据库连接成功~~~')
})

/* 2. 得到对应特定集合的 Model */
// 2.1. 定义 Schema(描述文档结构)
const userSchema = mongoose.Schema({ // 指定文档的结构：属性名/属性值的类型，是否是必须的，默认值
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  usertype: {type: String, required: true}, // 用户类型：jobhunter/boss
  avatar: {type: String}
})
// 2.2. 定义 Model(与集合对应, 可以操作集合) 构造函数
const UserModel = mongoose.model('user', userSchema) // 集合名：users，name：user

/* 3. 通过 Model 或其实例对集合数据进行 CRUD 操作 */
// 3.1. 通过 Model 实例的 save()添加数据
function testSave(){
  // 创建UserModel的实例
  const userModel = new UserModel({username: 'Bob', password: md5('123456'), usertype: 'boss'})
  // 调用save()保存
  userModel.save(function (error, user) {
    console.log('save()', error, user)
  })
}
// testSave()
// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
function testFind() {
  // 查询多个：得到的是包含所有匹配文档对象的数组，如果没有匹配的就是空数组
  UserModel.find(function (error, users) {
    console.log('find()', error, users)
  })
  // 查询一个：得到的是匹配的文档对象，如果没有匹配的就是null
  UserModel.findOne({_id: '5f10558a9b4c594a509e19fb'}, function (error, user) {
    console.log('findOne()', error, user)
  })
}
// testFind()
// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
function testUpdate() {
  UserModel.findByIdAndUpdate({_id: '5f10558a9b4c594a509e19fb'}, {username: 'Jack'}, function (error, oldUser) {
    console.log('findByIdAndUpdate()', error, oldUser)
  })
}
// testUpdate()
// 3.4. 通过 Model 的 remove()删除匹配的数据
function testDelete() {
  UserModel.remove({_id: '5f10558a9b4c594a509e19fb'}, function (error, doc) {
    console.log('remove', error, doc) //  { n: 1或0, ok: 1, deletedCount: 1或0 }
  })
}
// testDelete()