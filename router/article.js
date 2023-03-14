//导入express
const express = require('express')
//创建路由对象
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章的验证模块
const {
  add_article_schema,
  get_articleList_schema,
  articleId_schema,
  update_article_schema
} = require('../schema/article')

//导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')

//导入解析 formdata格式表单数据的包
const multer = require('multer')
//导入处理路径的内置模块
const path = require('path')

//创建multer的实例对象，通过dest属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post(
  '/add',
  upload.single('cover_img'),
  expressJoi(add_article_schema),
  article_handler.addArticle
)

//获取文章列表的路由
router.get(
  '/list',
  expressJoi(get_articleList_schema),
  article_handler.getArticleList
)

//根据id删除文章的路由
router.get(
  '/delete/:id',
  expressJoi(articleId_schema),
  article_handler.deleteArticle
)
//根据id获取文章信息的路由
router.get('/:id', expressJoi(articleId_schema), article_handler.getArticle)
//根据id更新文章信息的路由
router.post(
  '/edit',
  upload.single('cover_img'),
  expressJoi(update_article_schema),
  article_handler.updateArticle
)
//向外共享路由对象
module.exports = router
