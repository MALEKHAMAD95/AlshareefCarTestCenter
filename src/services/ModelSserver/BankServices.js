import ApiService from '../ApiService'

const GetBanksPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
    const columnKeyToIndex = {
        code: 1,
        name: 2,
        isActive: 3,
    }

    const params = {
        PageNumber: pageIndex,
        PageSize: pageSize,
    }

    const effectiveSortBy = sortBy?.length
        ? sortBy
        : [{ id: 'code', desc: false }]

    const sort = effectiveSortBy[0]
    const columnIndex = columnKeyToIndex[sort.id]
    if (columnIndex !== undefined) {
        params['order[0].column'] = columnIndex
        params['order[0].dir'] = sort.desc ? 'desc' : 'asc'
    }

    if (searchValue) {
        params['Search.Value'] = searchValue
    }

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Bank/paging',
            params,
            paramsSerializer: (params) => {
                const qs = new URLSearchParams()
                Object.entries(params).forEach(([key, value]) => {
                    qs.append(key, value)
                })
                return qs.toString()
            },
        })
         return response
    } catch (error) {
        console.error('Error fetching banks:', error)
        return error.response
    }
}

const GetAllBanks = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Bank/all',
        })
         return response
    } catch (error) {
        console.error('Error fetching all banks:', error)
        return error.response
    }
}

const GetBankById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Bank/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error fetching bank by ID:', error)
        return error.response
    }
}

const CreateBank = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/Bank',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error creating bank:', error)
        return error.response
    }
}

const UpdateBank = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Bank',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error updating bank:', error)
        return error.response
    }
}

const DeleteBankById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/Bank/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error deleting bank:', error)
        return error.response
    }
}

export {
    GetBanksPaging, // Done ✅
    CreateBank, // Done ✅
    UpdateBank, // Done ✅
    DeleteBankById, // Done ✅
    GetAllBanks,
    GetBankById,
}
