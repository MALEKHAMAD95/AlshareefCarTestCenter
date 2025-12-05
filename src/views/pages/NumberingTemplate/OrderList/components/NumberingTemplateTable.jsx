import React, { useMemo, useState, useRef, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
import { TbEdit, TbTrash, TbDots } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown } from '@/components/ui'
import { PiListStar } from 'react-icons/pi'
import { ConfirmDialog } from '@/components/shared'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import {
    DeleteNumberingTemplateById,
    GetNumberingTemplatesPaging,
} from '@/services/ModelSserver/NumberingTemplateServices'
import SharedDialog from '@/components/shared/SharedDialog'
import { useNavigate } from 'react-router-dom'

const ActionColumn = ({
    row,
    setopenDialog,
    setSelectItem,
    setOpenDialogCRUD,
    setIsEditMode,
    translationPath,
}) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleSelectItem = () => {
        setSelectItem(row || null)
    }

    const onEdit = () => {
        navigate(`/NumberingTemplate/Edit/${row.id}`)
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
        </div>
    )
}

const NumberingTemplateTable = ({
    openDialogCRUD,
    setopenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    filters,
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
    const templateCURef = useRef(null)
    const isFetchingRef = useRef(false)

    const fetchData = async () => {
        if (isFetchingRef.current) return
        isFetchingRef.current = true
        try {
            const params = {
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
                sortBy: tableData.sort,
                searchValue: searchItem || '',
                trcode: filters.trcode ? parseInt(filters.trcode) : undefined,
                userId: filters.userId ? parseInt(filters.userId) : undefined,
                warehouseId: filters.warehouseId
                    ? parseInt(filters.warehouseId)
                    : undefined,
                firmNumber: filters.firmNumber
                    ? parseInt(filters.firmNumber)
                    : undefined,
                searchDate: filters.searchDate || undefined,
            }
            const result = await GetNumberingTemplatesPaging(params)
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

    useEffect(() => {
        fetchData()
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
        filters,
    ])

    useEffect(() => {
        setTableData((prev) => ({
            ...prev,
            sort: [{ id: 'trcode', desc: false }],
        }))
    }, [])

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

    const columns = useMemo(
        () => [
            {
                header: t(`${translationPath}trcode`),
                accessorKey: 'trcode',
                sortable: true,
                cell: (props) => (
                    <span className="font-bold text-primary">
                        {props.row.original.trcode}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}value`),
                accessorKey: 'value',
                sortable: true,
                cell: (props) => <span>{props.row.original.value}</span>,
            },
            {
                header: t(`${translationPath}startDate`),
                accessorKey: 'startDate',
                sortable: true,
                cell: (props) => (
                    <span>
                        {new Date(
                            props.row.original.startDate,
                        ).toLocaleDateString()}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}endDate`),
                accessorKey: 'endDate',
                sortable: true,
                cell: (props) => (
                    <span>
                        {new Date(
                            props.row.original.endDate,
                        ).toLocaleDateString()}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}firmNumber`),
                accessorKey: 'firmNumber',
                sortable: true,
                cell: (props) => <span>{props.row.original.firmNumber}</span>,
            },
            {
                header: t(`${translationPath}priority`),
                accessorKey: 'priority',
                sortable: true,
                cell: (props) => <span>{props.row.original.priority}</span>,
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
        title: t(`${translationPath}deleteNumberingTemplate`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editNumberingTemplate`)
            : t(`${translationPath}addNumberingTemplate`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    }

    const handleClose = () => setopenDialog(false)

    const handleonConfirm = async () => {
        if (!selectItem?.id) return
        try {
            const response = await DeleteNumberingTemplateById(selectItem.id)
            if (response.success ||response.data.success) {
                fetchData()
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
        if (templateCURef.current) {
            templateCURef.current.submitForm()
        }
    }

    const handleCloseopenDialogCRUD = () => {
        setopenDialogCRUD(false)
        setIsEditMode(false)
    }

    const handleSubmitSuccess = (updatedTemplate) => {
        setopenDialogCRUD(false)
        setIsEditMode(false)

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((template) =>
                    template.id === updatedTemplate.id
                        ? { ...template, ...updatedTemplate.payload }
                        : template,
                ),
            }))
        } else {
            fetchData()
            setTableData((prev) => ({
                ...prev,
                pageIndex: Math.ceil((prev.total + 1) / prev.pageSize),
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
                    {dialogType.children} {selectItem?.value || ''}?
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
            ></SharedDialog>
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

export default NumberingTemplateTable
