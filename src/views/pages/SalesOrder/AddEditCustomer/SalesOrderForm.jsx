import { useState } from 'react';
import OrderLinesTable from '../SalesOrderDialogModal/OrderLinesTable';
import CustomerModal from '../SalesOrderDialogModal/CustomerModal';
import PaymentModal from '../SalesOrderDialogModal/PaymentModal';
import SOAModal from '../SalesOrderDialogModal/SOAModal';
import Alert from '../SalesOrderDialogModal/Alert';
import AddNote from './components/AddNote';
import SalesOrderSlip from './components/SalesOrderSlip';
import { TotalsSummary } from './components/TotalsSummary';
import TransModal from '../SalesOrderDialogModal/TransModal';
import GeneralLines from './components/GeneralLines';

export default function SalesOrderForm() {

  const [formData, setFormData] = useState({
    slipNumber: '',
    date: '2023-05-15',
    time: '10:30',
    documentNumber: '',
    paymentId: '0',
    paymentCode: '',
    documentTrackingNumber: '',
    clientId: '0',
    customerCode: '',
    customerName: '',
    status: '1',
    warehouse: '0',
    salesmanId: '',
    notes1: '',
    notes2: '',
    notes3: '',
    notes4: '',
    notes5: '',
    notes6: '',
    grossTotal: 0,
    totalSurcharges: 0,
    totalDiscounts: 0,
    totalPromotions: 0,
    totalVat: 0,
    netTotal: 0,
  });

  const [orderLines, setOrderLines] = useState([
    {
      id: '10000000',
      lineNumber: 1,
      lineType: '0',
      itemCode: '',
      itemName: '',
      subUnitId: '',
      qty: '',
      bonus: '',
      price: '',
      total: '',
      vatPercentage: '',
      vatAmount: '',
      warehouse: '1',
      notes: '',
      deliveredQty: '0',
      salesmanId: '1',
      salesmanCode: '',
      reserve: '0',
      reservationDate: '',
      auxCode: '',
      discountPercentage: '0',
    },
  ]);

  const [showCustomerModal, setShowCustomerModal] = useState(false); 
  const [showTransModal, setShowTransModal] = useState(false);
  const [showSOAModal, setShowSOAModal] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setAlert({ message: 'Sales order slip saved successfully.', type: 'success' });
    // Add save logic here (e.g., API call)
  };

  const handleCancel = () => {
    setAlert({ message: 'Form reset.', type: 'error' });
    setFormData({
      slipNumber: '',
      date: '2023-05-15',
      time: '10:30',
      documentNumber: '',
      paymentId: '0',
      paymentCode: '',
      documentTrackingNumber: '',
      clientId: '0',
      customerCode: '',
      customerName: '',
      status: '1',
      warehouse: '0',
      salesmanId: '',
      notes1: '',
      notes2: '',
      notes3: '',
      notes4: '',
      notes5: '',
      notes6: '',
      grossTotal: 0,
      totalSurcharges: 0,
      totalDiscounts: 0,
      totalPromotions: 0,
      totalVat: 0,
      netTotal: 0,
    });
    setOrderLines([
      {
        id: '10000000',
        lineNumber: 1,
        lineType: '0',
        itemCode: '',
        itemName: '',
        subUnitId: '',
        qty: '',
        bonus: '',
        price: '',
        total: '',
        vatPercentage: '',
        vatAmount: '',
        warehouse: '1',
        notes: '',
        deliveredQty: '0',
        salesmanId: '1',
        salesmanCode: '',
        reserve: '0',
        reservationDate: '',
        auxCode: '',
        discountPercentage: '0',
      },
    ]);
  };

  const calculateTotals = () => {
    let grossTotal = 0;
    let totalVat = 0;
    orderLines.forEach((line) => {
      const qty = parseFloat(line.qty) || 0;
      const price = parseFloat(line.price) || 0;
      const vatPercentage = parseFloat(line.vatPercentage) || 0;
      const lineTotal = qty * price;
      const vatAmount = (lineTotal * vatPercentage) / 100;
      grossTotal += lineTotal;
      totalVat += vatAmount;
    });
    setFormData((prev) => ({
      ...prev,
      grossTotal,
      totalVat,
      netTotal: grossTotal + totalVat,
    }));
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Create Sales Order Slip</h2>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />
      <form>
        <SalesOrderSlip
          formData={formData}
          handleInputChange={handleInputChange}
          setShowPaymentModal={() => setIsPaymentOpen(true)}
          setShowCustomerModal={() => setShowCustomerModal(true)}  // Open the customer modal here
          setShowSOAModal={() => setShowSOAModal(true)}
          setShowTransModal={() => setShowTransModal(true)}
        />
        <OrderLinesTable
          orderLines={orderLines}
          setOrderLines={setOrderLines}
          calculateTotals={calculateTotals}
          setAlert={setAlert}
        />
                <GeneralLines
 
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-2">
            <AddNote formData={formData} handleInputChange={handleInputChange} />
          </div>
          <TotalsSummary formData={formData} handleInputChange={handleInputChange} />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </form>
      {/* Dialog */}
      <PaymentModal
        show={isPaymentOpen}
        handleClose={() => setIsPaymentOpen(false)}
        setFormData={setFormData}
        setAlert={setAlert}
      />
      <CustomerModal
        show={showCustomerModal}
        handleClose={() => setShowCustomerModal(false)}
        setFormData={setFormData}
        setAlert={setAlert}
      />
      <SOAModal
        show={showSOAModal}
        handleClose={() => setShowSOAModal(false)}
        setAlert={setAlert}
        setFormData={setFormData}
      />
      <TransModal
        show={showTransModal}
        handleClose={() => setShowTransModal(false)}
        setFormData={setFormData}
        setAlert={setAlert}
      />
      {/* Dialog */}
    </div>
  );
}