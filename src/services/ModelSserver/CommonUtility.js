import ApiService from '../ApiService'

const CheckingShippingDispatchQuantity = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'POST',
            url: '/CommonUtility/CheckingShippingDispatchQuantity',
            data: body,
        })
         return response
    } catch (error) {
        console.error('Error creating CheckingShippingDispatchQuantity:', error)
        return error.response
    }
}

export { CheckingShippingDispatchQuantity }
