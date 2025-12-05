import React, { useMemo, useState, useRef, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import Tooltip from '@/components/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import Tag from '@/components/ui/Tag';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/shared';
import {
  triggerMessageError,
  triggerMessageSuccessfully,
} from '@/components/shared/ToastMange';
import { DeleteMainUnitById, GetMainUnitsPaging } from '@/services/ModelSserver/MainUnitServices';

const ActionColumn = ({
  row,
  setopenDialog,
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


  const onEdit = () => {
    navigate(`/MainUnit/Edit/${row.id}`);
  };
  const onDelete = () => {
    handleSelectItem();
    setopenDialog(true);
  };

  return (
    <div className="flex justify-start items-center gap-2 text-lg">
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

const MainUnitTable = ({
  openDialogCRUD,
  setopenDialogCRUD,
  selectItem,
  setSelectItem,
  searchItem,
  translationPath,
}) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState({
    pageIndex: 1,
    pageSize: 10,
    sort: [{ id: 'code', desc: false }],
    data: [],
    total: 0,
  });
  const [openDialog, setopenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const mainUnitCURef = useRef(null);
  const isFetchingRef = useRef(false);

  const handlePaginationChange = (page) => {
    setTableData((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handleSelectChange = (value) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
  };

  const handleSort = (sort) => {
    setTableData((prev) => ({
      ...prev,
      sort: sort?.key ? [{ id: sort.key, desc: sort.order === 'desc' }] : [],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const result = await GetMainUnitsPaging({
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
          }));
        } else {
          triggerMessageError(t(`${translationPath}fetchError`));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        triggerMessageError(t(`${translationPath}fetchError`));
      } finally {
        isFetchingRef.current = false;
      }
    };
    fetchData();
  }, [tableData.pageIndex, tableData.pageSize, tableData.sort, searchItem, t, translationPath]);

  const columns = useMemo(
    () => [
      {
        header: t(`${translationPath}code`),
        accessorKey: 'code',
        sortable: true,
        cell: ({ row }) => (
          <span className="font-bold text-primary">{row.original.code}</span>
        ),
      },
      {
        header: t(`${translationPath}name`),
        accessorKey: 'name',
        sortable: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        header: t(`${translationPath}cardType`),
        accessorKey: 'cardType',
        sortable: true,
        cell: ({ row }) => <span>{row.original.cardType}</span>,
      },
      {
        header: t(`${translationPath}actions`),
        id: 'actions',
        cell: ({ row }) => (
          <ActionColumn
            row={row.original}
            setopenDialog={setopenDialog}
            setSelectItem={setSelectItem}
            setOpenDialogCRUD={setopenDialogCRUD}
            setIsEditMode={setIsEditMode}
            translationPath={translationPath}
          />
        ),
      },
    ],
    [t, translationPath, setopenDialog, setSelectItem, setopenDialogCRUD, setIsEditMode]
  );

  const dialogType = {
    type: 'danger',
    title: t(`${translationPath}deleteMainUnit`),
    children: t(`${translationPath}confirmDelete`),
    cancelText: t(`${translationPath}cancel`),
    confirmText: t(`${translationPath}delete`),
  };

  const dialogTypeCRUD = {
    title: isEditMode
      ? t(`${translationPath}editMainUnit`)
      : t(`${translationPath}addMainUnit`),
    cancelText: t(`${translationPath}cancel`),
    confirmText: isEditMode
      ? t(`${translationPath}update`)
      : t(`${translationPath}create`),
  };

  const handleClose = () => {
    setopenDialog(false);
    setSelectItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectItem?.id) return;
    try {
      const response = await DeleteMainUnitById(selectItem.id);
      if (response.success ||response.data.success) {
        setTableData((prev) => ({
          ...prev,
          data: prev.data.filter((unit) => unit.id !== selectItem.id),
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
    handleClose();
  };

  const handleConfirmCRUD = () => {
    if (mainUnitCURef.current) {
      mainUnitCURef.current.submitForm();
    }
  };

  const handleCloseCRUD = () => {
    setopenDialogCRUD(false);
    setIsEditMode(false);
    setSelectItem(null);
  };

  const handleSubmitSuccess = (updatedUnit) => {
    setopenDialogCRUD(false);
    setIsEditMode(false);
    if (isEditMode) {
      setTableData((prev) => ({
        ...prev,
        data: prev.data.map((unit) =>
          unit.id === updatedUnit.id ? { ...unit, ...updatedUnit } : unit
        ),
      }));
    } else {
      setTableData((prev) => ({
        ...prev,
        data: [updatedUnit, ...prev.data],
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
        onConfirm={handleConfirmDelete}
      >
        <p>
          {dialogType.children} {selectItem?.name || ''}?
        </p>
      </ConfirmDialog>
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

export default MainUnitTable;