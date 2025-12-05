import ApiService from '../ApiService';

const GetSafeDepositsPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
  const columnKeyToIndex = {
    code: 0,
    name: 1,
    description: 3,
    isActive: 4,
  };

  const params = {
    PageNumber: pageIndex,
    PageSize: pageSize,
  };

  if (sortBy?.length) {
    const sort = sortBy[0];
    const columnIndex = columnKeyToIndex[sort.id];
    if (columnIndex !== undefined) {
      params.Order = [
        {
          column: columnIndex,
          dir: sort.desc ? 'desc' : 'asc',
        },
      ];
    }
  }

  if (searchValue) {
    params['Search.Value'] = searchValue;
  }

  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/SafeDeposits/paging',
      params,
      paramsSerializer: (params) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (key === 'Order' && Array.isArray(value)) {
            qs.append('Order', JSON.stringify(value));
          } else {
            qs.append(key, value);
          }
        });
        return qs.toString();
      },
    });
         return response.data;
  } catch (error) {
    console.error('Error fetching safe deposits:', error);
    return error.response;
  }
};

const GetSafeDepositById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/SafeDeposits/${id}`,
    });
     return response;
  } catch (error) {
    console.error('Error fetching safe deposit by ID:', error);
    return error.response;
  }
};

const GetAllSafeDeposits = async () => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/SafeDeposits/all',
    });
    return { data: response };
  } catch (error) {
    console.error('Error fetching all safe deposits:', error);
    return error.response;
  }
};

const CreateSafeDeposit = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/SafeDeposits',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error creating safe deposit:', error);
    return error.response;
  }
};

const UpdateSafeDeposit = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: '/SafeDeposits',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error updating safe deposit:', error);
    return error.response;
  }
};

const DeleteSafeDepositById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/SafeDeposits/${id}`,
    });
    return { data: response };
  } catch (error) {
    console.error('Error deleting safe deposit:', error);
    return error.response;
  }
};

export {
  GetAllSafeDeposits,
  GetSafeDepositsPaging,
  GetSafeDepositById,
  CreateSafeDeposit,
  UpdateSafeDeposit,
  DeleteSafeDepositById,
};