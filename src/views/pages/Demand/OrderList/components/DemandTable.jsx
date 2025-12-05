import React, { useMemo, useState, useRef, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import Tooltip from '@/components/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import Tag from '@/components/ui/Tag';
import { TbEye, TbEdit, TbTrash } from 'react-icons/tb';
import { ConfirmDialog } from '@/components/shared';
import SharedDialog from '@/components/shared/SharedDialog';
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
// Replace with your actual API service
import { GetDemandsPaging, DeleteDemandById } from '@/services/ModelSserver/DemandServices';
import DemandCU from './DemandCU';

const ActionColumn = ({
    row,
    setOpenDialog,
    setSelectItem,
    setOpenDialogCRUD,
    setIsEditMode,
    translationPath,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSelectItem = () => {
        setSelectItem(row || null);
    };

    const onView = () => {
        handleSelectItem();
        navigate(`/Demand/view/${row.id}`);
    };

    const onEdit = () => {
        navigate(`/Demand/Edit/${row.id}`);
    };
    const onDelete = () => {
        handleSelectItem();
        setOpenDialog(true);
    };

    return (
        <div className="flex justify-start items-center gap-2 text-lg">
            {/* <Tooltip wrapperClass="flex" title={t(`${translationPath}view`)}>
                <div
                    className="cursor-pointer p-2 hover:text-blue-500"
                    onClick={onView}
                >
                    <TbEye />
                </div>
            </Tooltip> */}
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
    );
};

const DemandTable = ({
    openDialogCRUD,
    setOpenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    translationPath,
}) => {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 5,
        sort: [],
        data: [],
        total: 0,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const bankCURef = useRef(null);
    const navigate = useNavigate();
    const isFetchingRef = useRef(false);

    const handlePaginationChange = (page) => {
        setTableData((prevState) => ({
            ...prevState,
            pageIndex: page,
        }));
    };

    const handleSelectChange = (value) => {
        setTableData((prevState) => ({
            ...prevState,
            pageSize: Number(value),
            pageIndex: 1,
        }));
    };

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
            }));
        } else {
            setTableData((prevState) => ({
                ...prevState,
                sort: [],
            }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            try {
                const result = await GetDemandsPaging({
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                    sortBy: tableData.sort,
                    searchValue: searchItem || '',
                });
                if (result?.success && result?.data) {
                    setTableData((prev) => ({
                        ...prev,
                        data: result.data,
                        total: result.totalCount || 0,
                        pageIndex: result.currentPage,
                        pageSize: result.pageSize,
                    }));
                } else {
                    triggerMessageError(t(`${translationPath}fetchError`));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                triggerMessageError(t(`${translationPath}fetchError`));
            }
            isFetchingRef.current = false;
        };
        fetchData();
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort,
        searchItem,
        t,
        translationPath,
    ]);

    // Set default sort (optional)
    useEffect(() => {
        setTableData((prev) => ({
            ...prev,
            sort: [{ id: 'slipNumber', desc: false }],
        }));
    }, []);

    const columns = useMemo(
        () => [
            {
                header: t(`${translationPath}slipNumber`),
                accessorKey: 'slipNumber',
                sortable: true,
                cell: (props) => (
                    <span className="font-bold text-primary">
                        {props.row.original.slipNumber}
                    </span>
                ),
            },
            {
                header: t(`${translationPath}date`),
                accessorKey: 'date',
                sortable: true,
                cell: (props) => {
                    const date = props.row.original.date;
                    return date
                        ? new Date(date).toLocaleDateString('en-CA') // Outputs YYYY-MM-DD
                        : '-';
                },
            },
            {
                header: t(`${translationPath}time`),
                accessorKey: 'time',
                sortable: true,
                cell: (props) => <span>{props.row.original.time || '-'}</span>,
            },
            {
                header: t(`${translationPath}documentNumber`),
                accessorKey: 'documentNumber',
                sortable: true,
                cell: (props) => <span>{props.row.original.documentNumber || '-'}</span>,
            },
            {
                header: t(`${translationPath}status`),
                accessorKey: 'status',
                sortable: true,
                cell: (props) => {
                    const status = props.row.original.status;
                    const isActive = status === 1; // Assuming 1 = Active, 0 = Inactive
                    return (
                        <Tag
                            className={isActive ? 'bg-green-100' : 'bg-red-100'}
                        >
                            <span
                                className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {isActive
                                    ? t(`${translationPath}active`)
                                    : t(`${translationPath}inactive`)}
                            </span>
                        </Tag>
                    );
                },
            },
            {
                header: t(`${translationPath}warehouse`),
                accessorKey: 'warehouse',
                sortable: true,
                cell: (props) => <span>{props.row.original.warehouse || '-'}</span>,
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
        [t, translationPath]
    );

    const dialogType = {
        type: 'danger',
        title: t(`${translationPath}deleteDemand`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    };

    const dialogTypeCRUD = {
        title: isEditMode
            ? t(`${translationPath}editDemand`)
            : t(`${translationPath}addDemand`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode
            ? t(`${translationPath}update`)
            : t(`${translationPath}create`),
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectItem(null);
    };

    const handleOnConfirm = async () => {
        if (!selectItem?.id) return;
        try {
            const response = await DeleteDemandById(selectItem.id);
            if (response.success ||response.data.success) {
                const updatedData = tableData.data.filter(
                    (item) => item.id !== selectItem.id
                );
                setTableData((prev) => ({
                    ...prev,
                    data: updatedData,
                    total: prev.total - 1,
                }));
                triggerMessageSuccessfully(t(`${translationPath}deleteSuccess`));
            } else {
                triggerMessageError(t(`${translationPath}deleteFailed`));
            }
        } catch (error) {
            console.error('Delete failed:', error);
            triggerMessageError(t(`${translationPath}deleteError`));
        }
        setOpenDialog(false);
        setSelectItem(null);
    };

    const handleOnConfirmOpenDialogCRUD = () => {
        if (bankCURef.current) {
            bankCURef.current.submitForm();
        }
    };

    const handleCloseOpenDialogCRUD = () => {
        setOpenDialogCRUD(false);
        setIsEditMode(false);
        setSelectItem(null);
    };

    const handleSubmitSuccess = (updatedItem) => {
        setOpenDialogCRUD(false);
        setIsEditMode(false);
        setSelectItem(null);

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((item) =>
                    item.id === updatedItem.id
                        ? { ...item, ...updatedItem.payload }
                        : item
                ),
            }));
        } else {
            setTableData((prev) => ({
                ...prev,
                data: [
                    { id: updatedItem.id, ...updatedItem.payload },
                    ...prev.data,
                ],
                total: prev.total + 1,
            }));
        }
    };

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
                onConfirm={handleOnConfirm}
            >
                <p>
                    {dialogType.children} {selectItem?.slipNumber || ''}?
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
                <DemandCU
                    ref={bankCURef}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={handleCloseOpenDialogCRUD}
                    initialData={selectItem}
                    translationPath={translationPath}
                    isEditMode={isEditMode}
                />
            </SharedDialog>
            <DataTable
                className="text-sm [&_td]:py-1 [&_th]:py-2"
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
    );
};

export default DemandTable;