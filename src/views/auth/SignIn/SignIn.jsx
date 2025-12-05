import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '@/components/template/LanguageSelector'

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}) => {
    const [message, setMessage] = useTimeOutMessage()
    const { t, i18n } = useTranslation('translation')
    const translationPath = 'auth.SignIn.'
    const mode = useThemeStore((state) => state.mode)

    // Determine LanguageSelector position based on directionality
    const isRtl = i18n.language === 'ar'

    return (
        <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Right Side - Premium Car Showcase */}
            <div className="hidden lg:flex lg:w-3/5 relative z-10 h-auto">
                <div 
                    className="w-full relative overflow-hidden min-h-screen"
                    style={{
                        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-amber-600/20"></div>

                    {/* Content Container */}
                    <div className="relative z-10 h-auto flex flex-col justify- p-6 lg:p-12 text-white items-center
">

                        {/* Middle Section - Main Content */}
                        <div className="max-w-2xl space-y-6">
                            {/* Title */}
                            <div className="space-y-4">
                                <div className="inline-block">
                                    <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-transparent bg-clip-text">
                                        <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-2xl">
                                            {t(`${translationPath}WelcomeTitle`) || 'Alshareef Car Test Center'}
                                        </h1>
                                    </div>
                                </div>
                                <p className="text-xl text-orange-100 leading-relaxed font-light max-w-xl">
                                    {t(`${translationPath}WelcomeDescription`) || 'نظام إدارة شامل ومتطور لفحص وصيانة المركبات بأعلى معايير الجودة والاحترافية'}
                                </p>
                            </div>

                            {/* Car Gallery with Animation */}
                            <div className="relative">
                                {/* Main Showcase Image */}
                                <div className="group relative overflow-hidden rounded-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200"
                                        alt="Luxury Car"
                                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-1">فحص  </h3>
                                                    <p className="text-sm text-orange-100">x          </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Small Gallery Grid */}
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="group relative overflow-hidden rounded-xl aspect-square">
                                        <img
                                            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400"
                                            alt="Car Detail"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="group relative overflow-hidden rounded-xl aspect-square">
                                        <img
                                            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400"
                                            alt="Car Interior"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="group relative overflow-hidden rounded-xl aspect-square">
                                        <img
                                            src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=400"
                                            alt="Car Technology"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-700/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </div>

    
                        </div>

                        {/* Bottom Section - Footer */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                            <div className="text-sm text-orange-200/80">
                                © 2026 {t(`${translationPath}CompanyName`) || 'Alshareef Car Test Center'}. All rights reserved.
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-orange-200 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="text-orange-200 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="text-orange-200 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Premium Login Form */}
            <div className="w-full lg:w-2/5 flex items-center justify-center pl-6 lg:pl-12   pr-6 lg:pr-12  relative z-10">
                {/* Glassmorphism Container */}
                <div className="w-full max-w-lg">
                    {/* Language Selector */}
                    <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-30`}>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
                            <LanguageSelector className="cursor-pointer" />
                        </div>
                    </div>

                    {/* Mobile Logo */}
                    <div className="mb-10 lg:hidden text-center">
                        <Logo imgClass="max-h-14 mx-auto drop-shadow-2xl" mode={mode} />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-32 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-lg">
                                    <img
                                        src="https://alshareef-group.com/wp-content/uploads/2024/12/white.png"
                                        alt="Alshareef logo"
                                        className="w-32 h-w-32 object-contain"
                                    />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">
                                    {t(`${translationPath}Welcome`) || 'Alshareef Car Test Center'}
                                </h2>
                                <p className="text-orange-100">
                                    {t(`${translationPath}PleaseSignIn`) || 'Please enter your credentials to sign in!'}
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-8">
                            {/* Alert Message */}
                            {message && (
                                <Alert showIcon className="mb-6" type="danger">
                                    <span className="break-all">{message}</span>
                                </Alert>
                            )}

                            {/* Login Form */}
                            <SignInForm
                                disableSubmit={disableSubmit}
                                setMessage={setMessage}
                                translationPath={translationPath}
                                passwordHint={
                                    <div className="mb-6 mt-3 text-end">
                                        <ActionLink
                                            to={forgetPasswordUrl}
                                            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold text-sm transition-colors inline-flex items-center gap-1"
                                            themeColor={false}
                                        >
                                            {t(`${translationPath}ForgotPassword`) || 'Forgot password'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </ActionLink>
                                    </div>
                                }
                            />

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                            </div>
                            {/* Sign Up Link */}
                            <div className="text-center">
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                    {t(`${translationPath}NoAccount`) || "Don't have an account?"}
                                </p>
                                <ActionLink
                                    to={signUpUrl}
                                    className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold transition-all hover:gap-3"
                                    themeColor={false}
                                >
                                    {t(`${translationPath}SignUp`) || 'Create new account'}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </ActionLink>
                            </div>
                        </div>

                        {/* Footer Badge */}
                        <div className="bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 px-8 py-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">اتصال آمن ومشفر</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-8 text-center text-sm text-orange-200/80">
                        <p>محمي بواسطة تشفير SSL من الدرجة العسكرية</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
