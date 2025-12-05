import React, { useMemo, useState, useRef, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { useNavigate } from 'react-router-dom'
import { TbEdit, TbTrash } from 'react-icons/tb'
import { ConfirmDialog } from '@/components/shared'
import MarkCU from './MarkCU'
import SharedDialog from '@/components/shared/SharedDialog'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import {
    DeleteMarkById,
    GetMarksPaging,
} from '@/services/ModelSserver/MarkServices'

const ActionColumn = ({
    row,
    setOpenDialog,
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
        setOpenDialog(true)
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

const MarkListTable = ({
    openDialogCRUD,
    setOpenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    translationPath,
}) => {
    const { t } = useTranslation()
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: [{ id: 'code', desc: false }],
        data: [],
        total: 0,
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false) // Added loading state
    const [isEditMode, setIsEditMode] = useState(false)
    const markCURef = useRef(null)
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            setLoadingTable(true) // Set loading to true before fetching
            const result = await GetMarksPaging({
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
            } else {
                triggerMessageError(t(`${translationPath}fetchError`))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            triggerMessageError(t(`${translationPath}fetchError`))
        } finally {
            setLoadingTable(false) // Reset loading state
        }
    }

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
                sort: [{ id: 'code', desc: false }],
            }))
        }
    }

    useEffect(() => {
        fetchData()
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
        t,
        translationPath,
    ])

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
                header: t(`${translationPath}thename`),
                accessorKey: 'name',
                sortable: true,
                cell: (props) => <span>{props.row.original.name}</span>,
            },
            {
                header: t(`${translationPath}actions`),
                id: 'actions',
                cell: (props) => (
                    <ActionColumn
                        row={props.row.original}
                        setOpenDialog={setOpenDialog}
                        setSelectItem={setSelectItem}
                        setOpenDialogCRUD={setOpenDialogCRUD}
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
        title: t(`${translationPath}deleteMark`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editMark`)
            : t(`${translationPath}addMark`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    }

    const handleClose = () => setOpenDialog(false)

    const handleOnConfirm = async () => {
        if (!selectItem?.id) return
        try {
            setLoadingTable(true) // Set loading during delete
            const response = await DeleteMarkById(selectItem.id)
            if (response.success || response.data.success) {
                const updatedData = tableData.data.filter(
                    (mark) => mark.id !== selectItem.id,
                )
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
        } finally {
            setLoadingTable(false)
            setOpenDialog(false)
            setSelectItem(null)
        }
    }

    const handleOnConfirmOpenDialogCRUD = () => {
        if (markCURef.current) {
            markCURef.current.submitForm()
        }
    }

    const handleCloseOpenDialogCRUD = () => {
        setOpenDialogCRUD(false)
        setIsEditMode(false)
    }

    const handleSubmitSuccess = (updatedMark) => {
        setOpenDialogCRUD(false)
        setIsEditMode(false)

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((mark) =>
                    mark.id === updatedMark.id
                        ? { ...mark, ...updatedMark.payload }
                        : mark,
                ),
            }))
        } else {
            setTableData((prev) => {
                const newTotal = prev.total + 1
                const lastPage = Math.ceil(newTotal / prev.pageSize)
                return {
                    ...prev,
                    pageIndex: lastPage,
                    total: newTotal,
                }
            })
            fetchData() 
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
                onClose={handleCloseOpenDialogCRUD}
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
                onRequestClose={handleCloseOpenDialogCRUD}
                onCancel={handleCloseOpenDialogCRUD}
                onConfirm={handleOnConfirmOpenDialogCRUD}
            >
                <MarkCU
                    ref={markCURef}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={handleCloseOpenDialogCRUD}
                    initialData={selectItem}
                    translationPath={translationPath}
                    isEditMode={isEditMode}
                />
            </SharedDialog>
            <DataTable
                columns={columns}
                data={tableData.data}
                noData={tableData.data.length === 0 && !loadingTable} 
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
            />
        </div>
    )
}

export default MarkListTable
