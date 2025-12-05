import ApiService from '../ApiService'
 


export const GetPurchaseOrderPaging = async ({
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
    };

    // Construct base params
    const params = {
        PageNumber: pageIndex,
        PageSize: pageSize,
        'Search.Value': searchValue || '',
        Trcode: trcode ?? 1, // Use nullish coalescing; 1 as default if trcode is null/undefined
        StartDate: startDate || '',
        EndDate: endDate || '',
        SaleMan: saleman || '',
        // Added Period, Firm, and IOCode with default value 1 based on example URL
        Period: 1,
        Firm: 1,
        IOCode: 1,
    };

    // Handle sorting
    if (Array.isArray(sortBy) && sortBy.length > 0) {
        const sort = sortBy[0];
        const columnIndex = columnKeyToIndex[sort.id];
        if (columnIndex !== undefined) {
            params.Order = JSON.stringify([{
                column: columnIndex,
                dir: sort.desc ? 'desc' : 'asc',
            }]);
        }
    }

    // Remove undefined or null values
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/MaterialsTransaction/Paging',
            params,
            // Let axios handle serialization naturally; no custom paramsSerializer needed
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching purchase orders:', {
            error: error.message,
            status: error.response?.status,
            url: '/MaterialsTransaction/Paging',
            params,
        });
        throw error; // Rethrow for caller to handle
    }
};


export const DelettPurchaseById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/MaterialsTransaction/${id}`,
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
