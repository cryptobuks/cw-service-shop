const path = require('path')
const basepath = path.join(__dirname, '..', 'app')

module.exports = {
  service: 'shop',
  fastify: { active: false, port: 5011, prefix: '/api/shop', sessionSecret: 'cw-micro-service-fastify-session-secret' },
  rabbitmq: { active: false, server: 'localhost:15672', user: 'dev', password: 'dev123' },
  redis: { active: false, server: 'localhost', port: 16379 },
  swagger: { active: false, exposeRoute: true },
  elasticSearch: { active: false, server: 'localhost:9200', timeout: 0, version: '7.6' },
  logger: { level: 'debug' },
  basepath,
  mongodb: {
    active: true,
    server: 'localhost',
    port: '37017',
    user: '',
    password: '',
    debug: true,
    databases: [
      {
        name: 'shop',
        db: 'shop',
        options: {}
      }
    ]
  }
}
