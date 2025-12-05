import React, { useMemo, useState, useRef, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { useNavigate } from 'react-router-dom'
import Tag from '@/components/ui/Tag'
import { TbEdit, TbTrash, TbDots } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { PiListStar } from 'react-icons/pi'
import { ConfirmDialog } from '@/components/shared'
import PaymentPlanCU from './PaymentPlanCU'
import SharedDialog from '@/components/shared/SharedDialog'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import {
    DeletePaymentPlanById,
    GetAllPaymentPlans,
} from '@/services/ModelSserver/PaymentPlanServices'

const ActionColumn = ({
    row,
    setopenDialog,
    setSelectItem,
    setOpenDialogCRUD,
    setIsEditMode,
    translationPath,
}) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    const handleSelectItem = () => {
        setSelectItem(row || null)
    }

    const onEdit = () => {
        handleSelectItem()
        setOpenDialogCRUD(true)
        setIsEditMode(true)
    }

    const onDelete = () => {
        handleSelectItem()
        setopenDialog(true)
    }

    return (
        <div className="flex justify-start items-center gap-2 text-lg relative">
            <Tooltip wrapperClass="flex" title={t(`${translationPath}edit`)}>
                <div
                    className="cursor-pointer p-2 hover:text-blue-500"
                    onClick={onEdit}
                >
                    <TbEdit />
                </div>
            </Tooltip>
            <Tooltip wrapperClass="flex" title={t(`${translationPath}delete`)}>
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onDelete}
                >
                    <TbTrash />
                </span>
            </Tooltip>
            <Dropdown
                placement="bottom-end"
                open={open}
                onToggle={() => setOpen(!open)}
                renderTrigger={
                    <span className="cursor-pointer p-2 hover:text-gray-600">
                        <TbDots />
                    </span>
                }
            >
                <DropdownItem>
                    <div className="flex items-center gap-2">
                        <PiListStar />
                        <span>{t(`${translationPath}paymentPlanDetails`)}</span>
                    </div>
                </DropdownItem>
            </Dropdown>
        </div>
    )
}

const PaymentPlanListTable = ({
    openDialogCRUD,
    setopenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    translationPath,
}) => {
    const { t } = useTranslation()
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: [{ id: 'id', desc: true }],
        fullData: [],
        data: [],
        total: 0,
    })
    const [openDialog, setopenDialog] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const paymentPlanCURef = useRef(null)
    const isFetchingRef = useRef(false)

    const fetchData = async () => {
        if (isFetchingRef.current) {
            return
        }
        isFetchingRef.current = true
        try {
            const result = await GetAllPaymentPlans()
            if (result?.data) {
                const sortedData = [...result.data].sort((a, b) => b.id - a.id)
                setTableData((prev) => ({
                    ...prev,
                    fullData: sortedData,
                    total: sortedData.length,
                }))
            } else {
                console.warn('No data returned from API')
                triggerMessageError(t(`${translationPath}fetchError`))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            triggerMessageError(t(`${translationPath}fetchError`))
        } finally {
            isFetchingRef.current = false
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        let filteredData = [...tableData.fullData]

        if (searchItem) {
            const lowerSearch = searchItem.toLowerCase()
            filteredData = filteredData.filter(
                (item) =>
                    item.code?.toLowerCase().includes(lowerSearch) ||
                    item.name?.toLowerCase().includes(lowerSearch),
            )
        }

        if (tableData.sort.length > 0) {
            const sort = tableData.sort[0]
            filteredData.sort((a, b) => {
                const aValue = a[sort.id]
                const bValue = b[sort.id]
                if (aValue === null || aValue === undefined)
                    return sort.desc ? -1 : 1
                if (bValue === null || bValue === undefined)
                    return sort.desc ? 1 : -1
                if (aValue < bValue) return sort.desc ? 1 : -1
                if (aValue > bValue) return sort.desc ? -1 : 1
                return 0
            })
        }

        const startIndex = (tableData.pageIndex - 1) * tableData.pageSize
        const paginatedData = filteredData.slice(
            startIndex,
            startIndex + tableData.pageSize,
        )

        setTableData((prev) => ({
            ...prev,
            data: paginatedData,
            total: filteredData.length,
        }))
    }, [
        tableData.fullData,
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
    ])

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
                sort: [{ id: 'id', desc: true }],
            }))
        }
    }

    const columns = useMemo(
        () => [
            {
                header: t(`${translationPath}code`),
                accessorKey: 'code',
                sortable: true,
                cell: (props) => (
                    <span className="font-bold text-primary">
                        {props.row.original.code}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}name`),
                accessorKey: 'name',
                sortable: true,
                cell: (props) => <span>{props.row.original.name}</span>,
            },
            {
                header: t(`${translationPath}status`),
                accessorKey: 'active',
                sortable: true,
                cell: (props) => {
                    const isActive = props.row.original.active === 1
                    return (
                        <Tag
                            className={isActive ? 'bg-green-100' : 'bg-red-100'}
                        >
                            <span
                                className={`font-semibold ${
                                    isActive ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {isActive
                                    ? t(`${translationPath}active`)
                                    : t(`${translationPath}inactive`)}
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
                        setopenDialog={setopenDialog}
                        setSelectItem={setSelectItem}
                        setOpenDialogCRUD={setopenDialogCRUD}
                        setIsEditMode={setIsEditMode}
                        translationPath={translationPath}
                    />
                ),
            },
        ],
        [t, translationPath],
    )

    const dialogType = {
        type: 'danger',
        title: t(`${translationPath}deletePaymentPlan`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editPaymentPlan`)
            : t(`${translationPath}addPaymentPlan`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    }

    const handleClose = () => setopenDialog(false)

    const handleonConfirm = async () => {
        if (!selectItem?.id) return
        try {
            const response = await DeletePaymentPlanById(selectItem.id)
            if (response.success ||response.data.success) {
                fetchData()
                triggerMessageSuccessfully(t(`${translationPath}deleteSuccess`))
            } else {
                triggerMessageError(t(`${translationPath}deleteFailed`))
            }
        } catch (error) {
            triggerMessageError(t(`${translationPath}deleteError`))
        }
        setopenDialog(false)
        setSelectItem(null)
    }

    const handleonConfirmopenDialogCRUD = () => {
        if (paymentPlanCURef.current) {
            paymentPlanCURef.current.submitForm()
        }
    }

    const handleCloseopenDialogCRUD = () => {
        setopenDialogCRUD(false)
        setIsEditMode(false)
        setSelectItem(null)
    }

    const handleSubmitSuccess = (result) => {
        setopenDialogCRUD(false)
        setIsEditMode(false)
        setSelectItem(null)
        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                fullData: prev.fullData.map((plan) =>
                    plan.id === result.id
                        ? { ...plan, ...result.payload }
                        : plan,
                ),
            }))
        } else {
            fetchData()
            setTableData((prev) => ({
                ...prev,
                pageIndex: 1,
                sort: [{ id: 'id', desc: true }],
            }))
        }
        triggerMessageSuccessfully(
            isEditMode
                ? t(`${translationPath}updateSuccess`)
                : t(`${translationPath}createSuccess`),
        )
    }

    return (
        <>
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
                onConfirm={handleonConfirm}
            >
                <p>
                    {dialogType.children} {selectItem?.name || ''}?
                </p>
            </ConfirmDialog>
            <SharedDialog
                isOpen={openDialogCRUD}
                type={dialogTypeCRUD.type}
                title={dialogTypeCRUD.title}
                cancelText={dialogTypeCRUD.cancelText}
                confirmText={dialogTypeCRUD.confirmText}
                onClose={handleCloseopenDialogCRUD}
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
                onRequestClose={handleCloseopenDialogCRUD}
                onCancel={handleCloseopenDialogCRUD}
                onConfirm={handleonConfirmopenDialogCRUD}
            >
                <PaymentPlanCU
                    ref={paymentPlanCURef}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={handleCloseopenDialogCRUD}
                    initialData={selectItem}
                    translationPath={translationPath}
                    isEditMode={isEditMode}
                />
            </SharedDialog>
            <DataTable
                columns={columns}
                data={tableData.data}
                noData={tableData.data.length === 0}
                loading={isFetchingRef.current}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </>
    )
}

export default PaymentPlanListTable
