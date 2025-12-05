import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, FormItem, Input, Button, Checkbox, Select } from '@/components/ui';
import {
  triggerMessageSuccessfully,
  triggerMessageError,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { CreateMaterial, GetMaterialById, UpdateMaterial } from '@/services/ModelSserver/MaterialServices';
import { GetAllMainUnits } from '@/services/ModelSserver/MainUnitServices';

const AddEditMaterial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [mainUnitOptions, setMainUnitOptions] = useState([]);
  const hasFetchedRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
      name: '',
      name2: '',
      description: '',
      description2: '',
      active: false,
      vat: 0,
      salesVat: 0,
      salesReturnVat: 0,
      retailSalesVat: 0,
      retailSalesReturnVat: 0,
      trackingId: 0,
      markId: 0,
      mainUnitId: 0,
      countable: false,
      cardType: 0,
    },
  });

  const fetchMainUnits = async () => {
    const response = await GetAllMainUnits();
    if (response?.success) {
      const units = response.data.map((unit) => ({
        value: unit.id,
        label: unit.name,
      }));
      setMainUnitOptions([
        ...units,
      ]);
    } else {
      triggerMessageError(t('views.Lookup.fetchMainUnitsFailed'));
    }
  };

  const fetchMaterial = async (id) => {
    try {
      setIsLoading(true);
      const response = await GetMaterialById(id);
      const materialData = response?.data?.data;
      if (materialData) {
        reset({
          code: materialData.code || '',
          name: materialData.name || '',
          name2: materialData.name2 || '',
          description: materialData.description || '',
          description2: materialData.description2 || '',
          active: materialData.active === 1,
          vat: materialData.vat || 0,
          salesVat: materialData.salesVat || 0,
          salesReturnVat: materialData.salesReturnVat || 0,
          retailSalesVat: materialData.retailSalesVat || 0,
          retailSalesReturnVat: materialData.retailSalesReturnVat || 0,
          trackingId: materialData.trackingId || 0,
          markId: materialData.markId || 0,
          mainUnitId: materialData.mainUnitId || 0,
          countable: materialData.countable === 1,
          cardType: materialData.cardType || 0,
        });
      } else {
        triggerMessageError(t('material.fetchFailed'));
        reset({});
      }
    } catch (error) {
      console.error('Fetch material error:', error);
      triggerMessageError(t('material.fetchError'));
      reset({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainUnits();
    if (id && !hasFetchedRef.current) {
      if (!isNaN(parseInt(id))) {
        fetchMaterial(id);
        hasFetchedRef.current = true;
      } else {
        triggerMessageError(t('material.invalidId'));
        navigate('/Material');
      }
    }
  }, [id, navigate, t]);

  const onSubmit = async (data) => {
    const payload = {
      code: data.code,
      name: data.name,
      name2: data.name2,
      description: data.description,
      description2: data.description2,
      active: data.active ? 1 : 0,
      vat: parseFloat(data.vat) || 0,
      salesVat: parseFloat(data.salesVat) || 0,
      salesReturnVat: parseFloat(data.salesReturnVat) || 0,
      retailSalesVat: parseFloat(data.retailSalesVat) || 0,
      retailSalesReturnVat: parseFloat(data.retailSalesReturnVat) || 0,
      trackingId: parseInt(data.trackingId) || 0,
      markId: parseInt(data.markId) || 0,
      mainUnitId: parseInt(data.mainUnitId) || 0,
      countable: data.countable ? 1 : 0,
      cardType: parseInt(data.cardType) || 0,
      ...(isEditMode && { id: parseInt(id) }),
      materialUnit: [],
    };

    try {
      setIsLoading(true);
      const response = isEditMode
        ? await UpdateMaterial(payload)
        : await CreateMaterial(payload);

      if (response?.success || response?.data?.success) {
        triggerMessageSuccessfully(
          (isEditMode ? t(`${translationPath}updateSuccess`) : t(`${translationPath}createSuccess`))
        );
        navigate('/Material');
      } else {
        triggerMessageError(t(`${translationPath}saveFailed`));
      }
    } catch (error) {
      console.error('Request failed:', error);
      triggerMessageError(t(`${translationPath}requestError`));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/Material');
  };

  const translationPath = 'views.Lookup.';

  const trackingOptions = [
    { value: 0, label: t(`${translationPath}noTracking`) },
    { value: 1, label: 'Tracking' },
  ];

  return (
    <div className="p-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          {t(isEditMode ? `${translationPath}editMaterial` : `${translationPath}addMaterial`)}
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
                    placeholder={t(`${translationPath}nameMaterial`)}
                    {...field}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}name2`)}
              invalid={!!errors.name2}
              errorMessage={errors.name2?.message}
            >
              <Controller
                name="name2"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder={t(`${translationPath}name2Placeholder`)}
                    {...field}
                    disabled={isLoading}
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
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder={t(`${translationPath}desMaterial`)}
                    {...field}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}description2`)}
              invalid={!!errors.description2}
              errorMessage={errors.description2?.message}
            >
              <Controller
                name="description2"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder={t(`${translationPath}desc2Placeholder`)}
                    {...field}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}purchaseVat`)}
              invalid={!!errors.vat}
              errorMessage={errors.vat?.message}
            >
              <Controller
                name="vat"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}vatPlaceholder`)}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}salesVat`)}
              invalid={!!errors.salesVat}
              errorMessage={errors.salesVat?.message}
            >
              <Controller
                name="salesVat"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}salesVatPlaceholder`)}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}salesReturnVat`)}
              invalid={!!errors.salesReturnVat}
              errorMessage={errors.salesReturnVat?.message}
            >
              <Controller
                name="salesReturnVat"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}salesReturnVatPlaceholder`)}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}retailSalesVat`)}
              invalid={!!errors.retailSalesVat}
              errorMessage={errors.retailSalesVat?.message}
            >
              <Controller
                name="retailSalesVat"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}retailSalesVatPlaceholder`)}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}retailSalesReturnVat`)}
              invalid={!!errors.retailSalesReturnVat}
              errorMessage={errors.retailSalesReturnVat?.message}
            >
              <Controller
                name="retailSalesReturnVat"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}retailSalesReturnVatPlaceholder`)}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}trackingType`)}
              invalid={!!errors.trackingId}
              errorMessage={errors.trackingId?.message}
            >
              <Controller
                name="trackingId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={trackingOptions}
                    value={trackingOptions.find((option) => option.value === field.value)}
                    onChange={(option) => field.onChange(option ? option.value : 0)}
                    placeholder={t(`${translationPath}selectTrackingType`)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}brand`)}
              invalid={!!errors.markId}
              errorMessage={errors.markId?.message}
            >
              <Controller
                name="markId"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}enterMarkCode`)}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}mainUnit`)}
              invalid={!!errors.mainUnitId}
              errorMessage={errors.mainUnitId?.message}
            >
              <Controller
                name="mainUnitId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={mainUnitOptions}
                    value={mainUnitOptions.find((option) => option.value === field.value)}
                    onChange={(option) => field.onChange(option ? option.value : 0)}
                    placeholder={t(`${translationPath}selectMainUnit`)}
                    disabled={isLoading}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t(`${translationPath}countable`)}
              invalid={!!errors.countable}
              errorMessage={errors.countable?.message}
            >
              <Controller
                name="countable"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(value) => field.onChange(value)}
                    disabled={isLoading}
                  >
                    {t(`${translationPath}countable`)}
                  </Checkbox>
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

export default AddEditMaterial;