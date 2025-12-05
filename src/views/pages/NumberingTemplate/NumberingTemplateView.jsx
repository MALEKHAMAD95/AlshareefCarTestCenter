import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import OrderListActionTools from './OrderList/components/OrderListActionTools'
import OrderListTableTools from './OrderList/components/OrderListTableTools'
import NumberingTemplateTable from './OrderList/components/NumberingTemplateTable'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'

const NumberingTemplateView = () => {
    const [openDialogCRUD, setopenDialogCRUD] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    const [searchItem, setSearchItem] = useState('')
    const [filters, setFilters] = useState({
        trcode: '',
        userId: '',
        warehouseId: '',
        firmNumber: '',
        searchDate: '',
    })
    const { t } = useTranslation(useTranslationValue)
    const translationPath = 'views.NumberingTemplate.'

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{t(`${translationPath}NumberingTemplates`)}</h3>
                        <OrderListActionTools
                            openDialogCRUD={openDialogCRUD}
                            setopenDialogCRUD={setopenDialogCRUD}
                            setSelectItem={setSelectItem}
                            translationPath={translationPath}
                        />
                    </div>
                    <OrderListTableTools
                        setSearchItem={setSearchItem}
                        setFilters={setFilters}
                        translationPath={translationPath}
                    />
                    <NumberingTemplateTable
                        openDialogCRUD={openDialogCRUD}
                        setopenDialogCRUD={setopenDialogCRUD}
                        selectItem={selectItem}
                        setSelectItem={setSelectItem}
                        searchItem={searchItem}
                        filters={filters}
                        translationPath={translationPath}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default NumberingTemplateView