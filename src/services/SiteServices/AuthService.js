// AuthService.js
// Handles authentication-related API calls

import ApiService from '../ApiService';

/**
 * Login API
 * Payload: {
 *   userName: string, // required
 *   password: string, // required
 * }
 */
const login = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Auth/login',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return error.response;
  }
};

export { login };
