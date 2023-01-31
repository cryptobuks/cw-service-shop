const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/category/get', (msg) => {
  const filter = msg.data
  return ctr.category.find(filter)
})
