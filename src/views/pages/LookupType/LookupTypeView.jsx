import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LookupTypeTable from './components/LookupTypeTable';
import LookupTypeActionTools from './components/LookupTypeActionTools';
import LookupTypeTableTools from './components/LookupTypeTableTools';

const LookupTypeView = () => {
  const [openDialogCRUD, setOpenDialogCRUD] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [searchItem, setSearchItem] = useState('');
  const { t } = useTranslation();
  const translationPath = 'views.LookupType.';

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>{t(`${translationPath}LookupType`)}</h3>
            <LookupTypeActionTools
              openDialogCRUD={openDialogCRUD}
              setOpenDialogCRUD={setOpenDialogCRUD}
              setSelectItem={setSelectItem}
              translationPath={translationPath}
            />
          </div>
          <LookupTypeTableTools
            setSearchItem={setSearchItem}
            translationPath={translationPath}
          />
          <LookupTypeTable
            openDialogCRUD={openDialogCRUD}
            setOpenDialogCRUD={setOpenDialogCRUD}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            searchItem={searchItem}
            translationPath={translationPath}
          />
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default LookupTypeView;
