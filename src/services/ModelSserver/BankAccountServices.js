import ApiService from '../ApiService';

const GetBanksPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
    const columnKeyToIndex = {
        code: 0,
        name: 1,
        active: 2,
        accountNo: 3,
        iban: 4,
        bankType: 5,
        currency: 6,
    };

    const params = {
        PageNumber: pageIndex,
        PageSize: pageSize,
    };

    if (sortBy?.length) {
        const sort = sortBy[0];
        const columnIndex = columnKeyToIndex[sort.id];
        if (columnIndex !== undefined) {
            params.Order = [
                {
                    column: columnIndex,
                    dir: sort.desc ? 'desc' : 'asc',
                },
            ];
        }
    }

    if (searchValue) {
        params['Search.Value'] = searchValue;
    }

    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/BankAccount/paging',
            params,
            paramsSerializer: (params) => {
                const qs = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (key === 'Order' && Array.isArray(value)) {
                        qs.append('Order', JSON.stringify(value));
                    } else {
                        qs.append(key, value);
                    }
                });
                return qs.toString();
            },
        });
         return response;
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        return error.response;
    }
};

const GetAllBanks = async (bankId) => {
    try {
        const params = bankId ? { id: bankId } : {};
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/BankAccount/all',
            params,
        });
         return response;
    } catch (error) {
        console.error('Error fetching all bank accounts:', error);
        return error.response;
    }
};

const GetMobileAllBanks = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/BankAccount/mobile/all',
        });
         return response;
    } catch (error) {
        console.error('Error fetching mobile bank accounts:', error);
        return error.response;
    }
};

const GetBankById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/BankAccount/${id}`,
        });
         return response;
    } catch (error) {
        console.error('Error fetching bank account by ID:', error);
        return error.response;
    }
};

const CreateBankAccount = async (body) => {
    try {
        const payload =   body ;
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/BankAccount',
            data: payload,
        });
        return { data: response };
    } catch (error) {
        console.error('Error creating bank account:', error);
        return error.response;
    }
};

const UpdateBankAccount = async (body) => {
    try {
        const payload =   body ;
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/BankAccount',
            data: payload,
        });
        return { data: response };
    } catch (error) {
        console.error('Error updating bank account:', error);
        return error.response;
    }
};

const DeleteBankAccountById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/BankAccount/${id}`,
        });
        return { data: response };
    } catch (error) {
        console.error('Error deleting bank account:', error);
        return error.response;
    }
};

export {
    GetBanksPaging,
    CreateBankAccount,
    UpdateBankAccount,
    DeleteBankAccountById,
    GetAllBanks,
    GetBankById,
    GetMobileAllBanks,
};