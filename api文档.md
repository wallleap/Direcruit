# 某某直聘接口文档

## 目录：
[1、注册](#1注册)
[2、登录](#2登录)
[3、更新用户信息](#3更新用户信息)
[4、获取当前的user(根据cookie)](#4获取当前的user(根据cookie))
[5、获取用户列表](#5获取用户列表)
[6、获取当前用户的聊天消息列表](#6获取当前用户的聊天消息列表)
[7、 修改指定消息为已读](#7修改指定消息为已读)



## 1、注册

### 请求URL：

	localhost:5000/register

### 请求方式：
	POST

### 参数类型

| 参数     | 是否必选 | 类型   | 说明                    |
| -------- | -------- | ------ | ----------------------- |
| username | Y        | String | 用户名                  |
| password | Y        | String | 密码                    |
| usertype | Y        | String | 用户类型 jobhunter/boss |



### 返回示例：
	成功:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae133e621388d262c8d91a6",
	        "username": "Bob",
	        "usertype": "boss"
	      }
	    }
	失败
	    {
	      "code": 1,
	      "msg": "此用户已存在"
	    }


## 2、登录

### 请求URL：
	localhost:5000/login

### 请求方式：
	POST

### 参数类型

| 参数     | 是否必选 | 类型   | 说明   |
| -------- | -------- | ------ | ------ |
| username | Y        | String | 用户名 |
| password | Y        | String | 密码   |



### 返回示例：
	成功:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae1338a21388d262c8d91a5",
	        "username": "Jack",
	        "usertype": "jobhunter",
	        "__v": 0
	      }
	    }
	失败
	    {
	      "code": 1,
	      "msg": "用户名或密码错误"
	    }

## 3、更新用户信息

### 请求URL：
	localhost:5000/update

### 请求方式：
	POST

### 参数类型：

| 参数    | 是否必选 | 类型   | 说明     |
| ------- | -------- | ------ | -------- |
| avatar  | Y        | String | 头像名称 |
| info    | N        | String | 介绍     |
| post    | N        | String | 职位     |
| company | N        | String | 月薪     |
| salary  | N        | String | 公司     |



### 返回示例：

	成功:
	    {
		    "code": 0,
		    "data": {
		        "avatar": "头像2",
		        "info": "react/vue",
		        "post": "前端工程师",
		        "company": "Oracle",
		        "salary": "18K",
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "Bob",
		        "usertype": "boss"
		    }
		}
	失败
	    {
	      "code": 1,
	      "msg": "请先登录"
	    }



## 4、获取当前的user(根据cookie)

### 请求URL：
	localhost:5000/user

### 请求方式：
	GET

### 参数类型

	无

### 返回示例：
	成功:
	    {
		    "code": 0,
		    "data": {
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "Bob",
		        "usertype": "boss",
		        "__v": 0,
		        "salary": "18K",
		        "company": "Oracle",
		        "post": "前端工程师",
		        "info": "react/vue",
		        "avatar": "头像2"
		    }
		}
	失败
	    {
	      "code": 1,
	      "msg": "请先登录"
	    }



## 5、获取用户列表

### 请求URL：
	localhost:5000/userlist

### 请求方式：
	GET

### 参数类型: query

| 参数     | 是否必选 | 类型   | 说明                 |
| -------- | -------- | ------ | -------------------- |
| usertype | Y        | String | 类型(jobhunter/boss) |

### 返回示例：
	{
	    "code": 0,
	    "data": [
	        {
	            "_id": "5ae1d5d19151153d30e008fd",
	            "username": "Jack",
	            "usertype": "jobhunter",
	            "__v": 0
	        },
	        {
	            "_id": "5ae1ddd99ca58023d82351ae",
	            "username": "aa",
	            "usertype": "jobhunter",
	            "__v": 0,
	            "post": "前端工程师",
	            "info": "Rect/Vue",
	            "avatar": "头像1"
	        }
	    ]
	}



## 6、获取当前用户的聊天消息列表

### 请求URL：
	localhost:5000/msglist

### 请求方式：
	GET

### 参数类型
	无

### 返回示例：
	{
	    "code": 0,
	    "data": {
	        "users": {
	            "5ae1d5d19151153d30e008fd": {
	                "username": "ds2"
	            },
	            "5ae1ddd99ca58023d82351ae": {
	                "username": "aa",
	                "avatar": "头像1"
	            },
	            "5ae1df049ca58023d82351af": {
	                "username": "aa2"
	            },
	            "5ae1e72aa072c522e024b18e": {
	                "username": "bb",
	                "avatar": "头像3"
	            },
	            "5ae1f088d37a442b749fc143": {
	                "username": "laoban1",
	                "avatar": "头像2"
	            }
	        },
	        "chatMsgs": [
				{
	                "read": false,
	                "_id": "5ae1f3c3a95eb824841199f1",
	                "from": "5ae1f088d37a442b749fc143",
	                "to": "5ae1ddd99ca58023d82351ae",
	                "content": "aa",
	                "create_time": 1524757443374,
	                "__v": 0
	            }
			]
	    }
	}



## 7、 修改指定消息为已读

### 请求URL：
	localhost:5000/readmsg

### 请求方式：
	post

### 参数类型

| 参数 | 是否必选 | 类型   | 说明             |
| ---- | -------- | ------ | ---------------- |
| from | Y        | String | 发送消息用户的id |

### 返回示例：

	{code: 0, data: 2}