const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    asset_name: { type: String, required: true },
    // asset_id: { type: String, required: true },
    asset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },

    asset_category: { type: String, required: true }, // copied from request at assignment time
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date },

    // 🆕 Return flow fields
    returnRequested: { type: Boolean, default: false },
    returnApprovedByDeptHead: { type: Boolean, default: false },
    returnDeptHeadMessage: { type: String },
    returnCondition: { type: String, enum: ['good', 'damaged'], default: null }, // Admin-filled
    returnFinalizedByAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
