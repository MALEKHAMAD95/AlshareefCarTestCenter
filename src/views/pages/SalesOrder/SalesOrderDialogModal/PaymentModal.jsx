import { useEffect, useState } from 'react'
import SharedDialog from '@/components/shared/SharedDialog'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Table from '@/components/ui/Table'
import { HiOutlineSearch } from 'react-icons/hi'
import { ConfirmDialog } from '@/components/shared'
import { DeletePaymentPlanById, GetAllPaymentPlans } from '@/services/ModelSserver/PaymentPlanServices'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'

const { Tr, Th, Td, THead, TBody } = Table
  
export default function PaymentModal({
  show,
  handleClose,
  setFormData,
  setAlert,
}) {
  const translationPath = 'views.Order.'
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [payments, setPayments] = useState([])
  const { t } = useTranslation(useTranslationValue);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectItem, setSelectItem] = useState(null)

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const response = await GetAllPaymentPlans()
      if (response?.success) {
        setPayments(response.data)
      } else {
        setAlert({ message: t(`${translationPath}FailedToFetchPayments`), type: 'error' })
      }
    } catch (error) {
      setAlert({ message: t(`${translationPath}ErrorFetchingPayments`), type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (show) fetchPayments()
  }, [show])

  const filteredPayments = payments.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (payment) => {
    setFormData(payment)
    setAlert({ message: `${t(`${translationPath}SelectedPayment`)}: ${payment.code}`, type: 'success' })
    handleClose()
  }

  const handleConfirmDelete = async () => {
    if (selectItem) {
      try {
        const response = await DeletePaymentPlanById(selectItem.id)
          if (response?.success || response?.data?.success ) {
          setPayments((prev) => prev.filter((p) => p.id !== selectItem.id))
          setAlert({ message: `${t(`${translationPath}DeletedPayment`)}: ${selectItem.code}`, type: 'error' })
        } else {
          setAlert({ message: t(`${translationPath}FailedToDeletePayment`), type: 'error' })
        }
      } catch (error) {
        setAlert({ message: t(`${translationPath}ErrorDeletingPayment`), type: 'error' })
      }
    }
    setOpenDialog(false)
    setSelectItem(null)
  }

  const dialogType = {
    type: 'danger',
    title: t(`${translationPath}DeletePaymentMethod`),
    children: t(`${translationPath}ConfirmDelete`),
    cancelText: t(`${translationPath}Cancel`),
    confirmText: t(`${translationPath}Delete`),
  }

  return (
    <>
      <SharedDialog
        isOpen={show}
        title={t(`${translationPath}SelectPaymentMethod`)}
        cancelText={t(`${translationPath}Cancel`)}
        confirmText={t(`${translationPath}Close`)}
        width={600}
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
            width: 'auto',
            maxWidth: '600px',
            margin: '0',
            top: 'auto',
            bottom: 'auto',
            transform: 'none',
          },
        }}
      >
        <div className="p-2">
          <div className="mb-4">
            <Tooltip title={t(`${translationPath}SearchByCodeOrName`)}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(`${translationPath}SearchPaymentMethods`)}
                prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
              />
            </Tooltip>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500 py-4">{t(`${translationPath}LoadingPayments`)}</div>
          ) : (
            <Table className="text-sm">
              <THead>
                <Tr>
                  <Th>{t(`${translationPath}Code`)}</Th>
                  <Th>{t(`${translationPath}Desc`)}</Th>
                  <Th className="text-center">{t(`${translationPath}Actions`)}</Th>
                </Tr>
              </THead>
              <TBody>
                {filteredPayments.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.code}</Td>
                    <Td>{payment.name || '-'}</Td>
                    <Td className="text-center space-x-2">
                      <button
                        onClick={() => handleSelect(payment)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        {t(`${translationPath}Select`)}
                      </button>
                      <button
                        onClick={() => {
                          setSelectItem(payment)
                          setOpenDialog(true)
                        }}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        {t(`${translationPath}Delete`)}
                      </button>
                    </Td>
                  </Tr>
                ))}
                {filteredPayments.length === 0 && (
                  <Tr>
                    <Td colSpan="3" className="text-center p-4 text-gray-400">
                      {t(`${translationPath}NoPaymentsFound`)}
                    </Td>
                  </Tr>
                )}
              </TBody>
            </Table>
          )}
        </div>
      </SharedDialog>

      <ConfirmDialog
        isOpen={openDialog}
        type={dialogType.type}
        title={dialogType.title}
        cancelText={dialogType.cancelText}
        confirmText={dialogType.confirmText}
        onClose={() => setOpenDialog(false)}
        onRequestClose={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        style={{
          overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          },
          content: {
            width: 'auto',
            maxWidth: '500px',
            margin: '0',
            top: 'auto',
            bottom: 'auto',
            transform: 'none',
          },
        }}
      >
        <p>
          {dialogType.children} <strong>{selectItem?.code}</strong>?
        </p>
      </ConfirmDialog>
    </>
  )
}