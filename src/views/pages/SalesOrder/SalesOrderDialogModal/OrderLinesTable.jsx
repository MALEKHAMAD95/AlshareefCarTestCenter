import { useState } from 'react';

const materials = [
  { id: 1, code: 'MAT001', name: 'Material 1', vat: 10, salesVat: 15 },
  { id: 2, code: 'MAT002', name: 'Material 2', vat: 12, salesVat: 18 },
];

export default function OrderLinesTable({ orderLines, setOrderLines, calculateTotals, setAlert }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...orderLines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };

    if (field === 'itemCode' || field === 'itemName') {
      const matchedMaterial = materials.find(
        (m) =>
          m.code.toLowerCase() === value.toLowerCase() ||
          m.name.toLowerCase() === value.toLowerCase()
      );
      if (matchedMaterial) {
        updatedLines[index].itemCode = matchedMaterial.code;
        updatedLines[index].itemName = matchedMaterial.name;
        updatedLines[index].vatPercentage = matchedMaterial.salesVat;
      } else if (value) {
        setAlert({ message: 'Invalid material. Please select a valid code or name.', type: 'error' });
        updatedLines[index].itemCode = '';
        updatedLines[index].itemName = '';
        updatedLines[index].vatPercentage = '';
      }
    }

    setOrderLines(updatedLines);
    if (field === 'qty' || field === 'price' || field === 'vatPercentage') {
      calculateTotals();
    }
  };

  const addLine = () => {
    const newLine = {
      id: `100000${orderLines.length + 1}`,
      lineNumber: orderLines.length + 1,
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
    };
    setOrderLines([...orderLines, newLine]);
  };

  const removeLine = (index) => {
    const updatedLines = orderLines.filter((_, i) => i !== index);
    updatedLines.forEach((line, i) => {
      line.lineNumber = i + 1;
    });
    setOrderLines(updatedLines);
    calculateTotals();
  };

  const openMaterialModal = (index) => {
    setSelectedRowIndex(index);
    // Placeholder for material modal; implement if needed
    setAlert({ message: 'Material selection modal not implemented.', type: 'error' });
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-4">
      <div className="card-header p-3 bg-gray-100">Order Lines</div>
      <div className="p-4">
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Line</th>
                <th className="p-2">Line Type</th>
                <th className="p-2">Item Code</th>
                <th className="p-2">Item Name</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Bonus</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">VAT %</th>
                <th className="p-2">VAT Amount</th>
                <th className="p-2">Warehouse</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderLines.map((line, index) => (
                <tr key={line.id}>
                  <td className="p-2">
                    <input
                      value={line.lineNumber}
                      readOnly
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={line.lineType}
                      onChange={(e) => handleLineChange(index, 'lineType', e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="0">Material</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <div className="flex">
                      <input
                        value={line.itemCode}
                        onChange={(e) => handleLineChange(index, 'itemCode', e.target.value)}
                        className="flex-1 p-1 border rounded-l"
                        type="text"
                        list={`datalistOptionsCode${index}`}
                      />
                      <datalist id={`datalistOptionsCode${index}`}>
                        <option value="MAT001" />
                        <option value="MAT002" />
                        <option value="MAT003" />
                      </datalist>
                      <button
                        type="button"
                        onClick={() => openMaterialModal(index)}
                        className="p-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                      >
                        ...
                      </button>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex">
                      <input
                        value={line.itemName}
                        onChange={(e) => handleLineChange(index, 'itemName', e.target.value)}
                        className="flex-1 p-1 border rounded-l"
                        type="text"
                        list={`datalistOptionsName${index}`}
                      />
                      <datalist id={`datalistOptionsName${index}`}>
                        <option value="Material 1" />
                        <option value="Material 2" />
                        <option value="Material 3" />
                      </datalist>
                      <button
                        type="button"
                        onClick={() => openMaterialModal(index)}
                        className="p-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                      >
                        ...
                      </button>
                    </div>
                  </td>
                  <td className="p-2">
                    <select
                      value={line.subUnitId}
                      onChange={(e) => handleLineChange(index, 'subUnitId', e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="">Select</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={line.qty}
                      onChange={(e) => handleLineChange(index, 'qty', e.target.value)}
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={line.bonus}
                      onChange={(e) => handleLineChange(index, 'bonus', e.target.value)}
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={line.price}
                      onChange={(e) => handleLineChange(index, 'price', e.target.value)}
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={line.total}
                      readOnly
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={line.vatPercentage}
                      onChange={(e) => handleLineChange(index, 'vatPercentage', e.target.value)}
                      className="w-full p-1 border rounded"
                       type="number" min="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={line.vatAmount}
                      onChange={(e) => handleLineChange(index, 'vatAmount', e.target.value)}
                      className="w-full p-1 border rounded"
                       type="number" min="0"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={line.warehouse}
                      onChange={(e) => handleLineChange(index, 'warehouse', e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="1">Warehouse 1</option>
                      <option value="2">Warehouse 2</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={line.notes}
                      onChange={(e) => handleLineChange(index, 'notes', e.target.value)}
                      className="w-full p-1 border rounded"
                      type="text"
                    />
                  </td>
                  <td className="p-2 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      type="button"
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addLine}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Line <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
}