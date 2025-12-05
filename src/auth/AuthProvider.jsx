import { useRef, useImperativeHandle } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiRefreshToken, apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'

const IsolatedNavigator = ({ ref }) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])

    return <></>
}

function AuthProvider({ children }) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)
    const { token, setToken } = useToken()

    const authenticated = Boolean(token && signedIn)
    const navigatorRef = useRef(null)

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        )
    }

    const handleSignIn = (tokens, user) => {
        setToken(tokens.accessToken || '')
        setSessionSignedIn(true)

        if (user) {
            const userData = {
                avatar: '',
                userName: user?.data?.userName || '', 
                email: '', 
                authority: [],
                refreshToken: user?.data?.refreshToken?.tokenString || '',
                expireAt: user?.data?.refreshToken?.expireAt || '',
                accessToken: user?.data?.accessToken || '',
                id: user?.data?.id?.toString() || '',
            }
            setUser(userData)
        }
    }

    const handleSignOut = () => {
        setToken('');
        setUser({});
        sessionStorage.removeItem('sessionUser');
        sessionStorage.removeItem('token');
        localStorage.removeItem('sessionUser');
        setSessionSignedIn(false);
    }

    const signIn = async (values) => {
        try {
            const resp =  {
    "data": {
        "id": 2,
        "userName": "سلطان",
        "accessToken": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYWxhYSIsIk5hbWVJZGVudGlmaWVyIjoiYWxhYSIsIklkIjoiMiIsImV4cCI6MTc1MDcyMDA0NywiaXNzIjoiTUlOSUVSUCIsImF1ZCI6Ik1JTklFUlAifQ.UQkGF7GI1WsXjRlCbT96k4VRO8JzcdU0F-389oya7w0",
        "refreshToken": {
            "tokenString": "zgF72SDpICuArApUVnb/h4i6OwtMJTq7nrf5OKBSO8w=",
            "expireAt": "2025-06-24T02:07:28.0224031"
        }
    },
    "message": null,
    "success": true,
    "statusCode": 200,
    "errorCode": null,
    "errors": []
}//await apiSignIn(values)
            if (resp) {
                handleSignIn({ accessToken: resp?.data?.accessToken }, resp)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Unable to sign in' }
        } catch (errors) {
            return {
                status: 'failed',
                message: 'Login Failed Invalid Username or The Password',
            }
        }
    }

    const signUp = async (values) => {
        try {
            const resp = await apiSignUp(values)
            if (resp) {
                handleSignIn({ accessToken: resp?.data?.accessToken }, resp)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Unable to sign up' }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const refreshAccessToken = async () => {
        try {
            const currentUser = useSessionUser.getState().user
            const response = await apiRefreshToken({
                accessToken: currentUser.accessToken,
                refreshToken: currentUser.refreshToken,
            })

            if (response?.accessToken && response?.refreshToken) {
                setToken(response.accessToken)
                setUser({
                    ...currentUser,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                })
                return { status: 'success' }
            }
            return { status: 'failed', message: 'Invalid response from token refresh' }
        } catch (error) {
            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
       handleSignOut()
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath)
            sessionStorage.removeItem('sessionUser');
            sessionStorage.removeItem('token');
            localStorage.removeItem('sessionUser');
        }
    }
    const oAuthSignIn = (callback) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
                refreshAccessToken,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
