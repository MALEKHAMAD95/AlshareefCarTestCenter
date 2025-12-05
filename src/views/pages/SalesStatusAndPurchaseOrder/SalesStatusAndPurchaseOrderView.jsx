import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import OrderListActionTools from './OrderList/components/OrderListActionTools';
import OrderListTableTools from './OrderList/components/OrderListTableTools';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SalesStatusAndPurchaseOrderTable from './OrderList/components/SalesStatusAndPurchaseOrderTable';

const SalesStatusAndPurchaseOrderView = () => {
    const { type } = useParams(); 
    const [openDialogCRUD, setOpenDialogCRUD] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [searchItem, setSearchItem] = useState('');
    const { t } = useTranslation();
    const translationPath = 'views.OrderStatus.';

    const orderStatusType = type === 'sales' ? 1 : type === 'purchase' ? 2 : 1;
    const pageTitle = orderStatusType === 1 ? t(`${translationPath}SalesStatus`) : t(`${translationPath}PurchaseStatus`);

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{pageTitle}</h3>
                        <OrderListActionTools
                            openDialogCRUD={openDialogCRUD}
                            setOpenDialogCRUD={setOpenDialogCRUD}
                            setSelectItem={setSelectItem}
                            translationPath={translationPath}
                        />
                    </div>
                    <OrderListTableTools
                        setSearchItem={setSearchItem}
                        translationPath={translationPath}
                    />
                    <SalesStatusAndPurchaseOrderTable
                        openDialogCRUD={openDialogCRUD}
                        setOpenDialogCRUD={setOpenDialogCRUD}
                        selectItem={selectItem}
                        setSelectItem={setSelectItem}
                        searchItem={searchItem}
                        translationPath={translationPath}
                        orderStatusType={orderStatusType} 
                    />
                </div>
            </AdaptiveCard>
        </Container>
    );
};

export default SalesStatusAndPurchaseOrderView;