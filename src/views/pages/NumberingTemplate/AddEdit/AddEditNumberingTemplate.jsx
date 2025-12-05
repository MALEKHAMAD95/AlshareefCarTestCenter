import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, FormItem, Input, Button, Select } from '@/components/ui'
import {
    GetNumberingTemplateById,
    CreateNumberingTemplate,
    UpdateNumberingTemplate,
} from '@/services/ModelSserver/NumberingTemplateServices'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import { GetAllWarehouse } from '@/services/ModelSserver/WarehouseServices'

const transactionTypeOptions = [
    { label: 'Sales Order', value: 1 },
    { label: 'Purchase Order', value: 2 },
    { label: 'Demand', value: 3 },
    { label: 'Warehouse Transfer', value: 4 },
    { label: 'Usage', value: 5 },
    { label: 'Input', value: 6 },
    { label: 'Whole Sales Dispatch', value: 7 },
    { label: 'Whole Sales Return Dispatch', value: 8 },
    { label: 'Retail Dispatch', value: 9 },
    { label: 'Retail Return Dispatch', value: 10 },
    { label: 'Whole Sale Invoice', value: 11 },
    { label: 'Whole Sale Return Invoice', value: 12 },
    { label: 'Retail Invoice', value: 13 },
    { label: 'Retail Return Invoice', value: 14 },
    { label: 'Purchase Receipt', value: 15 },
    { label: 'Purchase Return Receipt', value: 16 },
    { label: 'Purchase Invoice', value: 17 },
    { label: 'Purchase Return Invoice', value: 18 },
    { label: 'Check Collection', value: 19 },
    { label: 'Check Number', value: 20 },
    { label: 'Safe Deposit Transaction', value: 21 },
    { label: 'Cash Collection', value: 22 },
    { label: 'Visa Collection', value: 23 },
    { label: 'Bank Collection', value: 24 },
]

const AddEditNumberingTemplate = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id
    const [isLoading, setIsLoading] = useState(false)
    const [usedPlaceholders, setUsedPlaceholders] = useState(new Set())
    const hasFetchedRef = useRef(false)
    const hasFetchedWarehousesRef = useRef(false)
    const [warehouses, setWarehouses] = useState([])
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false)
    const translationPath = 'views.NumberingTemplate.'

    const countCharactersExcludingBraces = (value) => {
        if (!value) return 0

        let totalCount = 0
        let i = 0

        while (i < value.length) {
            if (value[i] === '{') {
                const closingBraceIndex = value.indexOf('}', i)
                if (closingBraceIndex === -1) {
                    totalCount += value.length - i
                    break
                }

                const placeholder = value.slice(i, closingBraceIndex + 1)

                if (placeholder.match(/\{s\d+\}/)) {
                    const numberMatch = placeholder.match(/\d+/)
                    if (numberMatch) {
                        totalCount += parseInt(numberMatch[0])
                    }
                } else if (placeholder === '{yyyy}') {
                    totalCount += 4
                } else if (placeholder === '{yy}') {
                    totalCount += 2
                } else if (placeholder === '{mmm}') {
                    totalCount += 3
                } else if (placeholder === '{mm}') {
                    totalCount += 2
                } else if (placeholder === '{dd}') {
                    totalCount += 2
                } else {
                    totalCount += placeholder.length - 2
                }

                i = closingBraceIndex + 1
            } else {
                totalCount += 1
                i += 1
            }
        }

        return totalCount
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            trcode: null, // Default to SalesOrder
            value: '',
            startDate: '',
            endDate: '',
            firmNumber: 0,
            userId: null,
            warehouseNumber: null,
            department: null,
            division: null,
            userGroup: null,
            userRole: null,
            priority: 0,
        },
        mode: 'onChange',
    })

    const templateValue = watch('value')

    const fetchWarehouses = async () => {
        setIsLoadingWarehouses(true)
        try {
            const result = await GetAllWarehouse()
            if (result?.data) {
                const options = result.data.map((warehouse) => ({
                    label: warehouse.name,
                    value: warehouse.id,
                }))
                setWarehouses([...options])
            }
        } catch (error) {
            console.error('Fetch warehouses error:', error)
            triggerMessageError(t(`${translationPath}fetchWarehousesError`))
        } finally {
            setIsLoadingWarehouses(false)
        }
    }

    const fetchTemplate = async (id) => {
        try {
            setIsLoading(true)
            const response = await GetNumberingTemplateById(id)
            const templateData = response?.data
            if (templateData && Object.keys(templateData).length > 0) {
                const formatDateTimeLocal = (dateStr) => {
                    if (!dateStr) return ''
                    return dateStr.replace(/:00$/, '')
                }

                reset({
                    trcode: templateData.trcode || 1,
                    value: templateData.value || '',
                    startDate: formatDateTimeLocal(templateData.startDate) || '',
                    endDate: formatDateTimeLocal(templateData.endDate) || '',
                    firmNumber: templateData.firmNumber || 0,
                    userId: templateData.userId || null,
                    warehouseNumber: templateData.warehouseNumber || null,
                    department: templateData.department || null,
                    division: templateData.division || null,
                    userGroup: templateData.userGroup || null,
                    userRole: templateData.userRole || null,
                    priority: templateData.priority || 0,
                })
                const placeholders = templateData.value?.match(/\{[a-z0-9]+\}/g) || []
                setUsedPlaceholders(new Set(placeholders))
            } else {
                console.warn('Empty or invalid template data:', templateData)
                triggerMessageError(t(`${translationPath}fetchFailed`))
                reset({})
            }
        } catch (error) {
            console.error('Fetch template error:', error)
            triggerMessageError(t(`${translationPath}fetchError`))
            reset({})
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id && !hasFetchedRef.current) {
            if (!isNaN(parseInt(id))) {
                fetchTemplate(id)
                hasFetchedRef.current = true
            } else {
                console.warn('Invalid ID:', id)
                triggerMessageError(t(`${translationPath}invalidId`))
                navigate('/NumberingTemplate')
            }
        }
    }, [id, navigate, reset, t])

    useEffect(() => {
        if (!hasFetchedWarehousesRef.current) {
            fetchWarehouses()
            hasFetchedWarehousesRef.current = true
        }
    }, [])

    useEffect(() => {
        if (!templateValue) {
            setUsedPlaceholders(new Set())
        }
    }, [templateValue])

    const addToTemplateValue = (placeholder) => {
        const currentValue = templateValue || ''
        const currentLength = countCharactersExcludingBraces(currentValue)
        const placeholderLength = countCharactersExcludingBraces(placeholder)

        if (currentLength + placeholderLength > 17) {
            triggerMessageError(t(`${translationPath}maxLengthError`, { count: currentLength + placeholderLength }))
            return
        }

        const newValue = currentValue + placeholder
        setValue('value', newValue, { shouldValidate: true })
        setUsedPlaceholders((prev) => new Set(prev).add(placeholder))
    }

    const getCleanedPrefix = (tempPattern) => {
        if (!tempPattern || tempPattern.trim() === '') return ''

        let pattern = tempPattern
        const now = new Date()

        pattern = pattern.replace(/\{yyyy\}/g, now.getFullYear().toString())
        pattern = pattern.replace(/\{yy\}/g, now.getFullYear().toString().slice(2))
        pattern = pattern.replace(/\{mm\}/g, String(now.getMonth() + 1).padStart(2, '0'))
        pattern = pattern.replace(/\{mmm\}/g, now.toLocaleString('en-US', { month: 'short' }))
        pattern = pattern.replace(/\{dd\}/g, String(now.getDate()).padStart(2, '0'))
        pattern = pattern.replace(/\{s(\d+)\}/g, (match, num) => '0'.repeat(parseInt(num)))

        return pattern
    }

    const onSubmit = async (data) => {
        const payload = {
            trcode: parseInt(data.trcode) || 1,
            value: data.value,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            firmNumber: parseInt(data.firmNumber) || 0,
            userId: parseInt(data.userId) || null,
            warehouseNumber: data.warehouseNumber ? parseInt(data.warehouseNumber) : null,
            department: parseInt(data.department) || null,
            division: parseInt(data.division) || null,
            userGroup: parseInt(data.userGroup) || null,
            userRole: data.userRole || null,
            priority: parseInt(data.priority) || 0,
            ...(isEditMode && { id: parseInt(id) }),
        }

        try {
            setIsLoading(true)
            const response = isEditMode
                ? await UpdateNumberingTemplate(payload)
                : await CreateNumberingTemplate(payload)

            if (response?.success || response?.data?.success) {
                triggerMessageSuccessfully(
                    t(
                        isEditMode
                            ? `${translationPath}updateSuccess`
                            : `${translationPath}createSuccess`,
                    ),
                )
                navigate('/NumberingTemplate')
            } else {
                console.error('API Error:', response)
                triggerMessageError(t(`${translationPath}saveFailed`))
            }
        } catch (error) {
            console.error('Request failed:', error)
            triggerMessageError(t(`${translationPath}requestError`))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/NumberingTemplate')
    }

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t(
                        isEditMode
                            ? `${translationPath}editNumberingTemplate`
                            : `${translationPath}addNumberingTemplate`,
                    )}
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{s6}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Adding Zeros [s6]
                    </Button>
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{yyyy}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Current Year [yyyy]
                    </Button>
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{yy}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Current Year [yy]
                    </Button>
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{mmm}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Current Month Name
                    </Button>
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{mm}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Current Month
                    </Button>
                    <Button
                        type="button"
                        onClick={() => addToTemplateValue('{dd}')}
                        disabled={isLoading}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Current Day
                    </Button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem
                            label={t(`${translationPath}trcode`)}
                            invalid={!!errors.trcode}
                            errorMessage={errors.trcode?.message}
                        >
                            <Controller
                                name="trcode"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}trcodeRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Select
                                        options={transactionTypeOptions}
                                        value={transactionTypeOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) => field.onChange(option ? option.value : null)}
                                        placeholder={t(
                                            `${translationPath}trcodePlaceholder`,
                                        )}
                                        isDisabled={isLoading}
                                        className="text-sm"
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}value`)}
                            invalid={!!errors.value}
                            errorMessage={errors.value?.message}
                        >
                            <div className="flex flex-col gap-2">
                                <Controller
                                    name="value"
                                    control={control}
                                    rules={{
                                        required: t(`${translationPath}valueRequired`),
                                        validate: (value) => {
                                            const charCount = countCharactersExcludingBraces(value)
                                            if (charCount > 17) {
                                                return t(`${translationPath}maxLengthError`, { count: charCount })
                                            }
                                            return true
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder={t(`${translationPath}valuePlaceholder`)}
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                                <p className="text-sm text-gray-500">
                                    Preview: {getCleanedPrefix(templateValue)} (Characters: {countCharactersExcludingBraces(templateValue)}/17)
                                </p>
                            </div>
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}startDate`)}
                            invalid={!!errors.startDate}
                            errorMessage={errors.startDate?.message}
                        >
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}startDateRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        placeholder={t(
                                            `${translationPath}startDatePlaceholder`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}endDate`)}
                            invalid={!!errors.endDate}
                            errorMessage={errors.endDate?.message}
                        >
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}endDateRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        placeholder={t(
                                            `${translationPath}endDatePlaceholder`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}firmNumber`)}
                            invalid={!!errors.firmNumber}
                            errorMessage={errors.firmNumber?.message}
                        >
                            <Controller
                                name="firmNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}firmNumberPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : 0,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}userId`)}
                            invalid={!!errors.userId}
                            errorMessage={errors.userId?.message}
                        >
                            <Controller
                                name="userId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}userIdPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : null,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}warehouseNumber`)}
                            invalid={!!errors.warehouseNumber}
                            errorMessage={errors.warehouseNumber?.message}
                        >
                            <Controller
                                name="warehouseNumber"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={warehouses}
                                        value={warehouses.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) => field.onChange(option ? option.value : null)}
                                        isLoading={isLoadingWarehouses}
                                        placeholder={t(`${translationPath}selectWarehouse`)}
                                        isDisabled={isLoading}
                                        className="text-sm"
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}department`)}
                            invalid={!!errors.department}
                            errorMessage={errors.department?.message}
                        >
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}departmentPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : null,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}division`)}
                            invalid={!!errors.division}
                            errorMessage={errors.division?.message}
                        >
                            <Controller
                                name="division"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}divisionPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : null,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}userGroup`)}
                            invalid={!!errors.userGroup}
                            errorMessage={errors.userGroup?.message}
                        >
                            <Controller
                                name="userGroup"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}userGroupPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : null,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}userRole`)}
                            invalid={!!errors.userRole}
                            errorMessage={errors.userRole?.message}
                        >
                            <Controller
                                name="userRole"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder={t(
                                            `${translationPath}userRolePlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? (e.target.value)
                                                    : null,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}priority`)}
                            invalid={!!errors.priority}
                            errorMessage={errors.priority?.message}
                        >
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={t(
                                            `${translationPath}priorityPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value
                                                    ? parseInt(e.target.value)
                                                    : 0,
                                            )
                                        }
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {t(`${translationPath}cancel`)}
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? t(`${translationPath}loading`)
                                : t(
                                      isEditMode
                                          ? `${translationPath}update`
                                          : `${translationPath}create`,
                                  )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default AddEditNumberingTemplate