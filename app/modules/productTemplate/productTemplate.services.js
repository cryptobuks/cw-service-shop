const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/productTemplate/get', (msg) => {
  const filter = msg.data
  return ctr.productTemplate.find(filter)
})
