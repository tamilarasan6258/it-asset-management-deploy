const mongoose = require('mongoose');

const assetCountSchema = new mongoose.Schema(
  {
    asset_category: { type: String, required: true, unique: true },
    total_count: { type: Number, required: true },
    available_count: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssetCount', assetCountSchema);
