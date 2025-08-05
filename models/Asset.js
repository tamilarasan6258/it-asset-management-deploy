const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    asset_name: { type: String, required: true },
    asset_id: { type: String, required: true, unique: true },
    asset_category: { type: String, required: true },
    condition: {
      type: String,
      enum: ['new', 'good', 'damaged'],
      required: true
    },
    description: { type: String },
    isAssigned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
