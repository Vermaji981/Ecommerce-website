const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      addresses: user.addresses || [],
      createdAt: user.createdAt
    }
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Generate 6-digit OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    // Strictly enforce customer role for all public self-registrations
    const assignedRole = 'customer';

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: assignedRole,
      otp,
      otpExpire,
      isVerified: false
    });

    // Send OTP email
    await sendEmail({
      email: user.email,
      subject: 'My E-commerce Website - Account Verification OTP',
      message: `Hello ${user.name},\n\nYour OTP for verifying your account on My E-commerce Website is: ${otp}\nThis OTP is valid for 15 minutes.\n\nThank you!`
    });

    sendTokenResponse(user, 201, res, 'Registration successful! Verification OTP sent to email.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find user by email and include password for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled. Please contact administrator.'
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for account activation
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code'
      });
    }

    if (user.otpExpire && user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Account verified successfully!');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send Reset Code
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email'
      });
    }

    // Generate 6-digit Reset OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetOtp;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'My E-commerce Website - Password Reset OTP',
      message: `Hello ${user.name},\n\nYour password reset code is: ${resetOtp}\nThis code will expire in 15 minutes.\nIf you did not request this, please ignore this email.`
    });

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your registered email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, reset OTP, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    if (user.resetPasswordToken !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    if (user.resetPasswordExpire && user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful! You can now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
