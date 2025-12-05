// CarService.js
// Handles car-related API calls

import ApiService from '../ApiService';

/**
 * Add New Car API
 * Payload: {
 *   carStatus: number, // required (enum)
 *   vin?: string,
 *   dealerId: number, // required
 *   makeId: number, // required
 *   modelId: number, // required
 *   transmissionId: number, // required
 *   driveTrainId: number, // required
 *   fuelTypeId: number, // required
 *   year: number, // required
 *   mileage: number, // required
 *   price: number, // required
 *   exteriorColor?: string,
 *   interiorColor?: string,
 *   engine?: string,
 *   description?: string,
 *   carImages?: Array<{ fileId: string, fileName?: string }>,
 *   carExpenses?: Array<{ expenseId: number, price: number, carExpenseAttachments?: Array<{ fileId: string, fileName?: string }> }>,
 *   carDocuments?: Array<{ fileId: string, fileName?: string }>
 * }
 */
const addNewCar = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Car/AddNewCar',
      data: body,
    });
    return response;
  } catch (error) {
    console.error('Error adding new car:', error);
    return error.response;
  }
};

export { addNewCar };
