const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'projectflow_super_secret_jwt_key_2026';

function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Gateway & Service auth middleware
function authenticate(req, res, next) {
  // First check headers passed from Gateway if downstream
  const gatewayUserId = req.header('x-user-id');
  const gatewayUserRole = req.header('x-user-role');
  const gatewayUserEmail = req.header('x-user-email');
  const gatewayUserName = req.header('x-user-name');

  if (gatewayUserId && gatewayUserRole) {
    req.user = {
      id: gatewayUserId,
      role: gatewayUserRole,
      email: gatewayUserEmail,
      name: gatewayUserName
    };
    return next();
  }

  // Otherwise check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  req.user = decoded;
  next();
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const hasRole = allowedRoles.some(role => role.toLowerCase() === userRole);
    if (!hasRole) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  generateToken,
  generateRefreshToken,
  verifyToken,
  authenticate,
  authorizeRoles
};
