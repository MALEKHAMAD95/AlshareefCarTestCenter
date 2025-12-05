import React, { useEffect, useMemo, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import SharedDialog from '@/components/shared/SharedDialog'
import {
    triggerMessageSuccessfully,
    triggerMessageError,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import {
    getLookupsByLookupTypeId,
    createLookup,
    updateLookup,
    deleteLookup,
} from '@/services/SiteServices/LookupService'
import LookupCU from './LookupCU'
import { FcEditImage, FcDeleteRow, FcPlus } from 'react-icons/fc'
import { TbSearch } from 'react-icons/tb'
import { DebouceInput } from '@/components/shared'

const LookupTable = () => {
    const { t } = useTranslation()
    const translationPath = 'views.Lookup.'
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        Data: [],
    })
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [deleteId, setDeleteId] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getLookupsByLookupTypeId(1, {
                page: tableData.pageIndex,
                pageSize: tableData.pageSize,
                sort: tableData.sort || [],
            })
            setTableData({
                total: res?.data?.total || 0,
                pageIndex: res?.data?.pageIndex || 1,
                pageSize: res?.data?.pageSize || 10,
                Data: res?.data?.Data || [
                    {
                        id: 1,
                        name: 'Toyota',
                        parentLookupId: null,
                        lookupTypeId: 1,
                        lookupIconUrl: 'https://example.com/icons/toyota.png',
                    },
                ],
            })
        } catch (e) {
            console.error('Error fetching data:', e)
            setTableData({
                total: 0,
                pageIndex: 1,
                pageSize: 10,
                Data: [
                    {
                        id: 1,
                        name: 'Toyota',
                        parentLookupId: null,
                        lookupTypeId: 1,
                        lookupIconUrl: 'https://example.com/icons/toyota.png',
                    },
                ],
            })
            triggerMessageError(t(`${translationPath}errorLoadingTableData`))
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [tableData.pageIndex, tableData.pageSize, tableData.sort])

    const handleEdit = (item) => {
        setEditItem(item)
        setOpenDialog(true)
    }

    const handleDelete = async () => {
        try {
            await deleteLookup(deleteId)
            triggerMessageSuccessfully(
                t(`${translationPath}deletedSuccessfully`),
            )
            fetchData()
        } catch (e) {
            triggerMessageError(t(`${translationPath}deleteFailed`))
        }
        setDeleteId(null)
    }

    const handlePaginationChange = (page) => {
        setTableData((prev) => ({
            ...prev,
            pageIndex: page,
        }))
    }

    const handleSelectChange = (value) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
    }

    const handleCreate = () => {
        setEditItem(null)
        setOpenDialog(true)
    }

    const handleDialogSave = async (values) => {
        try {
            if (editItem) {
                await updateLookup(editItem.id, values)
                triggerMessageSuccessfully(
                    t(`${translationPath}updatedSuccessfully`),
                )
            } else {
                await createLookup(values)
                triggerMessageSuccessfully(
                    t(`${translationPath}createdSuccessfully`),
                )
            }
            setOpenDialog(false)
            fetchData()
        } catch (e) {
            triggerMessageError(t(`${translationPath}saveFailed`))
        }
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

    const handleCloseDeleteDialog = () => {
        setDeleteId(null)
    }

    const dialogType = {
        type: 'danger',
        title: t(`${translationPath}deleteLookup`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const columns = useMemo(
        () => [
            { header: t(`${translationPath}id`), accessorKey: 'id' },
            { header: t(`${translationPath}name`), accessorKey: 'name' },
            {
                header: t(`${translationPath}type`),
                accessorKey: 'lookupTypeId',
            },
            {
                header: t(`${translationPath}parent`),
                accessorKey: 'parentLookupId',
            },
            {
                header: t(`${translationPath}actions`),
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => handleEdit(row.original)}
                            className="flex items-center gap-1"
                            title={t(`${translationPath}edit`)}
                        >
                            <FcEditImage size={20} />
                        </Button>
                        <button
                            size="sm"
                            color="red"
                            onClick={() => setDeleteId(row.original.id)}
                            className="flex items-center gap-1"
                            title={t(`${translationPath}delete`)}
                        >
                            <FcDeleteRow size={20} />
                        </button>
                    </div>
                ),
            },
        ],
        [t],
    )

    return (
        <div className="  rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2   mb-4">
                <div className=" md:w-1/3">
                    <DebouceInput
                        placeholder={t(`${translationPath}Search`)}
                        suffix={<TbSearch className="text-lg" />}
                        // onChange={handleInputChange}
                        wait={2000} 
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    className="flex items-center gap-1"
                    title={t(`${translationPath}add`)}
                >
                    <FcPlus size={16} />
                    {t(`${translationPath}add`)}
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={tableData.Data}
                noData={tableData.Data.length === 0}
                loading={loading}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <SharedDialog
                isOpen={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <LookupCU
                    initialData={editItem}
                    onSave={handleDialogSave}
                    onCancel={() => setOpenDialog(false)}
                />
            </SharedDialog>
            <SharedDialog
                isOpen={!!deleteId}
                type={dialogType.type}
                title={dialogType.title}
                cancelText={dialogType.cancelText}
                confirmText={dialogType.confirmText}
                onClose={handleCloseDeleteDialog}
                onRequestClose={handleCloseDeleteDialog}
                onCancel={handleCloseDeleteDialog}
                onConfirm={handleDelete}
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
            >
                <p className="text-gray-900 dark:text-gray-100">
                    {dialogType.children}
                </p>
            </SharedDialog>
        </div>
    )
}

export default LookupTable
