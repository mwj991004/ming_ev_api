//导入express
const express = require('express')

//创建服务器的实例对象
const app = express()

//托管静态资源
app.use(express.static('../../8.1大事件项目/ming_bigevent'))
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
//导入定义验证规则的包
const joi = require('joi')
//导入并配置cors 中间件
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件,只能解析application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

//一定要在路由之前，封装res.cc函数
app.use((req, res, next) => {
  //status 默认值为 1，表示失败的情况
  //err的值，可能是错误对象，也可能是一个错误描述字符串
  res.cc = function(err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入全局配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT
    .expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] })
    .unless({ path: [/^\/api\//] })
)
//导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
//导入并使用用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
//导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)
//定义错误级别中间件
app.use((err, req, res, next) => {
  //数据验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败!')
  }
  //未知的错误
  res.cc(err)
})

//启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
