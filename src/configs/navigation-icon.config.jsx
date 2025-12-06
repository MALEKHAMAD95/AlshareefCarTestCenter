import {
    FcHome,
    FcSafe,
    FcCollaboration,
    FcBusinessman,
    FcBusinessContact,
    FcMoneyTransfer,
    FcCurrencyExchange,
    FcGallery,
    FcReading,
} from 'react-icons/fc'
import { 
    TbFileAnalytics, 
    TbSettings,
    TbCalendar,
    TbClipboardList,
    TbCar,
    TbCalculator,
    TbUser,
    TbBuilding,
    TbClock,
    TbRefresh,
    TbFileText,
    TbChartBar,
    TbChecklist,
    TbHistory,
    TbBrandSpeedtest,
    TbUsers,
    TbShield,
    TbList,
    TbUserCircle,
    TbCarCrane,
    TbPalette,
    TbFlag,
    TbGasStation,
    TbCreditCard,
    TbBuildingBank,
    TbCheckbox,
    TbReload,
    TbPresentation,
    TbMapPin,
    TbHome,
    TbBriefcase,
    TbFileInvoice,
    TbWallet,
    TbChartLine,
    TbAd,
} from 'react-icons/tb'
import BlankSvg from '@/assets/svg/SystemIcons/TurnSvg'
import TurnSvg from '@/assets/svg/SystemIcons/TurnSvg'
import ClientInformationSvg from '@/assets/svg/SystemIcons/ClientInformationSvg'
import GuessCarsSvg from '@/assets/svg/SystemIcons/GuessCarsSvg'
import InspectorRecheckRequestsSvg from '@/assets/svg/SystemIcons/InspectorRecheckRequestsSvg'
import AccountingScreenSvg from '@/assets/svg/SystemIcons/AccountingScreenSvg'
import RequestAssignInspectionFromInspectorsSvg from '@/assets/svg/SystemIcons/RequestAssignInspectionFromInspectorsSvg'
import AllCarsInspectionsSvg from '@/assets/svg/SystemIcons/AllCarsInspectionsSvg'
import CarsserSvg from '@/assets/svg/SystemIcons/CarsserSvg'
import OldInspectionsSvg from '@/assets/svg/SystemIcons/OldInspectionsSvg'
import OldValuationSvg from '@/assets/svg/SystemIcons/OldValuationSvg'
import StartVehicleInspectionSvg from '@/assets/svg/SystemIcons/StartVehicleInspectionSvg'
import SettingsSvg from '@/assets/svg/SystemIcons/SettingsSvg'

const iconStyle = { fontSize: '1.35rem' }

const navigationIcon = {
    home: <FcHome />,
    inventory: <FcSafe />,
    auctions: <FcMoneyTransfer />,
    dealers: <FcBusinessman />,
    customer: <FcBusinessContact />,
    sales: <FcCurrencyExchange />,
    expenses: <FcMoneyTransfer />,
    gallery: <FcGallery />,
    leads: <FcReading />,
    
    // Main Navigation Icons
    appointment: <TurnSvg height={18} width={18} />,
    reservations: <TbClipboardList style={iconStyle} />,
    vehicle: <TbCar style={iconStyle} />,
    accounting: <AccountingScreenSvg  height={25} width={25} />   ,
    client: <ClientInformationSvg height={25} width={25} />,
    branchInspections: <AllCarsInspectionsSvg height={25} width={25} />,
    deferred: <TbClock style={iconStyle} />,
    recheck: <InspectorRecheckRequestsSvg height={25} width={25} />,
    inspectionRequests:  <RequestAssignInspectionFromInspectorsSvg height={25} width={25} />,
    estimation: <GuessCarsSvg height={25} width={25} />   ,
    previousEstimations:  <OldValuationSvg height={25} width={25} />   , 
    startInspection: <StartVehicleInspectionSvg height={25} width={25} />   , 
    complete: <TbChecklist style={{ fontSize: '1.7rem' }} />,
    previousInspections: <OldInspectionsSvg style={iconStyle} />,
    carsir: <CarsserSvg style={iconStyle} />,
    
    // Reports & Settings
    reports: <TbFileAnalytics style={{ fontSize: '1.15rem', color: '#004CC8' }} />,
    settings: <SettingsSvg height={25} width={25} />,
    
    // Reports Submenu Icons
    staffSummary: <TbUsers style={iconStyle} />,
    staffDetailed: <TbUserCircle style={iconStyle} />,
    checkpoints: <TbCheckbox style={iconStyle} />,
    paymentMethod: <TbCreditCard style={iconStyle} />,
    lenders: <TbBuildingBank style={iconStyle} />,
    customers: <TbUser style={iconStyle} />,
    auditResponsible: <TbShield style={iconStyle} />,
    
    // Settings Submenu Icons
    userGroups: <TbUsers style={iconStyle} />,
    permissions: <TbShield style={iconStyle} />,
    users: <TbUser style={iconStyle} />,
    vehicleTypes: <TbCar style={iconStyle} />,
    vehicleBodies: <TbCarCrane style={iconStyle} />,
    vehicleColors: <TbPalette style={iconStyle} />,
    countries: <TbFlag style={iconStyle} />,
    fuelTypes: <TbGasStation style={iconStyle} />,
    paymentMethods: <TbCreditCard style={iconStyle} />,
    financialInstitutions: <TbBuildingBank style={iconStyle} />,
    systemCheckpoints: <TbCheckbox style={iconStyle} />,
    inspectionPackages: <TbClipboardList style={iconStyle} />,
    resetCheckpoints: <TbReload style={iconStyle} />,
    exhibitions: <TbPresentation style={iconStyle} />,
    cities: <TbMapPin style={iconStyle} />,
    yildan: <TbHome style={iconStyle} />,
    branches: <TbBuilding style={iconStyle} />,
    departments: <TbBriefcase style={iconStyle} />,
    bankRequests: <TbFileInvoice style={iconStyle} />,
    bankUsers: <TbUsers style={iconStyle} />,
    bankEstimation: <TbChartLine style={iconStyle} />,
    bankAds: <TbAd style={iconStyle} />,
}

export default navigationIcon
