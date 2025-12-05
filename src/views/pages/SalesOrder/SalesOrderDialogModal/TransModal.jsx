import { useState } from 'react'
import SharedDialog from '@/components/shared/SharedDialog'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import { HiOutlineSearch } from 'react-icons/hi'
import { PiFunnelSimple, PiArrowsCounterClockwise } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'

const { Tr, Th, Td, THead, TBody } = Table

const transactions = [
  {
    invoiceNo: 'INV-001',
    invoiceType: 'Sales',
    date: '2023-05-10',
    batch: 'BATCH001',
    materialCode: 'MAT001',
    materialDescription: 'Material 1',
    qty: 10,
    bonus: 1,
    price: 100.0,
    discount: 5.0,
    vatAmount: 15.0,
    totalw_oTax: 950.0,
    netTotal: 965.0,
  },
  {
    invoiceNo: 'INV-002',
    invoiceType: 'Purchase',
    date: '2023-05-12',
    batch: 'BATCH002',
    materialCode: 'MAT002',
    materialDescription: 'Material 2',
    qty: 5,
    bonus: 0,
    price: 150.0,
    discount: 7.5,
    vatAmount: 21.38,
    totalw_oTax: 712.5,
    netTotal: 733.88,
  },
]

export default function TransModal({ show, handleClose }) {
  const translationPath = 'views.Order.'
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { t } = useTranslation(useTranslationValue);
  const handleClearFilters = () => {
    setSearch('')
    setStartDate('')
    setEndDate('')
  }

  const filteredList = transactions.filter((item) => {
    const matchSearch =
      item.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      item.materialDescription.toLowerCase().includes(search.toLowerCase())
    const matchStart = startDate ? new Date(item.date) >= new Date(startDate) : true
    const matchEnd = endDate ? new Date(item.date) <= new Date(endDate) : true
    return matchSearch && matchStart && matchEnd
  })

  if (!show) return null

  return (
    <SharedDialog
      isOpen={show}
      title={t(`${translationPath}SelectTrans`)}
      width={1200}
      cancelText={t(`${translationPath}Cancel`)}
      confirmText={t(`${translationPath}Close`)}
      onClose={handleClose}
      onRequestClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleClose}
    >
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="block text-sm font-medium">
            {t(`${translationPath}StartDate`)}
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white"
            />
          </label>
          <label className="block text-sm font-medium">
            {t(`${translationPath}EndDate`)}
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white"
            />
          </label>
          <div className="flex gap-2 col-span-1">
            <button
              className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 w-full"
              onClick={() => { }}
            >
              <PiFunnelSimple size={16} />
              {t(`${translationPath}Filter`)}
            </button>
            <button
              className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 w-full"
              onClick={handleClearFilters}
            >
              <PiArrowsCounterClockwise size={16} />
              {t(`${translationPath}All`)}
            </button>
          </div>
        </div>

        <Tooltip title={t(`${translationPath}SearchByInvoiceOrMaterial`)}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(`${translationPath}SearchTransactions`)}
            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
            className="w-full bg-white mb-3"
          />
        </Tooltip>

        <Table compact>
          <THead>
            <Tr>
              <Th>{t(`${translationPath}InvoiceNo`)}</Th>
              <Th>{t(`${translationPath}Type`)}</Th>
              <Th>{t(`${translationPath}Date`)}</Th>
              <Th>{t(`${translationPath}Batch`)}</Th>
              <Th>{t(`${translationPath}MaterialCode`)}</Th>
              <Th>{t(`${translationPath}Description`)}</Th>
              <Th>{t(`${translationPath}Qty`)}</Th>
              <Th>{t(`${translationPath}Bonus`)}</Th>
              <Th>{t(`${translationPath}Price`)}</Th>
              <Th>{t(`${translationPath}Discount`)}</Th>
              <Th>{t(`${translationPath}VAT`)}</Th>
              <Th>{t(`${translationPath}TotalWithoutTax`)}</Th>
              <Th>{t(`${translationPath}NetTotal`)}</Th>
            </Tr>
          </THead>
          <TBody>
            {filteredList.map((item, idx) => (
              <Tr key={idx}>
                <Td>{item.invoiceNo}</Td>
                <Td>{item.invoiceType}</Td>
                <Td>{item.date}</Td>
                <Td>{item.batch}</Td>
                <Td>{item.materialCode}</Td>
                <Td>{item.materialDescription}</Td>
                <Td>{item.qty}</Td>
                <Td>{item.bonus}</Td>
                <Td>{item.price.toFixed(2)}</Td>
                <Td>{item.discount.toFixed(2)}</Td>
                <Td>{item.vatAmount.toFixed(2)}</Td>
                <Td>{item.totalw_oTax.toFixed(2)}</Td>
                <Td>{item.netTotal.toFixed(2)}</Td>
              </Tr>
            ))}
            {filteredList.length === 0 && (
              <Tr>
                <Td colSpan="13" className="text-center p-4 text-gray-400">
                  {t(`${translationPath}NoTransactionsFound`)}
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>

        {filteredList.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination total={filteredList.length} displayTotal />
          </div>
        )}
      </div>
    </SharedDialog>
  )
}