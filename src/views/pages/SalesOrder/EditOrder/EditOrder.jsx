import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UpdateOrder } from '@/services/ModelSserver/OrderServices'
import { FcPlus, FcDeleteRow } from 'react-icons/fc'
import {
    triggerMessageError,
    triggerMessageSuccessfully,
} from '@/components/shared/ToastMange'
import { useTranslation } from 'react-i18next'
import { Input, Tag, Tooltip, Select, Button, Dialog } from '@/components/ui'
import { GetSalesmenPaging } from '@/services/ModelSserver/SalesmanServices'
import { TbFilter } from 'react-icons/tb'
import PaymentModal from '../SalesOrderDialogModal/PaymentModal'
import CustomerModal from '../SalesOrderDialogModal/CustomerModal'
import { GetAllWarehouse } from '@/services/ModelSserver/WarehouseServices'
import TransModal from '../AddEditCustomer/components/TransModal'
import SOAModal from '../AddEditCustomer/components/SOAModal'
import LoaderSpinner from '@/components/shared/LoaderSpinner'
import { useTranslationValue } from '@/locales'
import moment from 'moment'
import SalesOrderItemNameModal from '../AddEditCustomer/SalesOrderItemNameModal'
import { GetOrderById } from '@/services/ModelSserver/OrderServices';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { LiaSave } from 'react-icons/lia';

function SortableTableHeader({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    return (
        <th
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-2 text-left capitalize text-xs text-gray-600"
        >
            {children}
        </th>
    )
}

function EditOrder() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { t } = useTranslation(useTranslationValue)
    const translationPath = 'views.Order.'
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [alert, setAlert] = useState({ message: '', type: '' })
    const [paymentType, setpaymentTypeId] = useState(null)
    const isSalesmanFetchingRef = useRef(false);

    const [orderTransactions, setOrderTransactions] = useState([])
    const [generalLines, setGeneralLines] = useState([])
    const [currentId, setCurrentId] = useState(1)
    const [bonusInputs, setBonusInputs] = useState({})
    const [showItemNameModal, setShowItemNameModal] = useState({
        show: false,
        id: null,
    })
    const [notes1, setNotes1] = useState('')
    const [notes2, setNotes2] = useState('')
    const [notes3, setNotes3] = useState('')
    const [notes4, setNotes4] = useState('')
    const [notes5, setNotes5] = useState('')
    const [notes6, setNotes6] = useState('')
    const [slipNumber, setSlipNumber] = useState('')
    const [documentTrackingNumber, setDocumentTrackingNumber] = useState('')
    const [document, setDocument] = useState('')
    const [showTransModal, setShowTransModal] = useState(false)
    const [showSOAModal, setShowSOAModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const hasFetchedWarehousesRef = useRef(false)
    const [warehouses, setWarehouses] = useState([])
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false)
    const [salesmanOptions, setSalesmanOptions] = useState([])
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(0)
    const [salesManId, setSalesManId] = useState(0)
    const [Customer, setCustomer] = useState(null)
    const [salesmanLoading, setSalesmanLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [generalLinesDialogYesORno, setGeneralLinesDialogYesORno] =
        useState(false)

    const [IsCustomerModalOpen, setIsCustomerModalOpen] = useState(null)


    const getDefaultDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    const getDefaultTime = () => {
        const now = new Date()
        return now.toTimeString().slice(0, 8)
    }
    const handleTimeChange = (e) => {
        const formattedTime = moment(e.target.value, 'HH:mm').format('HH:mm:ss')
        setTime(formattedTime)
    }

    const [dateS, setDate] = useState(getDefaultDate())
    const [time, setTime] = useState(getDefaultTime())
    const [selectedStatus, setSelectedStatus] = useState(1)

    const statusOptions = [
        { value: 1, label: t(`${translationPath}Pending`) },
        { value: 4, label: t(`${translationPath}Approved`) },
        { value: 2, label: t(`${translationPath}Rejected`) },
    ]

    const handleStatusChange = (option) => {
        setSelectedStatus(option.value)
    }

    const openDialog = () => {
        setIsOpen(true)
        setGeneralLinesDialogYesORno(false)
    }

    const openDialogGeneral = () => {
        setIsOpen(true)
        setGeneralLinesDialogYesORno(true)
    }

    const closeDialog = () => setIsOpen(false)

    useEffect(() => {
        const fetchWarehouses = async () => {
            setIsLoadingWarehouses(true)
            const result = await GetAllWarehouse()
            if (result?.data) {
                const options = result.data.map((warehouse) => ({
                    label: warehouse.name,
                    value: warehouse.id,
                }))
                setWarehouses([...options])
            }
            setIsLoadingWarehouses(false)
        }

        if (!hasFetchedWarehousesRef.current) {
            fetchWarehouses()
            hasFetchedWarehousesRef.current = true
        }
    }, [])

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await GetOrderById(id);
                if (response.success && response.data) {
                    const { order, details } = response.data;
                    const orderId = order.id; // Only extract id from order object

                    const idMapping = new Map();
                    details.forEach((detail, index) => {
                        const newId = currentId + index;
                        idMapping.set(detail.id, newId);
                    });

                    let transactions = details.map((detail, index) => {
                        const newId = currentId + index;
                        let apiParentLineId = detail.parentLineId || 0;
                        const isMaterial = detail.lineType === lineTypeMap['Material'];
                        const isDiscount = detail.lineType === lineTypeMap['Discount'];
                        const isPromotion = detail.lineType === lineTypeMap['Promotion'];
                        const isSurcharge = detail.lineType === lineTypeMap['Surcharge'];
                        let newParentLineId = 0;

                        if (isMaterial) {
                            const parent = details.find((d) => d.id === apiParentLineId);
                            if (parent && parent.lineType === lineTypeMap['Material']) {
                                newParentLineId = idMapping.get(apiParentLineId);
                            }
                        } else if (isDiscount || isPromotion || isSurcharge) {
                            let foundParent = false;
                            for (let i = index - 1; i >= 0; i--) {
                                if (details[i].lineType === lineTypeMap['Material']) {
                                    newParentLineId = idMapping.get(details[i].id);
                                    foundParent = true;
                                    break;
                                }
                            }
                            if (!foundParent) {
                                newParentLineId = 0;
                            }
                        }


                        return {
                            id: detail.id || newId,
                            parentLineId: newParentLineId,
                            lineType: detail.lineType || 0,
                            vatAmount: detail.vatAmount || 0,
                            vatPercentage: detail.vatPercentage || 0,
                            qty: detail.qty || 1,
                            baseQty: detail.qty || 1,
                            distributedPromotion: detail.distributedPromotion || 0,
                            price: detail.price || 0,
                            notes: detail.notes || '',
                            deliveredQty: detail.deliveredQty || 0,
                            reserve: detail.reserve || 0,
                            reservationDate: detail.reservationDate || null,
                            auxCode: detail.auxCode || '',
                            discountPercentage: detail.discountPercentage || 0,
                            distributedDiscount: detail.distributedDiscount || 0,
                            distributedCost: detail.distributedCost || 0,
                            distributedSurcharge: detail.distributedSurcharge || 0,
                            distributedSurchargeVat: detail.distributedSurchargeVat || 0,
                            vatBaseTotal: detail.vatBaseTotal || 0,
                            globalTransaction: detail.globalTransaction || 0,
                            fullyShipped: detail.fullyShipped || 0,
                            lineNet: detail.lineNet || 0,
                            total: detail.total || 0,
                            materialId: detail.materialId || 0,
                            cancelled: detail.cancelled || 0,
                            closed: detail.closed || 0,
                            orderId: orderId, // Use the extracted orderId
                            clientId: detail.clientId || 0,
                            lineNumber: detail.lineNumber || 0,
                            subUnitId: detail.subUnitId || 0,
                            mainUnitId: detail.mainUnitId || 0,
                            factor1: detail.factor1 || 0,
                            factor2: detail.factor2 || 0,
                            unitCode: detail.unitCode || '',
                            availableUnits: [], // Placeholder for available units
                            selectedUnit: '',   // Placeholder for selected unit
                            warehouse: detail.warehouse || 0,

                            salesManId: detail.salesManId || 0,
                            paymentId: '',
                            status: detail.status || 0,
                            modifedStatus: detail.modifedStatus || 0,
                            demandId: detail.demandId || 0,
                            demandDetailsId: detail.demandDetailsId || 0,
                            new: detail.new || 0,
                        };
                    });

                    let generalLinesData = details.filter((detail) => detail.globalTransaction === 1).map((detail, index) => {
                        const newId = currentId + transactions.length + index;
                        return {
                            id: newId,
                            parentLineId: 0,
                            lineType: detail.lineType || 0,
                            vatAmount: detail.vatAmount || 0,
                            vatPercentage: detail.vatPercentage || 0,
                            qty: detail.qty || 0,
                            baseQty: detail.qty || 0,
                            distributedPromotion: detail.distributedPromotion || 0,
                            price: detail.price || 0,
                            notes: detail.notes || '',
                            deliveredQty: detail.deliveredQty || 0,
                            reserve: detail.reserve || 0,
                            reservationDate: detail.reservationDate || null,
                            auxCode: detail.auxCode || '',
                            discountPercentage: detail.discountPercentage || 0,
                            distributedDiscount: detail.distributedDiscount || 0,
                            distributedCost: detail.distributedCost || 0,
                            distributedSurcharge: detail.distributedSurcharge || 0,
                            distributedSurchargeVat: detail.distributedSurchargeVat || 0,
                            vatBaseTotal: detail.vatBaseTotal || 0,
                            globalTransaction: detail.globalTransaction || 0,
                            fullyShipped: detail.fullyShipped || 0,
                            lineNet: detail.lineNet || 0,
                            total: detail.total || 0,
                            materialId: detail.materialId || 0,
                            cancelled: detail.cancelled || 0,
                            closed: detail.closed || 0,
                            orderId: orderId, // Use the extracted orderId
                            clientId: detail.clientId || 0,
                            lineNumber: detail.lineNumber || 0,
                            subUnitId: detail.subUnitId || 0,
                            mainUnitId: detail.mainUnitId || 0,
                            factor1: detail.factor1 || 0,
                            factor2: detail.factor2 || 0,
                            unitCode: detail.unitCode || '',
                            warehouse: detail.warehouse || 0,
                            warehouseCostGroup: detail.warehouseCostGroup || 0,
                            salesManId: detail.salesManId || 0,
                            paymentId: '',
                            status: detail.status || 0,
                            modifedStatus: detail.modifedStatus || 0,
                            demandId: detail.demandId || 0,
                            demandDetailsId: detail.demandDetailsId || 0,
                            new: detail.new || 0,
                        };
                    });

                    setOrderTransactions(sortTransactions(transactions));
                    setGeneralLines(sortTransactions(generalLinesData));
                    setCurrentId(currentId + transactions.length + generalLinesData.length);
                    setSlipNumber(order.slipNumber || '');
                    setDocumentTrackingNumber(order.documentTrackingNumber || '');
                    setSalesManId(order.salesManId || 0);
                    setNotes1(order.notes1 || '');
                    setNotes2(order.notes2 || '');
                    setNotes3(order.notes3 || '');
                    setNotes4(order.notes4 || '');
                    setNotes5(order.notes5 || '');
                    setNotes6(order.notes6 || '');
                } else {
                    throw new Error('Failed to fetch order data');
                }
            } catch (error) {
                setError('Error loading order: ' + (error.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    useEffect(() => {
        fetchSalesmen()
    }, [])

    const fetchSalesmen = async () => {
        if (isSalesmanFetchingRef.current) return;
        isSalesmanFetchingRef.current = true;
        setSalesmanLoading(true);
        try {
            const response = await GetSalesmenPaging({
                pageIndex: 1,
                pageSize: 50,
                searchValue: '',
            });
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const [orderTableColumns, setOrderTableColumns] = useState(() => {
        const saved = localStorage.getItem('orderTableColumns')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                return {
                    visible: parsed.visible || parsed,
                    order:
                        parsed.order || Object.keys(parsed.visible || parsed),
                }
            } catch {
                // Fallback to default
            }
        }
        return {
            visible: {
                'Line Type': true,
                Line: true,
                'Material ID': true,
                Unit: true,
                'VAT Amount': true,
                Actions: true,
                'VAT %': true,
                Quantity: true,
                Bonus: true,
                Price: true,
                Notes: true,
                'Delivered Qty': true,
                Reserve: true,
                'Reservation Date': true,
                'Aux Code': true,
                'Discount %': true,
                'Discount Amount': true,
                Total: true,
            },
            order: [
                'Line Type',
                'Line',
                'Material ID',
                'Unit',
                'VAT Amount',
                'Actions',
                'VAT %',
                'Quantity',
                'Bonus',
                'Price',
                'Notes',
                'Delivered Qty',
                'Reserve',
                'Reservation Date',
                'Aux Code',
                'Discount %',
                'Discount Amount',
                'Total',
            ],
        }
    })

    const [generalTableColumns, setGeneralTableColumns] = useState(() => {
        const saved = localStorage.getItem('generalTableColumns')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                return {
                    visible: parsed.visible || parsed,
                    order:
                        parsed.order || Object.keys(parsed.visible || parsed),
                }
            } catch {
                // Fallback to default
            }
        }
        return {
            visible: {
                Total: true,
                'Line Type': true,
                'Line Number': true,
                'Material ID': true,
                'VAT Amount': true,
                Actions: true,
                'VAT %': true,
                Quantity: true,
                Promotion: true,
                Price: true,
                Notes: true,
                'Delivered Qty': true,
                Reserve: true,
                'Reservation Date': true,
                'Aux Code': true,
                'Discount %': true,
                'Discount Amount': true,
            },
            order: [
                'Total',
                'Line Type',
                'Line Number',
                'Material ID',
                'VAT Amount',
                'Actions',
                'VAT %',
                'Quantity',
                'Promotion',
                'Price',
                'Notes',
                'Delivered Qty',
                'Reserve',
                'Reservation Date',
                'Aux Code',
                'Discount %',
                'Discount Amount',
            ],
        }
    })

    useEffect(() => {
        localStorage.setItem(
            'orderTableColumns',
            JSON.stringify(orderTableColumns),
        )
    }, [orderTableColumns])

    useEffect(() => {
        localStorage.setItem(
            'generalTableColumns',
            JSON.stringify(generalTableColumns),
        )
    }, [generalTableColumns])

    const sortTransactions = (transactions) => {
        return transactions
    }

    const getLineNumbers = (transactions) => {
        return transactions.map((_, index) => (index + 1).toString())
    }

    const lineTypeMap = {
        Material: 0,
        Promotion: 1,
        Discount: 2,
        Surcharge: 3,
    }

    const reverseLineTypeMap = {
        0: t(`${translationPath}Material`),
        1: t(`${translationPath}Promotion`),
        2: t(`${translationPath}Discount`),
        3: t(`${translationPath}Surcharge`),
    }

    const reserveMap = {
        No: 0,
        Yes: 1,
    }

    const reverseReserveMap = {
        0: t(`${translationPath}No`),
        1: t(`${translationPath}Yes`),
    }

    const addNewTransaction = () => {
        const newTransaction = {
            id: currentId,
            parentLineId: 0,
            lineType: lineTypeMap['Material'],
            vatAmount: 0,
            vatPercentage: 0,
            qty: 1,
            baseQty: 1,
            distributedPromotion: 0,
            distributedCost: 0,
            distributedSurcharge: 0,
            price: 0,
            notes: '',
            deliveredQty: 0,
            reserve: 0,
            reservationDate: null,
            auxCode: '',
            discountPercentage: 0,
            distributedDiscount: 0,
            distributedSurchargeVat: 0,
            vatBaseTotal: 0,
            globalTransaction: 0,
            fullyShipped: 0,
            lineNet: 0,
            total: 0,
            materialId: 0,
            cancelled: 0,
            closed: 0,
            lineNumber: 0,
            subUnitId: 0,
            availableUnits: [],
            selectedUnit: '',
            ///////////////////////
            orderId: 0,
            clientId: 0,
            warehouse: 0,
            warehouseCostGroup: 0,
            salesManId: 0,
            paymentId: '',
            status: 0,
            modifedStatus: 0,
            demandId: 0,
            demandDetailsId: 0,
            new: 1,
            mainUnitId: 0,
            factor1: 0,
            factor2: 0,
            unitCode: '',
        };
        setOrderTransactions([...orderTransactions, newTransaction])
        setCurrentId(currentId + 1)
    };

    const addChildTransaction = (
        parentId,
        lineTypeStr = t(`${translationPath}Promotion`),
        bonusValue = 0,
        discountPercentage = 0,
        discountAmount = 0,
    ) => {
        const parent = orderTransactions.find((line) => line.id === parentId)
        if (!parent) return;

        const lineType = lineTypeMap[lineTypeStr]
        const childTotal =
            lineTypeStr === t(`${translationPath}Promotion`)
                ? bonusValue * parent.price
                : lineTypeStr === t(`${translationPath}Discount`)
                    ? -discountAmount
                    : 0

        const newTransaction = {
            id: currentId,
            parentLineId: parentId,
            lineType: lineType,
            vatAmount:
                lineTypeStr === t(`${translationPath}Promotion`)
                    ? (childTotal * parent.vatPercentage) / 100
                    : lineTypeStr === t(`${translationPath}Surcharge`)
                        ? 0
                        : 0,
            vatPercentage:
                lineTypeStr === t(`${translationPath}Promotion`)
                    ? parent.vatPercentage
                    : lineTypeStr === t(`${translationPath}Surcharge`)
                        ? 0
                        : parent.vatPercentage,
            qty:
                lineTypeStr === t(`${translationPath}Promotion`)
                    ? bonusValue
                    : 0,
            baseQty:
                lineTypeStr === t(`${translationPath}Promotion`)
                    ? bonusValue
                    : 0,
            distributedPromotion: 0,
            price:
                lineTypeStr === t(`${translationPath}Surcharge`)
                    ? 0
                    : parent.price,
            notes: '',
            deliveredQty: 0,
            reserve: 0,
            reservationDate: null,
            auxCode: '',
            discountPercentage:
                lineTypeStr === t(`${translationPath}Discount`)
                    ? discountPercentage
                    : 0,
            distributedDiscount:
                lineTypeStr === t(`${translationPath}Discount`)
                    ? discountAmount
                    : 0,
            distributedSurchargeVat: 0,
            vatBaseTotal: 0,
            globalTransaction: 0,

            fullyShipped: 0,
            lineNet: 0,
            total: childTotal,
            materialId:
                lineTypeStr === t(`${translationPath}Surcharge`)
                    ? 0
                    : parseInt(parent.materialId) || 0,
            cancelled: 0,
            closed: 0,
            lineNumber: 0,
            subUnitId: parent.subUnitId || 0,
            availableUnits: parent.availableUnits,
            selectedUnit: '',



            ////////////////////////////
            warehouse: 0,
            warehouseCostGroup: 0,
            salesManId: 0,
            paymentId: '',
            status: 0,
            modifedStatus: 0,
            demandId: 0,
            demandDetailsId: 0,
            new: 1,
            mainUnitId: 0,
            factor1: 0,
            factor2: 0,
            unitCode: '',
            orderId: 0,
            clientId: 0,
            distributedCost: 0,
            distributedSurcharge: 0,

        }
        const updatedTransactions = sortTransactions([
            ...orderTransactions,
            newTransaction,
        ])
        setOrderTransactions(updatedTransactions);
        setCurrentId(currentId + 1);
    };

    const deleteTransaction = (lineId) => {
        const updatedTransactions = sortTransactions(
            orderTransactions.filter(
                (line) => line.id !== lineId && line.parentLineId !== lineId,
            ),
        )
        setOrderTransactions(updatedTransactions)
        setBonusInputs((prev) => {
            const updated = { ...prev };
            delete updated[lineId];
            return updated;
        });
    };

    const addGeneralLine = () => {
        const newLine = {
            id: currentId,
            lineType: lineTypeMap['Discount'],
            vatAmount: 0,
            vatPercentage: 0,
            qty: 0,
            baseQty: 0,
            distributedPromotion: 0,
            distributedCost: 0,
            distributedSurcharge: 0,
            price: 0,
            notes: '',
            deliveredQty: 0,
            reserve: 0,
            reservationDate: null,
            auxCode: '',
            discountPercentage: 0,
            distributedDiscount: 0,
            distributedSurchargeVat: 0,
            vatBaseTotal: 0,
            globalTransaction: 1,
            fullyShipped: 0,
            lineNet: 0,
            total: 0,
            materialId: 0,
            parentLineId: 0,
            cancelled: 0,
            closed: 0,
            lineNumber: 0,
            subUnitId: 0,
            ////////////////////////
            orderId: 0,
            clientId: 0,
            mainUnitId: 0,
            factor1: 0,
            factor2: 0,
            unitCode: '',
            warehouse: 0,
            warehouseCostGroup: 0,
            salesManId: 0,
            paymentId: '',
            status: 0,
            modifedStatus: 0,
            demandId: 0,
            demandDetailsId: 0,
            new: 1,
        }
        setGeneralLines([...generalLines, newLine])
        setCurrentId(currentId + 1);
    };

    const deleteGeneralLine = (lineId) => {
        setGeneralLines(generalLines.filter((line) => line.id !== lineId));
    };

    const handleAddDiscountChild = (id) => {
        const transaction = orderTransactions.find((l) => l.id === id)
        if (!transaction || transaction.parentLineId !== 0) return

        let discountPercentage = parseFloat(transaction.discountPercentage) || 0
        let distributedDiscount =
            parseFloat(transaction.distributedDiscount) || 0

        if (discountPercentage > 0 && distributedDiscount === 0) {
            distributedDiscount = (transaction.total * discountPercentage) / 100
        }
        if (distributedDiscount > 0 && discountPercentage === 0) {
            discountPercentage = transaction.total
                ? (distributedDiscount / transaction.total) * 100
                : 0
        }

        if (distributedDiscount === 0 && discountPercentage === 0) return;

        let updatedTransactions = [...orderTransactions]

        const newChild = {
            id: currentId,
            parentLineId: id,
            lineType: lineTypeMap['Discount'],
            vatAmount: 0,
            vatPercentage: 0,
            qty: 0,
            baseQty: 0,
            distributedPromotion: 0,
            distributedCost: 0,
            distributedSurcharge: 0,
            price: 0,
            notes: '',
            deliveredQty: 0,
            reserve: 0,
            reservationDate: null,
            auxCode: '',
            discountPercentage: discountPercentage,
            distributedDiscount: distributedDiscount,
            distributedSurchargeVat: 0,
            vatBaseTotal: 0,
            globalTransaction: 0,
            fullyShipped: 0,
            lineNet: 0,
            total: -distributedDiscount,
            materialId: 0,
            cancelled: 0,
            closed: 0,
            lineNumber: 0,
            subUnitId: 0,
            availableUnits: [],
            selectedUnit: '',
            ////////////////////////////
            mainUnitId: 0,
            factor1: 0,
            factor2: 0,
            unitCode: '',
            orderId: 0,
            clientId: 0,
            warehouse: 0,
            warehouseCostGroup: 0,
            salesManId: 0,
            paymentId: '',
            status: 0,
            modifedStatus: 0,
            demandId: 0,
            demandDetailsId: 0,
            new: 1,
        }
        updatedTransactions.push(newChild)
        setCurrentId(currentId + 1)

        updatedTransactions = updatedTransactions.map((l) => {
            if (l.id === id) {
                return {
                    ...l,
                    discountPercentage: 0,
                    distributedDiscount: 0,
                };
            }
            return l;
        });

        updatedTransactions = updatedTransactions.map((transaction) => {
            if (
                transaction.id === id &&
                transaction.lineType === lineTypeMap['Material'] &&
                transaction.parentLineId === 0
            ) {
                const childDiscounts = updatedTransactions.filter(
                    (l) =>
                        l.parentLineId === transaction.id &&
                        l.lineType === lineTypeMap['Discount'],
                )
                const totalDiscount = childDiscounts.reduce(
                    (sum, child) => sum + (child.distributedDiscount || 0),
                    0,
                )
                return {
                    ...transaction,
                    total: transaction.total - totalDiscount,
                }
            }
            return transaction
        })

        updatedTransactions = sortTransactions(updatedTransactions)
        setOrderTransactions(updatedTransactions)
    }

    const updateOrderTransaction = (id, field, value) => {
        let updatedTransactions = [...orderTransactions]
        const transactionIndex = updatedTransactions.findIndex(
            (transaction) => transaction.id === id,
        )
        if (transactionIndex === -1) return

        const updatedTransaction = {
            ...updatedTransactions[transactionIndex],
            [field]: value,
        }
        const oldQty = updatedTransaction.qty

        if (field === 'selectedUnit') {
            updatedTransaction.selectedUnit = value || ''
            const factorMatch =
                updatedTransaction.selectedUnit.match(/\( 1 x (\d+) \)/)
            const factor = factorMatch ? parseInt(factorMatch[1]) : 1
            const actualQty = updatedTransaction.baseQty * factor
            updatedTransaction.total = actualQty * updatedTransaction.price
            updatedTransaction.vatAmount =
                (updatedTransaction.total *
                    (parseFloat(updatedTransaction.vatPercentage) || 0)) /
                100
            updatedTransaction.lineNet =
                updatedTransaction.total - updatedTransaction.vatAmount
            updatedTransactions[transactionIndex] = updatedTransaction

            const selectedUnitData = updatedTransaction.availableUnits.find(
                (unit) => unit.unitCodeAndFactor === value,
            )
            updatedTransaction.subUnitId = selectedUnitData
                ? parseInt(selectedUnitData.subUnitId) || 0
                : 0
        }

        if (
            updatedTransaction.lineType === lineTypeMap['Discount'] &&
            updatedTransaction.parentLineId !== 0
        ) {
            const parentTransaction = updatedTransactions.find(
                (transaction) =>
                    transaction.id === updatedTransaction.parentLineId,
            )
            const baseTotal = parentTransaction ? parentTransaction.total : 0

            if (field === 'total') {
                updatedTransaction.total = parseFloat(value) || 0
                updatedTransaction.distributedDiscount = Math.abs(
                    updatedTransaction.total,
                )
                updatedTransaction.discountPercentage = baseTotal
                    ? (updatedTransaction.distributedDiscount / baseTotal) * 100
                    : 0
                updatedTransaction.lineNet = updatedTransaction.total
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'discountPercentage') {
                updatedTransaction.discountPercentage = parseFloat(value) || 0
                updatedTransaction.distributedDiscount =
                    (baseTotal * updatedTransaction.discountPercentage) / 100
                updatedTransaction.total =
                    -updatedTransaction.distributedDiscount
                updatedTransaction.lineNet = updatedTransaction.total
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'distributedDiscount') {
                updatedTransaction.distributedDiscount = parseFloat(value) || 0
                updatedTransaction.discountPercentage = baseTotal
                    ? (updatedTransaction.distributedDiscount / baseTotal) * 100
                    : 0
                updatedTransaction.total =
                    -updatedTransaction.distributedDiscount
                updatedTransaction.lineNet = updatedTransaction.total
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatAmount') {
                updatedTransaction.vatAmount = parseFloat(value) || 0
                updatedTransaction.vatPercentage = updatedTransaction.total
                    ? (updatedTransaction.vatAmount /
                        Math.abs(updatedTransaction.total)) *
                    100
                    : 0
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatPercentage') {
                updatedTransaction.vatPercentage = parseFloat(value) || 0
                updatedTransaction.vatAmount =
                    (Math.abs(updatedTransaction.total) *
                        updatedTransaction.vatPercentage) /
                    100
                updatedTransactions[transactionIndex] = updatedTransaction
            }
        }

        if (
            updatedTransaction.lineType === lineTypeMap['Promotion'] &&
            updatedTransaction.parentLineId !== 0
        ) {
            if (field === 'qty' || field === 'price') {
                updatedTransaction.qty =
                    field === 'qty'
                        ? parseFloat(value) || 0
                        : updatedTransaction.qty
                updatedTransaction.baseQty = updatedTransaction.qty
                updatedTransaction.price =
                    field === 'price'
                        ? parseFloat(value) || 0
                        : updatedTransaction.price
                updatedTransaction.total =
                    updatedTransaction.qty * updatedTransaction.price
                updatedTransaction.vatAmount =
                    (updatedTransaction.total *
                        updatedTransaction.vatPercentage) /
                    100
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatAmount') {
                updatedTransaction.vatAmount = parseFloat(value) || 0
                updatedTransaction.vatPercentage = updatedTransaction.total
                    ? (updatedTransaction.vatAmount /
                        updatedTransaction.total) *
                    100
                    : 0
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatPercentage') {
                updatedTransaction.vatPercentage = parseFloat(value) || 0
                updatedTransaction.vatAmount =
                    (updatedTransaction.total *
                        updatedTransaction.vatPercentage) /
                    100
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
        }

        if (
            updatedTransaction.lineType === lineTypeMap['Surcharge'] &&
            updatedTransaction.parentLineId !== 0
        ) {
            if (field === 'total') {
                updatedTransaction.total = parseFloat(value) || 0
                updatedTransaction.vatAmount = updatedTransaction.vatPercentage
                    ? (updatedTransaction.total *
                        updatedTransaction.vatPercentage) /
                    (100 + updatedTransaction.vatPercentage)
                    : 0
                updatedTransaction.price =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatAmount') {
                updatedTransaction.vatAmount = parseFloat(value) || 0
                updatedTransaction.vatPercentage = updatedTransaction.price
                    ? (updatedTransaction.vatAmount /
                        updatedTransaction.price) *
                    100
                    : 0
                updatedTransaction.total =
                    updatedTransaction.price + updatedTransaction.vatAmount
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatPercentage') {
                updatedTransaction.vatPercentage = parseFloat(value) || 0
                updatedTransaction.vatAmount =
                    (updatedTransaction.price *
                        updatedTransaction.vatPercentage) /
                    100
                updatedTransaction.total =
                    updatedTransaction.price + updatedTransaction.vatAmount
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
            }
            updatedTransaction.vatAmount = isNaN(updatedTransaction.vatAmount)
                ? 0
                : updatedTransaction.vatAmount
            updatedTransaction.price = isNaN(updatedTransaction.price)
                ? 0
                : updatedTransaction.price
            updatedTransaction.total = isNaN(updatedTransaction.total)
                ? 0
                : updatedTransaction.total
            updatedTransaction.lineNet = isNaN(updatedTransaction.lineNet)
                ? 0
                : updatedTransaction.lineNet
        }

        if (
            updatedTransaction.lineType === lineTypeMap['Material'] &&
            updatedTransaction.parentLineId === 0
        ) {
            if (field === 'qty' || field === 'price') {
                updatedTransaction.qty =
                    field === 'qty'
                        ? parseFloat(value) || 0
                        : updatedTransaction.qty
                updatedTransaction.baseQty = updatedTransaction.qty
                updatedTransaction.price =
                    field === 'price'
                        ? parseFloat(value) || 0
                        : updatedTransaction.price

                const factorMatch = (
                    updatedTransaction.selectedUnit || ''
                ).match(/\( 1 x (\d+) \)/)
                const factor = factorMatch ? parseInt(factorMatch[1]) : 1
                const actualQty = updatedTransaction.baseQty * factor

                updatedTransaction.total = actualQty * updatedTransaction.price
                updatedTransaction.vatAmount =
                    (updatedTransaction.total *
                        (parseFloat(updatedTransaction.vatPercentage) || 0)) /
                    100
                updatedTransaction.distributedDiscount =
                    (updatedTransaction.total *
                        (parseFloat(updatedTransaction.discountPercentage) ||
                            0)) /
                    100
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction

                const qtyChangeRatio =
                    oldQty !== 0 ? updatedTransaction.qty / oldQty : 1

                updatedTransactions = updatedTransactions.map((child) => {
                    if (
                        child.parentLineId === updatedTransaction.id &&
                        child.lineType === lineTypeMap['Promotion']
                    ) {
                        const newChildQty = child.qty * qtyChangeRatio
                        const newChildTotal =
                            newChildQty * updatedTransaction.price
                        return {
                            ...child,
                            qty: newChildQty,
                            baseQty: newChildQty,
                            price: updatedTransaction.price,
                            total: newChildTotal,
                            vatAmount:
                                (newChildTotal * child.vatPercentage) / 100,
                            lineNet:
                                newChildTotal -
                                (newChildTotal * child.vatPercentage) / 100,
                        }
                    }
                    return child
                })

                updatedTransactions = updatedTransactions.map((child) => {
                    if (
                        child.parentLineId === updatedTransaction.id &&
                        child.lineType === lineTypeMap['Discount']
                    ) {
                        let newDistributedDiscount = child.distributedDiscount
                        if (updatedTransaction.discountPercentage > 0) {
                            newDistributedDiscount =
                                (updatedTransaction.total *
                                    updatedTransaction.discountPercentage) /
                                100
                        }
                        return {
                            ...child,
                            distributedDiscount: newDistributedDiscount,
                            total: -newDistributedDiscount,
                            discountPercentage: updatedTransaction.total
                                ? (newDistributedDiscount /
                                    updatedTransaction.total) *
                                100
                                : 0,
                            lineNet: -newDistributedDiscount,
                        }
                    }
                    return child
                })

                const childDiscounts = updatedTransactions.filter(
                    (l) =>
                        l.parentLineId === updatedTransaction.id &&
                        l.lineType === lineTypeMap['Discount'],
                )
                const totalDiscount = childDiscounts.reduce(
                    (sum, child) => sum + (child.distributedDiscount || 0),
                    0,
                )
                updatedTransactions[transactionIndex] = {
                    ...updatedTransactions[transactionIndex],
                    total:
                        updatedTransactions[transactionIndex].total -
                        totalDiscount,
                    lineNet:
                        updatedTransactions[transactionIndex].total -
                        totalDiscount -
                        updatedTransactions[transactionIndex].vatAmount,
                }
            }
            if (field === 'vatAmount') {
                updatedTransaction.vatAmount = parseFloat(value) || 0
                updatedTransaction.vatPercentage = updatedTransaction.total
                    ? (updatedTransaction.vatAmount /
                        updatedTransaction.total) *
                    100
                    : 0
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'vatPercentage') {
                updatedTransaction.vatPercentage = parseFloat(value) || 0
                updatedTransaction.vatAmount =
                    (updatedTransaction.total *
                        updatedTransaction.vatPercentage) /
                    100
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
            }
            if (field === 'distributedDiscount') {
                updatedTransaction.distributedDiscount = parseFloat(value) || 0
                updatedTransaction.discountPercentage = updatedTransaction.total
                    ? (updatedTransaction.distributedDiscount /
                        updatedTransaction.total) *
                    100
                    : 0
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
                handleAddDiscountChild(updatedTransaction.id)
            }
            if (field === 'discountPercentage') {
                updatedTransaction.discountPercentage = parseFloat(value) || 0
                updatedTransaction.distributedDiscount =
                    (updatedTransaction.total *
                        updatedTransaction.discountPercentage) /
                    100
                updatedTransaction.lineNet =
                    updatedTransaction.total - updatedTransaction.vatAmount
                updatedTransactions[transactionIndex] = updatedTransaction
                handleAddDiscountChild(updatedTransaction.id)
            }
        }

        if (field === 'reserve') {
            updatedTransaction.reserve = reserveMap[value] || 0
            updatedTransactions[transactionIndex] = updatedTransaction
        }

        if (field === 'reservationDate') {
            updatedTransaction.reservationDate = value ? value : null
            updatedTransactions[transactionIndex] = updatedTransaction
        }

        if (field === 'lineType' && updatedTransaction.parentLineId !== 0) {
            updatedTransaction.lineType =
                lineTypeMap[value] || lineTypeMap['Promotion']
            updatedTransactions[transactionIndex] = updatedTransaction
        }

        updatedTransactions[transactionIndex] = updatedTransaction

        updatedTransactions = updatedTransactions.map((transaction) => {
            if (
                transaction.lineType === lineTypeMap['Material'] &&
                transaction.parentLineId === 0
            ) {
                const childDiscounts = updatedTransactions.filter(
                    (l) =>
                        l.parentLineId === transaction.id &&
                        l.lineType === lineTypeMap['Discount'],
                )
                const totalDiscount = childDiscounts.reduce(
                    (sum, child) => sum + (child.distributedDiscount || 0),
                    0,
                )
                return {
                    ...transaction,
                    total: transaction.total - totalDiscount,
                    lineNet:
                        transaction.total -
                        totalDiscount -
                        transaction.vatAmount,
                }
            }
            return transaction
        })

        updatedTransactions = sortTransactions(updatedTransactions)
        setOrderTransactions(updatedTransactions)
    }

    const updateGeneralLine = (id, field, value) => {
        const updatedLines = generalLines.map((line) => {
            if (line.id !== id) return line
            const updatedLine = { ...line, [field]: value }

            if (field === 'lineType') {
                updatedLine.lineType = lineTypeMap[value]
            }

            if (field === 'vatAmount') {
                updatedLine.vatAmount = parseFloat(value) || 0
                updatedLine.vatPercentage = updatedLine.price
                    ? (updatedLine.vatAmount / updatedLine.price) * 100
                    : 0
                updatedLine.total = updatedLine.price + updatedLine.vatAmount
                updatedLine.lineNet = updatedLine.total - updatedLine.vatAmount
            }
            if (field === 'vatPercentage') {
                updatedLine.vatPercentage = parseFloat(value) || 0
                updatedLine.vatAmount =
                    (updatedLine.price * updatedLine.vatPercentage) / 100
                updatedLine.total = updatedLine.price + updatedLine.vatAmount
                updatedLine.lineNet = updatedLine.total - updatedLine.vatAmount
            }

            if (updatedLine.lineType === lineTypeMap['Discount']) {
                const grossTotal = orderTransactions
                    .filter((l) => l.lineType === lineTypeMap['Material'])
                    .reduce((sum, l) => sum + (l.total || 0), 0)
                if (field === 'discountPercentage') {
                    updatedLine.discountPercentage = parseFloat(value) || 0
                    updatedLine.distributedDiscount =
                        (grossTotal * updatedLine.discountPercentage) / 100
                    updatedLine.total = -updatedLine.distributedDiscount
                    updatedLine.lineNet = updatedLine.total
                }
                if (field === 'distributedDiscount') {
                    updatedLine.distributedDiscount = parseFloat(value) || 0
                    updatedLine.discountPercentage = grossTotal
                        ? (updatedLine.distributedDiscount / grossTotal) * 100
                        : 0
                    updatedLine.total = -updatedLine.distributedDiscount
                    updatedLine.lineNet = updatedLine.total
                }
                if (field === 'total') {
                    updatedLine.total = parseFloat(value) || 0
                    updatedLine.distributedDiscount = Math.abs(
                        updatedLine.total,
                    )
                    updatedLine.discountPercentage = grossTotal
                        ? (updatedLine.distributedDiscount / grossTotal) * 100
                        : 0
                    updatedLine.lineNet = updatedLine.total
                }
                updatedLine.discountPercentage = parseFloat(
                    updatedLine.discountPercentage.toFixed(2),
                )
                updatedLine.distributedDiscount = parseFloat(
                    updatedLine.distributedDiscount.toFixed(2),
                )
                updatedLine.total = parseFloat(updatedLine.total.toFixed(2))
                updatedLine.lineNet = parseFloat(updatedLine.lineNet.toFixed(2))
            } else if (updatedLine.lineType === lineTypeMap['Surcharge']) {
                if (field === 'total') {
                    updatedLine.total = parseFloat(value) || 0
                    updatedLine.vatAmount = updatedLine.vatPercentage
                        ? (updatedLine.total * updatedLine.vatPercentage) /
                        (100 + updatedLine.vatPercentage)
                        : 0
                    updatedLine.price =
                        updatedLine.total - updatedLine.vatAmount
                    updatedLine.lineNet =
                        updatedLine.total - updatedLine.vatAmount
                }
                if (field === 'vatAmount') {
                    updatedLine.vatAmount = parseFloat(value) || 0
                    updatedLine.vatPercentage = updatedLine.price
                        ? (updatedLine.vatAmount / updatedLine.price) * 100
                        : 0
                    updatedLine.total =
                        updatedLine.price + updatedLine.vatAmount
                    updatedLine.lineNet =
                        updatedLine.total - updatedLine.vatAmount
                }
                if (field === 'vatPercentage') {
                    updatedLine.vatPercentage = parseFloat(value) || 0
                    updatedLine.vatAmount =
                        (updatedLine.price * updatedLine.vatPercentage) / 100
                    updatedLine.total =
                        updatedLine.price + updatedLine.vatAmount
                    updatedLine.lineNet =
                        updatedLine.total - updatedLine.vatAmount
                }
                updatedLine.vatAmount = isNaN(updatedLine.vatAmount)
                    ? 0
                    : updatedLine.vatAmount
                updatedLine.price = isNaN(updatedLine.price)
                    ? 0
                    : updatedLine.price
                updatedLine.total = isNaN(updatedLine.total)
                    ? 0
                    : updatedLine.total
                updatedLine.lineNet = isNaN(updatedLine.lineNet)
                    ? 0
                    : updatedLine.lineNet
            } else if (updatedLine.lineType === lineTypeMap['Promotion']) {
                if (field === 'qty' || field === 'price') {
                    updatedLine.qty = parseFloat(value) || 0
                    updatedLine.baseQty = updatedLine.qty
                    updatedLine.price =
                        field === 'price'
                            ? parseFloat(value) || 0
                            : updatedLine.price
                    updatedLine.total = updatedLine.qty * updatedLine.price
                    updatedLine.vatAmount =
                        (updatedLine.total * updatedLine.vatPercentage) / 100
                    updatedLine.lineNet =
                        updatedLine.total - updatedLine.vatAmount
                }
            }

            if (field === 'reserve') {
                updatedLine.reserve = reserveMap[value] || 0
            }

            if (field === 'reservationDate') {
                updatedLine.reservationDate = value ? value : null
            }

            return updatedLine
        })
        setGeneralLines(updatedLines)
    }

    const handlePromotion = (id, bonusValue) => {
        const distributedPromotion = parseFloat(bonusValue) || 0
        let updatedTransactions = [...orderTransactions]

        const parent = updatedTransactions.find(
            (transaction) => transaction.id === id,
        )
        if (!parent) return

        if (distributedPromotion > 0) {
            const childTotal = distributedPromotion * parent.price
            const newChild = {
                id: currentId,
                parentLineId: id,
                lineType: lineTypeMap['Promotion'],
                vatAmount: (childTotal * parent.vatPercentage) / 100,
                vatPercentage: parent.vatPercentage,
                qty: distributedPromotion,
                baseQty: distributedPromotion,
                distributedPromotion: 0,
                distributedCost: 0,
                distributedSurcharge: 0,
                price: parent.price,
                notes: '',
                deliveredQty: 0,
                reserve: 0,
                reservationDate: null,
                auxCode: '',
                discountPercentage: 0,
                distributedDiscount: 0,
                distributedSurchargeVat: 0,
                vatBaseTotal: 0,
                globalTransaction: 0,
                fullyShipped: 0,
                lineNet: childTotal - (childTotal * parent.vatPercentage) / 100,
                total: childTotal,
                materialId: parseInt(parent.materialId) || 0,
                cancelled: 0,
                closed: 0,
                lineNumber: 0,
                subUnitId: parent.subUnitId || 0,
                availableUnits: parent.availableUnits,
                selectedUnit: '',
                /////////////////////////
                mainUnitId: 0,
                factor1: 0,
                factor2: 0,
                unitCode: '',
                warehouse: 0,
                warehouseCostGroup: 0,
                salesManId: 0,
                paymentId: '',
                status: 0,
                modifedStatus: 0,
                demandId: 0,
                demandDetailsId: 0,
                new: 1,
                orderId: 0,
                clientId: 0,
            }

            updatedTransactions.push(newChild)
            setCurrentId(currentId + 1)

            updatedTransactions = updatedTransactions.map((transaction) => {
                if (transaction.id === id) {
                    return { ...transaction, distributedPromotion: 0 }
                }
                return transaction
            })

            setBonusInputs((prev) => ({ ...prev, [id]: '' }))
        } else {
            updatedTransactions = updatedTransactions.filter(
                (transaction) =>
                    !(
                        transaction.parentLineId === id &&
                        transaction.lineType === lineTypeMap['Promotion']
                    ),
            )
            setBonusInputs((prev) => ({ ...prev, [id]: '' }))
        }

        updatedTransactions = sortTransactions(updatedTransactions)
        setOrderTransactions(updatedTransactions)
    }

    const openItemDialog = (lineId) => {
        const transaction = orderTransactions.find(
            (transaction) => transaction.id === lineId,
        )
        if (
            transaction.lineType === lineTypeMap['Discount'] &&
            transaction.parentLineId !== 0
        )
            return
        setShowItemNameModal({ show: true, id: lineId })
    }

    const handleItemSelect = (item, lineId) => {
        const updatedTransactions = orderTransactions.map((transaction) => {
            if (transaction.id !== lineId) return transaction
            const newPrice = item.price || 0
            const newVatPercentage = item.purchaseVat || 0
            const newQty = transaction.qty || 1
            const selectedUnit =
                item.unitCodesAndFactors?.[0]?.unitCodeAndFactor || ''
            const factorMatch = selectedUnit.match(/\( 1 x (\d+) \)/)
            const factor = factorMatch ? parseInt(factorMatch[1]) : 1
            const actualQty = newQty * factor
            const newTotal = actualQty * newPrice
            const selectedUnitData = item.unitCodesAndFactors?.[0] || {}

            return {
                ...transaction,
                materialId: parseInt(item.id) || 0,
                subUnitId: parseInt(selectedUnitData.subUnitId) || 0,
                price: newPrice,
                vatPercentage: newVatPercentage,
                qty: newQty,
                baseQty: newQty,
                total: newTotal,
                vatAmount: (newTotal * newVatPercentage) / 100,
                lineNet: newTotal - (newTotal * newVatPercentage) / 100,
                availableUnits:
                    item.unitCodesAndFactors.map(
                        (unit) => unit.unitCodeAndFactor,
                    ) || [],
                selectedUnit: selectedUnit,
            }
        })

        setOrderTransactions(updatedTransactions)
        setShowItemNameModal({ show: false, id: null })
    }

    const calculateTotals = useMemo(() => {
        const grossTotal = orderTransactions
            .filter(
                (transaction) =>
                    transaction.lineType === lineTypeMap['Material'],
            )
            .reduce((sum, transaction) => sum + (transaction.total || 0), 0)

        const totalDiscounts =
            orderTransactions
                .filter(
                    (transaction) =>
                        transaction.lineType === lineTypeMap['Discount'],
                )
                .reduce(
                    (sum, transaction) =>
                        sum + (Math.abs(transaction.distributedDiscount) || 0),
                    0,
                ) +
            generalLines
                .filter((line) => line.lineType === lineTypeMap['Discount'])
                .reduce(
                    (sum, line) =>
                        sum + (Math.abs(line.distributedDiscount) || 0),
                    0,
                )

        const totalPromotions =
            orderTransactions
                .filter(
                    (transaction) =>
                        transaction.lineType === lineTypeMap['Promotion'],
                )
                .reduce(
                    (sum, transaction) => sum + (transaction.total || 0),
                    0,
                ) +
            generalLines
                .filter((line) => line.lineType === lineTypeMap['Promotion'])
                .reduce((sum, line) => sum + (line.total || 0), 0)

        const totalSurcharges =
            orderTransactions
                .filter(
                    (transaction) =>
                        transaction.lineType === lineTypeMap['Surcharge'],
                )
                .reduce(
                    (sum, transaction) => sum + (transaction.total || 0),
                    0,
                ) +
            generalLines
                .filter((line) => line.lineType === lineTypeMap['Surcharge'])
                .reduce((sum, line) => sum + (line.total || 0), 0)

        const totalVat =
            orderTransactions
                .filter(
                    (transaction) =>
                        transaction.lineType !== lineTypeMap['Promotion'],
                )
                .reduce(
                    (sum, transaction) => sum + (transaction.vatAmount || 0),
                    0,
                ) +
            generalLines
                .filter((line) => line.lineType !== lineTypeMap['Promotion'])
                .reduce((sum, line) => sum + (line.vatAmount || 0), 0)

        const netTotal = grossTotal
        const generalDiscount = generalLines
            .filter((line) => line.lineType === lineTypeMap['Discount'])
            .reduce(
                (sum, line) => sum + (Math.abs(line.distributedDiscount) || 0),
                0,
            )

        const generalSurcharges = generalLines
            .filter((line) => line.lineType === lineTypeMap['Surcharge'])
            .reduce((sum, line) => sum + (line.total || 0), 0)

        return {
            grossTotal,
            totalDiscounts,
            totalPromotions,
            totalSurcharges,
            totalVat,
            netTotal,
            generalDiscount,
            generalSurcharges,
        }
    }, [orderTransactions, generalLines])
    const totals = calculateTotals

    const handleSave = async () => {
        setLoading(true)
        setError(null)

        const now = new Date()
        const orderMaster = {
            createdDate: dateS || now.toISOString(),
            time: time || now.toLocaleTimeString('en-GB', { hour12: false }),
            orderStatusTypeId: 1,
            paymentTypeId: (+paymentType && paymentType.id) || 0,
            statusId: selectedStatus,
            clientId: (+Customer && Customer.id) || 4,
            warehouseId: selectedWarehouseId || 0,
            warehouseCostGroup: 0,
            salesManId: parseInt(salesManId) || 0,
            documentNumber: document || '',
            documentTrackingNumber: documentTrackingNumber || '',
            slipNumber: slipNumber,
            generalDiscount: totals.generalDiscount,
            totalDiscounts: totals.totalDiscounts,
            totalDiscounted: totals.totalDiscounts,
            generalSurcharges: totals.generalSurcharges,
            totalSurcharges: totals.totalSurcharges,
            totalPromotions: totals.totalPromotions,
            totalVat: totals.totalVat,
            grossTotal: totals.grossTotal,
            netTotal: totals.netTotal,
            notes1: notes1,
            notes2: notes2,
            notes3: notes3,
            notes4: notes4,
            notes5: notes5,
            notes6: notes6,
            status: 0,
            changeStatus: 0,
            cancelled: 0,
            orderStatus: 0,
            shippingStatus: 0,
        }

        const preparedTransactions = [
            ...orderTransactions,
            ...generalLines,
        ].map((transaction, index) => {
            const {
                id,
                children,
                availableUnits,
                selectedUnit,
                baseQty,
                ...rest
            } = transaction
            const factorMatch = (transaction.selectedUnit || '').match(
                /\( 1 x (\d+) \)/,
            )
            const factor = factorMatch ? parseInt(factorMatch[1]) : 1

            //     const factor = factorMatch ? parseInt(factorMatch[1]) : 1;
            //     const actualQty = transaction.baseQty * factor;

            //     return {
            //         id: transaction.id,
            //         materialId: parseInt(rest.materialId) || 0,
            //         orderId: parseInt(id),
            //         clientId: rest.clientId || 0,
            //         lineType: rest.lineType || 0,
            //         lineNumber: rest.lineNumber || 0,
            //         globalTransaction: rest.globalTransaction || 0,
            //         qty: actualQty,
            //         deliveredQty: rest.deliveredQty || 0,
            //         price: rest.price || 0,
            //         total: rest.total || 0,
            //         discountPercentage: rest.discountPercentage || 0,
            //         distributedCost: rest.distributedCost || 0,
            //         distributedDiscount: rest.distributedDiscount || 0,
            //         distributedSurcharge: rest.distributedSurcharge || 0,
            //         distributedPromotion: rest.distributedPromotion || 0,
            //         vatPercentage: rest.vatPercentage || 0,
            //         vatAmount: rest.vatAmount || 0,
            //         vatBaseTotal: rest.vatBaseTotal || 0,
            //         notes: rest.notes || '',
            //         subUnitId: parseInt(rest.subUnitId) || 0,
            //         mainUnitId: rest.mainUnitId || 0,
            //         factor1: rest.factor1 || 0,
            //         factor2: rest.factor2 || 0,
            //         unitCode: rest.unitCode || '',
            //         fullyShipped: rest.fullyShipped || 0,
            //         warehouse: rest.warehouse || 0,
            //         warehouseCostGroup: rest.warehouseCostGroup || 0,
            //         lineNet: rest.lineNet || 0,
            //         salesManId: rest.salesManId || 0,
            //         paymentId: rest.paymentId || '',
            //         status: rest.status || 0,
            //         modifedStatus: rest.modifedStatus || 0,
            //         cancelled: rest.cancelled || 0,
            //         closed: rest.closed || 0,
            //         demandId: rest.demandId || 0,
            //         demandDetailsId: rest.demandDetailsId || 0,
            //         auxCode: rest.auxCode || '',
            //         reserve: rest.reserve || 0,
            //         reservationDate: rest.reservationDate
            //             ? new Date(rest.reservationDate).toISOString()
            //             : null,
            //         parentLineId: rest.parentLineId || 0,
            //         distributedSurchargeVat: rest.distributedSurchargeVat || 0,
            //         new: rest.new || 0,
            //     };
            // });

            const actualQty = transaction.baseQty * factor

            //     const actualQty = transaction.baseQty * factor;

            //     return {
            //         id: transaction.id,
            //         materialId: parseInt(rest.materialId) || 0,
            //         orderId: parseInt(id),
            //         clientId: rest.clientId || 0,
            //         lineType: rest.lineType || 0,
            //         lineNumber: rest.lineNumber || 0,
            //         globalTransaction: rest.globalTransaction || 0,
            //         qty: actualQty,
            //         deliveredQty: rest.deliveredQty || 0,
            //         price: rest.price || 0,
            //         total: rest.total || 0,
            //         discountPercentage: rest.discountPercentage || 0,
            //         distributedCost: rest.distributedCost || 0,
            //         distributedDiscount: rest.distributedDiscount || 0,
            //         distributedSurcharge: rest.distributedSurcharge || 0,
            //         distributedPromotion: rest.distributedPromotion || 0,
            //         vatPercentage: rest.vatPercentage || 0,
            //         vatAmount: rest.vatAmount || 0,
            //         vatBaseTotal: rest.vatBaseTotal || 0,
            //         notes: rest.notes || '',
            //         subUnitId: parseInt(rest.subUnitId) || 0,
            //         mainUnitId: rest.mainUnitId || 0,
            //         factor1: rest.factor1 || 0,
            //         factor2: rest.factor2 || 0,
            //         unitCode: rest.unitCode || '',
            //         fullyShipped: rest.fullyShipped || 0,
            //         warehouse: rest.warehouse || 0,
            //         warehouseCostGroup: rest.warehouseCostGroup || 0,
            //         lineNet: rest.lineNet || 0,
            //         salesManId: rest.salesManId || 0,
            //         paymentId: rest.paymentId || '',
            //         status: rest.status || 0,
            //         modifedStatus: rest.modifedStatus || 0,
            //         cancelled: rest.cancelled || 0,
            //         closed: rest.closed || 0,
            //         demandId: rest.demandId || 0,
            //         demandDetailsId: rest.demandDetailsId || 0,
            //         auxCode: rest.auxCode || '',
            //         reserve: rest.reserve || 0,
            //         reservationDate: rest.reservationDate
            //             ? new Date(rest.reservationDate).toISOString()
            //             : null,
            //         parentLineId: rest.parentLineId || 0,
            //         distributedSurchargeVat: rest.distributedSurchargeVat || 0,
            //         new: rest.new || 0,
            //     };
            // });



            return {
                ...rest,
                materialId: parseInt(rest.materialId) || 0,
                qty: actualQty,
                subUnitId: parseInt(rest.subUnitId) || 0,
                lineNumber: transaction.lineNumber || index + 1,
                reservationDate: rest.reservationDate
                    ? new Date(rest.reservationDate).toISOString()
                    : null,
                lineType:
                    typeof rest.lineType === 'string'
                        ? lineTypeMap[rest.lineType]
                        : rest.lineType,
            }
        })

        const body = {
            orderMaster,
            orderTransactions: preparedTransactions,
        }

        try {
            const response = await UpdateOrder(body)
             if (response?.success || response?.data?.success ) {
                triggerMessageSuccessfully(t(`${translationPath}UpdateSuccess`))
                navigate('/SalesOrder')
            } else {
                throw new Error('Unexpected response from server')
            }
        } catch (error) {
            console.error('Error updating order:', error)
            const errorMessage =
                error.response?.data?.errors?.['OrderMaster.SlipNumber']?.join(
                    '\n',
                ) ||
                error.response?.data?.errors?.join('\n') ||
                t(`${translationPath}createError`)
            setError(errorMessage)
            triggerMessageError(t(`${translationPath}createError`))
        } finally {
            setLoading(false)
        }
    }

    const handleOrderColumnsDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setOrderTableColumns((prev) => {
                const oldIndex = prev.order.indexOf(active.id)
                const newIndex = prev.order.indexOf(over.id)
                return {
                    ...prev,
                    order: arrayMove(prev.order, oldIndex, newIndex),
                }
            })
        }
    }

    const handleGeneralColumnsDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setGeneralTableColumns((prev) => {
                const oldIndex = prev.order.indexOf(active.id)
                const newIndex = prev.order.indexOf(over.id)
                return {
                    ...prev,
                    order: arrayMove(prev.order, oldIndex, newIndex),
                }
            })
        }
    }

    const toggleOrderColumn = (column) => {
        setOrderTableColumns((prev) => ({
            ...prev,
            visible: {
                ...prev.visible,
                [column]: !prev.visible[column],
            },
        }))
    }

    const toggleGeneralColumn = (column) => {
        setGeneralTableColumns((prev) => ({
            ...prev,
            visible: {
                ...prev.visible,
                [column]: !prev.visible[column],
            },
        }))
    }

    const filteredOrderTransactions = orderTransactions.filter((transaction) =>
        transaction.materialId.toString().toLowerCase(),
    )

    const lineNumbers = getLineNumbers(filteredOrderTransactions)
    // const lineNumbers = getLineNumbers(orderTransactions);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
            {loading && <LoaderSpinner />}
            <style>
                {`
          .disabled-field {
            background-color: #e5e7eb !important;
          }
          .select__menu {
            width: 100% !important;
            min-width: 200px;
          }
          .select__menu-list {
            padding: 0;
          }
          .select__option {
            padding: 8px 12px !important;
            cursor: pointer;
          }
          .select__option:hover {
            background-color: #f5f5f5;
          }
        `}
            </style>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t(`${translationPath}EditSalesOrderSlip`)}
                </h1>
                <Button
                    variant="solid"
                    className="flex items-center btn btn-sm btn-success"
                    onClick={handleSave}
                    disabled={loading}
                >
                    <LiaSave size={25} />
                    {t(`${translationPath}Save`)}
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                <form className="grid grid-cols-1 lg:grid-cols-6 gap-5">
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="slipNumber"
                        >
                            {t(`${translationPath}SlipNumber`)}
                        </label>
                        <input
                            id="slipNumber"
                            type="text"
                            value={slipNumber}
                            disabled
                            onChange={(e) => setSlipNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                            placeholder={t(`${translationPath}ORDAuto`)}
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="document"
                        >
                            {t(`${translationPath}Document`)}
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-sm">
                                #
                            </span>
                            <input
                                id="document"
                                type="text"
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                placeholder={t(
                                    `${translationPath}TrackingNumber`,
                                )}
                            />
                        </div>
                    </div>

                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="paymentType"
                        >
                            {t(`${translationPath}PaymentType`)}
                        </label>
                        <input
                            id="paymentType"
                            type="text"
                            value={paymentType?.code || ''}
                            onClick={() => setIsPaymentOpen(true)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm cursor-pointer"
                            placeholder={t(`${translationPath}PaymentType`)}
                            readOnly
                        />
                    </div>

                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="date"
                        >
                            {t(`${translationPath}Date`)}
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={dateS}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                        />
                    </div>

                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="time"
                        >
                            {t(`${translationPath}Time`)}
                        </label>
                        <input
                            id="time"
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                        />
                    </div>

                    <div className="col-span-1 flex space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowSOAModal(true)}
                            className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            {t(`${translationPath}SOA`)}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowTransModal(true)}
                            className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            {t(`${translationPath}ItemsTransaction`)}
                        </button>
                    </div>
                </form>

                <form className="grid grid-cols-1 lg:grid-cols-5 gap-4 pt-4">
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="Customer"
                        >
                            {t(`${translationPath}Customer`)}
                        </label>
                        <input
                            id="Customer"
                            type="text"
                            value={Customer&&Customer.firstName || ''}
                            onClick={() => setIsCustomerModalOpen(true)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm cursor-pointer"
                            placeholder={t(`${translationPath}Customer`)}
                            readOnly
                        />
                    </div>
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="DocumentTrackingNumber"
                        >
                            {t(`${translationPath}DocumentTrackingNumber`)}
                        </label>
                        <input
                            id="DocumentTrackingNumber"
                            type="text"
                            value={documentTrackingNumber}
                            onChange={(e) =>
                                setDocumentTrackingNumber(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                            placeholder={t(
                                `${translationPath}DocumentTrackingNumber`,
                            )}
                        />
                    </div>
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="salesman"
                        >
                            {t(`${translationPath}Salesman`)}
                        </label>
                        <Select
                            options={salesmanOptions}
                            value={
                                salesmanOptions.find(
                                    (option) => option.value === salesManId,
                                ) || null
                            }
                            onChange={(selectedOption) =>
                                setSalesManId(
                                    selectedOption ? selectedOption.value : 0,
                                )
                            }
                            isLoading={salesmanLoading}
                            placeholder={t(`${translationPath}selectSalesman`)}
                            className="text-sm"
                            isClearable
                        />
                    </div>
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="warehouse"
                        >
                            {t(`${translationPath}Warehouse`)}
                        </label>
                        <Select
                            options={warehouses}
                            value={warehouses.find(
                                (option) =>
                                    option.value === selectedWarehouseId,
                            )}
                            onChange={(option) =>
                                setSelectedWarehouseId(option.value)
                            }
                            isLoading={isLoadingWarehouses}
                            placeholder={t(`${translationPath}selectWarehouse`)}
                            className="text-sm"
                        />
                    </div>
                    <div className="col-span-1">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            htmlFor="status"
                        >
                            {t(`${translationPath}Status`)}
                        </label>
                        <Select
                            placeholder={t(`${translationPath}Status`)}
                            options={statusOptions.filter(
                                (opt) =>
                                    !opt.hidden || opt.value === selectedStatus,
                            )}
                            value={statusOptions.find(
                                (opt) => opt.value === selectedStatus,
                            )}
                            onChange={handleStatusChange}
                            className="text-sm"
                        />
                    </div>
                </form>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                        {t(`${translationPath}OrderTransactionsLines`)}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={openDialog}
                            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        >

                            <FaRegEye className="mr-2" />
                            {t(`${translationPath}ToggleColumns`)}
                        </button>
                        <button
                            onClick={addNewTransaction}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        >
                            {t(`${translationPath}AddTransaction`)}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-md">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleOrderColumnsDragEnd}
                                    modifiers={[restrictToHorizontalAxis]}
                                >
                                    <SortableContext
                                        items={orderTableColumns.order}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {orderTableColumns.order.map(
                                            (column) =>
                                                orderTableColumns.visible[
                                                column
                                                ] && (
                                                    <SortableTableHeader
                                                        key={column}
                                                        id={column}
                                                    >
                                                        {t(
                                                            `${translationPath}${column.replace(/\s+/g, '')}`,
                                                        )}
                                                    </SortableTableHeader>
                                                ),
                                        )}
                                    </SortableContext>
                                </DndContext>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrderTransactions.map(
                                (transaction, index) => {
                                    const isDiscount =
                                        transaction.lineType ===
                                        lineTypeMap['Discount'] &&
                                        transaction.parentLineId !== 0
                                    const isSurcharge =
                                        transaction.lineType ===
                                        lineTypeMap['Surcharge'] &&
                                        transaction.parentLineId !== 0
                                    const isChild =
                                        transaction.parentLineId !== 0
                                    const isPromotion =
                                        transaction.lineType ===
                                        lineTypeMap['Promotion'] &&
                                        transaction.parentLineId !== 0
                                    const bonusInputValue =
                                        bonusInputs[transaction.id] !==
                                            undefined
                                            ? bonusInputs[transaction.id]
                                            : ''
                                    const originalTotal =
                                        (transaction.price || 0) *
                                        (transaction.qty || 0)

                                    return (
                                        <tr
                                            key={transaction.id}
                                            className={`text-sm ${isChild ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'}`}
                                        >
                                            {orderTableColumns.order.map((column) =>
                                                orderTableColumns.visible[column] && (
                                                    <td key={column} className="p-2">
                                                        {column === 'Line Type' && (
                                                            <td className="min-w-20">
                                                                {transaction.parentLineId === 0 ? (
                                                                    <select
                                                                        disabled
                                                                        className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                                                                    >
                                                                        <option value="Material">
                                                                            {t(`${translationPath}Material`)}
                                                                        </option>
                                                                    </select>
                                                                ) : (
                                                                    <select
                                                                        value={reverseLineTypeMap[transaction.lineType]}
                                                                        onChange={(e) =>
                                                                            updateOrderTransaction(
                                                                                transaction.id,
                                                                                'lineType',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        disabled={isDiscount}
                                                                        className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                    >
                                                                        <option value="Promotion">
                                                                            {t(`${translationPath}Promotion`)}
                                                                        </option>
                                                                        <option value="Discount">
                                                                            {t(`${translationPath}Discount`)}
                                                                        </option>
                                                                        <option value="Surcharge">
                                                                            {t(`${translationPath}Surcharge`)}
                                                                        </option>
                                                                    </select>
                                                                )}
                                                            </td>
                                                        )}
                                                        {column === 'Line' && (
                                                            <td className=" min-w-10">
                                                                <input
                                                                    type="text"
                                                                    value={lineNumbers[index]}
                                                                    disabled
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Material ID' && (
                                                            <td className=" min-w-18">
                                                                <input
                                                                    type="text"
                                                                    value={transaction.materialId}
                                                                    onClick={() => openItemDialog(transaction.id)}
                                                                    readOnly
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-sm"
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Unit' && (
                                                            <td className=" min-w-24">
                                                                <select
                                                                    value={transaction.selectedUnit}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'selectedUnit',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={isChild || !transaction.availableUnits.length}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isChild || !transaction.availableUnits.length ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                >
                                                                    {transaction.availableUnits.length ? (
                                                                        transaction.availableUnits.map((unit) => (
                                                                            <option key={unit} value={unit}>
                                                                                {unit}
                                                                            </option>
                                                                        ))
                                                                    ) : (
                                                                        <option value="">
                                                                            {t(`${translationPath}NoUnitsAvailable`)}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            </td>
                                                        )}
                                                        {column === 'VAT Amount' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.vatAmount}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'vatAmount',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={isDiscount && !isSurcharge}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount && !isSurcharge ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Actions' && (
                                                            <td className=" min-w-16">
                                                                <div className="flex space-x-2">
                                                                    <Tooltip
                                                                        title={
                                                                            <div>
                                                                                {t(`${translationPath}AddRow`)}{' '}
                                                                                <strong className="text-yellow-400"> Row</strong>
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <FcPlus
                                                                            size={20}
                                                                            onClick={() => addChildTransaction(transaction.id)}
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        title={
                                                                            <div>
                                                                                {t(`${translationPath}DeleteRow`)}{' '}
                                                                                <strong className="text-yellow-400"> Row</strong>
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <FcDeleteRow
                                                                            size={20}
                                                                            onClick={() => deleteTransaction(transaction.id)}
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {column === 'VAT %' && (
                                                            <td className=" min-w-16 relative">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.vatPercentage}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'vatPercentage',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        (isDiscount && !isSurcharge) ||
                                                                        (isChild && !isSurcharge && !isPromotion)
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md pr-6 text-sm ${(isDiscount && !isSurcharge) || (isChild && !isSurcharge && !isPromotion) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                                                    %
                                                                </span>
                                                            </td>
                                                        )}
                                                        {column === 'Quantity' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.qty}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'qty',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={isDiscount || (isChild && !isPromotion)}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || (isChild && !isPromotion) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Bonus' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={bonusInputValue}
                                                                    onChange={(e) =>
                                                                        setBonusInputs((prev) => ({
                                                                            ...prev,
                                                                            [transaction.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === 'Tab') {
                                                                            handlePromotion(transaction.id, bonusInputValue);
                                                                        }
                                                                    }}
                                                                    disabled={isDiscount || isPromotion || isChild}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || isPromotion || isChild ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Price' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.price}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'price',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={isDiscount || isSurcharge}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || isSurcharge ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Notes' && (
                                                            <td className=" min-w-20">
                                                                <input
                                                                    type="text"
                                                                    value={transaction.notes}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'notes',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Delivered Qty' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.deliveredQty}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'deliveredQty',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={isDiscount || (isChild && !isPromotion)}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || (isChild && !isPromotion) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Reserve' && (
                                                            <td className=" min-w-16">
                                                                <select
                                                                    value={reverseReserveMap[transaction.reserve]}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'reserve',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                >
                                                                    <option value="Yes">
                                                                        {t(`${translationPath}Yes`)}
                                                                    </option>
                                                                    <option value="No">
                                                                        {t(`${translationPath}No`)}
                                                                    </option>
                                                                </select>
                                                            </td>
                                                        )}
                                                        {column === 'Reservation Date' && (
                                                            <td className=" min-w-32">
                                                                <input
                                                                    type="date"
                                                                    value={transaction.reservationDate || ''}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'reservationDate',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Aux Code' && (
                                                            <td className=" min-w-12">
                                                                <input
                                                                    type="text"
                                                                    value={transaction.auxCode}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'auxCode',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Discount %' && (
                                                            <td className=" min-w-16 relative">
                                                                <div className="relative">
                                                                    <input
                                                                        type="number"
                                                                        value={transaction.discountPercentage}
                                                                        onChange={(e) =>
                                                                            updateOrderTransaction(
                                                                                transaction.id,
                                                                                'discountPercentage',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' || e.key === 'Tab') {
                                                                                handleAddDiscountChild(transaction.id);
                                                                            }
                                                                        }}
                                                                        disabled={isChild && !isDiscount}
                                                                        className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md pr-6 text-sm ${isChild && !isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                    />
                                                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                                                        %
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        )}
                                                        {column === 'Discount Amount' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.distributedDiscount}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'distributedDiscount',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === 'Tab') {
                                                                            handleAddDiscountChild(transaction.id);
                                                                        }
                                                                    }}
                                                                    disabled={isChild && !isDiscount}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isChild && !isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                        {column === 'Total' && (
                                                            <td className=" min-w-16">
                                                                <input
                                                                    type="number"
                                                                    value={transaction.parentLineId === 0 ? originalTotal : transaction.total}
                                                                    onChange={(e) =>
                                                                        updateOrderTransaction(
                                                                            transaction.id,
                                                                            'total',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    disabled={!isSurcharge && !isDiscount}
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${!isSurcharge && !isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            </td>
                                                        )}
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    )
                                },
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                        {t(`${translationPath}GeneralLines`)}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={openDialogGeneral}
                            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        >
                        <FaRegEye className="mr-2" />
                            {t(`${translationPath}ToggleColumns`)}
                        </button>
                        <button
                            onClick={addGeneralLine}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        >
                            {t(`${translationPath}AddGeneralLine`)}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-md">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleGeneralColumnsDragEnd}
                                    modifiers={[restrictToHorizontalAxis]}
                                >
                                    <SortableContext
                                        items={generalTableColumns.order}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {generalTableColumns.order.map(
                                            (column) =>
                                                generalTableColumns.visible[
                                                column
                                                ] && (
                                                    <SortableTableHeader
                                                        key={column}
                                                        id={column}
                                                    >
                                                        {t(
                                                            `${translationPath}${column.replace(/\s+/g, '')}`,
                                                        )}
                                                    </SortableTableHeader>
                                                ),
                                        )}
                                    </SortableContext>
                                </DndContext>
                            </tr>
                        </thead>
                        <tbody>
                            {generalLines.map((line, index) => {
                                const isDiscount =
                                    line.lineType === lineTypeMap['Discount']
                                const isSurcharge =
                                    line.lineType === lineTypeMap['Surcharge']
                                const isPromotion =
                                    line.lineType === lineTypeMap['Promotion']
                                const lineNumbers = getLineNumbers(generalLines)

                                return (
                                    <tr
                                        key={line.id}
                                        className="text-sm bg-white dark:bg-gray-800"
                                    >
                                        {generalTableColumns.order.map(
                                            (column) =>
                                                generalTableColumns.visible[
                                                column
                                                ] && (
                                                    <td
                                                        key={column}
                                                        className="p-2"
                                                    >
                                                        {column === 'Total' && (
                                                            <input
                                                                type="number"
                                                                value={
                                                                    line.total
                                                                }
                                                                onChange={(e) =>
                                                                    updateGeneralLine(
                                                                        line.id,
                                                                        'total',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isSurcharge &&
                                                                    !isDiscount
                                                                }
                                                                className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${!isSurcharge && !isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                            />
                                                        )}
                                                        {column ===
                                                            'Line Type' && (
                                                                <select
                                                                    value={
                                                                        reverseLineTypeMap[
                                                                        line
                                                                            .lineType
                                                                        ]
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'lineType',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                >
                                                                    <option value="Promotion">
                                                                        {t(
                                                                            `${translationPath}Promotion`,
                                                                        )}
                                                                    </option>
                                                                    <option value="Discount">
                                                                        {t(
                                                                            `${translationPath}Discount`,
                                                                        )}
                                                                    </option>
                                                                    <option value="Surcharge">
                                                                        {t(
                                                                            `${translationPath}Surcharge`,
                                                                        )}
                                                                    </option>
                                                                </select>
                                                            )}
                                                        {column ===
                                                            'Line Number' && (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        lineNumbers[
                                                                        index
                                                                        ]
                                                                    }
                                                                    disabled
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                                                                />
                                                            )}
                                                        {column ===
                                                            'Material ID' && (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        line.materialId
                                                                    }
                                                                    disabled
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                                                                />
                                                            )}
                                                        {column ===
                                                            'VAT Amount' && (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        line.vatAmount
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'vatAmount',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isDiscount
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            )}
                                                        {column ===
                                                            'Actions' && (
                                                                <div className="flex space-x-2">
                                                                    <Tooltip
                                                                        title={
                                                                            <div>
                                                                                {t(
                                                                                    `${translationPath}DeleteRow`,
                                                                                )}{' '}
                                                                                <strong className="text-yellow-400">
                                                                                    Row
                                                                                </strong>
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <FcDeleteRow
                                                                            size={
                                                                                20
                                                                            }
                                                                            onClick={() =>
                                                                                deleteGeneralLine(
                                                                                    line.id,
                                                                                )
                                                                            }
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                        {column === 'VAT %' && (
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        line.vatPercentage
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'vatPercentage',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isDiscount ||
                                                                        isPromotion
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md pr-6 text-sm ${isDiscount || isPromotion ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                                                    %
                                                                </span>
                                                            </div>
                                                        )}
                                                        {column ===
                                                            'Quantity' && (
                                                                <input
                                                                    type="number"
                                                                    value={line.qty}
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'qty',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isDiscount ||
                                                                        isSurcharge
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || isSurcharge ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            )}
                                                        {column ===
                                                            'Promotion' && (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        line.distributedPromotion
                                                                    }
                                                                    disabled
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
                                                                />
                                                            )}
                                                        {column === 'Price' && (
                                                            <input
                                                                type="number"
                                                                value={
                                                                    line.price
                                                                }
                                                                onChange={(e) =>
                                                                    updateGeneralLine(
                                                                        line.id,
                                                                        'price',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDiscount
                                                                }
                                                                className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                            />
                                                        )}
                                                        {column === 'Notes' && (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    line.notes
                                                                }
                                                                onChange={(e) =>
                                                                    updateGeneralLine(
                                                                        line.id,
                                                                        'notes',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                            />
                                                        )}
                                                        {column ===
                                                            'Delivered Qty' && (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        line.deliveredQty
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'deliveredQty',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isDiscount ||
                                                                        isSurcharge
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${isDiscount || isSurcharge ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            )}
                                                        {column ===
                                                            'Reserve' && (
                                                                <select
                                                                    value={
                                                                        reverseReserveMap[
                                                                        line
                                                                            .reserve
                                                                        ]
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'reserve',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                >
                                                                    <option value="Yes">
                                                                        {t(
                                                                            `${translationPath}Yes`,
                                                                        )}
                                                                    </option>
                                                                    <option value="No">
                                                                        {t(
                                                                            `${translationPath}No`,
                                                                        )}
                                                                    </option>
                                                                </select>
                                                            )}
                                                        {column ===
                                                            'Reservation Date' && (
                                                                <input
                                                                    type="date"
                                                                    value={
                                                                        line.reservationDate ||
                                                                        ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'reservationDate',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                />
                                                            )}
                                                        {column ===
                                                            'Aux Code' && (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        line.auxCode
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'auxCode',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                                                                />
                                                            )}
                                                        {column ===
                                                            'Discount %' && (
                                                                <div className="relative">
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            line.discountPercentage
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateGeneralLine(
                                                                                line.id,
                                                                                'discountPercentage',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            !isDiscount
                                                                        }
                                                                        className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md pr-6 text-sm ${!isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                    />
                                                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                                                        %
                                                                    </span>
                                                                </div>
                                                            )}
                                                        {column ===
                                                            'Discount Amount' && (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        line.distributedDiscount
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGeneralLine(
                                                                            line.id,
                                                                            'distributedDiscount',
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !isDiscount
                                                                    }
                                                                    className={`w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${!isDiscount ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                                />
                                                            )}
                                                    </td>
                                                ),
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
                    {t(`${translationPath}Notes`)}
                </h2>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {t(`${translationPath}Notes`)}
                    </h2>
                    <Input
                        placeholder={t(`${translationPath}Notes1`)}
                        value={notes1}
                        onChange={(e) => setNotes1(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                    <Input
                        placeholder={t(`${translationPath}Notes2`)}
                        value={notes2}
                        onChange={(e) => setNotes2(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                    <Input
                        placeholder={t(`${translationPath}Notes3`)}
                        value={notes3}
                        onChange={(e) => setNotes3(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                    <Input
                        placeholder={t(`${translationPath}Notes4`)}
                        value={notes4}
                        onChange={(e) => setNotes4(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                    <Input
                        placeholder={t(`${translationPath}Notes5`)}
                        value={notes5}
                        onChange={(e) => setNotes5(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                    <Input
                        placeholder={t(`${translationPath}Notes6`)}
                        value={notes6}
                        onChange={(e) => setNotes6(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {t(`${translationPath}Totals`)}
                    </h2>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between mb-2 text-sm">
                            <Tag className="text-red-600 bg-blue-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                                <span className="font-medium text-gray-600">
                                    {t(`${translationPath}GrossTotal`)}:
                                </span>
                            </Tag>
                            <span>{totals.grossTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-gray-800 mb-1.5">
                            <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                                <span>
                                    {t(`${translationPath}TotalDiscounts`)}:
                                </span>
                            </Tag>
                            <span>{totals.totalDiscounts.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm">
                            <Tag className="text-red-600 bg-blue-100 dark:tebg-blue-100 dark:bg-red-500/20 border-0">
                                <span className="font-medium text-gray-600">
                                    {t(`${translationPath}TotalPromotions`)}:
                                </span>
                            </Tag>
                            <span>{totals.totalPromotions.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm">
                            <Tag className="text-red-600 bg-blue-100 dark:tebg-blue-100 dark:bg-red-500/20 border-0">
                                <span className="font-medium text-gray-600">
                                    {t(`${translationPath}TotalSurcharges`)}:
                                </span>
                            </Tag>
                            <span>{totals.totalSurcharges.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm">
                            <Tag className="text-red-600 bg-blue-100 dark:tebg-blue-100 dark:bg-red-500/20 border-0">
                                <span className="font-medium text-gray-600">
                                    {t(`${translationPath}TotalVAT`)}:
                                </span>
                            </Tag>
                            <span>{totals.totalVat.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
                                <span>{t(`${translationPath}NetTotal`)}:</span>
                            </Tag>
                            <span>{totals.netTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showItemNameModal.show && (
                <SalesOrderItemNameModal
                    show={showItemNameModal.show}
                    handleClose={() =>
                        setShowItemNameModal({ show: false, id: null })
                    }
                    handleSelect={(item) =>
                        handleItemSelect(item, showItemNameModal.id)
                    }
                />
            )}
            <Dialog
                isOpen={isOpen}
                onClose={closeDialog}
                title={
                    generalLinesDialogYesORno
                        ? t(`${translationPath}GeneralColumns`)
                        : t(`${translationPath}OrderColumns`)
                }
                className="max-w-md"
            >
                <div className="flex flex-wrap gap-2">
                    {(generalLinesDialogYesORno
                        ? Object.keys(generalTableColumns.visible)
                        : Object.keys(orderTableColumns.visible)
                    ).map((column) => (
                        <Tag
                            key={column}
                            onClick={() =>
                                generalLinesDialogYesORno
                                    ? toggleGeneralColumn(column)
                                    : toggleOrderColumn(column)
                            }
                            className={`cursor-pointer ${generalLinesDialogYesORno ? (generalTableColumns.visible[column] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100') : orderTableColumns.visible[column] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100'}`}
                        >
                            {t(
                                `${translationPath}${column.replace(/\s+/g, '')}`,
                            )}
                        </Tag>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={closeDialog}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {t(`${translationPath}Close`)}
                    </Button>
                </div>
            </Dialog>

 <PaymentModal
                show={isPaymentOpen}
                handleClose={() => setIsPaymentOpen(false)}
                setFormData={(item) => {
                    console.log('item: ', item)
                    setpaymentTypeId(item)
                }}
                setAlert={setAlert}
            />
            <CustomerModal
                show={IsCustomerModalOpen}
                handleClose={() => setIsCustomerModalOpen(false)}
                setFormData={(item) => {
                    setCustomer(item)
                }}
                setAlert={setAlert}
            />
            <SOAModal
                show={showSOAModal}
                handleClose={() => setShowSOAModal(false)}
                setAlert={setAlert}
                setFormData={(item) => {
                    console.log(item)
                }}
            />
            <TransModal
                show={showTransModal}
                handleClose={() => setShowTransModal(false)}
                setFormData={(item) => {
                    console.log(item)
                }}
                setAlert={setAlert}
            />
        </div>
    )
}

export default EditOrder
