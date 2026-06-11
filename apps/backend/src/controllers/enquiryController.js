const Enquiry = require('../models/Enquiry');

/**
 * @desc   Submit a new enquiry (B2B lead)
 * @route  POST /api/enquiries
 * @access Public
 */
const createEnquiry = async (req, res) => {
  const { companyName, contactPerson, phone, email, productName, productRef, quantity, message } = req.body;

  const enquiry = await Enquiry.create({
    companyName,
    contactPerson,
    phone,
    email,
    productName,
    productRef: productRef || undefined,
    quantity,
    message,
  });

  res.status(201).json({ success: true, message: 'Enquiry submitted successfully', enquiry });
};

/**
 * @desc   Get all enquiries (admin)
 * @route  GET /api/enquiries
 * @access Private/Admin
 */
const getEnquiries = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.status = status;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('productRef', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Enquiry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    enquiries,
  });
};

/**
 * @desc   Update enquiry status (admin)
 * @route  PUT /api/enquiries/:id/status
 * @access Private/Admin
 */
const updateEnquiryStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['New', 'In Progress', 'Resolved'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!enquiry) {
    return res.status(404).json({ success: false, message: 'Enquiry not found' });
  }

  res.status(200).json({ success: true, message: 'Enquiry status updated', enquiry });
};

module.exports = { createEnquiry, getEnquiries, updateEnquiryStatus };
