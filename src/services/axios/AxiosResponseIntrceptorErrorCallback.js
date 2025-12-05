// src/utils/AxiosResponseIntrceptorErrorCallback.js
import { useSessionUser, useToken } from '@/store/authStore'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import AxiosBase from './AxiosBase'
import { refreshAccessToken } from '../TokenService'

const unauthorizedCode = [401, 419, 440]

const AxiosResponseIntrceptorErrorCallback = async (error) => {
    const { response, config } = error
    const originalRequest = config

    if (response && unauthorizedCode.includes(response.status) && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            const newAccessToken = await refreshAccessToken()

            if (newAccessToken) {
                originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${newAccessToken}`
                return AxiosBase(originalRequest)
            }
        } catch (refreshError) {
            console.error('Refresh token failed', refreshError)
        }
     const { setToken } = useToken()
     setToken('')
     useSessionUser.getState().setUser({})
     useSessionUser.getState().setSessionSignedIn(false)
    }



    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback
