import appConfig from '@/configs/app.config';
import ApiService from '../ApiService';

const GetOrderStatusPaging = async ({ pageIndex, pageSize, sortBy, searchValue, orderStatusType }) => {
  const columnKeyToIndex = {
    name: 0,
    active: 1,
    isDefault: 2,
    linenr: 3,
  };

  const params = {
    PageNumber: pageIndex,
    PageSize: pageSize,
    OrderStatus: orderStatusType, // 1 for Sales Status, 2 for Purchase Status
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
      url: '/OrderStatus/paging',
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
         return response.data
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    return error.response;
  }
};

const GetOrderStatusById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/OrderStatus/GetById',
      params: { id },
    });
     return response;
  } catch (error) {
    console.error('Error fetching order status by ID:', error);
    return error.response;
  }
};

const GetOrderStatusByTypeId = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/OrderStatus/GetByTypeId',
      params: { id },
    });
     return response;
  } catch (error) {
    console.error('Error fetching order status by type ID:', error);
    return error.response;
  }
};

const GetLastLineNumByTypeId = async (typeId) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/OrderStatus/GetLastLineNumByTypeId',
      data: { typeId },
    });
     return response;
  } catch (error) {
    console.error('Error fetching last line number by type ID:', error);
    return error.response;
  }
};

const CreateOrderStatus = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/OrderStatus',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error creating order status:', error);
    return error.response;
  }
};

const UpdateOrderStatus = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: '/OrderStatus',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error updating order status:', error);
    return error.response;
  }
};

const DeleteOrderStatusById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/OrderStatus/${id}`,
    });
    return { data: response };
  } catch (error) {
    console.error('Error deleting order status:', error);
    return error.response;
  }
};

export {
  GetOrderStatusPaging,
  GetOrderStatusById,
  GetOrderStatusByTypeId,
  GetLastLineNumByTypeId,
  CreateOrderStatus,
  UpdateOrderStatus,
  DeleteOrderStatusById,
};