// LookupService.js
// Handles lookup-related API calls

import ApiService from '../ApiService';

/**
 * Create Lookup API
 * Payload: {
 *   name?: string,
 *   parentLookupId?: number,
 *   lookupTypeId: number, // required
 *   lookupIconUrl?: string
 * }
 */
const createLookup = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Lookup/CreateLookup',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error creating lookup:', error);
    return error.response;
  }
};

const updateLookup = async (id, body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: `/Lookup/UpdateLookup/${id}`,
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error updating lookup:', error);
    return error.response;
  }
};

const getLookupsById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Lookup/GetLookupsById/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error getting lookups by id:', error);
    return error.response;
  }
};

const getLookupsByLookupTypeId = async (id, params) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Lookup/GetLookupsByLookupTypeId/${id}`,
      params,
    });
    return response;
  } catch (error) {
    console.error('Error getting lookups by lookup type id:', error);
    return error.response;
  }
};

const getLookupsByParentLookupId = async (id, params) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Lookup/GetLookupsByParentLookupId/${id}`,
      params,
    });
    return response;
  } catch (error) {
    console.error('Error getting lookups by parent lookup id:', error);
    return error.response;
  }
};

const deleteLookup = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/Lookup/DeleteLookup/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error deleting lookup:', error);
    return error.response;
  }
};

export {
  createLookup,
  updateLookup,
  getLookupsById,
  getLookupsByLookupTypeId,
  getLookupsByParentLookupId,
  deleteLookup,
};
