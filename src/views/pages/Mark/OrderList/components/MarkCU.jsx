import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormItem, Input, Button, Checkbox } from '@/components/ui'
import { CreateMark, UpdateMark } from '@/services/ModelSserver/MarkServices'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'

const MarkCU = forwardRef(
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
            watch,
        } = useForm({
            defaultValues: {
                code: '',
                name: '',
                ...(initialData || {}),
            },
        })

        useEffect(() => {
            if (isEditMode && initialData) {
                reset(initialData)
            }
        }, [initialData, reset, isEditMode])

        const onSubmit = async (data) => {
            const payload = {
                code: data.code,
                name: data.name,
            }
            try {
                const response = isEditMode
                    ? await UpdateMark({ ...payload, id: initialData?.id })
                    : await CreateMark(payload)

              if (response?.success || response?.data?.success ) {
                    triggerMessageSuccessfully(
                        t(
                            isEditMode
                                ? `${translationPath}updateSuccess`
                                : `${translationPath}createSuccess`,
                        ),
                    )
                    onSubmitSuccess({
                        id: isEditMode ? initialData?.id : response?.data?.data,
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
                                    disabled={isEditMode}
                                    maxLength="6"
                                    placeholder={t(
                                        `${translationPath}codePlaceholder`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}thename`)}
                        invalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: t(`${translationPath}nameRequired`),
                            }}
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
                </Card>
            </form>
        )
    },
)

export default MarkCU