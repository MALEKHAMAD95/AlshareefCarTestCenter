import ApiService from '../ApiService'

const GetMainUnitsPaging = async ({
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
            url: '/MainUnit/paging',
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
        console.error('Error fetching main units:', error)
        return error.response
    }
}

const GetMainUnitById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/MainUnit/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error fetching main unit by ID:', error)
        return error.response
    }
}

const GetAllMainUnits = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/MainUnit/all',
        })
         return response
    } catch (error) {
        console.error('Error fetching all main units:', error)
        return error.response
    }
}

const CreateMainUnit = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/MainUnit',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error creating main unit:', error)
        return error.response
    }
}

const UpdateMainUnit = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/MainUnit',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error updating main unit:', error)
        return error.response
    }
}

const DeleteMainUnitById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/MainUnit/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error deleting main unit:', error)
        return error.response
    }
}

export {
    GetAllMainUnits,
    GetMainUnitsPaging,
    GetMainUnitById,
    CreateMainUnit,
    UpdateMainUnit,
    DeleteMainUnitById,
}
