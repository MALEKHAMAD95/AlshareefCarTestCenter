import { useState, useEffect } from 'react'
import SharedDialog from '@/components/shared/SharedDialog'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Table from '@/components/ui/Table'
import { HiOutlineSearch } from 'react-icons/hi'
import { GetTransactions } from '@/services/ModelSserver/OrderServices'

const { Tr, Th, Td, THead, TBody } = Table

export default function TransModal({ show, handleClose }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show) {
      fetchTransactions()
    }
  }, [show])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await GetTransactions()
      if (response?.success) {
        // Normalize fields if needed (e.g., fix typo in "invocieType")
        const normalizedData = response.data.map((item) => ({
          invoiceNo: item.invoiceNo,
          invoiceType: item.invocieType || item.invoiceType,
          date: item.createdDate === '0001-01-01T00:00:00' ? '' : item.createdDate,
          batch: item.batch,
          materialCode: item.materialCode,
          materialDescription: item.materialDescription,
          qty: item.qty,
          bonus: item.bounus,
          price: item.price,
          discount: item.discount,
          vatAmount: item.vaTamount,
          totalw_oTax: item.totalw_oTax,
          netTotal: item.netTotal,
        }))
        setTransactions(normalizedData)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setStartDate('')
    setEndDate('')
  }

  const filteredList = transactions.filter((item) => {
    const matchSearch =
      item.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.materialDescription?.toLowerCase().includes(search.toLowerCase())
    const matchStart = startDate ? new Date(item.date) >= new Date(startDate) : true
    const matchEnd = endDate ? new Date(item.date) <= new Date(endDate) : true
    return matchSearch && matchStart && matchEnd
  })

  if (!show) return null

  return (
    <SharedDialog
      isOpen={show}
      title="Select Trans"
      width={1200}
      cancelText="Cancel"
      confirmText="Close"
      onClose={handleClose}
      onRequestClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleClose}
    >
      <div className="p-4 space-y-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="block text-sm font-medium">
            Start Date
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white"
            />
          </label>
          <label className="block text-sm font-medium">
            End Date
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
              onClick={() => {}} // filtering is live
            >
              <PiFunnelSimple size={16} />
              Filter
            </button>
            <button
              className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 w-full"
              onClick={handleClearFilters}
            >
              <PiArrowsCounterClockwise size={16} />
              All
            </button>
          </div>
        </div> */}

        <Tooltip title="Search by invoice number or material description">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
            prefix={<HiOutlineSearch className="text-lg text-gray-500" />}
            className="w-full bg-white mb-3"
          />
        </Tooltip>
        <div className="overflow-auto max-h-[500px]  rounded-md">

        <Table compact>
          <THead>
            <Tr>
              <Th>Invoice No</Th>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>Batch</Th>
              <Th>Material Code</Th>
              <Th>Description</Th>
              <Th>Qty</Th>
              <Th>Bonus</Th>
              <Th>Price</Th>
              <Th>Discount</Th>
              <Th>VAT</Th>
              <Th>Total (w/o Tax)</Th>
              <Th>Net Total</Th>
            </Tr>
          </THead>
          <TBody>
            {loading ? (
              <Tr>
                <Td colSpan="13" className="text-center p-4 text-gray-400">
                  Loading...
                </Td>
              </Tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((item, idx) => (
                <Tr key={idx}>
                  <Td>{item.invoiceNo}</Td>
                  <Td>{item.invoiceType}</Td>
                  <Td>{item.date?.split('T')[0]}</Td>
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
              ))
            ) : (
              <Tr>
                <Td colSpan="13" className="text-center p-4 text-gray-400">
                  No transactions found.
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
      </div>
    </SharedDialog>
  )
}
