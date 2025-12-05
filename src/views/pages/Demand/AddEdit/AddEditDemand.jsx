import { useTranslation } from 'react-i18next'
import {
    CreateDemand,
    GetDemandById,
    UpdateDemand,
} from '@/services/ModelSserver/DemandServices'
import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, FormItem, Input, Button, Select } from '@/components/ui'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import DemandLinesModal from './DemandLinesModal'
import ItemNameModal from './ItemNameModal'
import UnitModal from './UnitModal'
import { PiTrash } from 'react-icons/pi'
import { GetAllWarehouse } from '@/services/ModelSserver/WarehouseServices'

const AddEditDemand = () => {
    const translationPath = 'views.Demand.'
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id
    const [isLoading, setIsLoading] = useState(false)
    const [showDemandLinesModal, setShowDemandLinesModal] = useState({
        show: false,
        index: null,
    })
    const [showItemNameModal, setShowItemNameModal] = useState({
        show: false,
        index: null,
    })
    const [showUnitModal, setShowUnitModal] = useState({
        show: false,
        index: null,
    })

    const hasFetchedDemandRef = useRef(false)
    const hasFetchedWarehousesRef = useRef(false)

    const statuses = [
        { value: 1, label: t(`${translationPath}active`) },
        { value: 0, label: t(`${translationPath}inactive`) },
    ]

    const getCurrentTime = () => {
        const now = new Date()
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            slipNumber: '',
            date: new Date().toISOString().split('T')[0],
            time: getCurrentTime(),
            documentNumber: '',
            status: 1,
            warehouse: 0,
            demandDetails: [
                {
                    lineNumber: 1,
                    demandLine: '',
                    itemName: '',
                    unit: '',
                    qty: 0,
                    warehouse: 0,
                    notes: '',
                    deliveredQty: 0,
                    canceledQty: 0,
                    itemId: 0,
                    subUnitId: 0,
                    mainUnitId: 0,
                },
            ],
        },
        mode: 'onChange',
    })

    const fetchDemand = async (id) => {
        try {
            setIsLoading(true)
            const response = await GetDemandById(id)
            if (response?.success || response?.data?.success) {
                const demandData = response.data
                reset({
                    slipNumber: demandData.slipNumber || '',
                    date: demandData.date
                        ? new Date(demandData.date).toISOString().split('T')[0]
                        : '',
                    time: demandData.time || getCurrentTime(),
                    documentNumber: demandData.documentNumber || '',
                    status: demandData.status ?? 1,
                    warehouse: demandData.warehouse ?? 0,
                    demandDetails: demandData.demandDetails?.length
                        ? demandData.demandDetails.map((detail, index) => ({
                              lineNumber: index + 1,
                              demandLine: detail.lineType
                                  ? `DL00${detail.lineType}`
                                  : '',
                              itemName: detail.itemId
                                  ? `ITEM00${detail.itemId}`
                                  : '',
                              unit: detail.subUnitId
                                  ? `UNIT00${detail.subUnitId}`
                                  : '',
                              qty: detail.qty || 0,
                              warehouse: detail.warehouse || 0,
                              notes: detail.notes || '',
                              deliveredQty: detail.deliveredQty || 0,
                              canceledQty: detail.canceledQty || 0,
                              itemId: detail.itemId || 0,
                              subUnitId: detail.subUnitId || 0,
                              mainUnitId: detail.mainUnitId || 0,
                          }))
                        : [
                              {
                                  lineNumber: 1,
                                  demandLine: '',
                                  itemName: '',
                                  unit: '',
                                  qty: 0,
                                  warehouse: 0,
                                  notes: '',
                                  deliveredQty: 0,
                                  canceledQty: 0,
                                  itemId: 0,
                                  subUnitId: 0,
                                  mainUnitId: 0,
                              },
                          ],
                })
            } else {
                triggerMessageError(response?.statusText)
                reset({})
            }
        } catch (error) {
            console.error('Fetch demand error:', error)
            triggerMessageError(t('demand.fetchError'))
            reset({})
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id && !hasFetchedDemandRef.current) {
            if (!isNaN(parseInt(id))) {
                fetchDemand(id)
                hasFetchedDemandRef.current = true
            } else {
                triggerMessageError(t('demand.invalidId'))
                navigate('/Demand')
            }
        }
    }, [id, navigate, t])

    const [warehouses, setWarehouses] = useState([])
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true)

    useEffect(() => {
        const fetchWarehouses = async () => {
            setIsLoadingWarehouses(true)
            const result = await GetAllWarehouse()
            if (result && result.data) {
                const options = result.data.map((warehouse) => ({
                    label: warehouse.name,
                    value: warehouse.id,
                }))
                setWarehouses([{ value: 0, label: 'Select...' }, ...options])
            }
            setIsLoadingWarehouses(false)
        }

        if (!hasFetchedWarehousesRef.current) {
            fetchWarehouses()
            hasFetchedWarehousesRef.current = true
        }
    }, [])

    const addDemandLine = () => {
        const currentDetails = watch('demandDetails') || []
        setValue('demandDetails', [
            ...currentDetails,
            {
                lineNumber: currentDetails.length + 1,
                demandLine: '',
                itemName: '',
                unit: '',
                qty: 0,
                warehouse: 0,
                notes: '',
                deliveredQty: 0,
                canceledQty: 0,
                itemId: 0,
                subUnitId: 0,
                mainUnitId: 0,
            },
        ])
    }

    const removeDemandLine = (index) => {
        const currentDetails = watch('demandDetails') || []
        if (currentDetails.length > 1) {
            const updatedDetails = currentDetails
                .filter((_, i) => i !== index)
                .map((detail, i) => ({ ...detail, lineNumber: i + 1 }))
            setValue('demandDetails', updatedDetails)
        }
    }

    const handleDemandLineSelect = (demandLine, index) => {
        setValue(`demandDetails[${index}].demandLine`, demandLine.description)
        setValue(`demandDetails[${index}].lineType`, demandLine.id)
        setShowDemandLinesModal({ show: false, index: null })
    }

    const handleItemSelect = (item, index) => {
        setValue(`demandDetails[${index}].itemName`, item.description)
        setValue(`demandDetails[${index}].itemId`, item.id)
        setShowItemNameModal({ show: false, index: null })
    }

    const handleUnitSelect = (unit, index) => {
        setValue(`demandDetails[${index}].unit`, unit.description)
        setValue(`demandDetails[${index}].subUnitId`, unit.id)
        setValue(`demandDetails[${index}].mainUnitId`, unit.id)
        setShowUnitModal({ show: false, index: null })
    }

    const onSubmit = async (data) => {
        const currentDateTime = new Date()
        const formatTime = (date) =>
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`

        const payload = {
            slipNumber: data.slipNumber,
            date: data.date || currentDateTime.toISOString(),
            time: data.time || formatTime(currentDateTime),
            documentNumber: data.documentNumber || '',
            status: Number(data.status) || 0,
            warehouse: Number(data.warehouse) || 0,
            demandDetails: data.demandDetails.map((detail) => ({
                demandId: isEditMode ? parseInt(id) : 0,
                itemId: detail.itemId || 0,
                clientId: 0,
                qty: Number(detail.qty) || 0,
                deliveredQty: Number(detail.deliveredQty) || 0,
                canceledQty: Number(detail.canceledQty) || 0,
                subUnitId: detail.subUnitId || 0,
                mainUnitId: detail.mainUnitId || 0,
                factor1: 0,
                factor2: 0,
                warehouse: Number(detail.warehouse) || 0,
                notes: detail.notes || '',
                status: 0,
                lineType: detail.lineType || 0,
                lineNumber: detail.lineNumber,
                userName: 'user',
                date: currentDateTime.toISOString(),
                price: 0,
            })),
        }

        try {
            setIsLoading(true)
            const response = isEditMode
                ? await UpdateDemand({ ...payload, id: parseInt(id) })
                : await CreateDemand(payload)

            if (response?.success || response?.data?.success) {
                triggerMessageSuccessfully(
                    t(
                        isEditMode
                            ? t(`${translationPath}updateSuccess`)
                            : t(`${translationPath}createSuccess`),
                    ),
                )
                navigate('/Demand')
            } else {
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
        navigate('/Demand')
    }

    return (
        <div className="p-4 sm:p-6">
            <Card>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    {t(
                        isEditMode
                            ? `${translationPath}editDemand`
                            : `${translationPath}createDemand`,
                    )}
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                        <FormItem
                            label={t(`${translationPath}slipNumber`)}
                            error={errors.slipNumber?.message}
                        >
                            <Controller
                                name="slipNumber"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}slipNumberRequired`,
                                    ),
                                    pattern: {
                                        value: /^[A-Za-z0-9-]+$/,
                                        message: t(
                                            `${translationPath}slipNumberInvalid`,
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            `${translationPath}slipNumberPlaceholder`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}date`)}
                            error={errors.date?.message}
                        >
                            <Controller
                                name="date"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}dateRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        disabled={isLoading}
                                        
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}time`)}
                            error={errors.time?.message}
                        >
                            <Controller
                                name="time"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}timeRequired`,
                                    ),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="time"
                                        {...field}
                                        disabled={isLoading}
                                        
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label={t(`${translationPath}documentNumber`)}>
                            <Controller
                                name="documentNumber"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^[A-Za-z0-9-]*$/,
                                        message: t(
                                            `${translationPath}documentNumberInvalid`,
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            `${translationPath}documentNumberPlaceholder`,
                                        )}
                                        {...field}
                                        disabled={isLoading}
                                        
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label={t(`${translationPath}status`)}>
                            <Controller
                                name="status"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}statusRequired`,
                                    ),
                                    min: {
                                        value: 0,
                                        message: t(
                                            `${translationPath}statusInvalid`,
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <Select
                                        options={statuses}
                                        value={statuses.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option.value)
                                        }
                                        disabled={isLoading}
                                        
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}warehouse`)}
                            error={errors.warehouse?.message}
                        >
                            <Controller
                                name="warehouse"
                                control={control}
                                rules={{
                                    required: t(
                                        `${translationPath}warehouseRequired`,
                                    ),
                                    min: {
                                        value: 1,
                                        message: t(
                                            `${translationPath}warehouseInvalid`,
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <Select
                                        options={warehouses}
                                        value={warehouses.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option.value)
                                        }
                                        disabled={isLoadingWarehouses}
                                        
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="mt-4 ">
                        <div className="grid grid-cols-[30px_80px_100px_60px_60px_80px_100px_60px_60px_50px] sm:grid-cols-10 gap-1 font-semibold text-sm sm:text-xs border-b pb-1 min-w-[700px]">
                            <div className="px-1">
                                {t(`${translationPath}line`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}demandLines`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}itemName`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}unit`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}quantity`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}warehouse`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}notes`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}deliveredQty`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}canceledQty`)}
                            </div>
                            <div className="px-1">
                                {t(`${translationPath}actions`)}
                            </div>
                        </div>

                        {watch('demandDetails')?.map((detail, index) => (
                            <div
                                key={index}
                                className="mt-2 pb-6 grid grid-cols-[30px_80px_100px_60px_60px_80px_100px_60px_60px_50px] sm:grid-cols-10 gap-1 items-center border-b py-1 text-sm sm:text-xs min-w-[700px]"
                            >
                                <div className="px-1">{detail.lineNumber}</div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].demandLine`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                onClick={() =>
                                                    setShowDemandLinesModal({
                                                        show: true,
                                                        index,
                                                    })
                                                }
                                                className="cursor-pointer "
                                                disabled={isLoading}
                                                placeholder={t(
                                                    `${translationPath}demandLinePlaceholder`,
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].itemName`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                onClick={() =>
                                                    setShowItemNameModal({
                                                        show: true,
                                                        index,
                                                    })
                                                }
                                                className="cursor-pointer "
                                                disabled={isLoading}
                                                placeholder={t(
                                                    `${translationPath}itemNamePlaceholder`,
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].unit`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                onClick={() =>
                                                    setShowUnitModal({
                                                        show: true,
                                                        index,
                                                    })
                                                }
                                                className="cursor-pointer "
                                                disabled={isLoading}
                                                placeholder={t(
                                                    `${translationPath}unitPlaceholder`,
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].qty`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                disabled={isLoading}
                                                className=""
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].warehouse`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={warehouses}
                                                 classNames=""
                                                value={warehouses.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                )}
                                                onChange={(option) =>
                                                    field.onChange(option.value)
                                                }
                                                disabled={
                                                    isLoading ||
                                                    isLoadingWarehouses
                                                }
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].notes`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                {...field}
                                                disabled={isLoading}
                                                placeholder={t(
                                                    `${translationPath}notesPlaceholder`,
                                                )}
                                                className=""
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].deliveredQty`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                disabled={isLoading}
                                                className=""
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Controller
                                        name={`demandDetails[${index}].canceledQty`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                disabled={isLoading}
                                                className=""
                                            />
                                        )}
                                    />
                                </div>
                                <div className="px-1">
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="red-600"
                                        onClick={() => removeDemandLine(index)}
                                        disabled={isLoading}
                                        className=" bg-red-600 h-10 sm:h-8"
                                    >
                                        <PiTrash className="text-base" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="solid"
                        size="sm"
                        className="mt-4 h-10 sm:h-8"
                        onClick={addDemandLine}
                        disabled={isLoading}
                    >
                        {t(`${translationPath}addLine`)}
                    </Button>

                    <div className="flex justify-between w-36 max-w-44 gap-4 mt-4">
                        <Button
                            type="submit"
                            variant="solid"
                            color="green-500"
                            disabled={isLoading || !isValid}
                        >
                            {isLoading
                                ? t(`${translationPath}loading`)
                                : t(
                                      isEditMode
                                          ? `${translationPath}update`
                                          : `${translationPath}create`,
                                  )}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {t(`${translationPath}back`)}
                        </Button>
                    </div>
                </form>
            </Card>

            <DemandLinesModal
                show={showDemandLinesModal.show}
                handleClose={() =>
                    setShowDemandLinesModal({ show: false, index: null })
                }
                handleSelect={(demandLine) =>
                    handleDemandLineSelect(
                        demandLine,
                        showDemandLinesModal.index,
                    )
                }
            />
            <ItemNameModal
                show={showItemNameModal.show}
                handleClose={() =>
                    setShowItemNameModal({ show: false, index: null })
                }
                handleSelect={(item) =>
                    handleItemSelect(item, showItemNameModal.index)
                }
            />
            <UnitModal
                show={showUnitModal.show}
                handleClose={() =>
                    setShowUnitModal({ show: false, index: null })
                }
                handleSelect={(unit) =>
                    handleUnitSelect(unit, showUnitModal.index)
                }
            />
        </div>
    )
}

export default AddEditDemand
