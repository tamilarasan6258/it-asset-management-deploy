const Asset = require('../models/Asset');
const AssetCount = require('../models/AssetCount');

// @desc    Add new asset (admin only)
// @route   POST /api/assets
exports.createAsset = async (req, res) => {
  try {
    const { asset_name, asset_id, asset_category, condition, description } = req.body;

    // Check for duplicate asset_id
    const existing = await Asset.findOne({ asset_id });
    if (existing) {
      return res.status(400).json({ message: 'Asset ID already exists' });
    }

    const newAsset = new Asset({
      asset_name,
      asset_id,
      asset_category,
      description,
      condition
    });

    await newAsset.save();

    // Update or create AssetCount
    const assetCount = await AssetCount.findOne({ asset_category });

    if (assetCount) {
      assetCount.total_count += 1;
      assetCount.available_count += 1;
      await assetCount.save();
    } else {
      await AssetCount.create({
        asset_category,
        total_count: 1,
        available_count: 1
      });
    }

    res.status(201).json({ message: 'Asset added successfully', asset: newAsset });
  } catch (err) {
    console.error('Create Asset Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all assets (admin only)
// @route   GET /api/assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    console.error('Fetch Assets Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get asset inventory summary
// @route   GET /api/assets/summary
exports.getAssetCountSummary = async (req, res) => {
  try {
    const summary = await AssetCount.find();
    res.json(summary);
  } catch (err) {
    console.error('Get Inventory Summary Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Edit asset details (admin only)
// @route   PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const { asset_name, asset_category, condition, description } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const oldCategory = asset.asset_category;

    // Update asset details
    asset.asset_name = asset_name || asset.asset_name;
    asset.asset_category = asset_category || asset.asset_category;
    asset.condition = condition || asset.condition;
    asset.description = description || asset.description;


    await asset.save();

    // If category changed, update asset count
    if (oldCategory !== asset_category) {
      await AssetCount.findOneAndUpdate(
        { asset_category: oldCategory },
        { $inc: { total_count: -1, available_count: -1 } }
      );

      const newCat = await AssetCount.findOne({ asset_category });
      if (newCat) {
        newCat.total_count += 1;
        newCat.available_count += 1;
        await newCat.save();
      } else {
        await AssetCount.create({
          asset_category,
          total_count: 1,
          available_count: 1
        });
      }
    }

    res.json({ message: 'Asset updated successfully', asset });
  } catch (err) {
    console.error('Update Asset Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete asset (admin only)
// @route   DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    // Delete asset
    await asset.deleteOne();

    // Update count
    await AssetCount.findOneAndUpdate(
      { asset_category: asset.asset_category },
      { $inc: { total_count: -1, available_count: -1 } }
    );

    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Delete Asset Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get available assets by category
exports.getAvailableAssetsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const assets = await Asset.find({
      asset_category: category,
      isAssigned: false
    });

    res.status(200).json(assets);
  } catch (err) {
    console.error('Fetch Available Assets Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};