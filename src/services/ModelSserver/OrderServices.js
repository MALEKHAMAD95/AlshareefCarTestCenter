import ApiService from '../ApiService'

export const GetOrdersPaging = async ({
    pageIndex,
    pageSize,
    sortBy,
    searchValue,
    startDate,
    endDate,
    saleman,
    trcode,
}) => {
    const columnKeyToIndex = {
        ficheNumber: 0,
        createdDate: 1,
        warehouse: 2,
        netTotal: 3,
        status: 4,
    }

    const params = {
        PageNumber: pageIndex,
        PageSize: pageSize,
        'Search.Value': searchValue || undefined,
        Trcode: trcode || 1,
        StartDate: startDate || undefined,
        EndDate: endDate || undefined,
        SaleMan: saleman || undefined,
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

    Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key],
    )

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Order/Paging',
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
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching orders:', error)
        throw error
    }
}

export const DeleteOrderById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Order/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error deleting order:', error)
        return error.response
    }
}





export const CreateOrder = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Order/Create',
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error creating order:', error)
        throw error
    }
}

export const GetOrderById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Order/GetById?id=${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching order:', error)
        throw error
    }
}

export const GetSOA = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Order/GetSOA',
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching SOA:', error)
        throw error
    }
}

export const GetTransactions = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Order/GetTransactions',
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error
    }
}

export const UpdateOrder = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Order/Update',
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error updating order:', error)
        throw error
    }
}


export const BatchApproval = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Order/BatchApproval',
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error updating order:', error)
        throw error
    }
}

// {
//   "orderIds": [
//     0
//   ],
//   "status": 1,
//   "orderStatus": 0
// }