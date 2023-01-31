const couponProperties = {
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
  value: {
    type: 'number'
  },
  target: {
    type: 'object'
  },
  isFixed: {
    type: 'boolean'
  },
  labelFixed: {
    type: 'string'
  },
  prefix: {
    type: 'string'
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
  getCoupons: {
    schema: {
      tags: ['Coupon'],
      summary: 'List all coupons',
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
  createCoupon: {
    schema: {
      tags: ['Coupon'],
      summary: 'Create a coupon',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['name'],
        properties: couponProperties
      }
    }
  },
  updateCoupon: {
    schema: {
      tags: ['Coupon'],
      summary: 'Update a coupon',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['couponId', 'name'],
        properties: {
          ...couponProperties,
          couponId: {
            type: 'string'
          }
        }
      }
    }
  },
  deleteCoupon: {
    schema: {
      tags: ['Coupon'],
      summary: 'Delete a Coupon',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['couponId'],
        properties: {
          couponId: {
            type: 'string'
          }
        }
      }
    }
  }
}
