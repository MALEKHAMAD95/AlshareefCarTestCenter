import ApiService from '../ApiService'

const GetNumberingTemplatesPaging = async ({
    pageIndex,
    pageSize,
    sortBy,
    searchValue,
    trcode,
    userId,
    warehouseId,
    firmNumber,
    searchDate,
}) => {
    const columnKeyToIndex = {
        trcode: 0,
        value: 1,
        startDate: 2,
        endDate: 3,
        firmNumber: 4,
        priority: 5,
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
    } else {
        const columnIndex = columnKeyToIndex['trcode']
        params.Order = [
            {
                column: columnIndex,
                dir: 'desc',
            },
        ]
    }

    if (searchValue) {
        params['Search.Value'] = searchValue
    }
    if (trcode !== undefined) {
        params.Trcode = trcode
    }
    if (userId !== undefined) {
        params.UserID = userId
    }
    if (warehouseId !== undefined) {
        params.warehouseId = warehouseId
    }
    if (firmNumber !== undefined) {
        params.firm_number = firmNumber
    }
    if (searchDate) {
        params.SearchDate = searchDate
    }

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/NumberingTemplate/paging',
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
        console.error('Error fetching numbering templates:', error)
        return error.response
    }
}

const GetAllNumberingTemplates = async ({
    trcode,
    userId,
    warehouseId,
    firmNumber,
    searchDate,
}) => {
    const params = {}
    if (trcode !== undefined) params.Trcode = trcode
    if (userId !== undefined) params.UserID = userId
    if (warehouseId !== undefined) params.warehouseId = warehouseId
    if (firmNumber !== undefined) params.firm_number = firmNumber
    if (searchDate) params.SearchDate = searchDate

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/NumberingTemplate/GetAllTemplate',
            params,
        })
         return response
    } catch (error) {
        console.error('Error fetching all numbering templates:', error)
        return error.response
    }
}

const GetNumberingTemplateById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/NumberingTemplate/${id}`,
        })
         return response
    } catch (error) {
        console.error('Error fetching numbering template by ID:', error)
        return error.response
    }
}

const CreateNumberingTemplate = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/NumberingTemplate',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error creating numbering template:', error)
        return error.response
    }
}

const UpdateNumberingTemplate = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/NumberingTemplate',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error updating numbering template:', error)
        return error.response
    }
}

const DeleteNumberingTemplateById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/NumberingTemplate/${id}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error deleting numbering template:', error)
        return error.response
    }
}

export {
    GetNumberingTemplatesPaging,
    GetAllNumberingTemplates,
    GetNumberingTemplateById,
    CreateNumberingTemplate,
    UpdateNumberingTemplate,
    DeleteNumberingTemplateById,
}
