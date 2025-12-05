// src/views/Material/MaterialTable.js
import React, { useMemo, useState, useRef, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import Tooltip from '@/components/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import Tag from '@/components/ui/Tag';
import { TbEdit, TbTrash } from 'react-icons/tb';
 
import {
  triggerMessageError,
  triggerMessageSuccessfully,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/shared';
import { DeleteMaterialById, GetMaterialPaging } from '@/services/ModelSserver/MaterialServices';

const ActionColumn = ({
  row,
  setopenDialog,
  setSelectItem,
  translationPath,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectItem = () => {
    setSelectItem(row || null);
  };

  const onEdit = () => {
    navigate(`/Material/edit/${row.id}`);
  };

  const onDelete = () => {
    handleSelectItem();
    setopenDialog(true);
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

const MaterialTable = ({
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
    sort: [],
    data: [],
    total: 0,
  });
  const [openDialog, setopenDialog] = useState(false);
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
        const result = await GetMaterialPaging({
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
          sortBy: tableData.sort,
          searchValue: searchItem || '',
        });
        if (result?.data ) {
          setTableData((prev) => ({
            ...prev,
            data: result?.data,
            total: result?.totalCount || 0,
          }));
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

  useEffect(() => {
    setTableData((prev) => ({
      ...prev,
      sort: [{ id: 'code', desc: false }],
    }));
  }, []);

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
        header: t(`${translationPath}description`),
        accessorKey: 'description',
        sortable: true,
        cell: (props) => <span>{props.row.original.description}</span>,
      },
      {
        header: t(`${translationPath}status`),
        accessorKey: 'active',
        sortable: true,
        cell: (props) => {
          const isActive = props.row.original.active === 1;
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
        header: t(`${translationPath}actions`),
        id: 'actions',
        cell: (props) => (
          <ActionColumn
            row={props.row.original}
            setopenDialog={setopenDialog}
            setSelectItem={setSelectItem}
            translationPath={translationPath}
          />
        ),
      },
    ],
    [t, translationPath]
  );

  const dialogType = {
    type: 'danger',
    title: t(`${translationPath}deleteMaterial`),
    children: t(`${translationPath}confirmDelete`),
    cancelText: t(`${translationPath}cancel`),
    confirmText: t(`${translationPath}delete`),
  };

  const handleClose = () => setopenDialog(false);

  const handleonConfirm = async () => {
    if (!selectItem?.id) return;
    try {
      const response = await DeleteMaterialById(selectItem.id);
      if (response.success ||response.data.success) {
        const updatedData = tableData.data.filter(
          (material) => material.id !== selectItem.id
        );
        setTableData((prev) => ({ ...prev, data: updatedData }));
        triggerMessageSuccessfully(t(`${translationPath}deleteSuccess`));
      } else {
        triggerMessageError(t(`${translationPath}deleteFailed`));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      triggerMessageError(t(`${translationPath}deleteError`));
    }
    setopenDialog(false);
    setSelectItem(null);
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
        onConfirm={handleonConfirm}
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

export default MaterialTable;