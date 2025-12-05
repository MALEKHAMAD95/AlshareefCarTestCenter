import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, FormItem, Input, Button, Checkbox, Select } from '@/components/ui';
import { GetBankById, CreateBankAccount, UpdateBankAccount } from '@/services/ModelSserver/BankAccountServices';
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';

const bankTypeOptions = [
    { value: 0, label: 'Main Bank' },
    { value: 1, label: 'Branch Bank' },
    { value: 2, label: 'Savings' },
];

const currencyOptions = [
    { value: 0, label: '$' },
    { value: 1, label: 'JD' },
    { value: 2, label: 'EUR' },
    { value: 3, label: 'TRY' },
    { value: 4, label: 'ILS' },
];

const AddEditBankAccounts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // id is bankId in create mode, bank account ID in edit mode
    const isEditMode = window.location.pathname.includes('/edit');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedBankId, setFetchedBankId] = useState(null);

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
        },
    });

    const fetchBankAccount = async (accountId) => {
        try {
            setIsLoading(true);
            const response = await GetBankById(accountId);
            const bankAccountData = response?.data;
            if (bankAccountData && Object.keys(bankAccountData).length > 0) {
                reset({
                    code: bankAccountData?.code || '',
                    name: bankAccountData?.name || '',
                    accountNo: bankAccountData?.accountNo || '',
                    iban: bankAccountData?.iban || '',
                    active: bankAccountData?.active === 1,
                    bankType: bankAccountData?.bankType ?? bankTypeOptions[0].value,
                    currency: bankAccountData?.currency ?? currencyOptions[0].value,
                });
                setFetchedBankId(bankAccountData?.bankId || 0);
            } else {
                console.warn('Empty or invalid bank account data:', bankAccountData);
                triggerMessageError(t('bankAccount.fetchFailed'));
                reset({});
            }
        } catch (error) {
            console.error('Fetch bank account error:', error);
            triggerMessageError(t('bankAccount.fetchError'));
            reset({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            if (!id || isNaN(parseInt(id))) {
                console.warn('Invalid bank account ID:', id);
                triggerMessageError(t('bankAccount.invalidId'));
                navigate('/BankAccounts');
            } else {
                fetchBankAccount(id);
            }
        } else {
            if (!id || isNaN(parseInt(id))) {
                console.warn('Invalid bankId:', id);
                triggerMessageError(t('bankAccount.invalidBankId'));
                navigate('/BankAccounts');
            }
        }
    }, [id, isEditMode, navigate, t]);

    const onSubmit = async (data) => {
        const payload = {
            code: data.code,
            name: data.name,
            accountNo: data.accountNo,
            iban: data.iban,
            active: data.active ? 1 : 0,
            bankId: isEditMode ? fetchedBankId : parseInt(id),
            bankType: data.bankType,
            currency: data.currency,
            ...(isEditMode && { id: parseInt(id) }),
        };

        try {
            setIsLoading(true);
            const response = isEditMode
                ? await UpdateBankAccount(payload)
                : await CreateBankAccount(payload);

            if (response?.success || response?.data?.success ) {
                triggerMessageSuccessfully(
                    t(isEditMode ? 'bankAccount.updateSuccess' : 'bankAccount.createSuccess')
                );
                navigate('/BankAccounts');
            } else {
                console.error('API Error:', response);
                triggerMessageError(t('bankAccount.saveFailed'));
            }
        } catch (error) {
            console.error('Request failed:', error);
            triggerMessageError(t('bankAccount.requestError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/BankAccounts');
    };

    const translationPath = 'views.BankAccount.';

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t(isEditMode ? `${translationPath}editBankAccount` : `${translationPath}addBankAccount`)}
                </h2>
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        options={bankTypeOptions}
                                        value={bankTypeOptions.find(option => option.value === field.value)}
                                        onChange={(option) => field.onChange(option.value)}
                                        placeholder={t(`${translationPath}bankTypePlaceholder`)}
                                        isDisabled={isLoading}
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
                                        isDisabled={isLoading}
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
                                        onChange={(value) => field.onChange(value)}
                                        disabled={isLoading}
                                    >
                                        {t(`${translationPath}isActive`)}
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

export default AddEditBankAccounts;