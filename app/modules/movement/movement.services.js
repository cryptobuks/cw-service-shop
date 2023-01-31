const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/movement/get', (msg) => {
  const filter = msg.data
  return ctr.movement.find(filter)
})
