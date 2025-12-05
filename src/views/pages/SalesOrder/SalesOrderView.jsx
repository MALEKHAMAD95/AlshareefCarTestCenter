import React, { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useTranslation } from 'react-i18next'
import SalesOrderModuleTable from './OrderList/components/SalesOrderModuleTable'
import OrderListTableTools from './OrderList/components/OrderListTableTools'
import OrderListActionTools from './OrderList/components/OrderListActionTools'

const SalesOrderView = () => {
    const [openDialogCRUD, setOpenDialogCRUD] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    const [searchItem, setSearchItem] = useState('')
    const [filters, setFilters] = useState({})
    const [selectedRows, setSelectedRows] = useState([])
    const [showBatchApprovalDialog, setShowBatchApprovalDialog] =
        useState(false)
    const { t } = useTranslation()
    const translationPath = 'views.OrderStatus.'

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{t(`${translationPath}orders`)}</h3>
                        <OrderListActionTools
                            translationPath={translationPath}
                        />
                    </div>
                    <OrderListTableTools
                        setSearchItem={setSearchItem}
                        setFilters={setFilters}
                        translationPath={translationPath}
                        selectedRows={selectedRows}
                        setShowBatchApprovalDialog={setShowBatchApprovalDialog}
                    />
                    <SalesOrderModuleTable
                        openDialogCRUD={openDialogCRUD}
                        setOpenDialogCRUD={setOpenDialogCRUD}
                        selectItem={selectItem}
                        setSelectItem={setSelectItem}
                        showBatchApprovalDialog={showBatchApprovalDialog}
                        setShowBatchApprovalDialog={setShowBatchApprovalDialog}
                        searchItem={searchItem}
                        setSearchItem={setSearchItem}
                        filters={filters}
                        setFilters={setFilters}
                        translationPath={translationPath}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows} // Pass setSelectedRows to update state
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default SalesOrderView
