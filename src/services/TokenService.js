import axios from 'axios'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'

export const refreshAccessToken = async () => {
    const session = useSessionUser.getState().user
    const currentAccessToken = session?.accessToken
    const refreshToken = session?.refreshToken
    const userName = session?.userName

    if (!refreshToken || !userName || !currentAccessToken) {
        throw new Error('Missing token or username')
    }

    const response = await axios.post(`${appConfig.server_address}/api/Auth/refreshToken`, {
        accessToken: currentAccessToken,
        refreshToken: refreshToken,
    })

    const { accessToken: newAccessToken, refreshToken: refreshTokenObj } = response.data
    const newRefreshToken = refreshTokenObj?.tokenString

    if (newAccessToken && newRefreshToken) {
        const { setToken } = useToken()
        setToken(newAccessToken)

        useSessionUser.getState().setUser({
            ...session,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })

        return newAccessToken
    }

    throw new Error('Unable to refresh token')
}
