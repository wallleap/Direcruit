/*
能发送ajax请求得函数模块
函数的返回值为promise对象
*/
import axios from 'axios'

// 暴露函数ajax，参数有url，数据对象(默认值为空对象)，方式(默认为GET)
export default function ajax(url, data={}, method='GET'){
  /*两种方式：GET(url后面带参数)、POST(url和数据)
  axios.get(url)
  axios.post(url,data)
  */
  if(method==='GET'){ // 发送GET请求
    // GET需要把data请求参数拼到url中
    // eg: paramStr = username=Bob&password=123456
    let paramStr = ''
    Object.keys(data).forEach(key => [ // 得到data对象所有key的数组，进行遍历
      paramStr += key + '=' +data[key] + '&'
    ])
    if(paramStr){
      paramStr = paramStr.substring(0, paramStr.length-1) // 去掉最后的&
    }
    url = url + '?' +paramStr
    // 使用axios发get请求
    return axios.get(url)
  }else{ // 发送POST请求
    // 使用axios发post请求
    return axios.post(url, data)
  }
}