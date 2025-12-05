// DealerService.js
// Handles dealer-related API calls

import ApiService from '../ApiService';

/**
 * Create Dealer API
 * Payload: {
 *   userName?: string,
 *   email?: string,
 *   password?: string,
 *   firstName?: string,
 *   lastName?: string,
 *   phoneNumber?: string,
 *   imageId?: string
 * }
 */
const createDealer = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Dealer',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error creating dealer:', error);
    return error.response;
  }
};

export { createDealer };
