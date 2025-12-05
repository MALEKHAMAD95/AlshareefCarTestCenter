import { useEffect, useState } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Input from '@/components/ui/Input';
import Tooltip from '@/components/ui/Tooltip';
import Table from '@/components/ui/Table';
import { HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const { Tr, Th, Td, THead, TBody } = Table;

export default function DemandLinesModal({ show, handleClose, handleSelect }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [demandLines, setDemandLines] = useState([]);

    const translationPath = 'views.Demand.';

    const fetchDemandLines = () => {
        setIsLoading(true);
        setTimeout(() => {
            const mockData = [
                { id: 1, code: 'DL001', description: 'Standard Demand' },
                { id: 2, code: 'DL002', description: 'Urgent Demand' },
                { id: 3, code: 'DL003', description: 'Bulk Demand' },
            ];
            setDemandLines(mockData);
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (show) fetchDemandLines();
    }, [show]);

    const filteredDemandLines = demandLines.filter(
        (dl) =>
            dl.code.toLowerCase().includes(search.toLowerCase()) ||
            dl.description.toLowerCase().includes(search.toLowerCase())
    );

    if (!show) return null;

    return (
        <SharedDialog
            isOpen={show}
            title={t(`${translationPath}selectDemandLine`)}
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
                    <Tooltip title={t(`${translationPath}searchDemandLineTooltip`)}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t(`${translationPath}searchDemandLine`)}
                            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
                        />
                    </Tooltip>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-4">
                        {t(`${translationPath}loadingDemandLines`)}
                    </div>
                ) : (
                    <Table className="text-sm">
                        <THead>
                            <Tr>
                                <Th>{t(`${translationPath}code`)}</Th>
                                <Th>{t(`${translationPath}description`)}</Th>
                                <Th className="text-center">{t(`${translationPath}action`)}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {filteredDemandLines.map((demandLine) => (
                                <Tr key={demandLine.id}>
                                    <Td>{demandLine.code}</Td>
                                    <Td>{demandLine.description}</Td>
                                    <Td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleSelect(demandLine)}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            {t(`${translationPath}select`)}
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                            {filteredDemandLines.length === 0 && (
                                <Tr>
                                    <Td colSpan="3" className="text-center p-4 text-gray-400">
                                        {t(`${translationPath}noDemandLinesFound`)}
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