const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/color/get', (msg) => {
  const filter = msg.data
  return ctr.color.find(filter)
})
