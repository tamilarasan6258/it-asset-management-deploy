const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    asset_category: { type: String, required: true }, // updated field name
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    deptHeadRemarks: { type: String },
    department: { type: String, required: true },
    forwardedToAdmin: { type: Boolean, default: false },
    adminRemarks: { type: String },
    adminStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    completed: { type: Boolean, default: false },


  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
