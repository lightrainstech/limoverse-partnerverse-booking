'use strict'

const fp = require('fastify-plugin')
const generateResponse = require('../utils/generatorResponse')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(function (fastify, opts, next) {
  fastify.decorateReply('success', function (data = [], response = {}) {
    // Setting defaults
    response.error = response.error || false
    response.message = response.message || 'Success'

    this.type('application/json')
    this.send(generateResponse(data, response))
  })
  fastify.decorateReply('error', function (response = {}) {
    // Setting defaults
    response.statusCode = response.statusCode || 400
    response.error = response.error || true
    response.message = response.message || 'Error'

    this.code(response.statusCode)
    this.type('application/json')
    this.send(generateResponse([], response))
  })

  fastify.setErrorHandler(function (error, request, reply) {
    let resp
    if (error.validation) {
      resp = {
        error: true,
        statusCode: 422,
        message: `${error.validation[0].message
          .substring(0)
          .charAt(0)
          .toUpperCase()}${error.validation[0].message.substring(1)}`
      }
      reply.status(422).send(generateResponse([], resp))
    } else {
      resp = {
        error: true,
        statusCode: 401,
        message: error.message
      }
      reply.status(401).send(generateResponse([], resp))
    }
    // reply.status(400).send(generateResponse([], resp))
  })

  next()
})
