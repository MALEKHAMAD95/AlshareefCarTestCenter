import React from 'react';
import Container from '@/components/shared/Container';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PurchaseOrderModuleView = () => {
  const [openDialogCRUD, setOpenDialogCRUD] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [searchItem, setSearchItem] = useState('');
  const [filters, setFilters] = useState({});
  const { t } = useTranslation();
  const translationPath = 'views.PurchaseOrder.';

  return (
    <Container>
PurchaseOrderModuleView;

    </Container>
  );
};

export default PurchaseOrderModuleView;