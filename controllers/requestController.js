const Request = require('../models/Request');
const AssetCount = require('../models/AssetCount');
const Asset = require('../models/Asset');

// @desc    Raise a new asset request (Employee)
// @route   POST /api/requests
// @access  Private (Employee)
exports.createRequest = async (req, res) => {
  try {
    const { asset_category, reason } = req.body;

    if (!asset_category || !reason) {
      return res.status(400).json({ message: 'Category and reason required' });
    }

    const request = new Request({
      user: req.user._id,
      asset_category,
      reason,
      department: req.user.department
    });

    await request.save();

    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (err) {
    console.error('Create Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const Assignment = require('../models/Assignment');

exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const statusFilter = req.query.status;

    const skip = (page - 1) * limit;

    // Build query
    const query = {
      user: userId,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(search ? {
        $or: [
          { asset_category: { $regex: search, $options: 'i' } },
          { reason: { $regex: search, $options: 'i' } }
        ]
      } : {})
    };

    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // return plain JS objects

    // 🆕 Attach assignment info
    const requestIds = requests.map(r => r._id);
    const assignments = await Assignment.find({ request: { $in: requestIds } })
      .populate('asset_id', 'asset_id asset_name')
      .populate('assignedBy', 'name')
      .lean();

    const assignmentMap = new Map();
    assignments.forEach(a => assignmentMap.set(a.request.toString(), a));

    const requestsWithAssignment = requests.map(r => ({
      ...r,
      assignment: assignmentMap.get(r._id.toString()) || null
    }));

    res.json({
      requests: requestsWithAssignment,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error('Get My Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get all requests for Dept Head's department
// @route   GET /api/requests/department
// @access  Private (Dept Head)
exports.getRequestsByDepartment = async (req, res) => {
  try {
    console.log("1");
    const department = req.user.department;
    // const usersInDept = await User.find({ department: dept }).distinct('_id');
    console.log("2");

    const requests = await Request.find({ department })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    console.log("3");

    res.json(requests);
    console.log("4");

  } catch (err) {
    console.log("5");

    console.error('Get Dept Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve or Reject a request
// @route   PUT /api/requests/:id/status
// @access  Private (Dept Head)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure dept head can only handle their dept
    if (request.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized department' });
    }

    // Update status only if pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = status;
    request.remarks = remarks;
    request.updatedAt = Date.now();

    await request.save();

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    console.error('Update Request Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await Request.findById(id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = status;
  if (status === 'rejected') {
    request.completed = true; // ✅ mark as completed
  }
  await request.save();

  res.json({ message: 'Request status updated', request });
};


// @route PUT /api/requests/forward/:id
exports.forwardToAdmin = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.forwardedToAdmin = true;
    request.adminStatus = 'pending';
    await request.save();

    res.json({ message: 'Request forwarded to admin' });
  } catch (err) {
    console.error('Forward Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// @route PUT /api/requests/admin-review/:id
exports.reviewRequestByAdmin = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request || !request.forwardedToAdmin) {
      return res.status(400).json({ message: 'Invalid or unforwarded request' });
    }

    request.adminStatus = status;
    request.adminRemarks = adminRemarks;
    if (status === 'rejected') {
      request.completed = true; // ✅ mark as completed
    }
    await request.save();

    res.json({ message: 'Admin reviewed request' });
  } catch (err) {
    console.error('Admin Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Get all requests forwarded to admin
// @route GET /api/requests/forwarded
// @access Private (Admin)
exports.getForwardedRequestsForAdmin = async (req, res) => {
  try {
    const requests = await Request.find({ forwardedToAdmin: true, completed: false })
      .populate('user', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error('Fetch Forwarded Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route GET /api/requests/admin-approved
// @access Private (Admin)
exports.getAdminApprovedRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      forwardedToAdmin: true,
      adminStatus: 'approved',
      status: 'approved',         // ✅ Dept Head also approved
      completed: false            // ✅ Not completed

    })
      .populate('user', 'name email department')
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Get Admin Approved Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getRequestAssetSummary = async (req, res) => {
  try {
    // 1. Get available asset counts by category
    const availableAssets = await Asset.aggregate([
      { $match: { isAssigned: false } },
      {
        $group: {
          _id: '$asset_category',
          availableCount: { $sum: 1 }
        }
      }
    ]);

    // 2. Get count of assigned requests (dept head & admin approved, not completed)
    const approvedByBoth = await Request.aggregate([
      {
        $match: {
          adminStatus: 'approved',
          status: 'approved',
          completed: false
        }
      },
      {
        $group: {
          _id: '$asset_category',
          pendingAssignmentCount: { $sum: 1 }
        }
      }
    ]);

    // 3. Get count of requests approved by Admin but not yet approved by Dept Head
    const adminOnlyApproved = await Request.aggregate([
      {
        $match: {
          adminStatus: 'approved',
          status: 'pending',
          completed: false
        }
      },
      {
        $group: {
          _id: '$asset_category',
          adminOnlyApprovedCount: { $sum: 1 }
        }
      }
    ]);

    // 📦 Combine all into one summary per asset_category
    const allCategories = new Set([
      ...availableAssets.map(a => a._id),
      ...approvedByBoth.map(a => a._id),
      ...adminOnlyApproved.map(a => a._id)
    ]);

    const summary = Array.from(allCategories).map(cat => {
      const available = availableAssets.find(a => a._id === cat)?.availableCount || 0;
      const pendingAssignment = approvedByBoth.find(a => a._id === cat)?.pendingAssignmentCount || 0;
      const adminOnly = adminOnlyApproved.find(a => a._id === cat)?.adminOnlyApprovedCount || 0;

      return {
        asset_category: cat,
        available_count: available,
        pending_assignment_count: pendingAssignment,
        admin_only_approved_count: adminOnly
      };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error generating summary:', err);
    res.status(500).json({ message: 'Server error' });
  }
};