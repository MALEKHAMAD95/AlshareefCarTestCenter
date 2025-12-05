import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'

export const publicRoutes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/MainPages/DashboardPage/DashboardPage')),
        authority: [],
    },
    {
        key: 'LookupView',
        path: '/Lookup',
        component: lazy(() => import('@/views/pages/Lookup/LookupView')),
        authority: [],
    },
    {
        key: 'Customer',
        path: '/Customer/edit/:id',
        component: lazy(
            () => import('@/views/pages/Customer/AddEdit/AddEditCustomer'),
        ),
        authority: [],
    },

    {
        key: 'SalesOrder',
        path: '/SalesOrder/add',
        component: lazy(
            () => import('@/views/pages/SalesOrder/AddOrder/AddOrder'),
        ),
        authority: [],
    },
    {
        key: 'SalesOrder',
        path: '/SalesOrder/Edit/:id',
        component: lazy(
            () => import('@/views/pages/SalesOrder/EditOrder/EditOrder'),
        ),
        authority: [],
    },

    ,
    {
        key: 'PurchaseOrder',
        path: '/PurchaseOrder',
        component: lazy(
            () =>
                import(
                    '@/views/pages/PurchaseOrderModule/PurchaseOrderModuleView'
                ),
        ),
        authority: [],
    },
    {
        key: 'PurchaseOrder',
        path: '/PurchaseOrder/add',
        component: lazy(
            () =>
                import(
                    '@/views/pages/PurchaseOrderModule/PurchaseOrderModuleView'
                ),
        ),
        authority: [],
    },
    {
        key: 'PurchaseOrder',
        path: '/PurchaseOrder/Edit/:id',
        component: lazy(
            () =>
                import(
                    '@/views/pages/PurchaseOrderModule/PurchaseOrderModuleView'
                ),
        ),
        authority: [],
    },

    {
        key: 'MaterialsTransaction',
        path: '/MaterialsTransaction',
        component: lazy(
            () =>
                import(
                    '@/views/pages/MaterialsTransaction/MaterialsTransactionView'
                ),
        ),
        authority: [],
    },
    {
        key: 'PurchaseOrder',
        path: '/PurchaseOrder',
        component: lazy(
            () => import('@/views/pages/PurchaseOrder/PurchaseOrderView'),
        ),
        authority: [],
    },
    {
        key: 'ReportType',
        path: '/ReportType',
        component: lazy(
            () => import('@/views/pages/ReportType/ReportTypeView'),
        ),
        authority: [],
    },
    {
        key: 'Report',
        path: '/Report',
        component: lazy(() => import('@/views/pages/Report/ReportView')),
        authority: [],
    },
    {
        key: 'Targets',
        path: '/Targets',
        component: lazy(() => import('@/views/pages/Targets/TargetsView')),
        authority: [],
    },
    {
        key: 'Warehouse',
        path: '/Warehouse',
        component: lazy(() => import('@/views/pages/Warehouse/WarehouseView')),
        authority: [],
    },
    {
        key: 'Mark',
        path: '/Mark',
        component: lazy(() => import('@/views/pages/Mark/MarkView')),
        authority: [],
    },
    {
        key: 'BankAccounts',
        path: '/BankAccounts',
        component: lazy(
            () => import('@/views/pages/BankAccounts/BankAccountsView'),
        ),
        authority: [],
    },
    {
        key: 'BankAccounts',
        path: '/BankAccounts/Edit/:id',
        component: lazy(
            () =>
                import(
                    '@/views/pages/BankAccounts/AddEdit/AddEditBankAccounts'
                ),
        ),
        authority: [],
    },
    {
        key: 'BankAccounts',
        path: '/BankAccounts/Add/:id',
        component: lazy(
            () =>
                import(
                    '@/views/pages/BankAccounts/AddEdit/AddEditBankAccounts'
                ),
        ),
        authority: [],
    },
    {
        key: 'PaymentPlan',
        path: '/PaymentPlan',
        component: lazy(
            () => import('@/views/pages/PaymentPlan/PaymentPlanView'),
        ),
        authority: [],
    },
    ...othersRoute,
]
