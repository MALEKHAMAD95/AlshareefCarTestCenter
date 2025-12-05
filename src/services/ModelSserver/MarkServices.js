import ApiService from '../ApiService'

const GetMarksPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
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
            params.Order = {
                column: columnIndex,
                dir: sort.desc ? 'desc' : 'asc',
            }
        }
    }

    if (searchValue) {
        params['Search.Value'] = searchValue
    }

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Mark/paging',
            params,
            paramsSerializer: (params) => {
                const qs = new URLSearchParams()
                Object.entries(params).forEach(([key, value]) => {
                    if (key === 'Order' && typeof value === 'object') {
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
   return response.data
    } catch (error) {
        console.error('Error fetching marks:', error)
        return error.response
    }
}

const GetAllMarks = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Mark/all',
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching all marks:', error)
        return error.response
    }
}

const GetMarkById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Mark/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching mark by ID:', error)
        return error.response
    }
}

const CreateMark = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Mark',
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error creating mark:', error)
        return error.response
    }
}

const UpdateMark = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Mark',
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error updating mark:', error)
        return error.response
    }
}

const DeleteMarkById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Mark/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
         return response
    } catch (error) {
        console.error('Error deleting mark:', error)
        return error.response
    }
}

export {
    GetMarksPaging,
    CreateMark,
    UpdateMark,
    DeleteMarkById,
    GetAllMarks,
    GetMarkById,
}
