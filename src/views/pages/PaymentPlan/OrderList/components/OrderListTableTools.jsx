import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { useTranslationValue } from '@/locales'
import { useTranslation } from 'react-i18next'

const OrderListTableTools = ({ translationPath, setSearchItem }) => {
    const { t } = useTranslation(useTranslationValue)

    const handleInputChange = (event) => {
        const val = event.target.value
        setSearchItem(val)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <DebouceInput
                placeholder={t(`${translationPath}Search`)}
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
                wait={1000} // 2-second debounce
            />
        </div>
    )
}

export default OrderListTableTools