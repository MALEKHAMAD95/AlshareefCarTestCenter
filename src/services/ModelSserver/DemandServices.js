import ApiService from '../ApiService'
const GetDemandsPaging = async ({
    pageIndex = 1, // Default to 1 if undefined
    pageSize = 10, // Default to 10 if undefined
    sortBy,
    searchValue,
} = {}) => {
    const columnKeyToIndex = {
        code: 0,
        name: 1,
        description: 2,
        isActive: 3,
    }


    // Validate and convert to numbers
    var validatedPageIndex = Number(pageIndex)
    var validatedPageSize = Number(pageSize)

    if (isNaN(validatedPageIndex) || validatedPageIndex < 1) {
        console.warn('Invalid pageIndex, defaulting to 1')
        validatedPageIndex = 1
    }
    if (isNaN(validatedPageSize) || validatedPageSize < 1) {
        console.warn('Invalid pageSize, defaulting to 10')
        validatedPageSize = 10
    }

    var params = {
        PageNumber: validatedPageIndex,
        PageSize: validatedPageSize,
    }

    if (sortBy?.length) {
        var sort = sortBy[0]
        var columnIndex = columnKeyToIndex[sort.id]
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
            url: '/Demand/paging',
            params,
            paramsSerializer: (params) => {
                const qs = new URLSearchParams()
                Object.entries(params).forEach(([key, value]) => {
                    if (value === undefined || value === null) {
                        return // Skip undefined or null values
                    }
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
        console.error('Error fetching demands:', error)
        return error.response
    }
}

 

const GetDemandById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Demand/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error fetching demand by ID:', error)
        return error.response
    }
}

const CreateDemand = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Demand',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error creating demand:', error)
        return error.response
    }
}

const UpdateDemand = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Demand',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error updating demand:', error)
        return error.response
    }
}

const DeleteDemandById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Demand/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error deleting demand:', error)
        return error.response
    }
}

export {
    GetDemandsPaging,
    GetDemandById,
    CreateDemand,
    UpdateDemand,
    DeleteDemandById,
}
