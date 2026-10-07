const adminOnly = (req, res, next) => {
  if (req.user && String(req.user.role).toLowerCase() === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin authorization required'
    });
  }
};

module.exports = { adminOnly };
