import React, { useEffect, useState } from 'react'
import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'


const SalesOrderSlip = ({
  formData,
  handleInputChange,
  setShowPaymentModal,
  setShowCustomerModal,
  setShowSOAModal,
  setShowTransModal,
}) => {
  const [asyncValue, setAsyncValue] = useState(null)

  const colourOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'red', label: 'Red' },
    { value: 'yellow', label: 'Yellow' },
  ]

  const filterColors = (inputValue) => {
    return colourOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterColors(inputValue))
    }, 500)
  }
  useEffect(() => {
    if (!formData.date) {
      const now = new Date()
      handleInputChange({ target: { name: 'date', value: now.toISOString().split('T')[0] } })
      handleInputChange({ target: { name: 'time', value: now.toTimeString().slice(0, 5) } })
    }
  }, [])

  return (
    <div className="bg-white shadow-md rounded-lg mb-4">
      <div className="card-header p-3 bg-blue-100 font-medium text-neutral-800" >Sales Order Slip</div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Slip Number */}
          <div>
            <label className="block text-sm font-medium">Slip Number</label>
            <Input
              name="slipNumber"
              value={formData.slipNumber}
              onChange={handleInputChange}
              disabled
              placeholder="ORD******** Automatically"
              className="w-full bg-white"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-white"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium">Time</label>
            <Input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full bg-white"
            />
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-sm font-medium">Document #</label>
            <Input
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInputChange}
              className="w-full bg-white"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium">Payment Type</label>
            <div className="flex">
              <Input
                name="paymentCode"
                value={formData.paymentCode}
                onChange={handleInputChange}
                placeholder="Enter Payment"
                className="flex-1 bg-white rounded-l-md"
              />
              <button
                type="button"
                onClick={setShowPaymentModal}
                className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                ...
              </button>
            </div>
          </div>

          {/* Document Tracking Number */}
          <div>
            <label className="block text-sm font-medium">Document Tracking Number</label>
            <Input
              name="documentTrackingNumber"
              value={formData.documentTrackingNumber}
              onChange={handleInputChange}
              className="w-full bg-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <Select
              value={{
                value: formData.status,
                label:
                  formData.status === '1'
                    ? 'Pending'
                    : formData.status === '4'
                      ? 'Approved'
                      : 'Rejected',
              }}
              options={[
                { value: '1', label: 'Pending' },
                { value: '4', label: 'Approved' },
                { value: '2', label: 'Rejected' },
              ]}
              onChange={(option) =>
                handleInputChange({ target: { name: 'status', value: option.value } })
              }
              className="bg-white"
            />
          </div>

          {/* Warehouse */}
          <div>
            <label className="block text-sm font-medium">Warehouse</label>
            <Select
              value={{
                value: formData.warehouse,
                label: formData.warehouse === '1' ? 'Warehouse 1' : 'Warehouse 2',
              }}
              options={[
                { value: '0', label: '--Select--' },
                { value: '1', label: 'Warehouse 1' },
                { value: '2', label: 'Warehouse 2' },
              ]}
              onChange={(option) =>
                handleInputChange({ target: { name: 'warehouse', value: option.value } })
              }
              className="bg-white"
            />
          </div>

          {/* Salesman */}
          <div>
            <label className="block text-sm font-medium">Salesman</label>
            <Select
              value={{
                value: formData.salesmanId,
                label:
                  formData.salesmanId === '1'
                    ? 'John Doe'
                    : formData.salesmanId === '2'
                      ? 'Jane Smith'
                      : '--Select--',
              }}
              options={[
                { value: '', label: '-- Select --' },
                { value: '1', label: 'John Doe' },
                { value: '2', label: 'Jane Smith' },
              ]}
              onChange={(option) =>
                handleInputChange({ target: { name: 'salesmanId', value: option.value } })
              }
              className="bg-white"
            />
          </div>

          <div className="col-span-full xl:col-span-1">
            <label className="block text-sm font-medium mb-1">Customer</label>
            <div className="flex gap-2 mb-2">
              <Input
                name="customerCode"
                value={formData.customerCode}
                onChange={handleInputChange}
                placeholder="Code"
                className="w-1/2 bg-white"
              />
              <Input
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-1/2 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ...
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={setShowSOAModal}
                className="flex-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                SOA
              </button>
              <button
                type="button"
                onClick={setShowTransModal}
                className="flex-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Items Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesOrderSlip
