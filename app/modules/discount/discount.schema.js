const discountProperties = {
  status: {
    type: 'string',
    enum: ['active', 'suspended']
  },
  name: {
    type: 'string'
  },
  date: {
    type: 'array',
    items: {
      type: 'object',
      required: ['startDate', 'endDate'],
      properties: {
        startDate: {
          type: 'string'
        },
        endDate: {
          type: 'string'
        }
      }
    }
  },
  time: {
    type: 'array',
    items: {
      type: 'object',
      required: ['startTime', 'endTime'],
      properties: {
        startTime: {
          type: 'string'
        },
        endTime: {
          type: 'string'
        }
      }
    }
  },
  maxQuantity: {
    type: 'number'
  },
  type: {
    type: 'string',
    enum: ['amount', 'percent']
  },
  value: {
    type: 'number'
  },
  target: {
    type: 'object'
  },
  items: {
    type: 'array',
    items: {
      type: 'object',
      required: ['type', 'itemId'],
      properties: {
        type: {
          type: 'string',
          enum: ['subscription', 'product']
        },
        itemId: {
          type: 'string'
        }
      }
    }
  },
  createdFrom: {
    type: 'string'
  },
  updatedFrom: {
    type: 'string'
  }
}
module.exports = {
  getDiscounts: {
    schema: {
      tags: ['Discount'],
      summary: 'List all discounts',
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
  createDiscount: {
    schema: {
      tags: ['Discount'],
      summary: 'Create a discount',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['name'],
        properties: discountProperties
      }
    }
  },
  updateDiscount: {
    schema: {
      tags: ['Discount'],
      summary: 'Update a discount',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['discountId', 'name'],
        properties: {
          ...discountProperties,
          discountId: {
            type: 'string'
          }
        }
      }
    }
  },
  deleteDiscount: {
    schema: {
      tags: ['Discount'],
      summary: 'Delete a discount',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['discountId'],
        properties: {
          discountId: {
            type: 'string'
          }
        }
      }
    }
  }
}
