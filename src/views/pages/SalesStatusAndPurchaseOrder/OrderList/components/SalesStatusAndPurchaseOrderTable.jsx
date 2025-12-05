import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import Tooltip from '@/components/ui/Tooltip';
import Tag from '@/components/ui/Tag';
import { TbEye, TbEdit, TbTrash, TbDots } from 'react-icons/tb';
import DropdownItem from '@/components/ui/Dropdown/DropdownItem';
import { Dropdown } from '@/components/ui';
import { PiListStar } from 'react-icons/pi';
import { ConfirmDialog } from '@/components/shared';
import SalesStatusAndPurchaseOrderCU from './SalesStatusAndPurchaseOrderCU';
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    GetOrderStatusPaging,
    DeleteOrderStatusById,
} from '@/services/ModelSserver/OrderStatusServices';
import SharedDialog from '@/components/shared/SharedDialog';

const ActionColumn = ({
    row,
    setOpenDialog,
    setSelectItem,
    setOpenDialogCRUD,
    setIsEditMode,
    translationPath,
}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const handleSelectItem = () => {
        setSelectItem(row || null);
    };

    const onEdit = () => {
        handleSelectItem();
        setOpenDialogCRUD(true);
        setIsEditMode(true);
    };

    const onDelete = () => {
        handleSelectItem();
        setOpenDialog(true);
    };

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
    );
};

const SalesStatusAndPurchaseOrderTable = ({
    openDialogCRUD,
    setOpenDialogCRUD,
    selectItem,
    setSelectItem,
    searchItem,
    translationPath,
    orderStatusType,
}) => {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: [],
        data: [],
        total: 0,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const orderStatusCURef = useRef(null);
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
                const result = await GetOrderStatusPaging({
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                    sortBy: tableData.sort,
                    searchValue: searchItem || '',
                    orderStatusType, // Pass the dynamic type (1 or 2)
                });
                if (result?.data) {
                    setTableData((prev) => ({
                        ...prev,
                        data: result.data,
                        total: result.totalCount || 0,
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                triggerMessageError(t(`${translationPath}fetchError`));
            }
            isFetchingRef.current = false;
        };
        fetchData();
    }, [tableData.pageIndex, tableData.pageSize, tableData.sort, searchItem, orderStatusType, t, translationPath]);

    const columns = useMemo(
        () => [
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
                    const isActive = props.row.original.active;
                    return (
                        <Tag className={isActive ? 'bg-green-100' : 'bg-red-100'}>
                            <span
                                className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {isActive ? t(`${translationPath}active`) : t(`${translationPath}inactive`)}
                            </span>
                        </Tag>
                    );
                },
            },
            {
                header: t(`${translationPath}isDefault`),
                accessorKey: 'isDefault',
                sortable: true,
                cell: (props) => (
                    <span>{props.row.original.isDefault ? t(`${translationPath}yes`) : t(`${translationPath}no`)}</span>
                ),
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
    );

    const dialogType = {
        type: 'danger',
        title: t(`${translationPath}deleteOrderStatus`),
        children: t(`${translationPath}confirmDelete`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: t(`${translationPath}delete`),
    };

    const dialogTypeCRUD = {
        title: isEditMode ? t(`${translationPath}editOrderStatus`) : t(`${translationPath}addOrderStatus`),
        cancelText: t(`${translationPath}cancel`),
        confirmText: isEditMode ? t(`${translationPath}update`) : t(`${translationPath}create`),
    };

    const handleClose = () => setOpenDialog(false);

    const handleOnConfirm = async () => {
        if (!selectItem?.id) return;
        try {
            const response = await DeleteOrderStatusById(selectItem.id);
            if (response.success ||response.data.success) {
                const updatedData = tableData.data.filter((item) => item.id !== selectItem.id);
                setTableData((prev) => ({ ...prev, data: updatedData }));
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
        if (orderStatusCURef.current) {
            orderStatusCURef.current.submitForm();
        }
    };

    const handleCloseOpenDialogCRUD = () => {
        setOpenDialogCRUD(false);
        setIsEditMode(false);
    };

    const handleSubmitSuccess = (updatedStatus) => {
        setOpenDialogCRUD(false);
        setIsEditMode(false);

        if (isEditMode) {
            setTableData((prev) => ({
                ...prev,
                data: prev.data.map((status) =>
                    status.id === updatedStatus.id ? { ...status, ...updatedStatus.payload } : status,
                ),
            }));
        } else {
            setTableData((prev) => ({
                ...prev,
                data: [{ id: updatedStatus.id, ...updatedStatus.payload }, ...prev.data],
                total: prev.total + 1,
            }));
        }

        navigate(`/OrderStatus/${orderStatusType === 1 ? 'sales' : 'purchase'}`);
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
                    overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
                    content: { width: 'auto', maxWidth: '500px', margin: '0', top: 'auto', bottom: 'auto', transform: 'none' },
                }}
                onRequestClose={handleClose}
                onCancel={handleClose}
                onConfirm={handleOnConfirm}
            >
                <p>{dialogType.children} {selectItem?.name || ''}?</p>
            </ConfirmDialog>
            <SharedDialog
                isOpen={openDialogCRUD}
                type={dialogTypeCRUD.type}
                title={dialogTypeCRUD.title}
                cancelText={dialogTypeCRUD.cancelText}
                confirmText={dialogTypeCRUD.confirmText}
                onClose={handleCloseOpenDialogCRUD}
                style={{
                    overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
                    content: { width: 'auto', maxWidth: '500px', margin: '0', top: 'auto', bottom: 'auto', transform: 'none' },
                }}
                onRequestClose={handleCloseOpenDialogCRUD}
                onCancel={handleCloseOpenDialogCRUD}
                onConfirm={handleOnConfirmOpenDialogCRUD}
            >
                <SalesStatusAndPurchaseOrderCU
                    ref={orderStatusCURef}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={handleCloseOpenDialogCRUD}
                    initialData={selectItem}
                    translationPath={translationPath}
                    isEditMode={isEditMode}
                    orderStatusType={orderStatusType}
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
    );
};

export default SalesStatusAndPurchaseOrderTable;