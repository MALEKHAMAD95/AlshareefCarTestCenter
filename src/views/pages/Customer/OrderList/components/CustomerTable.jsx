import React, { useMemo, useState, useRef, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import Tooltip from '@/components/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import Tag from '@/components/ui/Tag';
import { TbDots, TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import { ConfirmDialog } from '@/components/shared';
import {
  triggerMessageError,
  triggerMessageSuccessfully,
} from '@/components/shared/ToastMange';
import { useTranslation } from 'react-i18next';
import { GetCustomersPaging, DeleteCustomerById } from '@/services/ModelSserver/CustomerServices';
import { Dropdown } from '@/components/ui';
import DropdownItem from '@/components/ui/Dropdown/DropdownItem';
import { PiListStar } from 'react-icons/pi';

const ActionColumn = ({
  row,
  setOpenDialog,
  setSelectItem,
  translationPath,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelectItem = () => {
    setSelectItem(row || null);
  };

  const onEdit = () => {
    navigate(`/Customer/Edit/${row.id}`);
  };

  const onDelete = () => {
    handleSelectItem();
    setOpenDialog(true);
  };

  const onView = () => {
    handleSelectItem();
    navigate(`/Customer/view/${row.id}`);
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
          <span
            className="cursor-pointer p-2 hover:text-gray-600"
            onClick={() => setOpen(!open)}
          >
            <TbDots />
          </span>
        }
      >
        <DropdownItem onClick={onEdit}>
          <div className="flex items-center gap-2">
            <PiListStar />
            <span>{t(`${translationPath}customerSalesManRelation`)}</span>
          </div>
        </DropdownItem>
      </Dropdown> */}
    </div>
  );
};

const CustomerTable = ({ searchItem, translationPath }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState({
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    data: [],
    total: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
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
        const result = await GetCustomersPaging({
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
          sortBy: tableData.sort,
          searchValue: searchItem || '',
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
        header: t(`${translationPath}fullName`),
        accessorKey: 'fullName',
        sortable: true,
        cell: (props) => {
          const { firstName, secondName } = props.row.original;
          return <span>{`${firstName} ${secondName || ''}`.trim()}</span>;
        },
      },
      {
        header: t(`${translationPath}address`),
        accessorKey: 'address',
        sortable: true,
        cell: (props) => <span>{props.row.original.address || '-'}</span>,
      },
      {
        header: t(`${translationPath}email`),
        accessorKey: 'email',
        sortable: true,
        cell: (props) => <span>{props.row.original.email || '-'}</span>,
      },
      {
        header: t(`${translationPath}phoneNumber`),
        accessorKey: 'phoneNumber',
        sortable: true,
        cell: (props) => <span>{props.row.original.phoneNumber || '-'}</span>,
      },
      {
        header: t(`${translationPath}taxNo`),
        accessorKey: 'taxNo',
        sortable: true,
        cell: (props) => <span>{props.row.original.taxNo || '-'}</span>,
      },
      {
        header: t(`${translationPath}status`),
        accessorKey: 'blocked',
        sortable: true,
        cell: (props) => {
          const isBlocked = props.row.original.blocked === 1;
          return (
            <Tag className={isBlocked ? 'bg-red-100' : 'bg-green-100'}>
              <span
                className={`font-semibold ${isBlocked ? 'text-red-600' : 'text-green-600'}`}
              >
                {isBlocked
                  ? t(`${translationPath}inactive`)
                  : t(`${translationPath}active`)}
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
            setOpenDialog={setOpenDialog}
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
    title: t(`${translationPath}deleteCustomer`),
    children: t(`${translationPath}confirmDelete`),
    cancelText: t(`${translationPath}cancel`),
    confirmText: t(`${translationPath}delete`),
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectItem(null);
  };

  const handleOnConfirm = async () => {
    if (!selectItem?.id) return;
    try {
      const response = await DeleteCustomerById(selectItem.id);
      if (response.success ||response.data.success) {
        const updatedData = tableData.data.filter(
          (customer) => customer.id !== selectItem.id
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
          {dialogType.children} {selectItem?.firstName || ''}?
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

export default CustomerTable;