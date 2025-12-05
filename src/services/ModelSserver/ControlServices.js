import ApiService from '../ApiService'
import { triggerMessageError } from '@/components/shared/ToastMange';

const GetControlByKey = async (key) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Control/${key}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error fetching control by key:', error)
        return error.response
    }
}

const GetControlValueByKey = async (key) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: `/Control/GetVal/${key}`,
        })
        return { data: response }
    } catch (error) {
        console.error('Error fetching control value by key:', error)
        return error.response
    }
}

const GetAllControls = async () => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'GET',
            url: '/Control/all',
        })
        return { data: response }
    } catch (error) {
        console.error('Error fetching all controls:', error)
        return error.response
    }
}

const UpdateControl = async (body) => {
    try {
        const response = await ApiService.fetchDataWithAxios({
            method: 'PUT',
            url: '/Control',
            data: body,
        })
        return { data: response }
    } catch (error) {
        console.error('Error updating control:', error)
        return error.response
    }
}


const fetchControls = async (t, translationPath) => {
    try {
        const response = await GetAllControls();
        if (response?.data?.data) {
            const parsedControls = response.data.data.map(control => ({
                ...control,
                setoptions: JSON.parse(control.setoptions),
            }));
            return parsedControls;
        } else {
            triggerMessageError(t(`${translationPath}fetchError`));
            return [];
        }
    } catch (error) {
        console.error('Error fetching controls:', error);
        triggerMessageError(t(`${translationPath}fetchError`));
        return [];
    }
};

export { GetControlByKey, GetControlValueByKey, GetAllControls, UpdateControl, fetchControls }
