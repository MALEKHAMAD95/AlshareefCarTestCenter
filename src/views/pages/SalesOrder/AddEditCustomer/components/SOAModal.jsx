import { useEffect, useState } from 'react'
import SharedDialog from '@/components/shared/SharedDialog'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import { HiOutlineSearch } from 'react-icons/hi'
import { PiFunnelSimple, PiArrowsCounterClockwise } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'
import { GetSOA } from '@/services/ModelSserver/OrderServices'
 
const { Tr, Th, Td, THead, TBody } = Table

export default function SelectSOA({ show, handleClose, setAlert, setFormData }) {
  const translationPath = 'views.Order.'
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [soaList, setSoaList] = useState([])
  const { t } = useTranslation(useTranslationValue)

  const fetchSOAItems = async () => {
    setIsLoading(true)
    try {
      const response = await GetSOA()
    if (response?.success || response?.data?.success ) {
        const formattedData = response.data.map(item => ({
          id: item.id,
          date: item.createdDate.split('T')[0], // Extract date part
          slipNo: item.slipNo,
          slipType: item.slipType,
          paymentType: item.paymentType,
          description: item.description,
          debit: item.debit,
          credit: item.credit,
          balance: item.balance
        }))
        setSoaList(formattedData)
      } else {
        setAlert({ message: 'Failed to fetch SOA records', type: 'error' })
      }
    } catch (error) {
      setAlert({ message: 'Error fetching SOA records', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (show) fetchSOAItems()
  }, [show])

  const filteredList = soaList.filter((item) => {
    const matchSearch = item.slipNo.toLowerCase().includes(search.toLowerCase()) || 
                       item.description.toLowerCase().includes(search.toLowerCase())
    const matchStart = startDate ? new Date(item.date) >= new Date(startDate) : true
    const matchEnd = endDate ? new Date(item.date) <= new Date(endDate) : true
    return matchSearch && matchStart && matchEnd
  })

  const handleSelect = (item) => {
    setFormData(item)
    setAlert({ message: `${t(`${translationPath}SelectedSOA`)}: ${item.description}`, type: 'success' })
    handleClose()
  }

  const handleClearFilters = () => {
    setSearch('')
    setStartDate('')
    setEndDate('')
  }

  const handleFilter = () => {
    let filtered = soaList
    if (startDate) {
      filtered = filtered.filter((item) => new Date(item.date) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter((item) => new Date(item.date) <= new Date(endDate))
    }
    if (search) {
      filtered = filtered.filter((item) =>
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.slipNo.toLowerCase().includes(search.toLowerCase())
      )
    }
    return filtered
  }

  if (!show) return null

  return (
    <SharedDialog
      isOpen={show}
      title={t(`${translationPath}SelectSOA`)}
      width={900}
      cancelText={t(`${translationPath}Cancel`)}
      confirmText={t(`${translationPath}Close`)}
      onClose={handleClose}
      onRequestClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleClose}
    >
      <div className="p-4 space-y-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="block text-sm font-middle">
            {t(`${translationPath}StartDate`)}
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white"
            />
          </label>
          <label className="block text-sm font-middle">
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
              onClick={() => setSoaList(handleFilter())}
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
        </div> */}

        <Tooltip title={t(`${translationPath}SearchBySlipOrDescription`)}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(`${translationPath}SearchSOA`)}
            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
            className="w-full bg-white"
          />
        </Tooltip>

        {isLoading ? (
          <div className="text-center text-gray-500 py-4">{t(`${translationPath}LoadingSOARecords`)}</div>
        ) : (
          <>
            <div className="overflow-auto max-h-[500px] rounded-md overflow-x-auto">
              <Table compact>
                <THead>
                  <Tr>
                    <Th>{t(`${translationPath}Date`)}</Th>
                    <Th>{t(`${translationPath}SlipNo`)}</Th>
                    <Th>{t(`${translationPath}SlipType`)}</Th>
                    <Th>{t(`${translationPath}PaymentType`)}</Th>
                    <Th>{t(`${translationPath}Description`)}</Th>
                    <Th>{t(`${translationPath}Debit`)}</Th>
                    <Th>{t(`${translationPath}Credit`)}</Th>
                    <Th>{t(`${translationPath}Balance`)}</Th>
                    <Th className="text-center">{t(`${translationPath}Action`)}</Th>
                  </Tr>
                </THead>
                <TBody>
                  {filteredList.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.date}</Td>
                      <Td>{item.slipNo}</Td>
                      <Td>{item.slipType}</Td>
                      <Td>{item.paymentType}</Td>
                      <Td>{item.description}</Td>
                      <Td>{item.debit.toFixed(3)}</Td>
                      <Td>{item.credit.toFixed(3)}</Td>
                      <Td>{item.balance.toFixed(3)}</Td>
                      <Td className="text-center">
                        <button
                          onClick={() => handleSelect(item)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          {t(`${translationPath}Select`)}
                        </button>
                      </Td>
                    </Tr>
                  ))}
                  {filteredList.length === 0 && (
                    <Tr>
                      <Td colSpan="9" className="text-center p-4 text-gray-400">
                        {t(`${translationPath}NoSOARecordsFound`)}
                      </Td>
                    </Tr>
                  )}
                </TBody>
              </Table>
            </div>

            {/* {filteredList.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Pagination total={filteredList.length} displayTotal />
              </div>
            )} */}
          </>
        )}
      </div>
    </SharedDialog>
  )
}