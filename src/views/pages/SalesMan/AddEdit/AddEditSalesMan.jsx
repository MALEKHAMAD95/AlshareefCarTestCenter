import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, FormItem, Input, Button, Checkbox } from '@/components/ui'
import {
    GetSalesmanById,
    CreateSalesman,
    UpdateSalesman,
} from '@/services/ModelSserver/SalesmanServices'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import PositionModal from './PositionModal'

const AddEditSalesMan = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id
    const [showPositionModal, setShowPositionModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const hasFetchedRef = useRef(false)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            code: '',
            name: '',
            position: '',
            active: false,
            userId: 0,
            firmNo: 0,
        },
    })

    const fetchSalesman = async (id) => {
        try {
            setIsLoading(true)
            const response = await GetSalesmanById(id)
            const salesmanData = response
            if (salesmanData && Object.keys(salesmanData).length > 0) {
                reset({
                    code: salesmanData?.data?.code || '',
                    name: salesmanData?.data?.name || '',
                    position: salesmanData?.data?.position || '',
                    active: salesmanData?.data?.active === 1,
                    userId: salesmanData?.data?.userId || 0,
                    firmNo: salesmanData?.data?.firmNo || 0,
                })
            } else {
                console.warn('Empty or invalid salesman data:', salesmanData)
                triggerMessageError(t('salesman.fetchFailed'))
                reset({})
            }
        } catch (error) {
            console.error('Fetch salesman error:', error)
            triggerMessageError(t('salesman.fetchError'))
            reset({})
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (id && !hasFetchedRef.current) {
            if (!isNaN(parseInt(id))) {
                fetchSalesman(id)
                hasFetchedRef.current = true
            } else {
                console.warn('Invalid ID:', id)
                triggerMessageError(t('salesman.invalidId'))
                navigate('/SalesMan')
            }
        }
    }, [id])

    const onSubmit = async (data) => {
        const payload = {
            code: data.code,
            name: data.name,
            position: data.position,
            active: data.active ? 1 : 0,
            userId: data.userId,
            firmNo: data.firmNo,
            ...(isEditMode && { id: parseInt(id) }),
        }

        try {
            setIsLoading(true)
            const response = isEditMode
                ? await UpdateSalesman(payload)
                : await CreateSalesman(payload)

            if (response?.success || response?.data?.success) {
                triggerMessageSuccessfully(
                    isEditMode
                        ? t(`${translationPath}updateSuccess`)
                        : t(`${translationPath}createSuccess`),
                )
                navigate('/SalesMan')
            } else {
                console.error('API Error:', response)

                triggerMessageError(t(`${translationPath}saveFailed`))
            }
        } catch (error) {
            console.error('Request failed:', error)
            triggerMessageError(t('salesman.requestError'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/SalesMan')
    }

    const handlePositionSelect = (position) => {
        setValue('position', position.description)
        setShowPositionModal(false)
    }

    const translationPath = 'views.Lookup.'

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t(
                        isEditMode
                            ? `${translationPath}editSalesMan`
                            : `${translationPath}addSalesMan`,
                    )}
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormItem
                            label={t(`${translationPath}code`)}
                            invalid={!!errors.code}
                            errorMessage={errors.code?.message}
                        >
                            <Controller
                                name="code"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}codeRequired`,
                                    ),
                                    maxLength: {
                                        value: 6,
                                        message: t(
                                            `${translationPath}codeMaxLength`,
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        maxLength="6"
                                        placeholder={t(
                                            `${translationPath}codePlaceholder`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
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
                                    required: t(
                                        `${translationPath}nameRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            `${translationPath}nameSalesMan`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label={t(`${translationPath}position`)}
                            invalid={!!errors.position}
                            errorMessage={errors.position?.message}
                        >
                            <Controller
                                name="position"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}positionRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            `${translationPath}positionSalesMan`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* 
                        <FormItem
                            label={t(`${translationPath}position`)}
                            invalid={!!errors.position}
                            errorMessage={errors.position?.message}
                        >
                            <Controller
                                name="position"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}positionRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}positionSalesMan`)}
                                        {...field}
                                        readOnly
                                        onClick={() => setShowPositionModal(true)}
                                        className="cursor-pointer"
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem> */}
                        <FormItem
                            label={t(`${translationPath}firmNo`)}
                            invalid={!!errors.firmNo}
                            errorMessage={errors.firmNo?.message}
                        >
                            <Controller
                                name="firmNo"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}firmNoRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                          type="number" min="0"
                                        placeholder={t(
                                            `${translationPath}firmNoPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
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
                                rules={{
                                    required: t(
                                        `${translationPath}userIdRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                     type="number" min="0"
                                        placeholder={t(
                                            `${translationPath}userIdPlaceholder`,
                                        )}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        disabled={isLoading}
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
                                        onChange={(value) =>
                                            field.onChange(value)
                                        }
                                        disabled={isLoading}
                                    >
                                        {t(`${translationPath}isActive`)}
                                    </Checkbox>
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
            <PositionModal
                show={showPositionModal}
                handleClose={() => setShowPositionModal(false)}
                handleSelect={handlePositionSelect}
            />
        </div>
    )
}

export default AddEditSalesMan
