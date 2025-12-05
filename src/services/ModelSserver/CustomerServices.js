import ApiService from '../ApiService'

const GetAllCustomers = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Customer/all',
        })
         return response
    } catch (error) {
        console.error('Error fetching all customers:', error)
        return error.response
    }
}

const GetCustomersPaging = async ({
    pageIndex,
    pageSize,
    sortBy,
    searchValue,
}) => {
    const columnKeyToIndex = {
        code: 0,
        firstName: 1,
        secondName: 2,
        blocked: 3,
        address: 4,
        address2: 5,
        contactPerson: 6,
        phoneNumber: 7,
        phoneNumber2: 8,
        contactPhoneNo: 9,
        taxNo: 10,
        email: 11,
    }

    const params = {
        PageNumber: pageIndex,
        PageSize: pageSize,
    }

    if (sortBy?.length) {
        const sort = sortBy[0]
        const columnIndex = columnKeyToIndex[sort.id]
        if (columnIndex !== undefined) {
            params['order[0].column'] = columnIndex
            params['order[0].dir'] = sort.desc ? 'desc' : 'asc'
        }
    }

    if (searchValue) {
        params['Search.Value'] = searchValue
    }

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Customer/paging',
            params,
            paramsSerializer: (params) => {
                const qs = new URLSearchParams()
                Object.entries(params).forEach(([key, value]) => {
                    qs.append(key, value)
                })
                return qs.toString()
            },
        })
         return response.data
    } catch (error) {
        console.error('Error fetching customers:', error)
        return error.response
    }
}

const GetCustomerById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Customer/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error fetching customer by ID:', error)
        return error.response
    }
}

const CreateCustomer = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Customer',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error creating customer:', error)
        return error.response
    }
}

const UpdateCustomer = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Customer',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error updating customer:', error)
        return error.response
    }
}

const DeleteCustomerById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Customer/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error deleting customer:', error)
        return error.response
    }
}

export {
    GetAllCustomers,
    GetCustomersPaging,
    GetCustomerById,
    CreateCustomer,
    UpdateCustomer,
    DeleteCustomerById,
}
