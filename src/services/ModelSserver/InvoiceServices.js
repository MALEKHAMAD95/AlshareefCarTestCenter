import ApiService from '../ApiService';

const GetInvoicesPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
  const columnKeyToIndex = {
    code: 0,
    number: 1,
    customer: 2,
    amount: 3,
    status: 4,
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
      url: '/api/Invoice/Paging',
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
     return response;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return error.response;
  }
};

const GetInvoiceById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/api/Invoice/GetById',
      params: { id },
    });
    return { data: response };
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    return error.response;
  }
};

const CreateDispatchInvoice = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/api/Invoice/Dispatch/Create',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error creating dispatch invoice:', error);
    return error.response;
  }
};

const CreateSalesOrderInvoice = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/api/Invoice/SalesOrder/Create',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error creating sales order invoice:', error);
    return error.response;
  }
};

const UpdateInvoice = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: '/api/Invoice/Update',
      data: body,
    });
    return { data: response };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return error.response;
  }
};

const DeleteInvoiceById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/api/Invoice/${id}`,
    });
    return { data: response };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return error.response;
  }
};

export {
  GetInvoicesPaging,
  GetInvoiceById,
  CreateDispatchInvoice,
  CreateSalesOrderInvoice,
  UpdateInvoice,
  DeleteInvoiceById,
};