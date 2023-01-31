
const defaultBody = {
  type: 'object',
  required: ['name', 'isTranslated'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'name of size'
    },
    isTranslated: {
      type: 'boolean',
      description: 'Status of translation'
    },
    translations: {
      type: 'object',
      properties: {
        it: {
          type: 'string'
        }
      }
    }

  }
}

module.exports = {
  getSizes: {
    schema: {
      tags: ['Size'],
      summary: 'Get a list of sizes',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object'
      }
    }
  },
  createSize: {
    schema: {
      tags: ['Size'],
      summary: 'Create a new Size',
      security: [
        {
          authorization: []
        }
      ],
      body: defaultBody
    }
  },
  setSize: {
    schema: {
      tags: ['Size'],
      summary: 'Update an existing size',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['sizeId', 'name', 'isTranslated'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'name of size'
          },
          isHiddenForCw: {
            type: 'boolean',
            description: 'Hidden for CW'
          },
          isTranslated: {
            type: 'boolean',
            description: 'Status of translation'
          },
          sizeId: {
            type: 'string',
            description: 'Size id'
          },
          translations: {
            type: 'object',
            properties: {
              it: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },
  deleteSize: {
    schema: {
      tags: ['Size'],
      summary: 'Delete an existing size',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['sizeId'],
        properties: {
          sizeId: {
            type: 'string',
            description: 'Id of the Size'
          }

        }
      }
    }
  }

}
