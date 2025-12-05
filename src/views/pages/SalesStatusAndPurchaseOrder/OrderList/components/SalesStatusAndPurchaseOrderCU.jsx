import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, FormItem, Input, Checkbox } from '@/components/ui';
import { CreateOrderStatus, UpdateOrderStatus } from '@/services/ModelSserver/OrderStatusServices';
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';

const SalesStatusAndPurchaseOrderCU = forwardRef(
    (
        {
            onSubmitSuccess,
            onCancel,
            initialData = null,
            isEditMode,
            translationPath,
            orderStatusType,
        },
        ref,
    ) => {
        const { t } = useTranslation();
        const {
            control,
            handleSubmit,
            reset,
            formState: { errors },
            watch,
        } = useForm({
            defaultValues: {
                name: '',
                active: false,
                isDefault: false,
                linenr: 1, // Default value set to 1
                ...(initialData || {}),
            },
        });

        useEffect(() => {
            if (isEditMode && initialData) {
                reset({
                    ...initialData,
                    linenr: initialData.linenr > 0 ? initialData.linenr : 1, 
                });
            }
        }, [initialData, reset, isEditMode]);

        const onSubmit = async (data) => {
            const payload = {
                orderStatusType,
                name: data.name,
                active: data.active,
                isDefault: data.isDefault,
                linenr: data.linenr,
            };
            try {
                const response = isEditMode
                    ? await UpdateOrderStatus({ ...payload, id: initialData?.id })
                    : await CreateOrderStatus(payload);

                if (response?.success || response?.data?.success) {
                    triggerMessageSuccessfully(
                        t(
                            isEditMode
                                ? `${translationPath}updateSuccess`
                                : `${translationPath}createSuccess`,
                        ),
                    );
                    onSubmitSuccess({
                        id: isEditMode ? initialData?.id : response?.data?.data,
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
                        label={t(`${translationPath}lineNumber`)}
                        invalid={!!errors.linenr}
                        errorMessage={errors.linenr?.message}
                    >
                        <Controller
                            name="linenr"
                            control={control}
                            rules={{
                                required: t(`${translationPath}lineNumberRequired`),
                                min: {
                                    value: 1,
                                    message: t(`${translationPath}lineNumberGreaterThanZero`), // Custom message for > 0
                                },
                            }}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    placeholder={t(
                                        `${translationPath}lineNumberPlaceholder`,
                                    )}
                                    {...field}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value >= 1 ? value : 1); // Prevent negative or zero
                                    }}
                                    className="no-spinners" // Keep the spinner removal class
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
                                    onChange={(checked) => {
                                        field.onChange(checked);
                                    }}
                                    disabled={false}
                                    className="cursor-pointer"
                                >
                                    {t(`${translationPath}isActive`)}
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t(`${translationPath}isDefault`)}
                        invalid={!!errors.isDefault}
                        errorMessage={errors.isDefault?.message}
                    >
                        <Controller
                            name="isDefault"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(checked) => {
                                        field.onChange(checked);
                                    }}
                                    disabled={false}
                                    className="cursor-pointer"
                                >
                                    {t(`${translationPath}isDefault`)}
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                </Card>
            </form>
        );
    },
);

export default SalesStatusAndPurchaseOrderCU;