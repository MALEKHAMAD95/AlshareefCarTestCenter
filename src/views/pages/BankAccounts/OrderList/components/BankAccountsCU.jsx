import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormItem, Input, Checkbox, Select } from '@/components/ui'
import { CreateBankAccount, UpdateBankAccount } from '@/services/ModelSserver/BankAccountServices'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'

const bankTypeOptions = [
    { value: 0, label: 'Main Bank' },
    { value: 1, label: 'Branch Bank' },
    { value: 2, label: 'Savings' },
]

const currencyOptions = [
    { value: 0, label: '$' },
    { value: 1, label: 'JD' },
    { value: 2, label: 'EUR' },
    { value: 3, label: 'TRY' },
    { value: 4, label: 'ILS' },
]

const BankAccountsCU = forwardRef(
    (
        {
            onSubmitSuccess,
            onCancel,
            initialData = null,
            isEditMode,
            translationPath,
            bankId,
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
                accountNo: '',
                iban: '',
                active: false,
                bankType: bankTypeOptions[0].value,
                currency: currencyOptions[0].value,
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
                accountNo: data.accountNo,
                iban: data.iban,
                active: data.active ? 1 : 0,
                bankType: data.bankType,
                currency: data.currency,
                bankId: parseInt(bankId),
                ...(isEditMode ? { id: initialData?.id } : {}),
            }
            try {
                const response = isEditMode
                    ? await UpdateBankAccount(payload)
                    : await CreateBankAccount(payload)

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
                    <div className="grid grid-cols-2 gap-4">
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
                                    maxLength: {
                                        value: 6,
                                        message: t(`${translationPath}codeMaxLength`),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        maxLength="6"
                                        placeholder={t(`${translationPath}codePlaceholder`)}
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
                                rules={{
                                    required: t(`${translationPath}nameRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}namePlaceholder`)}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}accountNo`)}
                            invalid={!!errors.accountNo}
                            errorMessage={errors.accountNo?.message}
                        >
                            <Controller
                                name="accountNo"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}accountNoRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}accountNoPlaceholder`)}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}iban`)}
                            invalid={!!errors.iban}
                            errorMessage={errors.iban?.message}
                        >
                            <Controller
                                name="iban"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}ibanRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}ibanPlaceholder`)}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}bankType`)}
                            invalid={!!errors.bankType}
                            errorMessage={errors.bankType?.message}
                        >
                            <Controller
                                name="bankType"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}bankTypeRequired`),
                                }}
                                render={({ field }) => (
                                    <Select
                                        options={bankTypeOptions.map(opt => ({
                                            ...opt,
                                            label: t(`${translationPath}${opt.label.toLowerCase().replace(' ', '')}`),
                                        }))}
                                        value={bankTypeOptions.find(option => option.value === field.value)}
                                        onChange={(option) => field.onChange(option.value)}
                                        placeholder={t(`${translationPath}bankTypePlaceholder`)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}currency`)}
                            invalid={!!errors.currency}
                            errorMessage={errors.currency?.message}
                        >
                            <Controller
                                name="currency"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}currencyRequired`),
                                }}
                                render={({ field }) => (
                                    <Select
                                        options={currencyOptions}
                                        value={currencyOptions.find(option => option.value === field.value)}
                                        onChange={(option) => field.onChange(option.value)}
                                        placeholder={t(`${translationPath}currencyPlaceholder`)}
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
                    </div>
                </Card>
            </form>
        )
    },
)

export default BankAccountsCU