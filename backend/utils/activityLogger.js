const ActivityLog = require('../models/ActivityLog');

/**
 * Safely log an activity in MongoDB
 * @param {Object} params
 */
const logActivity = async ({
  actionType,
  user = null,
  userId = null,
  userName = '',
  userEmail = '',
  userRole = 'customer',
  entityType = 'System',
  entityId = '',
  orderId = '',
  productId = '',
  description = '',
  metadata = {},
  req = null
}) => {
  try {
    let resolvedUserId = userId;
    let resolvedUserName = userName;
    let resolvedUserEmail = userEmail;
    let resolvedUserRole = userRole;

    if (user) {
      resolvedUserId = user._id || user.id || resolvedUserId;
      resolvedUserName = user.name || resolvedUserName;
      resolvedUserEmail = user.email || resolvedUserEmail;
      resolvedUserRole = user.role || resolvedUserRole;
    } else if (req && req.user) {
      resolvedUserId = req.user._id || req.user.id;
      resolvedUserName = req.user.name || resolvedUserName;
      resolvedUserEmail = req.user.email || resolvedUserEmail;
      resolvedUserRole = req.user.role || resolvedUserRole;
    }

    let ipAddress = '';
    if (req) {
      ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    }

    await ActivityLog.create({
      actionType,
      user: resolvedUserId,
      userName: resolvedUserName || 'Guest',
      userEmail: resolvedUserEmail || '',
      userRole: resolvedUserRole || 'customer',
      entityType,
      entityId: entityId ? String(entityId) : '',
      orderId: orderId ? String(orderId) : '',
      productId: productId ? String(productId) : '',
      description: description || `Action ${actionType} performed`,
      metadata: metadata || {},
      ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ''
    });
  } catch (err) {
    // Non-blocking log failure
    console.error('[ActivityLogger Error]:', err.message);
  }
};

module.exports = { logActivity };
