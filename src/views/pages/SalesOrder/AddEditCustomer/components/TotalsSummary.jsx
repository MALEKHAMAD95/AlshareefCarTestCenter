

export const TotalsSummary = ({ formData }) => {
    const items = [
        { label: 'Gross Total', value: formData.grossTotal, color: 'bg-success' },
        { label: 'Total Surcharges', value: formData.totalSurcharges, color: 'bg-warning' },
        { label: 'Total Discount', value: formData.totalDiscounts, color: 'bg-error' },
        { label: 'Total Promotions', value: formData.totalPromotions, color: 'bg-warning' },
        { label: 'Total VAT', value: formData.totalVat, color: 'bg-success' },
        { label: 'Net Total', value: formData.netTotal, color: 'bg-success' },
    ]
    return (
        <div className="flex flex-col gap-10 bg-white shadow-md rounded-lg p-4">
            {items.map((item, index) => (
                <div key={item.label} className="flex items-center gap-16">
                    <div className="flex items-center gap-2">
                        <div className="rounded-full h-8 w-8 border-2 border-gray-200 dark:border-gray-600 font-bold text-sm flex items-center justify-center">
                            {index + 1}
                        </div>
                        <div className="text-sm font-medium">{item.label}</div>
                    </div>
                    <div className="border-dashed  border-gray-300 dark:border-gray-500 flex-1" />
                    <div>
                        <span className={`rounded-full px-2 py-1 text-white text-sm ${item.color}`}>
                            {item.value}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
