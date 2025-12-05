import ApiService from '../ApiService'

const GetSalesmenPaging = async ({
    pageIndex,
    pageSize,
    sortBy,
    searchValue,
}) => {
    const columnKeyToIndex = {
        code: 0,
        name: 1,
        description: 3,
        isActive: 4,
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
            url: '/Salesman/paging',
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
        console.error('Error fetching salesmen:', error)
        return error.response
    }
}

const GetSalesmanById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Salesman/${id}`,
        })
        return response
    } catch (error) {
        console.error('Error fetching salesman by ID:', error)
        return error.response
    }
}

const GetAllSalesmen = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Salesman/all',
        })
        return response
    } catch (error) {
        console.error('Error fetching all salesmen:', error)
        return error.response
    }
}

const CreateSalesman = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Salesman',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error creating salesman:', error)
        return error.response
    }
}

const UpdateSalesman = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Salesman',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error updating salesman:', error)
        return error.response
    }
}

const DeleteSalesmanById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Salesman/${id}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error deleting salesman:', error)
        return error.response
    }
}

export {
    GetSalesmenPaging,
    GetSalesmanById,
    GetAllSalesmen,
    CreateSalesman,
    UpdateSalesman,
    DeleteSalesmanById,
}
