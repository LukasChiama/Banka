import Jwt from '../helpers/auth';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    res.status(403).json({
      status: 403,
      error: 'Authorization token required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      status: 401,
      error: 'Access denied! Invalid token.',
    });
  }

  try {
    const decoded = await Jwt.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      status: 403,
      error: 'Authorization fail! Invalid token',
    });
  }
};

export const adminAuth = (req, res, next) => {
  const { isadmin } = req.user;
  if (isadmin !== true) {
    return res.status(403).json({
      status: 403,
      error: 'Unauthorized! Accessible to admin only',
    });
  }
  return next();
};

export const staffAuth = (req, res, next) => {
  const { type, isadmin } = req.user;
  if (type !== 'staff' || isadmin === true) {
    return res.status(403).json({
      status: 403,
      error: 'Unauthorized! Accessible to staff only',
    });
  }
  return next();
};

export const clientAuth = (req, res, next) => {
  const { type } = req.user;
  if (type !== 'client') {
    return res.status(403).json({
      status: 403,
      error: 'Unauthorized! Staff and admin not allowed',
    });
  }
  return next();
};
