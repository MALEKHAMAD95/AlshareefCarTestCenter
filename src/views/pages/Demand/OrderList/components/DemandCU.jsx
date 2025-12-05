import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormItem, Input, Button, Checkbox } from '@/components/ui'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import { CreateDemand, UpdateDemand } from '@/services/ModelSserver/DemandServices'

const DemandCU = forwardRef(
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
                description: '',
                isActive: false,
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
                description: data.description,
                isActive: data.isActive,
            }

            try {
                const response = isEditMode
                    ? await UpdateDemand({ ...payload, id: initialData?.id })
                    : await CreateDemand(payload)

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
                                    maxlength="6"
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
                                        `${translationPath}nameSafeDeposits`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}description`)}
                        invalid={!!errors.description}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: t(`${translationPath}nameRequired`),
                            }}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder={t(
                                        `${translationPath}desSafeDeposits`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}activeStatus`)}
                        invalid={!!errors.isActive}
                        errorMessage={errors.isActive?.message}
                    >
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                checked={field.value} 
                                onChange={(checked) => {
                                    field.onChange(checked) 
                                }}
                                disabled={false}
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

export default DemandCU
