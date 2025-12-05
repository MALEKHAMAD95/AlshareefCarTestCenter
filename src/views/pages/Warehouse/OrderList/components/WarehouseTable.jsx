import React, { useMemo, useState, useRef, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { useNavigate } from 'react-router-dom'
import { TbEye, TbEdit, TbTrash, TbDots } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { PiListStar } from 'react-icons/pi'
import { ConfirmDialog } from '@/components/shared'
import SharedDialog from '@/components/shared/SharedDialog'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import WarehouseCU from './WarehouseCU'
import {
    DeleteWarehouseById,
    GetWarehousePaging,
} from '@/services/ModelSserver/WarehouseServices'

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

    const onView = () => {
        handleSelectItem()
        navigate(`/Warehouses/view/${row.id}`)
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
            {/* <Tooltip wrapperClass="flex" title={t(`${translationPath}view`)}>
                <span
                    className="cursor-pointer p-2 hover:text-primary"
                    onClick={onView}
                >
                    <TbEye />
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
                        <span>{t(`${translationPath}warehouseDetails`)}</span>
                    </div>
                </DropdownItem>
            </Dropdown> */}
        </div>
    )
}

const WarehouseListTable = ({
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
        sort: [],
        data: [],
        total: 0,
    })
    const [openDialog, setopenDialog] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const warehouseCURef = useRef(null)
    const isFetchingRef = useRef(false)

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
                sort: [],
            }))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (isFetchingRef.current) return
            isFetchingRef.current = true
            try {
                const result = await GetWarehousePaging({
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                    sortBy: tableData.sort,
                    searchValue: searchItem || '',
                })
                if (result?.data) {
                    setTableData((prev) => ({
                        ...prev,
                        data: result.data,
                        total: result.totalCount || 0,
                    }))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                triggerMessageError(t(`${translationPath}fetchError`))
            }
            isFetchingRef.current = false
        }
        fetchData()
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
        t,
        translationPath,
    ])

    useEffect(() => {
        setTableData((prev) => ({
            ...prev,
            sort: [{ id: 'id', desc: false }],
        }))
    }, [])

    const columns = useMemo(
        () => [
            {
                header: t(`${translationPath}id`),
                accessorKey: 'id',
                sortable: true,
                cell: (props) => (
                    <span className="font-bold text-primary">
                        {props.row.original.id}
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
                header: t(`${translationPath}warehouseNumber`),
                accessorKey: 'warehouseNumber',
                sortable: true,
                cell: (props) => (
                    <span>{props.row.original.warehouseNumber}</span>
                ),
            },
            {
                header: t(`${translationPath}costGroup`),
                accessorKey: 'costGroup',
                sortable: true,
                cell: (props) => <span>{props.row.original.costGroup}</span>,
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
        title: t(`${translationPath}deleteWarehouse`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editWarehouse`)
            : t(`${translationPath}addWarehouse`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    }

    const handleClose = () => setopenDialog(false)

    const handleonConfirm = async () => {
        if (!selectItem?.id) return
        try {
            const response = await DeleteWarehouseById(selectItem.id)
            if (response.success ||response.data.success) {
                const updatedData = tableData.data.filter(
                    (warehouse) => warehouse.id !== selectItem.id,
                )
                setTableData((prev) => ({ ...prev, data: updatedData }))
                triggerMessageSuccessfully(t(`${translationPath}deleteSuccess`))
            } else {
                triggerMessageError(t(`${translationPath}deleteFailed`))
            }
        } catch (error) {
            console.error('Delete failed:', error)
            triggerMessageError(t(`${translationPath}deleteError`))
        }
        setopenDialog(false)
        setSelectItem(null)
    }

    const handleonConfirmopenDialogCRUD = () => {
        if (warehouseCURef.current) {
            warehouseCURef.current.submitForm()
        }
    }

    const handleCloseopenDialogCRUD = () => {
        setopenDialogCRUD(false)
        setIsEditMode(false)
    }

    const handleSubmitSuccess = (updatedWarehouse) => {
        setopenDialogCRUD(false)
        setIsEditMode(false)

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((warehouse) =>
                    warehouse.id === updatedWarehouse.id
                        ? { ...warehouse, ...updatedWarehouse.payload }
                        : warehouse,
                ),
            }))
        } else {
            setTableData((prev) => ({
                ...prev,
                data: [
                    { id: updatedWarehouse.id, ...updatedWarehouse.payload },
                    ...prev.data,
                ],
                total: prev.total + 1,
            }))
        }
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
                <WarehouseCU
                    ref={warehouseCURef}
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

export default WarehouseListTable
