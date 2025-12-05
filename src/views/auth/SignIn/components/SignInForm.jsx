import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Notification, toast } from '@/components/ui'

const validationSchema = z.object({
    userName: z
        .string({ required_error: 'Please enter your userName' })
        .min(1, { message: 'Please enter your userName' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const triggerMessage = (msg = '') => {
    toast.push(
        <Notification type="success" duration={3000}>
            {msg || 'Upload Failed!'}
        </Notification>,
        {
            placement: 'top-center',
        },
    )
}
const SignInForm = (props) => {
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        disableSubmit = false,
        className,
        setMessage,
        passwordHint,
        translationPath,
    } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            userName: 'Ahmad',
            password: 'Ahmad',
        },
        resolver: zodResolver(validationSchema),
    })

    const { t } = useTranslation()

    const { signIn } = useAuth()

    const onSignIn = async (values) => {
        const { userName, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({ userName, password })
            if (result?.status === 'success') {
                triggerMessage('Login Successfully Welcome')
            }
            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        }
        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label={t(`${translationPath}Email`)}
                    invalid={Boolean(errors.userName)}
                    errorMessage={
                        errors.userName?.message &&
                        t(`${translationPath}${errors.userName?.message}`)
                    }
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t(
                                    `${translationPath}EmailPlaceholder`,
                                )}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t(`${translationPath}Password`)}
                    invalid={Boolean(errors.password)}
                    errorMessage={
                        errors.password?.message &&
                        t(`${translationPath}${errors.password?.message}`)
                    }
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder={t(
                                    `${translationPath}PasswordPlaceholder`,
                                )}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting
                        ? t(`${translationPath}SigningIn`)
                        : t(`${translationPath}SignIn`)}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
