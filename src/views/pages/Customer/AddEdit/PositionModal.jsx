import { useEffect, useState } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Input from '@/components/ui/Input';
import Tooltip from '@/components/ui/Tooltip';
import Table from '@/components/ui/Table';
import { HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const { Tr, Th, Td, THead, TBody } = Table;

export default function PositionModal({ show, handleClose, handleSelect }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [positions, setPositions] = useState([]);

    const translationPath = 'views.Lookup.';

    const fetchPositions = () => {
        setIsLoading(true);
        setTimeout(() => {
            const mockData = [
                { id: 1, code: 'POS001', description: 'Sales Manager' },
                { id: 2, code: 'POS002', description: 'Sales Representative' },
                { id: 3, code: 'POS003', description: 'Regional Sales Lead' },
                { id: 4, code: 'POS004', description: 'Sales Associate' },
            ];
            setPositions(mockData);
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (show) fetchPositions();
    }, [show]);

    const filteredPositions = positions.filter(
        (p) =>
            p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
    );

    if (!show) return null;

    return (
        <SharedDialog
            isOpen={show}
            title={t(`${translationPath}selectPosition`)}
            width={600}
            cancelText={t(`${translationPath}cancel`)}
            confirmText={t(`${translationPath}close`)}
            onClose={handleClose}
            onRequestClose={handleClose}
            onCancel={handleClose}
            onConfirm={handleClose}
            style={{
                overlay: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                },
                content: {
                    maxWidth: '800px',
                    margin: '0',
                    top: 'auto',
                    bottom: 'auto',
                    transform: 'none',
                },
            }}
        >
            <div className="p-2">
                <div className="mb-4">
                    <Tooltip title={t(`${translationPath}searchPositionTooltip`)}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t(`${translationPath}searchPosition`)}
                            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
                        />
                    </Tooltip>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-4">
                        {t(`${translationPath}loadingPositions`)}
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
                            {filteredPositions.map((position) => (
                                <Tr key={position.id}>
                                    <Td>{position.code}</Td>
                                    <Td>{position.description}</Td>
                                    <Td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleSelect(position)}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            {t(`${translationPath}select`)}
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                            {filteredPositions.length === 0 && (
                                <Tr>
                                    <Td colSpan="3" className="text-center p-4 text-gray-400">
                                        {t(`${translationPath}noPositionsFound`)}
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