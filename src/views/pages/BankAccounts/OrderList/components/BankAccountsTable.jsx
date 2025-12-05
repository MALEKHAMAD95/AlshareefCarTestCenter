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
import SharedDialog from '@/components/shared/SharedDialog'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import BankAccountsCU from './BankAccountsCU'
import {
    DeleteBankAccountById,
    GetAllBanks,
} from '@/services/ModelSserver/BankAccountServices'

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
                        <span>{t(`${translationPath}bankAccountDetails`)}</span>
                    </div>
                </DropdownItem>
            </Dropdown>
        </div>
    )
}

const BankAccountsTable = ({
    openDialogCRUD,
    setopenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    translationPath,
    bankId,
}) => {
    const { t } = useTranslation()
    const [tableData, setTableData] = useState({
        sort: [],
        data: [],
    })
    const [openDialog, setopenDialog] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const bankCURef = useRef(null)
    const navigate = useNavigate()
    const isFetchingRef = useRef(false)

    const fetchData = async () => {
        if (isFetchingRef.current) return
        isFetchingRef.current = true
        try {
            const result = await GetAllBanks(bankId)
            if (result?.data) {
                let data = result.data
                // Apply client-side search
                if (searchItem) {
                    const lowerSearch = searchItem.toLowerCase()
                    data = data.filter(
                        (item) =>
                            item.code?.toLowerCase().includes(lowerSearch) ||
                            item.name?.toLowerCase().includes(lowerSearch) ||
                            item.accountNo?.toLowerCase().includes(lowerSearch) ||
                            item.iban?.toLowerCase().includes(lowerSearch)
                    )
                }
                // Apply client-side sorting
                if (tableData.sort.length > 0) {
                    const { id, desc } = tableData.sort[0]
                    data = [...data].sort((a, b) => {
                        const valA = a[id] ?? ''
                        const valB = b[id] ?? ''
                        if (typeof valA === 'string') {
                            return desc
                                ? valB.localeCompare(valA)
                                : valA.localeCompare(valB)
                        }
                        return desc ? valB - valA : valA - valB
                    })
                }
                setTableData((prev) => ({
                    ...prev,
                    data,
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
    }, [searchItem, tableData.sort, bankId])

    useEffect(() => {
        setTableData((prev) => ({
            ...prev,
            sort: [{ id: 'code', desc: false }],
        }))
    }, [])

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
                header: t(`${translationPath}accountNo`),
                accessorKey: 'accountNo',
                sortable: true,
                cell: (props) => <span>{props.row.original.accountNo}</span>,
            },
            {
                header: t(`${translationPath}iban`),
                accessorKey: 'iban',
                sortable: true,
                cell: (props) => <span>{props.row.original.iban}</span>,
            },
            {
                header: t(`${translationPath}bankType`),
                accessorKey: 'bankType',
                sortable: true,
                cell: (props) => {
                    const bankType = props.row.original.bankType
                    const bankTypeOptions = [
                        { value: 0, label: t(`${translationPath}mainBank`) },
                        { value: 1, label: t(`${translationPath}branchBank`) },
                        { value: 2, label: t(`${translationPath}savings`) },
                    ]
                    return <span>{bankTypeOptions.find(opt => opt.value === bankType)?.label || bankType}</span>
                },
            },
            {
                header: t(`${translationPath}currency`),
                accessorKey: 'currency',
                sortable: true,
                cell: (props) => {
                    const currency = props.row.original.currency
                    const currencyOptions = [
                        { value: 0, label: '$' },
                        { value: 1, label: 'JD' },
                        { value: 2, label: 'EUR' },
                        { value: 3, label: 'TRY' },
                        { value: 4, label: 'ILS' },
                    ]
                    return <span>{currencyOptions.find(opt => opt.value === currency)?.label || currency}</span>
                },
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
        title: t(`${translationPath}deleteBankAccount`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    }

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editBankAccount`)
            : t(`${translationPath}addBankAccount`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    }

    const handleClose = () => setopenDialog(false)

    const handleonConfirm = async () => {
        if (!selectItem?.id) return
        try {
            const response = await DeleteBankAccountById(selectItem.id)
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
        if (bankCURef.current) {
            bankCURef.current.submitForm()
        }
    }

    const handleCloseopenDialogCRUD = () => {
        setopenDialogCRUD(false)
        setIsEditMode(false)
    }

    const handleSubmitSuccess = (updatedBank) => {
        setopenDialogCRUD(false)
        setIsEditMode(false)

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((bank) =>
                    bank.id === updatedBank.id
                        ? { ...bank, ...updatedBank.payload }
                        : bank,
                ),
            }))
        } else {
            fetchData()
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
                <BankAccountsCU
                    ref={bankCURef}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={handleCloseopenDialogCRUD}
                    initialData={selectItem}
                    translationPath={translationPath}
                    isEditMode={isEditMode}
                    bankId={bankId}
                />
            </SharedDialog>
            <DataTable
                columns={columns}
                data={tableData.data}
                noData={tableData.data.length === 0}
                loading={isFetchingRef.current}
                onSort={handleSort}
            />
        </>
    )
}

export default BankAccountsTable