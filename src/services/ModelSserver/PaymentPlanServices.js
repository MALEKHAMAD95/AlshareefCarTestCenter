import ApiService from '../ApiService';

// const GetPaymentPlansPaging = async ({ pageIndex, pageSize, sortBy, searchValue }) => {
//     const columnKeyToIndex = {
//         code: 0,
//         name: 1,
//         active: 2,
//     };

//     const params = {
//         PageNumber: pageIndex,
//         PageSize: pageSize,
//     };

//     if (sortBy?.length) {
//         const sort = sortBy[0];
//         const columnIndex = columnKeyToIndex[sort.id];
//         if (columnIndex !== undefined) {
//             params.Order = {
//                 column: columnIndex,
//                 dir: sort.desc ? 'desc' : 'asc',
//             };
//         }
//     }

//     if (searchValue) {
//         params['Search.Value'] = searchValue;
//     }

//     try {
//         const response = await ApiService.fetchDataWithAxios({
//             method: 'GET',
//             url: '/PaymentPlan/paging',
//             params,
//             paramsSerializer: (params) => {
//                 const qs = new URLSearchParams();
//                 Object.entries(params).forEach(([key, value]) => {
//                     if (key === 'Order' && typeof value === 'object') {
//                         qs.append('Order', JSON.stringify(value));
//                     } else {
//                         qs.append(key, value);
//                     }
//                 });
//                 return qs.toString();
//             },
//         });
//          return response;
//     } catch (error) {
//         console.error('Error fetching payment plans:', error);
//         return error.response;
//     }
// };

const GetAllPaymentPlans = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/PaymentPlan/all',
        });
         return response;
    } catch (error) {
        console.error('Error fetching all payment plans:', error);
        return error.response;
    }
};

const GetPaymentPlanById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/PaymentPlan/${id}`,
        });
         return response;
    } catch (error) {
        console.error('Error fetching payment plan by ID:', error);
        return error.response;
    }
};

const CreatePaymentPlan = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/PaymentPlan',
            data: body,
        });
        return { data: response };
    } catch (error) {
        console.error('Error creating payment plan:', error);
        return error.response;
    }
};

const UpdatePaymentPlan = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/PaymentPlan',
            data: body,
        });
        return { data: response };
    } catch (error) {
        console.error('Error updating payment plan:', error);
        return error.response;
    }
};

const DeletePaymentPlanById = async (id) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'DELETE',
            url: `/PaymentPlan/${id}`,
        });
        return { data: response };
    } catch (error) {
        console.error('Error deleting payment plan:', error);
        return error.response;
    }
};

export {
    // GetPaymentPlansPaging,
    CreatePaymentPlan,
    UpdatePaymentPlan,
    DeletePaymentPlanById,
    GetAllPaymentPlans,
    GetPaymentPlanById,
};