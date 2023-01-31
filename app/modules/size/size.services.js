const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/size/get', (msg) => {
  const filter = msg.data
  return ctr.size.find(filter)
})
