import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, FormItem, Input, Button } from '@/components/ui';
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { CreateWarehouse, UpdateWarehouse } from '@/services/ModelSserver/WarehouseServices';

const WarehouseCU = forwardRef(
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
        const { t } = useTranslation();
        const {
            control,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm({
            defaultValues: {
                firmNo: 0,
                name: '',
                warehouseNumber: 0,
                costGroup: 0,
                ...(initialData || {}),
            },
        });

        useEffect(() => {
            if (isEditMode && initialData) {
                reset({
                    id: initialData.id,
                    firmNo: initialData.firmNo,
                    name: initialData.name,
                    warehouseNumber: initialData.warehouseNumber,
                    costGroup: initialData.costGroup,
                });
            }
        }, [initialData, reset, isEditMode]);

        const onSubmit = async (data) => {
            const payload = {
                firmNo: Number(data.firmNo),
                name: data.name,
                warehouseNumber: Number(data.warehouseNumber),
                costGroup: Number(data.costGroup),
            };

            try {
                const response = isEditMode
                    ? await UpdateWarehouse({ ...payload, id: initialData?.id })
                    : await CreateWarehouse(payload);

              if (response?.success || response?.data?.success ) {
                    triggerMessageSuccessfully(
                        t(
                            isEditMode
                                ? `${translationPath}updateSuccess`
                                : `${translationPath}createSuccess`,
                        ),
                    );
                    onSubmitSuccess({
                        id: isEditMode ? initialData?.id : response?.data?.id,
                        payload,
                    });
                } else {
                    console.error('API Error:', response);
                    triggerMessageError(t(`${translationPath}saveFailed`));
                }
            } catch (error) {
                console.error('Request failed:', error);
                triggerMessageError(t(`${translationPath}requestError`));
            }
        };

        useImperativeHandle(ref, () => ({
            submitForm: () => handleSubmit(onSubmit)(),
        }));

        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Card>
                    <FormItem
                        label={t(`${translationPath}firmNo`)}
                        invalid={!!errors.firmNo}
                        errorMessage={errors.firmNo?.message}
                    >
                        <Controller
                            name="firmNo"
                            control={control}
                            rules={{
                                required: t(`${translationPath}firmNoRequired`),
                                validate: (value) =>
                                    !isNaN(value) && Number(value) >= 0
                                        ? true
                                        : t(`${translationPath}firmNoInvalid`),
                            }}
                            render={({ field }) => (
                                <Input
                                    type="number" min="0"
                                    placeholder={t(
                                        `${translationPath}firmNoPlaceholder`,
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
                    <FormItem
                        label={t(`${translationPath}warehouseNumber`)}
                        invalid={!!errors.warehouseNumber}
                        errorMessage={errors.warehouseNumber?.message}
                    >
                        <Controller
                            name="warehouseNumber"
                            control={control}
                            rules={{
                                required: t(
                                    `${translationPath}warehouseNumberRequired`,
                                ),
                                validate: (value) =>
                                    !isNaN(value) && Number(value) >= 0
                                        ? true
                                        : t(
                                              `${translationPath}warehouseNumberInvalid`,
                                          ),
                            }}
                            render={({ field }) => (
                                <Input
                                    type="number" min="0"
                                    placeholder={t(
                                        `${translationPath}warehouseNumberPlaceholder`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}costGroup`)}
                        invalid={!!errors.costGroup}
                        errorMessage={errors.costGroup?.message}
                    >
                        <Controller
                            name="costGroup"
                            control={control}
                            rules={{
                                required: t(
                                    `${translationPath}costGroupRequired`,
                                ),
                                validate: (value) =>
                                    !isNaN(value) && Number(value) >= 0
                                        ? true
                                        : t(
                                              `${translationPath}costGroupInvalid`,
                                          ),
                            }}
                            render={({ field }) => (
                                <Input
                                    type="number" min="0"
                                    placeholder={t(
                                        `${translationPath}costGroupPlaceholder`,
                                    )}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </Card>
            </form>
        );
    },
);

export default WarehouseCU;