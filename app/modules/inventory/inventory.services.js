const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/inventory/get', (msg) => {
  const filter = msg.data
  return ctr.inventory.find(filter)
})
