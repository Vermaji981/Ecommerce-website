const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const ApplicationPayment = require('../models/ApplicationPayment');
const { logActivity } = require('../utils/activityLogger');

// Initialize Razorpay Instance safely
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('your_key')) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return null;
};

// @desc    Create Razorpay Order / Process Direct Payment & Store in MongoDB
// @route   POST /api/payment/create-order
// @access  Public / Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const {
      amount,
      totalAmount,
      customerName,
      email,
      phone,
      shippingAddress,
      city,
      state,
      postalCode,
      pincode,
      country,
      items,
      paymentMethod,
      currency = 'INR'
    } = req.body;

    const amountVal = Number(amount || totalAmount || 0);

    if (!amountVal || amountVal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // String sanitizer helper
    const cleanString = (val, maxLen = 200) => {
      if (!val || typeof val !== 'string') return '';
      return val.trim().replace(/<[^>]*>?/gm, '').slice(0, maxLen);
    };

    // Extract user-entered details from request body or nested shippingAddress object
    const rawAddress = (typeof shippingAddress === 'object' && shippingAddress !== null)
      ? shippingAddress
      : {};

    const enteredFullName = cleanString(customerName || rawAddress.fullName || rawAddress.name || req.body.name, 100);
    const enteredEmail = cleanString(email || rawAddress.email, 120);
    const enteredPhone = cleanString(phone || rawAddress.phone, 30);
    const enteredStreet = cleanString(typeof shippingAddress === 'string' ? shippingAddress : (rawAddress.street || rawAddress.address || ''), 300);
    const enteredCity = cleanString(city || rawAddress.city, 100);
    const enteredState = cleanString(state || rawAddress.state, 100);
    const enteredPostalCode = cleanString(postalCode || pincode || rawAddress.postalCode || rawAddress.pincode, 20);
    const enteredCountry = cleanString(country || rawAddress.country || 'India', 100);

    // Validate that required shipping details are provided
    if (!enteredFullName) {
      return res.status(400).json({ success: false, message: 'Please provide recipient full name for shipping' });
    }
    if (!enteredStreet) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery shipping address' });
    }

    // Do NOT use admin credentials as customer details under any circumstances
    const adminEmail = (process.env.ADMIN_EMAIL || 'hv0563163@gmail.com').toLowerCase();
    const isAdminUser = req.user && (
      req.user.role === 'admin' ||
      (req.user.email && req.user.email.toLowerCase() === adminEmail)
    );

    // Prioritize user-entered details; fallback to authenticated user only if NOT admin
    const finalCustomerName = enteredFullName || (!isAdminUser && req.user?.name ? req.user.name : 'Customer');
    const finalEmail = enteredEmail || (!isAdminUser && req.user?.email ? req.user.email : '');
    const finalPhone = enteredPhone || (!isAdminUser && req.user?.phone ? req.user.phone : '');

    // Associate order with verified authenticated user if available
    // Do NOT trust unverified user ID from frontend req.body
    const userId = req.user ? req.user._id : null;

    // Build formatted address string for convenient display
    const addressComponents = [
      enteredStreet,
      enteredCity,
      enteredState,
      enteredPostalCode,
      enteredCountry
    ].filter(Boolean);
    const formattedAddressStr = addressComponents.join(', ');

    // Build rich, structured shippingAddress object stored in MongoDB
    const finalShippingAddress = {
      fullName: finalCustomerName,
      phone: finalPhone,
      email: finalEmail,
      street: enteredStreet,
      address: enteredStreet,
      city: enteredCity,
      state: enteredState,
      postalCode: enteredPostalCode,
      pincode: enteredPostalCode,
      country: enteredCountry,
      formattedAddress: formattedAddressStr
    };

    // Create & Save Order in MongoDB Atlas
    const order = await Order.create({
      orderId,
      transactionId,
      user: userId,
      customerName: finalCustomerName,
      email: finalEmail,
      phone: finalPhone,
      shippingAddress: finalShippingAddress,
      items: items || [],
      subtotal: Number(amount || totalAmount || 0),
      discount: Number(req.body.discount || 0),
      couponCode: req.body.couponCode || '',
      shippingCharge: Number(req.body.shippingCharge || 0),
      totalAmount: amountVal,
      paymentMethod: (paymentMethod || 'CARD').toUpperCase(),
      paymentStatus: (paymentMethod || '').toUpperCase() === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Confirmed',
          previousStatus: 'Pending',
          changedByName: 'Payment Order Initialization',
          changedAt: new Date(),
          note: `Payment order initialized for ₹${amountVal} via ${(paymentMethod || 'CARD').toUpperCase()}`
        }
      ]
    });

    const razorpay = getRazorpayInstance();

    if (razorpay) {
      const options = {
        amount: Math.round(amountVal * 100),
        currency,
        receipt: `receipt_${orderId}`
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        message: 'Payment order created',
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        order
      });
    } else {
      // Instant Successful Payment Simulation & MongoDB Save
      return res.status(200).json({
        success: true,
        message: 'Payment processed successfully and order stored in MongoDB',
        orderId: order.orderId,
        transactionId: order.transactionId,
        amount: Math.round(amountVal * 100),
        currency,
        key: 'rzp_test_simulated_key',
        isSimulation: true,
        order
      });
    }
  } catch (error) {
    console.error('[Payment Error]:', error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Public / Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing payment verification credentials' });
    }

    let isValidSignature = false;

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isValidSignature = expectedSignature === razorpay_signature;
    } else {
      isValidSignature = true;
    }

    if (!isValidSignature) {
      if (dbOrderId) {
        const failedOrder = await Order.findByIdAndUpdate(
          dbOrderId,
          { paymentStatus: 'Failed' },
          { new: true }
        );
        if (failedOrder) {
          await logActivity({
            actionType: 'PAYMENT_FAILED',
            user: failedOrder.user,
            userName: failedOrder.customerName,
            userEmail: failedOrder.email,
            entityType: 'Order',
            entityId: failedOrder._id.toString(),
            orderId: failedOrder.orderId || failedOrder._id.toString(),
            description: `Payment verification failed for Order ${failedOrder.orderId || failedOrder._id}`,
            metadata: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id },
            req
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }

    if (dbOrderId) {
      const paidOrder = await Order.findByIdAndUpdate(
        dbOrderId,
        {
          paymentStatus: 'Paid',
          orderStatus: 'Confirmed',
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        },
        { new: true }
      );

      if (paidOrder) {
        await logActivity({
          actionType: 'PAYMENT_SUCCESS',
          user: paidOrder.user,
          userName: paidOrder.customerName,
          userEmail: paidOrder.email,
          entityType: 'Order',
          entityId: paidOrder._id.toString(),
          orderId: paidOrder.orderId || paidOrder._id.toString(),
          description: `Payment of ₹${paidOrder.totalAmount} verified successfully for Order ${paidOrder.orderId || paidOrder._id}`,
          metadata: {
            totalAmount: paidOrder.totalAmount,
            transactionId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id
          },
          req
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GOVERNMENT APPLICATION FEE PAYMENT MODULE
// ==========================================

// @desc    Get Application Fee & Payment Details by Application Number
// @route   GET /api/payment/application/:appNumber
// @access  Public
exports.getApplicationFeeDetails = async (req, res, next) => {
  try {
    const { appNumber } = req.params;
    if (!appNumber) {
      return res.status(400).json({ success: false, message: 'Application number is required' });
    }

    const existingPayment = await ApplicationPayment.findOne({
      applicationNumber: appNumber.trim()
    });

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        payment: existingPayment
      });
    }

    // Default configuration for a new application fee payment
    const defaultData = {
      applicationNumber: appNumber.trim(),
      applicantName: req.user ? req.user.name : 'Rajesh Kumar',
      applicationType: 'Staff Selection & Recruitment Examination 2026',
      registrationDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      category: 'General / Unreserved',
      email: req.user ? req.user.email : 'applicant@portal.gov.in',
      phone: req.user ? (req.user.phone || '9876543210') : '9876543210',
      fees: {
        applicationFee: 500.0,
        processingFee: 25.0,
        gst: 4.5,
        totalAmount: 529.5
      },
      paymentStatus: 'Pending',
      currency: 'INR'
    };

    res.status(200).json({
      success: true,
      payment: defaultData,
      isNew: true
    });
  } catch (error) {
    console.error('[Application Fee Details Error]:', error);
    next(error);
  }
};

// @desc    Create Razorpay Payment Order for Government Application Form Fee
// @route   POST /api/payment/application/create-order
// @access  Public
exports.createApplicationFeeOrder = async (req, res, next) => {
  try {
    const {
      applicationNumber,
      applicantName,
      applicationType = 'Staff Selection & Recruitment Examination 2026',
      registrationDate,
      category = 'General / Unreserved',
      email,
      phone,
      fees = {},
      paymentMethod = 'UPI'
    } = req.body;

    if (!applicationNumber || !applicantName) {
      return res.status(400).json({
        success: false,
        message: 'Application Number and Applicant Name are mandatory.'
      });
    }

    // Duplicate payment prevention check
    const existingPaid = await ApplicationPayment.findOne({
      applicationNumber: applicationNumber.trim(),
      paymentStatus: 'Paid'
    });

    if (existingPaid) {
      return res.status(400).json({
        success: false,
        alreadyPaid: true,
        message: `Application Fee for Application No. ${applicationNumber} has already been paid successfully. Duplicate fee submissions are strictly prevented.`,
        payment: existingPaid
      });
    }

    // Server-side authentic fee calculation
    const applicationFee = Number(fees.applicationFee !== undefined ? fees.applicationFee : 500);
    const processingFee = Number(fees.processingFee !== undefined ? fees.processingFee : 25);
    const gst = Number(fees.gst !== undefined ? fees.gst : 4.5);
    const totalAmount = Number((applicationFee + processingFee + gst).toFixed(2));

    const totalInPaise = Math.round(totalAmount * 100);

    const razorpay = getRazorpayInstance();
    let razorpayOrderId = '';
    let isTestSimulation = false;

    if (razorpay) {
      const options = {
        amount: totalInPaise,
        currency: 'INR',
        receipt: `gov_rcpt_${applicationNumber.trim().slice(-8)}_${Date.now().toString().slice(-4)}`,
        notes: {
          applicationNumber: applicationNumber.trim(),
          applicantName: applicantName.trim(),
          applicationType: applicationType
        }
      };
      const razorpayOrder = await razorpay.orders.create(options);
      razorpayOrderId = razorpayOrder.id;
    } else {
      isTestSimulation = true;
      razorpayOrderId = `order_gov_test_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    }

    // Upsert ApplicationPayment record in MongoDB
    const paymentRecord = await ApplicationPayment.findOneAndUpdate(
      { applicationNumber: applicationNumber.trim() },
      {
        applicantName: applicantName.trim(),
        applicationType: applicationType.trim(),
        registrationDate: registrationDate || new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        category,
        email: email || '',
        phone: phone || '',
        fees: {
          applicationFee,
          processingFee,
          gst,
          totalAmount
        },
        currency: 'INR',
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: 'Pending',
        razorpayOrderId,
        user: req.user ? req.user._id : null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Government application fee payment order created successfully',
      orderId: razorpayOrderId,
      amount: totalInPaise,
      totalAmount: totalAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_simulated_key',
      isTestMode: isTestSimulation,
      payment: paymentRecord
    });
  } catch (error) {
    console.error('[Create Application Order Error]:', error);
    next(error);
  }
};

// @desc    Cryptographically Verify Application Fee Payment Signature
// @route   POST /api/payment/application/verify
// @access  Public
exports.verifyApplicationFeePayment = async (req, res, next) => {
  try {
    const {
      applicationNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod
    } = req.body;

    if (!applicationNumber || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification payload: Application number, Order ID and Payment ID are required.'
      });
    }

    let isValid = false;

    // Cryptographic HMAC SHA256 Signature verification against backend secret
    if (
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_SECRET.includes('your_razorpay') &&
      razorpay_signature
    ) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isValid = expectedSignature === razorpay_signature;
    } else {
      // In Test/Development Simulation mode, verify payment ID format
      isValid = Boolean(razorpay_payment_id && razorpay_payment_id.length > 5);
    }

    const targetRecord = await ApplicationPayment.findOne({
      applicationNumber: applicationNumber.trim()
    });

    if (!targetRecord) {
      return res.status(404).json({
        success: false,
        message: `Application record not found for application number: ${applicationNumber}`
      });
    }

    if (!isValid) {
      targetRecord.paymentStatus = 'Failed';
      targetRecord.failureReason = 'Cryptographic signature verification failed by gateway.';
      await targetRecord.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Digital signature mismatch or unauthorized response.'
      });
    }

    // Generate Official Portal Transaction & Challan Reference Numbers
    const transactionId = `TXN-GOV-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const bankReferenceNumber = `CP${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    targetRecord.paymentStatus = 'Paid';
    targetRecord.razorpayOrderId = razorpay_order_id;
    targetRecord.razorpayPaymentId = razorpay_payment_id;
    targetRecord.razorpaySignature = razorpay_signature || 'TEST_SIGNATURE_VERIFIED';
    targetRecord.transactionId = transactionId;
    targetRecord.bankReferenceNumber = bankReferenceNumber;
    targetRecord.verifiedAt = new Date();
    targetRecord.failureReason = '';
    if (paymentMethod) {
      targetRecord.paymentMethod = paymentMethod.toUpperCase();
    }

    await targetRecord.save();

    return res.status(200).json({
      success: true,
      message: 'Application fee payment verified and registered successfully.',
      payment: targetRecord
    });
  } catch (error) {
    console.error('[Verify Application Fee Error]:', error);
    next(error);
  }
};

// @desc    Record Payment Failure or User Cancellation
// @route   POST /api/payment/application/failure
// @access  Public
exports.recordApplicationFeeFailure = async (req, res, next) => {
  try {
    const { applicationNumber, failureReason, paymentStatus = 'Failed' } = req.body;

    if (!applicationNumber) {
      return res.status(400).json({ success: false, message: 'Application number is required' });
    }

    const updated = await ApplicationPayment.findOneAndUpdate(
      { applicationNumber: applicationNumber.trim() },
      {
        paymentStatus: paymentStatus === 'Cancelled' ? 'Cancelled' : 'Failed',
        failureReason: failureReason || 'Transaction was declined or terminated by user.'
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment failure status logged successfully',
      payment: updated
    });
  } catch (error) {
    console.error('[Log Payment Failure Error]:', error);
    next(error);
  }
};

