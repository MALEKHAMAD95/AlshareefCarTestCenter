import Button from '@/components/ui/Button'
import { useTranslationValue } from '@/locales'
import { useTranslation } from 'react-i18next'
import { TbPlus } from 'react-icons/tb'

const OrderListActionTools = ({ setopenDialogCRUD, setSelectItem, translationPath }) => {
    const { t } = useTranslation(useTranslationValue)
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => {
                    setopenDialogCRUD(true)
                    setSelectItem(null)
                }}
            >
                {t(`${translationPath}AddNewMark`)}
            </Button>
        </div>
    )
}

export default OrderListActionTools