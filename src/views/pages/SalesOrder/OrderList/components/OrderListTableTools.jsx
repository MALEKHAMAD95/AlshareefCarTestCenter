import { useState, useRef, useEffect } from 'react'
import { Input, Button, DatePicker, Select } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { GetSalesmenPaging } from '@/services/ModelSserver/SalesmanServices'
import { triggerMessageError } from '@/components/shared/ToastMange'
import { TbSearch, TbSearchOff } from 'react-icons/tb'

const OrderTableTools = ({ setSearchItem, setFilters, translationPath, selectedRows = [], setShowBatchApprovalDialog }) => {
    const { t } = useTranslation()
    const [localSearch, setLocalSearch] = useState('')
    const [localFilters, setLocalFilters] = useState({
        startDate: '',
        endDate: '',
        saleman: null,
        createdBy: null,
    })
    const [salesmanOptions, setSalesmanOptions] = useState([])
    const [salesmanLoading, setSalesmanLoading] = useState(false)
    const isSalesmanFetchingRef = useRef(false)

    const fetchSalesmen = async () => {
        if (isSalesmanFetchingRef.current) return
        isSalesmanFetchingRef.current = true
        setSalesmanLoading(true)
        try {
            const response = await GetSalesmenPaging({
                pageIndex: 1,
                pageSize: 50,
                searchValue: '',
            })
            if (response.success && response.data) {
                const options = response.data.map((salesman) => ({
                    value: salesman.id,
                    label: `${salesman.code} - ${salesman.name}`,
                }))
                setSalesmanOptions(options)
            } else {
                triggerMessageError(t(`${translationPath}fetchSalesmanError`))
            }
        } catch (error) {
            console.error('Error fetching salesmen:', error)
            triggerMessageError(t(`${translationPath}fetchSalesmanError`))
        } finally {
            setSalesmanLoading(false)
            isSalesmanFetchingRef.current = false
        }
    }

    const handleSearch = () => {
        setSearchItem(localSearch)
        setFilters({ ...localFilters })
    }

    const handleFilterChange = (key, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const clearFilters = () => {
        const resetFilters = {
            startDate: '',
            endDate: '',
            saleman: null,
            createdBy: null,
        }
        setLocalFilters(resetFilters)
        setLocalSearch('')
        setSearchItem('')
        setFilters(resetFilters)
    }

    const handleBatchAction = () => {
        if ((selectedRows || []).length > 0) {
            setShowBatchApprovalDialog(true)
        } else {
            triggerMessageError(t(`${translationPath}noRowsSelected`))
        }
    }

    useEffect(() => {
        fetchSalesmen()
    }, [])

    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
                placeholder={t(`${translationPath}searchPlaceholder`)}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-48"
            />
            <div className="flex items-center gap-2">
                <DatePicker
                    placeholder={t(`${translationPath}startDate`)}
                    value={localFilters.startDate ? new Date(localFilters.startDate) : null}
                    onChange={(date) =>
                        handleFilterChange('startDate', date ? date.toISOString().split('T')[0] : '')
                    }
                    className="w-36"
                />
            </div>
            <div className="flex items-center gap-2">
                <DatePicker
                    placeholder={t(`${translationPath}endDate`)}
                    value={localFilters.endDate ? new Date(localFilters.endDate) : null}
                    onChange={(date) =>
                        handleFilterChange('endDate', date ? date.toISOString().split('T')[0] : '')
                    }
                    className="w-36"
                />
            </div>
            <Select
                options={salesmanOptions}
                value={localFilters.saleman}
                onChange={(value) => {
                    if (salesmanOptions.length === 0) fetchSalesmen()
                    handleFilterChange('saleman', value)
                }}
                placeholder={t(`${translationPath}selectSalesman`)}
                disabled={salesmanLoading}
                className="w-48"
            />
            {/* <Select
                options={salesmanOptions}
                value={localFilters.saleman}
                onChange={(value) => {
                    if (salesmanOptions.length === 0) fetchSalesmen()
                    handleFilterChange('saleman', value)
                }}
                placeholder={t(`${translationPath}selectSalesman`)}
                disabled={salesmanLoading}
                className="w-48"
            /> */}
            <Button
                onClick={handleSearch}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-100 focus:outline-none"
            >
                <TbSearch />
                <span>{t(`${translationPath}search`)}</span>
            </Button>
            <Button
                variant="plain"
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-red-600 hover:text-white focus:outline-none"
            >
                <TbSearchOff />
                <span>{t(`${translationPath}clearFilters`)}</span>
            </Button>
            <Button
                onClick={handleBatchAction}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-100 focus:outline-none"
                disabled={(selectedRows || []).length === 0}
            >
                {t(`${translationPath}batchApprove`)}
            </Button>
        </div>
    )
}

export default OrderTableTools