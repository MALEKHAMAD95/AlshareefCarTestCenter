import { useEffect, useState, useRef } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Select from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { triggerMessageError, triggerMessageSuccessfully } from '@/components/shared/ToastMange';
import { GetOrderStatusPaging } from '@/services/ModelSserver/OrderStatusServices';
import { BatchApproval } from '@/services/ModelSserver/OrderServices'; // Adjust import path as needed

const statusOptions = [
  { value: '1', label: 'Pending' },
  { value: '4', label: 'Approved' },
  { value: '2', label: 'Rejected' },
];

export default function BatchApprovalDialog({ show, handleClose, selectedRows, onSuccess ,setSelectedRows }) {
  const { t } = useTranslation();
  const translationPath = 'views.OrderStatus.';
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatusOptions, setOrderStatusOptions] = useState([]);
  const isFetchingRef = useRef(false);
  const [tableData, setTableData] = useState({
    pageIndex: 1,
    pageSize: 50,
    sort: [],
    data: [],
    total: 0,
  });

  useEffect(() => {
    if (show && selectedRows.length > 0) {
      setSelectedStatus(null); // No default value
    }
  }, [show, selectedRows]);

  useEffect(() => {
    const fetchData = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const result = await GetOrderStatusPaging({
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
          sortBy: tableData.sort,
          searchValue: '',
          orderStatusType: 1, // Fixed to 1 as per requirement
        });
        if (result?.data) {
          const options = result.data.map(status => ({
            value: status.id, // Adjust based on your API response structure
            label: status.name || status.status || `Status ${status.id}`, // Adjust based on your API response
          }));
          setOrderStatusOptions(options);
          setSelectedOrderStatus(null); // No default value
        } else {
          triggerMessageError(t(`${translationPath}fetchError`));
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
        triggerMessageError(t(`${translationPath}fetchError`));
      } finally {
        isFetchingRef.current = false;
      }
    };
    if (show) {
      fetchData();
    }
  }, [show, tableData.pageIndex, tableData.pageSize, tableData.sort, t, translationPath]);

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleOrderStatusChange = (selectedOption) => {
    setSelectedOrderStatus(selectedOption);
  };

  const handleConfirm = async () => {
    if (!selectedStatus || !selectedOrderStatus || selectedRows.length === 0) return;
    setIsLoading(true);
    try {
      const payload = {
        orderIds: selectedRows.map(row => row.id),
        status: parseInt(selectedStatus.value),
        orderStatus: parseInt(selectedOrderStatus.value),
      };
      const response = await BatchApproval(payload);
      if (response.success || response.data.success) {
        triggerMessageSuccessfully(t(`${translationPath}batchApproveSuccess`));
        if (onSuccess) onSuccess(); // Call the onSuccess callback to clear selectedRows
        handleClose(); // Close dialog on success
        setSelectedRows([])
      } else {
        triggerMessageError(t(`${translationPath}batchApproveFailed`));
      }
    } catch (error) {
      console.error('Error saving batch approval:', error);
      triggerMessageError(t(`${translationPath}batchApproveError`));
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <SharedDialog
      isOpen={show}
      title={t(`${translationPath}batchApproval`)}
      width={600}
      cancelText={t(`${translationPath}cancel`)}
      confirmText={t(`${translationPath}approve`)}
      onClose={handleClose}
      onRequestClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmButtonProps={{ disabled: isLoading || !selectedStatus || !selectedOrderStatus }}
    >
      <div className="p-4">
        <div className="mb-4">
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder={t(`${translationPath}selectStatus`)}
            className="text-sm"
            isClearable
          />
        </div>
        <div className="mb-4">
          <Select
            options={orderStatusOptions}
            value={selectedOrderStatus}
            onChange={handleOrderStatusChange}
            placeholder={t(`${translationPath}selectOrderStatus`)}
            className="text-sm"
            isClearable
          />
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500 py-4">
            {t(`${translationPath}processing`)}
          </div>
        ) : (
          <div>
            <p>{t(`${translationPath}selectedOrders`, { count: selectedRows.length })}</p>
            <ul className="list-disc pl-5 mt-2">
              {selectedRows.map((row) => (
                <li key={row.id}>{row.ficheNumber} (ID: {row.id})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SharedDialog>
  );
}