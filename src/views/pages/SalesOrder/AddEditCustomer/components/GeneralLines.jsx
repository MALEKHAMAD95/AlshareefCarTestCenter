import React, { useState, useEffect } from 'react';

const GeneralLines = ({ selectedtrcode = 1 }) => {
  const materials = [
    { id: 1, code: 'MAT001', name: 'Material 1', vat: 10, salesVat: 15 },
    { id: 2, code: 'MAT002', name: 'Material 2', vat: 12, salesVat: 18 },
  ];

  const materialUnits = [
    { id: 1, materialId: 1, subUnitId: 1, mainUnitId: 1, unitCode: 'PCS', factor1: 1, factor2: 1 },
    { id: 2, materialId: 1, subUnitId: 2, mainUnitId: 1, unitCode: 'BOX', factor1: 10, factor2: 1 },
    { id: 3, materialId: 2, subUnitId: 3, mainUnitId: 2, unitCode: 'KG', factor1: 1, factor2: 1 },
  ];

  const salesmen = [
    { id: 1, name: 'John Doe', code: 'S001' },
    { id: 2, name: 'Jane Smith', code: 'S002' },
  ];

  const warehouses = [
    { WarehouseNumber: 1, name: 'Main Warehouse' },
    { WarehouseNumber: 2, name: 'Secondary Warehouse' },
  ];

  const paymentCodes = [
    { id: 1, code: 'CASH', name: 'Cash' },
    { id: 2, code: 'CREDIT', name: 'Credit' },
  ];

  const [lines, setLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(1);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    addLine();
  }, []);

  const addLine = () => {
    const newLine = {
      id: Date.now(),
      lineNumber: lineIndex,
      lineType: 0,
      itemCode: '',
      itemName: '',
      subUnitId: '',
      qty: 0,
      bonus: 0,
      price: 0,
      total: 0,
      vatPercentage: 0,
      vatAmount: 0,
      warehouse: '',
      notes: '',
      deliveredQty: 0,
      salesmanId: '',
      salesmanCode: '',
      paymentCode: '',
      reserve: false,
      reservationDate: '',
      auxCode: '',
      discountPercentage: 0,
    };

    setLines([...lines, newLine]);
    setLineIndex(lineIndex + 1);
  };

  const removeLine = (id) => {
    setLines(lines.filter((line) => line.id !== id));
  };

  const handleChange = (id, field, value) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };

          if (['qty', 'price', 'vatPercentage', 'discountPercentage'].includes(field)) {
            return calculateLineTotals(updatedLine);
          }

          return updatedLine;
        }
        return line;
      })
    );
  };

  const calculateLineTotals = (line) => {
    const qty = parseFloat(line.qty) || 0;
    const price = parseFloat(line.price) || 0;
    const vatPercentage = parseFloat(line.vatPercentage) || 0;
    const discountPercentage = parseFloat(line.discountPercentage) || 0;

    const subtotal = qty * price;
    const discountAmount = subtotal * (discountPercentage / 100);
    const amountAfterDiscount = subtotal - discountAmount;
    const vatAmount = amountAfterDiscount * (vatPercentage / 100);
    const total = amountAfterDiscount + vatAmount;

    return {
      ...line,
      total: total.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
    };
  };

  const selectMaterial = (material) => {
    if (currentRow) {
      const materialVat = selectedtrcode === 1 ? material.salesVat : material.vat;
      const units = materialUnits.filter((unit) => unit.materialId === material.id);

      setLines(
        lines.map((line) => {
          if (line.id === currentRow) {
            return {
              ...line,
              itemCode: material.code,
              itemName: material.name,
              vatPercentage: materialVat,
              subUnitId: units.length > 0 ? units[0].subUnitId : '',
            };
          }
          return line;
        })
      );
    }

    setShowMaterialModal(false);
    setMaterialSearch('');
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.code.toLowerCase().includes(materialSearch.toLowerCase()) ||
      material.name.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">General Lines</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[2000px] w-full text-xs border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {[
                  'Line',
                  'LineType',
                  'ItemCode',
                  'ItemName',
                  'Unit',
                  'Quantity',
                  'Bonus',
                  'Price',
                  'Total',
                  'Vat%',
                  'VatAmount',
                  'Warehouse',
                  'Notes',
                  'DeliveredQty',
                  'Salesman',
                  'SalesmanCode',
                  'PaymentCode',
                  'Reserve',
                  'ReservationDate',
                  'AuxCode',
                  'Discount%',
                  'Actions',
                ].map((header) => (
                  <th key={header} className="p-2 border text-left whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-t">
                  <td className="p-2">{line.lineNumber}</td>
                  <td className="p-2">
                    <select
                      className="w-full border rounded p-1"
                      value={line.lineType}
                      onChange={(e) => handleChange(line.id, 'lineType', e.target.value)}
                    >
                      <option value="0">Material</option>
                      <option value="1">Promotion</option>
                      <option value="2">Discount</option>
                      <option value="3">Surcharge</option>
                    </select>
                  </td>
                  <td className="p-2 flex gap-1">
                    <input
                      type="text"
                      className="w-full border rounded p-1"
                      value={line.itemCode}
                      onChange={(e) => handleChange(line.id, 'itemCode', e.target.value)}
                      onBlur={(e) => {
                        const material = materials.find((m) => m.code === e.target.value);
                        if (material) {
                          handleChange(line.id, 'itemCode', material.code);
                          handleChange(line.id, 'itemName', material.name);
                          const vat = selectedtrcode === 1 ? material.salesVat : material.vat;
                          handleChange(line.id, 'vatPercentage', vat);
                        }
                      }}
                    />
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        setCurrentRow(line.id);
                        setShowMaterialModal(true);
                      }}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full border rounded p-1"
                      value={line.itemName}
                      onChange={(e) => handleChange(line.id, 'itemName', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="w-full border rounded p-1"
                      value={line.subUnitId}
                      onChange={(e) => handleChange(line.id, 'subUnitId', e.target.value)}
                    >
                      {materialUnits
                        .filter((unit) => {
                          const material = materials.find((m) => m.code === line.itemCode);
                          return material ? unit.materialId === material.id : false;
                        })
                        .map((unit) => (
                          <option key={unit.id} value={unit.subUnitId}>
                            {unit.unitCode}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* Continue with similar fields for qty, bonus, price, etc... */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          onClick={addLine}
        >
          Add Line <i className="fas fa-plus ml-1" />
        </button>
      </div>

      {showMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Select Material</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowMaterialModal(false);
                  setMaterialSearch('');
                }}
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                className="w-full border rounded p-2 mb-4"
                placeholder="Search Description"
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
              />
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Desc</th>
                    <th className="p-2 border">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="border-t">
                      <td className="p-2">{material.code}</td>
                      <td className="p-2">{material.name}</td>
                      <td className="p-2">
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          onClick={() => selectMaterial(material)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralLines;
