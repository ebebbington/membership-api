const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
  'employee_id': {
    type: Number,
    required: true,
    // todo :: validate
  },
  'name': {
    type: String,
    required: [true, 'Name has not been supplied'],
    validate: {
      validator: function (v) {
        return /.+[^\s]/.test(v)
      },
      message: (props) => `${props.value} is not set`
    }
  },
  'email': {
    type: String,
    required: false,
    // todo :: validate for email
  },
  'phone_number': {
    type: String,
    required: true,
    // todo :: validate for phone number - is it possible?
  },
  'pin': {
    type: Number,
    required: true,
    minLength: [4, 'Your PIN must be at least 4 digits']
  },
  'amount': {
    type: Number,
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('Card', CardSchema)