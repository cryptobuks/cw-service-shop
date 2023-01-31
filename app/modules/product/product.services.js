const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/product/get', (msg) => {
  const filter = msg.data
  return ctr.product.find(filter)
})
