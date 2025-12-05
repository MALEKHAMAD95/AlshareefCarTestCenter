import Button from '@/components/ui/Button'
import { useTranslationValue } from '@/locales'
import { useTranslation } from 'react-i18next'
import { TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const OrderListActionTools = ({ setopenDialogCRUD, setSelectItem, translationPath, bankId }) => {
    const { t } = useTranslation(useTranslationValue)
    const navigate = useNavigate()

    const handleAddNew = () => {
        setSelectItem(null)
        setopenDialogCRUD(true)
    }

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={handleAddNew}
            >
                {t(`${translationPath}AddNewRecord`)}
            </Button>
        </div>
    )
}

export default OrderListActionTools