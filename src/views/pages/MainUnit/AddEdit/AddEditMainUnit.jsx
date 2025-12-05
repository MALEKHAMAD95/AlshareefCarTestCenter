import './main.css'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, FormItem, Input, Button, Checkbox } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import {
    CreateMainUnit,
    GetMainUnitById,
    UpdateMainUnit,
} from '@/services/ModelSserver/MainUnitServices'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useNavigate, useParams } from 'react-router-dom'

const MainUnitCU = forwardRef(({ initialData = null, onSubmitSuccess, onCancel }, ref) => {
    const { t } = useTranslation()
    const translationPath = 'views.MainUnit.'
    const [isLoading, setIsLoading] = useState(false)
    const [subUnits, setSubUnits] = useState([])
    const [subUnitErrors, setSubUnitErrors] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = id

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            code: '',
            name: '',
            cardType: 0,
        },
        mode: 'onChange', // Enable real-time validation
    })

    useEffect(() => {
        const fetchData = async (unitId) => {
            try {
                setIsLoading(true)
                const response = await GetMainUnitById(unitId)
                if (response && response.data) {
                    reset({
                        code: response.data.code || '',
                        name: response.data.name || '',
                        cardType: response.data.cardType || 0,
                    })
                    setSubUnits(response.data.subUnits || [])
                } else {
                    triggerMessageError(t(`${translationPath}fetchError`))
                }
            } catch (error) {
                console.error('Fetch error:', error)
                triggerMessageError(t(`${translationPath}fetchError`))
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchData(id)
        }
    }, [id, reset, t])

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)(),
    }))

    const handleAddSubUnit = () => {
        setSubUnits([
            ...subUnits,
            {
                unitCode: '',
                unitName: '',
                isMain: false,
                factor1: 0,
                factor2: 0,
                lineNumber: subUnits.length + 1,
            },
        ])
    }

    const handleDeleteSubUnit = (index) => {
        setSubUnits(subUnits.filter((_, i) => i !== index))
        setSubUnitErrors(subUnitErrors.filter((_, i) => i !== index))
    }

    const handleSubUnitChange = (index, field, value) => {
        const updatedSubUnits = [...subUnits]
        updatedSubUnits[index] = { ...updatedSubUnits[index], [field]: value }
        setSubUnits(updatedSubUnits)

        const updatedErrors = [...subUnitErrors]
        updatedErrors[index] = updatedErrors[index] || {}
        if (field === 'unitCode') {
            updatedErrors[index].unitCode = !value ? t(`${translationPath}unitCodeRequired`) : null
        }
        if (field === 'unitName') {
            updatedErrors[index].unitName = !value ? t(`${translationPath}unitNameRequired`) : null
        }
        setSubUnitErrors(updatedErrors)
    }

    const validateSubUnits = () => {
        const errors = subUnits.map((subUnit) => ({
            unitCode: !subUnit.unitCode ? t(`${translationPath}unitCodeRequired`) : null,
            unitName: !subUnit.unitName ? t(`${translationPath}unitNameRequired`) : null,
        }))
        setSubUnitErrors(errors)
        return errors.every((error) => !error.unitCode && !error.unitName)
    }

    const onSubmit = async (data) => {
        if (!validateSubUnits()) {
            triggerMessageError(t(`${translationPath}subUnitsValidationError`))
            return
        }

        const codeNumber = parseInt(data.code, 10)
        if (isNaN(codeNumber) || codeNumber <= 0) {
            triggerMessageError(t(`${translationPath}codeRequired`))
            return
        }

        const payload = {
            code: codeNumber.toString(),
            name: data.name,
            cardType: data.cardType,
            subUnits: subUnits.map((subUnit) => ({
                unitCode: subUnit.unitCode,
                unitName: subUnit.unitName,
                isMain: subUnit.isMain ? 1 : 0,
                factor1: parseFloat(subUnit.factor1) || 0,
                factor2: parseFloat(subUnit.factor2) || 0,
                lineNumber: subUnit.lineNumber,
            })),
            ...(isEditMode && { id: parseInt(id) }),
        }

        try {
            setIsLoading(true)
            const response = isEditMode ? await UpdateMainUnit(payload) : await CreateMainUnit(payload)
            if (response?.success || response?.Success) {
                triggerMessageSuccessfully(
                    t(isEditMode ? `${translationPath}updateSuccess` : `${translationPath}createSuccess`),
                )
                if (onSubmitSuccess) {
                    onSubmitSuccess({ id: id || response.Data?.id, ...payload })
                }
                navigate(isEditMode ? `/MainUnit/Edit/${id || response.Data?.id}` : '/MainUnit')
            } else {
                const errorMessage = response?.data?.Message || response?.message || t(`${translationPath}saveFailed`)
                triggerMessageError(errorMessage)
            }
        } catch (error) {
            const errorMessage = error.message || t(`${translationPath}requestError`)
            triggerMessageError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (onCancel) {
            onCancel()
        } else {
            navigate('/MainUnit')
        }
    }

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t(isEditMode ? `${translationPath}editMainUnit` : `${translationPath}createNewMainUnit`)}
                </h2>
                <p className="mb-6">{t(`${translationPath}description`)}</p>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{t(`${translationPath}MainUnit`)}</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder={t(`${translationPath}enterCode`)}
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={t(`${translationPath}unitName`)}
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
                                            placeholder={t(`${translationPath}enterName`)}
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </form>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{t(`${translationPath}subUnits`)}</h3>
                    <p className="mb-4 text-gray-600 italic">{t(`${translationPath}createSubUnits`)}</p>
                    <div className="sub-units-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t(`${translationPath}code`)}</th>
                                    <th>{t(`${translationPath}name`)}</th>
                                    <th>{t(`${translationPath}isMain`)}</th>
                                    <th>{t(`${translationPath}factor1`)}</th>
                                    <th>{t(`${translationPath}factor2`)}</th>
                                    <th>{t(`${translationPath}actions`)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subUnits.map((subUnit, index) => (
                                    <tr key={index} className="sub-unit-row">
                                        <td>
                                            <Input
                                                type="text"
                                                value={subUnit.unitCode}
                                                placeholder={t(`${translationPath}enterCode`)}
                                                onChange={(e) =>
                                                    handleSubUnitChange(index, 'unitCode', e.target.value)
                                                }
                                                className="borderless-input"
                                            />
                                            {subUnitErrors[index]?.unitCode && (
                                                <p className="text-red-500 text-sm">
                                                    {subUnitErrors[index].unitCode}
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            <Input
                                                type="text"
                                                value={subUnit.unitName}
                                                placeholder={t(`${translationPath}enterName`)}
                                                onChange={(e) =>
                                                    handleSubUnitChange(index, 'unitName', e.target.value)
                                                }
                                                className="borderless-input"
                                            />
                                            {subUnitErrors[index]?.unitName && (
                                                <p className="text-red-500 text-sm">
                                                    {subUnitErrors[index].unitName}
                                                </p>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Checkbox
                                                checked={subUnit.isMain}
                                                onChange={(value) =>
                                                    handleSubUnitChange(index, 'isMain', value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={subUnit.factor1}
                                                onChange={(e) =>
                                                    handleSubUnitChange(index, 'factor1', e.target.value)
                                                }
                                                className="borderless-input factor-input"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={subUnit.factor2}
                                                onChange={(e) =>
                                                    handleSubUnitChange(index, 'factor2', e.target.value)
                                                }
                                                className="borderless-input factor-input"
                                            />
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="delete-icon"
                                                onClick={() => handleDeleteSubUnit(index)}
                                                title={t(`${translationPath}delete`)}
                                            >
                                                <PiTrash className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        variant="solid"
                        className="mt-4 flex items-center gap-2 add-new-record-button"
                        onClick={handleAddSubUnit}
                        disabled={isLoading}
                    >
                        <PiPlus className="text-lg" />
                        {t(`${translationPath}addNewRecord`)}
                    </Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t(`${translationPath}close`)}
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {t(`${translationPath}save`)}
                    </Button>
                </div>
            </Card>
        </div>
    )
})

export default MainUnitCU