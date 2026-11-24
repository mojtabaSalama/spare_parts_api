const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');

async function login(req, res, next) {
  try {
    const { user, token, refreshToken } = await authService.login(req.body);
    return successResponse(res, { user, token, refreshToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return successResponse(res, user, 'Current user fetched');
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const { user, token, refreshToken } = await authService.register({ ...req.body, role: 'staff' });
    return successResponse(res, { user, token, refreshToken }, 'Staff account created', 201);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next({ statusCode: 400, message: 'Refresh token is required' });
    }
    const { token, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);
    return successResponse(res, { token, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, createStaff, refresh };