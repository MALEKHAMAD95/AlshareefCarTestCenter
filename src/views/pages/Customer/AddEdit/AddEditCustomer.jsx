import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, FormItem, Input, Button, Checkbox } from '@/components/ui';
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { CreateCustomer, GetCustomerById, UpdateCustomer } from '@/services/ModelSserver/CustomerServices';

const AddEditCustomer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            code: '',
            firstName: '',
            secondName: '',
            blocked: false,
            address: '',
            address2: '',
            contactPerson: '',
            phoneNumber: '',
            phoneNumber2: '',
            contactPhoneNo: '',
            taxNo: '',
            email: '',
        },
    });

    const fetchCustomer = async (id) => {
        try {
            setIsLoading(true);
            const response = await GetCustomerById(id);
            const customerData = response?.data;

            if (customerData && Object.keys(customerData).length > 0) {
                reset({
                    code: customerData.code || '',
                    firstName: customerData.firstName || '',
                    secondName: customerData.secondName || '',
                    blocked: customerData.blocked === 1,
                    address: customerData.address || '',
                    address2: customerData.address2 || '',
                    contactPerson: customerData.contactPerson || '',
                    phoneNumber: customerData.phoneNumber || '',
                    phoneNumber2: customerData.phoneNumber2 || '',
                    contactPhoneNo: customerData.contactPhoneNo || '',
                    taxNo: customerData.taxNo || '',
                    email: customerData.email || '',
                });
            } else {
                triggerMessageError(t('customer.fetchFailed'));
                reset({});
            }
        } catch (error) {
            console.error('Fetch customer error:', error);
            triggerMessageError(t('customer.fetchError'));
            reset({});
        } finally {
            setIsLoading(false);
        }
    };

    const hasFetchedRef = useRef(false);


    useEffect(() => {
        if (id && !hasFetchedRef.current) {
            if (!isNaN(parseInt(id))) {
                fetchCustomer(id);
                hasFetchedRef.current = true;
            } else {
                console.warn('Invalid ID:', id);
                triggerMessageError(t('customer.invalidId'));
                navigate('/Customer');
            }
        }
    }, [id]);

    const onSubmit = async (data) => {
        const payload = {
            code: data.code,
            firstName: data.firstName,
            secondName: data.secondName,
            blocked: data.blocked ? 1 : 0,
            address: data.address,
            address2: data.address2,
            contactPerson: data.contactPerson,
            phoneNumber: data.phoneNumber,
            phoneNumber2: data.phoneNumber2,
            contactPhoneNo: data.contactPhoneNo,
            taxNo: data.taxNo,
            email: data.email,
            ...(isEditMode && { id: parseInt(id) }),
        };

        try {
            setIsLoading(true);
            const response = isEditMode
                ? await UpdateCustomer(payload)
                : await CreateCustomer(payload);

            if (response) {
                triggerMessageSuccessfully(
                 isEditMode  &&

                    t(`${translationPath}updateSuccess`) ||  t(`${translationPath}createSuccess`)

                );
                navigate('/Customer');
            } else {
                console.error('API Error:', response);
                triggerMessageError(t('customer.saveFailed'));
            }
        } catch (error) {
            console.error('Request failed:', error);
            triggerMessageError(t('customer.requestError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/Customer');
    };

    const translationPath = 'views.Customer.';

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t(isEditMode ? `${translationPath}editCustomer` : `${translationPath}addCustomer`)}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                                    required: t(`${translationPath}codeRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}codePlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}firstName`)}
                            invalid={!!errors.firstName}
                            errorMessage={errors.firstName?.message}
                        >
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}firstNameRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}firstNamePlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}secondName`)}
                            invalid={!!errors.secondName}
                            errorMessage={errors.secondName?.message}
                        >
                            <Controller
                                name="secondName"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}secondNameRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}secondNamePlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}email`)}
                            invalid={!!errors.email}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}emailRequired`),
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: t(`${translationPath}emailInvalid`),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder={t(`${translationPath}emailPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}phoneNumber`)}
                            invalid={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                        >
                            <Controller
                                name="phoneNumber"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}phoneNumberRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}phoneNumberPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}phoneNumber2`)}
                            invalid={!!errors.phoneNumber2}
                            errorMessage={errors.phoneNumber2?.message}
                        >
                            <Controller
                                name="phoneNumber2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}phoneNumber2Placeholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}contactPhoneNo`)}
                            invalid={!!errors.contactPhoneNo}
                            errorMessage={errors.contactPhoneNo?.message}
                        >
                            <Controller
                                name="contactPhoneNo"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}contactPhoneNoPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}address`)}
                            invalid={!!errors.address}
                            errorMessage={errors.address?.message}
                        >
                            <Controller
                                name="address"
                                control={control}
                                rules={{
                                    required: t(`${translationPath}addressRequired`),
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}addressPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}address2`)}
                            invalid={!!errors.address2}
                            errorMessage={errors.address2?.message}
                        >
                            <Controller
                                name="address2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}address2Placeholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}contactPerson`)}
                            invalid={!!errors.contactPerson}
                            errorMessage={errors.contactPerson?.message}
                        >
                            <Controller
                                name="contactPerson"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}contactPersonPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}taxNo`)}
                            invalid={!!errors.taxNo}
                            errorMessage={errors.taxNo?.message}
                        >
                            <Controller
                                name="taxNo"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder={t(`${translationPath}taxNoPlaceholder`)}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={t(`${translationPath}accountStatus`)}
                            invalid={!!errors.blocked}
                            errorMessage={errors.blocked?.message}
                        >
                            <Controller
                                name="blocked"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        disabled={isLoading}
                                    >
                                        {t(`${translationPath}isBlocked`)}
                                    </Checkbox>
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" onClick={handleCancel} disabled={isLoading}>
                            {t(`${translationPath}cancel`)}
                        </Button>
                        <Button type="submit" variant="solid" disabled={isLoading}>
                            {isLoading
                                ? t(`${translationPath}loading`)
                                : t(isEditMode ? `${translationPath}update` : `${translationPath}create`)}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditCustomer;