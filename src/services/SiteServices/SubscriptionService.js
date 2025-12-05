// SubscriptionService.js
// Handles subscription-related API calls

import ApiService from '../ApiService';

/**
 * Create Subscription Plan API
 * Payload: {
 *   name?: string,
 *   description?: string,
 *   carLimit: number, // required
 *   pipelineCarLimit: number, // required
 *   pricePerMonth: number, // required
 *   extraCarPrice: number // required
 * }
 */
const createSubscriptionPlan = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Subscription/CreateSubscriptionPlan',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return error.response;
  }
};

const updateSubscriptionPlan = async (id, body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: `/Subscription/UpdateSubscriptionPlan/${id}`,
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return error.response;
  }
};

const getSubscriptionPlanById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Subscription/GetSubscriptionPlanById/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error getting subscription plan by id:', error);
    return error.response;
  }
};

const getAllSubscriptionPlans = async () => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/Subscription/GetAllSubscriptionPlans',
    });
    return response;
  } catch (error) {
    console.error('Error getting all subscription plans:', error);
    return error.response;
  }
};

const deleteSubscriptionPlan = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/Subscription/DeleteSubscriptionPlan/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return error.response;
  }
};

const createAddonService = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Subscription/CreateAddonService',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error creating addon service:', error);
    return error.response;
  }
};

const updateAddonService = async (id, body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: `/Subscription/UpdateAddonService/${id}`,
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error updating addon service:', error);
    return error.response;
  }
};

const getAddonServicesById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Subscription/GetAddonServicesById/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error getting addon services by id:', error);
    return error.response;
  }
};

const getAllAddonServices = async () => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/Subscription/GetAllAddonServices',
    });
    return response;
  } catch (error) {
    console.error('Error getting all addon services:', error);
    return error.response;
  }
};

const deleteAddonServices = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/Subscription/DeleteAddonServices/${id}`,
    });
    return response;
  } catch (error) {
    console.error('Error deleting addon services:', error);
    return error.response;
  }
};

export {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  getSubscriptionPlanById,
  getAllSubscriptionPlans,
  deleteSubscriptionPlan,
  createAddonService,
  updateAddonService,
  getAddonServicesById,
  getAllAddonServices,
  deleteAddonServices,
};
