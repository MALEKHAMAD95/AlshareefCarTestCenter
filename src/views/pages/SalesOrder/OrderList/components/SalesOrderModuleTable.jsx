import React, { useMemo, useState, useEffect, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { useNavigate } from 'react-router-dom'
import Tag from '@/components/ui/Tag'
import { TbEdit, TbTrash } from 'react-icons/tb'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/shared'
import { BsBox } from 'react-icons/bs'
import { FaRegCheckCircle, FaRegCircle } from 'react-icons/fa'
import SaveSharedDialog from '@/views/pages/SalesOrder/AddEditCustomer/components/SaveSharedDialog'
import { fetchControls } from '@/services/ModelSserver/ControlServices'
import { DeleteOrderById, GetOrdersPaging } from '@/services/ModelSserver/OrderServices'
import BatchApprovalDialog from '@/views/pages/SalesOrder/SalesOrderDialogModal/BatchApprovalDialog'
import ActionLevel from '@/views/pages/SalesOrder/Enum/ActionLevel '
import OrderListTableTools from './OrderListTableTools'

const ActionColumn = ({
    row,
    setOpenDialog,
    setSelectItem,
    setShowSaveSharedDialog,
    setSelectedOrder,
    translationPath,
}) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleSelectItem = () => {
        setSelectItem(row || null)
    }

    const onEdit = () => {
        setSelectedOrder(row)
        setShowSaveSharedDialog(true)
    }

    const onDelete = () => {
        handleSelectItem()
        setOpenDialog(true)
    }

    return (
        <div className="flex justify-start items-center gap-2 text-lg relative">
            <Tooltip wrapperClass="flex" title={t(`${translationPath}edit`)}>
                <div className="cursor-pointer p-2 hover:text-blue-500" onClick={onEdit}>
                    <TbEdit />
                </div>
            </Tooltip>
            <Tooltip wrapperClass="flex" title={t(`${translationPath}delete`)}>
                <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
                    <TbTrash />
                </span>
            </Tooltip>
        </div>
    )
}

const SalesOrderModuleTable = ({
    openDialogCRUD,
    setOpenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    setSearchItem,
    filters,
    setFilters,
    translationPath,
    selectedRows,
    setSelectedRows, // Added to resolve the unused warning
    setShowBatchApprovalDialog,
    showBatchApprovalDialog
}) => {
    const { t } = useTranslation()
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 5,
        sort: [{ id: 'ficheNumber', desc: false }],
        data: [],
        total: 0,
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [loadingTable, setLoading] = useState(false)
    const [showSaveSharedDialog, setShowSaveSharedDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [controls, setControls] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const loadControls = async () => {
            setLoading(true)
            const fetchedControls = await fetchControls(t, translationPath)
            setControls(fetchedControls)
            setLoading(false)
        }
        loadControls()
    }, [t, translationPath])

    const handlePaginationChange = (page) => {
        setTableData((prevState) => ({
            ...prevState,
            pageIndex: page,
        }))
    }

    const handleSelectChange = (value) => {
        setTableData((prevState) => ({
            ...prevState,
            pageSize: Number(value),
            pageIndex: 1,
        }))
    }

    const handleSort = (sort) => {
        if (sort?.key) {
            setTableData((prevState) => ({
                ...prevState,
                sort: [
                    {
                        id: sort.key,
                        desc: sort.order === 'desc',
                    },
                ],
            }))
        } else {
            setTableData((prevState) => ({
                ...prevState,
                sort: [{ id: 'ficheNumber', desc: false }],
            }))
        }
    }
        const fetchData = async () => {
            try {
                setLoading(true)
                const salemanValue = filters.saleman
                const result = await GetOrdersPaging({
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                    sortBy: tableData.sort,
                    searchValue: searchItem || '',
                    trcode: 1,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    saleman: salemanValue ? salemanValue.value : undefined,
                })
                if (result?.data) {
                    setTableData((prev) => ({
                        ...prev,
                        data: result.data,
                        total: result.totalCount || 0,
                    }))
                } else {
                    triggerMessageError(t(`${translationPath}fetchError`))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                triggerMessageError(t(`${translationPath}fetchError`))
            } finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        fetchData()
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
        filters,
    ])

    const columns = useMemo(
        () => [
            {
                header: t(`${translationPath}ficheNumber`),
                accessorKey: 'ficheNumber',
                sortable: true,
                cell: (props) => (
                    <span className="font-bold text-primary">
                        {props.row.original.ficheNumber}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}shippingStatus`),
                accessorKey: 'shippingStatus',
                sortable: true,
                cell: (props) => {
                    const statusValue = props.row.original.shippingStatus
                    let statusText
                    let IconComponent
                    let iconColor
                    let actionLevel

                    switch (true) {
                        case statusValue === 0:
                            statusText = t(`${translationPath}delivered`)
                            IconComponent = FaRegCheckCircle
                            iconColor = 'text-green-500'
                            actionLevel = ActionLevel.Proceed
                            break
                        case statusValue === 1:
                            statusText = t(`${translationPath}partiallyDelivered`)
                            IconComponent = FaRegCircle
                            iconColor = 'text-yellow-500'
                            actionLevel = ActionLevel.Warn
                            break
                        default:
                            statusText = t(`${translationPath}notDelivered`)
                            IconComponent = BsBox
                            iconColor = 'text-red-500'
                            actionLevel = ActionLevel.Block
                    }
                    // switch (statusValue) {
                    //                         case 0:
                    //                             statusText = t(`${translationPath}notDelivered`);
                    //                             IconComponent = BsBox;
                    //                             iconColor = 'text-red-500';
                    //                             break;
                    //                         case 1:
                    //                             statusText = t(`${translationPath}partiallyDelivered`);
                    //                             IconComponent = FaRegCircle;
                    //                             iconColor = 'text-yellow-500';
                    //                             break;
                    //                         case 2:
                    //                             statusText = t(`${translationPath}delivered`);
                    //                             IconComponent = FaRegCheckCircle;
                    //                             iconColor = 'text-green-500';
                    //                             break;
                    //                         default:
                    //                             statusText = t(`${translationPath}unknown`);
                    //                             IconComponent = null;
                    //                             iconColor = 'text-gray-500';
                    //                     }
                    return (
                        <span className="flex items-center gap-2">
                            {IconComponent && <IconComponent className={`text-lg ${iconColor}`} />}
                            <span className="font-bold text-primary">{statusText}</span>
                        </span>
                    )
                },
            },
            {
                header: t(`${translationPath}createdDate`),
                accessorKey: 'createdDate',
                sortable: true,
                cell: (props) => <span>{props.row.original.createdDate}</span>,
            },
            {
                header: t(`${translationPath}warehouse`),
                accessorKey: 'warehouse',
                sortable: true,
                cell: (props) => <span>{props.row.original.warehouse}</span>,
            },
            {
                header: t(`${translationPath}netTotal`),
                accessorKey: 'netTotal',
                sortable: true,
                cell: (props) => <span>{props.row.original.netTotal}</span>,
            },
            {
                header: t(`${translationPath}status`),
                accessorKey: 'status',
                sortable: true,
                cell: (props) => {
                    const status = props.row.original.status

                    let bgColor = ''
                    let textColor = ''
                    let statusTextKey = ''

                    switch (status) {
                        case 4:
                            bgColor = 'bg-green-100'
                            textColor = 'text-green-600'
                            statusTextKey = 'approved'
                            break
                        case 1:
                            bgColor = 'bg-yellow-100'
                            textColor = 'text-yellow-700'
                            statusTextKey = 'proposal'
                            break
                        case 2:
                            bgColor = 'bg-red-100'
                            textColor = 'text-red-600'
                            statusTextKey = 'rejected'
                            break
                        default:
                            bgColor = 'bg-gray-100'
                            textColor = 'text-gray-600'
                            statusTextKey = 'unknown'
                            break
                    }

                    return (
                        <Tag className={bgColor}>
                            <span className={`font-semibold ${textColor}`}>
                                {t(`${translationPath}${statusTextKey}`)}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: t(`${translationPath}actions`),
                id: 'actions',
                cell: (props) => (
                    <ActionColumn
                        row={props.row.original}
                        setOpenDialog={setOpenDialog}
                        setSelectItem={setSelectItem}
                        setShowSaveSharedDialog={setShowSaveSharedDialog}
                        setSelectedOrder={setSelectedOrder}
                        translationPath={translationPath}
                    />
                ),
            },
        ],
        [t, translationPath, ActionLevel],
    )

    const dialogType = {
        type: 'danger',
        title: t(`${translationPath}deleteOrder`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const handleClose = () => setOpenDialog(false)

    const handleOnConfirm = async () => {
        if (!selectItem?.id) return
        try {
            const response = await DeleteOrderById(selectItem.id)
            if (response.success || response.data.success) {
                const updatedData = tableData.data.filter((order) => order.id !== selectItem.id)
                setTableData((prev) => ({
                    ...prev,
                    data: updatedData,
                    total: prev.total - 1,
                }))
                triggerMessageSuccessfully(t(`${translationPath}deleteSuccess`))
            } else {
                triggerMessageError(t(`${translationPath}deleteFailed`))
            }
        } catch (error) {
            console.error('Delete failed:', error)
            triggerMessageError(t(`${translationPath}deleteError`))
        }
        setOpenDialog(false)
        setSelectItem(null)
    }

    const handleSaveSharedDialogConfirm = (data) => {
        if (data.action === 'proceed') {
            navigate(`/SalesOrder/Edit/${selectedOrder.id}`)
        }
    }

    const handleRowSelect = (checked, row) => {
        if (checked) {
            setSelectedRows((prevData) => {
                if (!prevData.some((r) => r.id === row.id)) { // Use id to avoid duplicates
                    return [...prevData, row]
                }
                return prevData
            })
        } else {
            setSelectedRows((prevData) => prevData.filter((r) => r.id !== row.id))
        }
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectedRows(originalRows)
        } else {
            setSelectedRows([])
        }
    }

    return (
        <div className="p-4">
            <ConfirmDialog
                isOpen={openDialog}
                type={dialogType.type}
                title={dialogType.title}
                cancelText={dialogType.cancelText}
                confirmText={dialogType.confirmText}
                onClose={handleClose}
                style={{
                    overlay: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    },
                    content: {
                        width: 'auto',
                        maxWidth: '500px',
                        margin: '0',
                        top: 'auto',
                        bottom: 'auto',
                        transform: 'none',
                    },
                }}
                onRequestClose={handleClose}
                onCancel={handleClose}
                onConfirm={handleOnConfirm}
            >
                <p>{dialogType.children} {selectItem?.ficheNumber || ''}?</p>
            </ConfirmDialog>
            <SaveSharedDialog
                show={showSaveSharedDialog}
                handleClose={() => setShowSaveSharedDialog(false)}
                setFormData={handleSaveSharedDialogConfirm}
                setAlert={triggerMessageSuccessfully}
                controls={controls}
                shippingStatus={selectedOrder?.shippingStatus}
                status={selectedOrder?.status}
                translationPath={translationPath}
            />
            <BatchApprovalDialog
                show={showBatchApprovalDialog}
                handleClose={() => setShowBatchApprovalDialog(false)}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />
            <DataTable
                columns={columns}
                data={tableData.data}
                noData={tableData.data.length === 0}
                loading={loadingTable}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                pageSizes={[5, 10, 25, 50, 100]}
                selectable
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
        </div>
    )
}

export default SalesOrderModuleTable