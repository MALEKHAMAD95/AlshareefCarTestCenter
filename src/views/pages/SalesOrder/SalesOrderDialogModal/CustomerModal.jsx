import { useEffect, useState, useRef } from 'react'
import SharedDialog from '@/components/shared/SharedDialog'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import { HiOutlineSearch } from 'react-icons/hi'
import { GetCustomersPaging } from '@/services/ModelSserver/CustomerServices'
import { useTranslationValue } from '@/locales'
import { useTranslation } from 'react-i18next'

const { Tr, Th, Td, THead, TBody } = Table

export default function CustomerModal({
    show,
    handleClose,
    setFormData,
    setAlert,
}) {
    const translationPath = 'views.Order.'
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [customers, setCustomers] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize] = useState(10) // Matches API pageSize
    const [totalItems, setTotalItems] = useState(0)
    const debounceRef = useRef(null)
    const { t } = useTranslation(useTranslationValue)

    const fetchCustomers = async (searchValue = '', page = 1) => {
        setIsLoading(true)
        try {
            const response = await GetCustomersPaging({
                pageIndex: page,
                pageSize: pageSize,
                searchValue: searchValue,
            })
            setCustomers(response.data || [])
            setTotalItems(response.totalCount || 0) // Use totalCount from API
        } catch (error) {
            console.error('Error fetching customers:', error)
            setCustomers([])
            setTotalItems(0)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (show) {
            fetchCustomers('', 1) // Reset to page 1 when modal opens
        }
    }, [show])

    useEffect(() => {
        if (!show) return

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchCustomers(search.trim(), 1) // Reset to page 1 on search
            setPageIndex(1)
        }, 500)
    }, [search])

    const handlePageChange = (newPage) => {
        setPageIndex(newPage)
        fetchCustomers(search.trim(), newPage)
    }

    const handleSelect = (customer) => {
        setFormData(customer)
        setAlert({
            message: `${t(`${translationPath}SelectedCustomer`)}: ${customer.firstName}`,
            type: 'success',
        })
        handleClose()
    }

    if (!show) return null

    return (
        <SharedDialog
            isOpen={show}
            title={t(`${translationPath}SelectCustomer`)}
            width={600}
            cancelText={t(`${translationPath}Cancel`)}
            confirmText={t(`${translationPath}Close`)}
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
                    maxWidth: '800px',
                    margin: '0',
                    top: 'auto',
                    bottom: 'auto',
                    transform: 'none',
                },
            }}
        >
            <div className="p-2 min-h-96">
                <div className="mb-4">
                    <Tooltip title={t(`${translationPath}SearchByCodeOrName`)}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t(`${translationPath}SearchCustomer`)}
                            prefix={
                                <HiOutlineSearch className="text-lg text-gray-500" />
                            }
                        />
                    </Tooltip>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-4">
                        {t(`${translationPath}LoadingCustomers`)}
                    </div>
                ) : (
                    <div className="overflow-auto max-h-[500px] rounded-md overflow-x-auto">
                        <Table className="text-sm">
                            <THead>
                                <Tr>
                                    <Th>{t(`${translationPath}Code`)}</Th>
                                    <Th>{t(`${translationPath}Name`)}</Th>
                                    <Th className="text-center">
                                        {t(`${translationPath}Actions`)}
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <Tr key={customer.id}>
                                            <Td>{customer.code}</Td>
                                            <Td>{customer.firstName}</Td>
                                            <Td className="text-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleSelect(customer)
                                                    }
                                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                >
                                                    {t(
                                                        `${translationPath}Select`,
                                                    )}
                                                </button>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td
                                            colSpan="3"
                                            className="text-center p-4 text-gray-400"
                                        >
                                            {t(
                                                `${translationPath}NoCustomersFound`,
                                            )}
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </div>
                )}
                {totalItems > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            total={totalItems}
                            pageSize={pageSize}
                            currentPage={pageIndex}
                            onChange={handlePageChange}
                            displayTotal
                        />
                    </div>
                )}
            </div>
        </SharedDialog>
    )
}
