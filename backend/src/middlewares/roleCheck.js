export const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. 'dorm_admin') 
  // or an array of roles (e.g. ['dorm_admin', 'student'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      // user's role is not authorized
      return res.status(403).json({ message: 'Forbidden: Access is denied' });
    }

    // authentication and authorization successful
    next();
  };
};