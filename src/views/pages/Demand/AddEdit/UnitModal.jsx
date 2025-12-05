import { useEffect, useState } from 'react';
import SharedDialog from '@/components/shared/SharedDialog';
import Input from '@/components/ui/Input';
import Tooltip from '@/components/ui/Tooltip';
import Table from '@/components/ui/Table';
import { HiOutlineSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { GetAllMainUnits } from '@/services/ModelSserver/MainUnitServices';
 
const { Tr, Th, Td, THead, TBody } = Table;

export default function UnitModal({ show, handleClose, handleSelect }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [units, setUnits] = useState([]);
    const [mainUnitOptions, setMainUnitOptions] = useState([]);
    const translationPath = 'views.Demand.';

    const fetchMainUnits = async () => {
        setIsLoading(true);
        try {
            const response = await GetAllMainUnits();
            if (response?.success) {
                const formattedUnits = response.data
                    .flatMap((mainUnit) =>
                        mainUnit.subUnits.map((subUnit) => ({
                            id: subUnit.id,
                            code: subUnit.unitCode,
                            description: subUnit.unitName,
                        }))
                    )
                    .filter((unit) => unit.code && unit.description);
                setUnits(formattedUnits);
                setMainUnitOptions(formattedUnits);
            } else {
                console.error('Failed to fetch main units:', response);
                setUnits([]);
                setMainUnitOptions([]);
                triggerMessageError(t(`${translationPath}fetchMainUnitsFailed`));
            }
        } catch (error) {
            console.error('Error fetching main units:', error);
            setUnits([]);
            setMainUnitOptions([]);
            triggerMessageError(t(`${translationPath}fetchMainUnitsFailed`));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show) fetchMainUnits();
    }, [show]);

    const filteredUnits = units.filter(
        (unit) =>
            unit.code.toLowerCase().includes(search.toLowerCase()) ||
            unit.description.toLowerCase().includes(search.toLowerCase())
    );

    if (!show) return null;

    return (
        <SharedDialog
            isOpen={show}
            title={t(`${translationPath}selectUnit`)}
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
                    <Tooltip title={t(`${translationPath}searchUnitTooltip`)}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t(`${translationPath}searchUnit`)}
                            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
                        />
                    </Tooltip>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-4">
                        {t(`${translationPath}loadingUnits`)}
                    </div>
                ) : (
                    <div className="h-96 max-h-96 overflow-auto rounded-md">
                        <Table className="text-sm">
                            <THead>
                                <Tr>
                                    <Th>{t(`${translationPath}code`)}</Th>
                                    <Th>{t(`${translationPath}description`)}</Th>
                                    <Th className="text-center">{t(`${translationPath}action`)}</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {filteredUnits.length > 0 ? (
                                    filteredUnits.map((unit) => (
                                        <Tr key={unit.id}>
                                            <Td>{unit.code}</Td>
                                            <Td>{unit.description}</Td>
                                            <Td className="text-center space-x-2">
                                                <button
                                                    onClick={() => handleSelect(unit)}
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
                                            {t(`${translationPath}noUnitsFound`)}
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </div>
                )}
            </div>
        </SharedDialog>
    );
}