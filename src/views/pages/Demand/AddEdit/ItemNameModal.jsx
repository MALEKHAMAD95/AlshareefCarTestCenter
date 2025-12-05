import { useEffect, useState, useRef } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Input from '@/components/ui/Input';
import Tooltip from '@/components/ui/Tooltip';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { FetchMaterials } from '@/services/ModelSserver/MaterialServices';

const { Tr, Th, Td, THead, TBody } = Table;

export default function ItemNameModal({ show, handleClose, handleSelect }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(5); // Matches API pageSize in original fetch
    const [totalItems, setTotalItems] = useState(0);
    const debounceRef = useRef(null);
    const translationPath = 'views.Demand.';

    const fetchItems = async (searchValue = '', page = 1) => {
        setIsLoading(true);
        try {
            const response = await FetchMaterials(page, pageSize, searchValue);
            if (response?.success || response?.data?.success) {
                const formattedItems = (response?.data?.data || response?.data).map((item) => ({
                    id: item.id,
                    code: item.materialCode,
                    description: item.materialName,
                    unit: item.unitCodeAndFactors,
                }));
                setItems(formattedItems);
                setTotalItems(response?.data?.totalCount || response?.totalCount || 0); // Adjust based on API response
            } else {
                console.error('Failed to fetch materials:', response);
                setItems([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error in fetchItems:', error);
            setItems([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchItems('', 1); // Reset to page 1 when modal opens
        }
    }, [show]);

    useEffect(() => {
        if (!show) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchItems(search.trim(), 1); // Reset to page 1 on search
            setPageIndex(1);
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [search]);

    const handlePageChange = (newPage) => {
        setPageIndex(newPage);
        fetchItems(search.trim(), newPage);
    };

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
            <div className="p-2 min-h-96">
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
                    <div className="overflow-auto max-h-[500px] rounded-md overflow-x-auto min-h-60">
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
                                {items.length > 0 ? (
                                    items.map((item) => (
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
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan="3" className="text-center p-4 text-gray-400">
                                            {t(`${translationPath}noItemsFound`)}
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </div>
                )}

            </div>
            {totalItems > 0 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        total={totalItems}
                        pageSize={pageSize}
                        currentPage={pageIndex}
                        onChange={handlePageChange}
                        displayTotal
                    />
                </div>
            )}

        </SharedDialog>
    );
}