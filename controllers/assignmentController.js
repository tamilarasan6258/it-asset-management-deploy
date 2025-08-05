const Assignment = require('../models/Assignment');
const Request = require('../models/Request');
const Asset = require('../models/Asset');
const AssetCount = require('../models/AssetCount');
const User = require('../models/user');

exports.assignAsset = async (req, res) => {
  try {
    const { requestId, assetId } = req.body;

    // 1. Find request
    const request = await Request.findById(requestId);
    if (!request || request.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or unapproved request' });
    }

    // 2. Find asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (asset.isAssigned) {
      return res.status(400).json({ message: 'Asset is already assigned' });
    }

    // 3. Check available count
    const assetCount = await AssetCount.findOne({ asset_category: asset.asset_category });
    if (!assetCount || assetCount.available_count <= 0) {
      return res.status(400).json({ message: 'Asset not available' });
    }

    // 4. Create assignment record
    const assignment = new Assignment({
      request: request._id,
      asset_name: asset.asset_name,
      asset_id: asset._id,
      asset_category: asset.asset_category,
      assignedBy: req.user._id,
      assignedTo: request.user,
    });

    await assignment.save();

    // ✅ Mark asset as assigned
    asset.isAssigned = true;
    await asset.save();

    request.completed = true; // Mark request as completed
    await request.save();

    // 5. Reduce available count
    assetCount.available_count -= 1;
    await assetCount.save();

    res.status(201).json({ message: 'Asset assigned successfully', assignment });

  } catch (err) {
    console.error('Assign Asset Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.returnAsset = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // 1. Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.returnedAt) {
      return res.status(400).json({ message: 'Asset already returned' });
    }

    // 2. Update return date
    assignment.returnedAt = new Date();
    await assignment.save();

    // update asset as unassigned
    const asset = await Asset.findById(assignment.asset_id);
    if (asset) {
      asset.isAssigned = false;
      await asset.save();
    }

    // 3. Increase available count in AssetCount
    const assetCount = await AssetCount.findOne({ asset_category: assignment.asset_category });

    if (assetCount) {
      assetCount.available_count += 1;
      await assetCount.save();
    }

    res.status(200).json({ message: 'Asset returned successfully', assignment });

  } catch (err) {
    console.error('Return Asset Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ assignedTo: req.user._id })
      .populate('asset_id') // 👉 get asset info
      .populate('assignedTo', 'name email') // optional: for future use
      .populate('assignedBy', 'name email role') // include assigner details
      .sort({ assignedAt: -1 });

    res.status(200).json(assignments);
  } catch (err) {
    console.error('Get My Assignments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// PATCH /api/assignments/:id/request-return
exports.requestReturn = async (req, res) => {
  console.log("1");
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  assignment.returnRequested = true;
  await assignment.save();

  res.json({ message: 'Return requested', assignment });
};

// PATCH /api/assignments/:id/approve-return
exports.approveReturnByDeptHead = async (req, res) => {
  const { message } = req.body;

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  assignment.returnApprovedByDeptHead = true;
  assignment.returnDeptHeadMessage = message;
  await assignment.save();

  res.json({ message: 'Return approved by Dept Head', assignment });
};

// PATCH /api/assignments/:id/finalize-return
exports.finalizeReturnByAdmin = async (req, res) => {
  const { condition } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  assignment.returnCondition = condition;
  assignment.returnFinalizedByAdmin = true;
  assignment.returnedAt = new Date();
  await assignment.save();

  // Unassign asset
  const asset = await Asset.findById(assignment.asset_id);
  if (asset) {
    asset.isAssigned = false;
    await asset.save();
  }

  // Increase asset count
  const assetCount = await AssetCount.findOne({ asset_category: assignment.asset_category });
  if (assetCount) {
    assetCount.available_count += 1;
    await assetCount.save();
  }

  res.json({ message: 'Return finalized by Admin', assignment });
};

// GET /api/assignments/return-requests-dept
exports.getReturnRequestsForDeptHead = async (req, res) => {
  try {
    const deptUsers = await User.find({ department: req.user.department }).distinct('_id');

    const assignments = await Assignment.find({
      assignedTo: { $in: deptUsers },
      returnRequested: true,
      returnApprovedByDeptHead: { $ne: true },
      returnedAt: null
    })
      .populate('asset_id', 'asset_name asset_id asset_category')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name role');

    res.json(assignments);
  } catch (err) {
    console.error('Dept Head Return Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET /api/assignments/pending-returns
exports.getPendingReturnsForAdmin = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      returnRequested: true,
      returnApprovedByDeptHead: true,
      returnFinalizedByAdmin: { $ne: true },
      returnedAt: null
    })
      .populate('asset_id', 'asset_name asset_id asset_category')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name role');

    res.json(assignments);
  } catch (err) {
    console.error('Admin Pending Returns Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/assignments/dept-assets
exports.getAllDeptAssignments = async (req, res) => {
  try {
    // Get all users in the department
    const deptUsers = await User.find({ department: req.user.department }).distinct('_id');

    const assignments = await Assignment.find({
      assignedTo: { $in: deptUsers }
    })
      .populate('asset_id', 'asset_name asset_id asset_category')
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name role')
      .sort({ assignedAt: -1 });

    res.status(200).json(assignments);
  } catch (err) {
    console.error('Fetch Dept All Assignments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllEmployeeAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({})
      .populate('asset_id', 'asset_name asset_id asset_category')
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name role')
      .sort({ assignedAt: -1 });

    res.status(200).json(assignments);
  } catch (err) {
    console.error('Get All Employee Assignments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
