// LookupTypeService.js
// Handles lookup type-related API calls

import ApiService from '../ApiService';

/**
 * Create Lookup Type API
 * Payload: {
 *   name?: string
 * }
 */
const createLookupType = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/LookupType/CreateLookupType',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error creating lookup type:', error);
    return error.response;
  }
};

const updateLookupType = async (id, body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: `/LookupType/UpdateLookupType/${id}`,
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error updating lookup type:', error);
    return error.response;
  }
};

const getLookupTypeById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/LookupType/GetLookupTypeById/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error getting lookup type by id:', error);
    return error.response;
  }
};

const getLookupTypes = async (params) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/LookupType/GetLookupTypes',
      params,
    });
    return response;
  } catch (error) {
    console.error('Error getting lookup types:', error);
    return error.response;
  }
};

const deleteLookupType = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/LookupType/DeleteLookupType/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error deleting lookup type:', error);
    return error.response;
  }
};

export {
  createLookupType,
  updateLookupType,
  getLookupTypeById,
  getLookupTypes,
  deleteLookupType,
};
