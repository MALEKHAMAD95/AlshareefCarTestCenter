import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '@/components/template/LanguageSelector'

export const ForgotPasswordBase = ({ signInUrl = '/sign-in' }) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const { t, i18n } = useTranslation('translation')
    const translationPath = 'auth.ForgotPassword.'
    const navigate = useNavigate()

    // تحديد الاتجاهية بناءً على اللغة
    const isRtl = i18n.language === 'ar'

    const handleContinue = () => {
        navigate(signInUrl)
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            {/* <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
                <LanguageSelector className="cursor-pointer" />
            </div> */}
            <div className="w-full max-w-md">
                <div className="mb-6">
                    {emailSent ? (
                        <>
                            <h3 className="mb-2">{t(`${translationPath}CheckYourEmail`)}</h3>
                            <p className="font-semibold heading-text">
                                {t(`${translationPath}EmailSentMessage`)}
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="mb-2">{t(`${translationPath}ForgotPassword`)}</h3>
                            <p className="font-semibold heading-text">
                                {t(`${translationPath}EnterEmailMessage`)}
                            </p>
                        </>
                    )}
                </div>
                {message && (
                    <Alert showIcon className="mb-4" type="danger">
                        <span className="break-all">{message}</span>
                    </Alert>
                )}
                <ForgotPasswordForm
                    emailSent={emailSent}
                    setMessage={setMessage}
                    setEmailSent={setEmailSent}
                >
                    <Button
                        block
                        variant="solid"
                        type="button"
                        onClick={handleContinue}
                    >
                        {t(`${translationPath}Continue`)}
                    </Button>
                </ForgotPasswordForm>
                <div className="mt-4 text-center">
                    <span>{t(`${translationPath}BackTo`)}</span>{' '}
                    <ActionLink
                        to={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t(`${translationPath}SignIn`)}
                    </ActionLink>
                </div>
            </div>
        </div>
    )
}

const ForgotPassword = () => {
    return <ForgotPasswordBase />
}

export default ForgotPassword