import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { useTranslationValue } from '@/locales'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui'

const OrderListTableTools = ({ translationPath, setSearchItem, setFilters }) => {
    const { t } = useTranslation(useTranslationValue)

    const handleInputChange = (event) => {
        const val = event.target.value
        setSearchItem(val)
    }

    const handleFilterChange = (key) => (event) => {
        const value = event.target.value
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 w-full">
                <DebouceInput
                    placeholder={t(`${translationPath}Search`)}
                    suffix={<TbSearch className="text-lg" />}
                    onChange={handleInputChange}
                    wait={2000}
                    className="w-full md:w-1/5"
                />
                <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}trcode`)}
                    onChange={handleFilterChange('trcode')}
                    className="w-full md:w-1/5"
                />
                <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}userId`)}
                    onChange={handleFilterChange('userId')}
                    className="w-full md:w-1/5"
                />
                <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}warehouseId`)}
                    onChange={handleFilterChange('warehouseId')}
                    className="w-full md:w-1/5"
                />
                <Input
                    type="number" min="0"
                    placeholder={t(`${translationPath}firmNumber`)}
                    onChange={handleFilterChange('firmNumber')}
                    className="w-full md:w-1/5"
                />
                <Input
                    type="date"
                    placeholder={t(`${translationPath}searchDate`)}
                    onChange={handleFilterChange('searchDate')}
                    className="w-full md:w-1/5"
                />
            </div>
        </div>
    )
}

export default OrderListTableTools