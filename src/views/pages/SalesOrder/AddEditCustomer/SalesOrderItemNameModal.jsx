import { useEffect, useState } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Input from '@/components/ui/Input';
import Tooltip from '@/components/ui/Tooltip';
import Table from '@/components/ui/Table';
import { HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { FetchMaterials } from '@/services/ModelSserver/MaterialServices';

const { Tr, Th, Td, THead, TBody } = Table;

export default function SalesOrderItemNameModal({ show, handleClose, handleSelect }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const translationPath = 'views.Demand.';

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await FetchMaterials(1, 5, search);
      if (response?.success || response?.data?.success) {
        const formattedItems = (response?.data?.data || response?.data).map((item) => ({
          id: item.id,
          code: item.materialCode,
          description: item.materialName,
          materialCode: item.materialCode,
          unit: item.unitCodeAndFactors,
          unitCodesAndFactors: item.unitCodesAndFactors,
          price: item.price,
          salesVat: item.salesVat,
          purchaseVat: item.purchaseVat,
        }));
        setItems(formattedItems);
      } else {
        console.error('Failed to fetch materials:', response);
        setItems([]);
      }
    } catch (error) {
      console.error('Error in fetchItems:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchItems();
  }, [show, search]);

  const filteredItems = items.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!show) return null;

  return (
    <SharedDialog
      isOpen={show}
      title={t(`${translationPath}selectItem`)}
      width={600}
      cancelText={t(`${translationPath}cancel`)}
      confirmText={t(`${translationPath}close`)}
      onClose={handleClose}
      onRequestClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleClose}
    >
      <div className="p-2">
        <div className="mb-4">
          <Tooltip title={t(`${translationPath}searchItemTooltip`)}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(`${translationPath}searchItem`)}
              prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
            />
          </Tooltip>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-4">
            {t(`${translationPath}loadingItems`)}
          </div>
        ) : (
          <Table className="text-sm">
            <THead>
              <Tr>
                <Th>{t(`${translationPath}code`)}</Th>
                <Th>{t(`${translationPath}description`)}</Th>
                {/* <Th>{t(`${translationPath}unit`)}</Th> */}
                <Th className="text-center">{t(`${translationPath}action`)}</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredItems.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.code}</Td>
                  <Td>{item.description}</Td>
                  {/* <Td>{item.unit}</Td> */}
                  <Td className="text-center space-x-2">
                    <button
                      onClick={() => handleSelect(item)}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {t(`${translationPath}select`)}
                    </button>
                  </Td>
                </Tr>
              ))}
              {filteredItems.length === 0 && (
                <Tr>
                  <Td colSpan="4" className="text-center p-4 text-gray-400">
                    {t(`${translationPath}noItemsFound`)}
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        )}
      </div>
    </SharedDialog>
  );
}