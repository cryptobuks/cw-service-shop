process.env.NODE_ENV = 'production'
const config = require('config')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)
cw.autoStart().then(async () => {
  try {
    const Product = cw.db.shop.model('Product')
    const ProductTemplate = cw.db.shop.model('ProductTemplate')
    const products = await Product.find()
    await Promise.all(products.map(item => item.save()))
    const productTemplates = await ProductTemplate.find()
    await Promise.all(productTemplates.map(item => item.save()))
  } catch (error) {
    console.log(error)
  }
})
