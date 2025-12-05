import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormItem, Input, Checkbox } from '@/components/ui'
import { CreatePaymentPlan, UpdatePaymentPlan } from '@/services/ModelSserver/PaymentPlanServices'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'

const PaymentPlanCU = forwardRef(
    (
        {
            onSubmitSuccess,
            onCancel,
            initialData = null,
            isEditMode,
            translationPath,
        },
        ref,
    ) => {
        const { t } = useTranslation()
        const {
            control,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm({
            defaultValues: {
                code: '',
                name: '',
                active: false,
                ...(initialData ? { ...initialData, active: !!initialData.active } : {}),
            },
        })

        useEffect(() => {
            if (isEditMode && initialData) {
                reset({ ...initialData, active: !!initialData.active })
            }
        }, [initialData, reset, isEditMode])

        const onSubmit = async (data) => {
            const payload = {
                code: data.code,
                name: data.name,
                active: data.active ? 1 : 0, // Convert boolean to integer
            }
            try {
                const response = isEditMode
                    ? await UpdatePaymentPlan({ ...payload, id: initialData?.id })
                    : await CreatePaymentPlan(payload)

              if (response?.success || response?.data?.success ) {
                    triggerMessageSuccessfully(
                        t(
                            isEditMode
                                ? `${translationPath}updateSuccess`
                                : `${translationPath}createSuccess`,
                        ),
                    )
                    onSubmitSuccess({
                        id: isEditMode ? initialData?.id : response?.data?.data?.id,
                        payload,
                    })
                } else {
                    console.error('API Error:', response)
                    triggerMessageError(t(`${translationPath}saveFailed`))
                }
            } catch (error) {
                console.error('Request failed:', error)
                triggerMessageError(t(`${translationPath}requestError`))
            }
        }

        useImperativeHandle(ref, () => ({
            submitForm: () => handleSubmit(onSubmit)(),
        }))

        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Card>
                    <FormItem
                        label={t(`${translationPath}code`)}
                        invalid={!!errors.code}
                        errorMessage={errors.code?.message}
                    >
                        <Controller
                            name="code"
                            control={control}
                            rules={{
                                required: t(`${translationPath}codeRequired`),
                            }}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    maxLength="50"
                                    placeholder={t(
                                        `${translationPath}codePlaceholder`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}name`)}
                        invalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder={t(
                                        `${translationPath}namePlaceholder`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}activeStatus`)}
                        invalid={!!errors.active}
                        errorMessage={errors.active?.message}
                    >
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(checked) => field.onChange(checked)}
                                    className="cursor-pointer"
                                >
                                    {t(`${translationPath}isActive`)}
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                </Card>
            </form>
        )
    },
)

export default PaymentPlanCU