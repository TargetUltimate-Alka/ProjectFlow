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
  // 1. If an Authorization Bearer token is provided, cryptographically verify it
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }
    req.user = decoded;
    return next();
  }

  // 2. If forwarded downstream from API Gateway with verified gateway headers
  const gatewayUserId = req.header('x-user-id');
  const gatewayUserRole = req.header('x-user-role');
  if (gatewayUserId && gatewayUserRole) {
    req.user = {
      id: gatewayUserId,
      role: gatewayUserRole,
      email: req.header('x-user-email'),
      name: decodeURIComponent(req.header('x-user-name') || '')
    };
    return next();
  }

  // 3. Internal service-to-service communication
  const internalService = req.header('x-internal-service');
  if (internalService) {
    req.user = {
      id: 'system',
      role: 'System',
      email: `${internalService}@internal`,
      name: internalService
    };
    return next();
  }

  return res.status(401).json({ error: 'Authentication required. No token provided.' });
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
