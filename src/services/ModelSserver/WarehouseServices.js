import ApiService from '../ApiService'

const GetWarehousePaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
  const columnKeyToIndex = {
    code: 0,
    name: 1,
    isActive: 2,
  }

  const params = {
    PageNumber: pageIndex,
    PageSize: pageSize,
  }

  if (sortBy?.length) {
    const sort = sortBy[0]
    const columnIndex = columnKeyToIndex[sort.id]
    if (columnIndex !== undefined) {
      params.Order = [
        {
          column: columnIndex,
          dir: sort.desc ? 'desc' : 'asc',
        },
      ]
    }
  }

  if (searchValue) {
    params['Search.Value'] = searchValue
  }

  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/Warehouse/paging',
      params,
      paramsSerializer: (params) => {
        const qs = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (key === 'Order' && Array.isArray(value)) {
            qs.append('Order', JSON.stringify(value))
          } else {
            qs.append(key, value)
          }
        })
        return qs.toString()
      },
    })
   return response.data
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return error.response
  }
}

const GetAllWarehouse = async () => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: '/Warehouse/all',
    })
     return response
  } catch (error) {
    console.error('Error fetching all warehouses:', error)
    return error.response
  }
}

const GetWarehouseById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/Warehouse/${id}`,
    })
     return response
  } catch (error) {
    console.error('Error fetching warehouse by ID:', error)
    return error.response
  }
}

const CreateWarehouse = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/Warehouse',
      data: body,
    })
    return { data: response }
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return error.response
  }
}

const UpdateWarehouse = async (body) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'PUT',
      url: '/Warehouse',
      data: body,
    })
    return { data: response }
  } catch (error) {
    console.error('Error updating warehouse:', error)
    return error.response
  }
}

const DeleteWarehouseById = async (id) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'DELETE',
      url: `/Warehouse/${id}`,
    })
    return { data: response }
  } catch (error) {
    console.error('Error deleting warehouse:', error)
    return error.response
  }
}

export {
  GetWarehousePaging,
  CreateWarehouse,
  UpdateWarehouse,
  DeleteWarehouseById,
  GetAllWarehouse,
  GetWarehouseById,
}
