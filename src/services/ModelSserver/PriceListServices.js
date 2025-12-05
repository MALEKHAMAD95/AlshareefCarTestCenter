import ApiService from '../ApiService';

const GetAllPriceLists = async () => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/PriceList/all',
    });
    return { data: response };
  } catch (error) {
    console.error('Error fetching all price lists:', error);
    return error.response;
  }
};

const GetPriceListById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/PriceList/${id}`,
      params: { PriceListId: id },
    });
    return { data: response };
  } catch (error) {
    console.error('Error fetching price list by ID:', error);
    return error.response;
  }
};

const CreatePriceList = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/PriceList',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error creating price list:', error);
    return error.response;
  }
};

const DeletePriceListById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/PriceList/${id}`,
      params: { PriceListId: id },
    });
    return { data: response };
  } catch (error) {
    console.error('Error deleting price list:', error);
    return error.response;
  }
};

export {
  GetAllPriceLists,
  GetPriceListById,
  CreatePriceList,
  DeletePriceListById,
};