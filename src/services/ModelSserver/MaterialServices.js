import ApiService from '../ApiService'

const GetMaterialPaging = async ({
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
            url: '/Material/paging',
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
         return response
    } catch (error) {
        console.error('Error fetching materials:', error)
        return error.response
    }
}

const GetMaterialById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Material/${id}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error fetching material by ID:', error)
        return error.response
    }
}

const GetAllMaterial = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Material/all',
        })
        return { data: response }
    } catch (error) {
        console.error('Error fetching all materials:', error)
        return error.response
    }
}

const CreateMaterial = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Material',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error creating material:', error)
        return error.response
    }
}

const UpdateMaterial = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Material',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error updating material:', error)
        return error.response
    }
}

const DeleteMaterialById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Material/${id}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error deleting material:', error)
        return error.response
    }
}

const FetchMaterials = async (
    pageNumber = 1,
    pageSize = 5,
    searchValue = '',
) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Material/pagingMaterial/info',
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
                Order: JSON.stringify({ column: 0, dir: 'string' }),
                'Search.Value': searchValue,
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching materials:', error)
        return error.response || { data: { success: false, data: [] } }
    }
}

export {
    GetAllMaterial,
    GetMaterialPaging,
    GetMaterialById,
    CreateMaterial,
    UpdateMaterial,
    FetchMaterials,
    DeleteMaterialById,
}
