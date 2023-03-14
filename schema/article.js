//导入定义验证规则的模块
const joi = require('joi')

//定义 标题、分类Id、内容、发布状态的验证规则
const title = joi.string().required()
const cate_id = joi
  .number()
  .integer()
  .min(1)
  .required()
const content = joi
  .string()
  .required()
  .allow('')
const state = joi
  .string()
  .valid('已发布', '草稿')
  .required()

const pagenum = joi
  .number()
  .integer()
  .required()

const id = joi.string().required()
//验证规则对象 --发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state
  }
}
//验证规则对象 --获取文章列表
exports.get_articleList_schema = {
  query: {
    pagenum,
    pagesize: pagenum,
    cate_id: joi.string().allow(''),
    state: joi.string().allow('')
  }
}

exports.articleId_schema = {
  params: {
    id
  }
}
exports.update_article_schema = {
  title,
  cate_id,
  content,
  state,
  Id: joi
    .number()
    .integer()
    .min(1)
    .required()
}
