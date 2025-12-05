import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import OrderListActionTools from './OrderList/components/OrderListActionTools'
import OrderListTableTools from './OrderList/components/OrderListTableTools'
import PaymentPlanListTable from './OrderList/components/PaymentPlanListTable'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'

const PaymentPlanList = () => {
    const [openDialogCRUD, setopenDialogCRUD] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    const [searchItem, setSearchItem] = useState('')
    const { t } = useTranslation(useTranslationValue)
    const translationPath = 'views.Lookup.'

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{t(`${translationPath}PaymentPlanManagement`)}</h3>
                        <OrderListActionTools
                            openDialogCRUD={openDialogCRUD}
                            setopenDialogCRUD={setopenDialogCRUD}
                            setSelectItem={setSelectItem}
                            translationPath={translationPath}
                        />
                    </div>
                    <OrderListTableTools
                        setSearchItem={setSearchItem}
                        translationPath={translationPath}
                    />
                    <PaymentPlanListTable
                        openDialogCRUD={openDialogCRUD}
                        setopenDialogCRUD={setopenDialogCRUD}
                        selectItem={selectItem}
                        setSelectItem={setSelectItem}
                        searchItem={searchItem}
                        translationPath={translationPath}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default PaymentPlanList