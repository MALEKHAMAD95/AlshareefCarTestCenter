import {
    FcHome,
    FcSafe,
    FcBusinessman,
    FcBusinessContact,
    FcMoneyTransfer,
    FcCurrencyExchange,
    FcGallery,
    FcReading,
} from 'react-icons/fc'
import {
    TbCalendar,
    TbClipboardList,
    TbCar,
    TbUser,
    TbBuilding,
    TbClock,
    TbChecklist,
    TbUsers,
    TbShield,
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
import ReportSvg from '@/assets/svg/SystemIcons/ReportSvg'
import VehicleEntrySvg from '@/assets/svg/SystemIcons/VehicleEntrySvg'
import { BiHomeAlt } from 'react-icons/bi'
import ReservationsSvg from '@/assets/svg/SystemIcons/ReservationsSvg'

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
  Dashboard: <BiHomeAlt />,
    // Main Navigation Icons
    appointment: <TurnSvg height={25} width={25} />,
    reservations: <ReservationsSvg  height={25} width={25} />,
    vehicle: <VehicleEntrySvg height={25} width={25} />,
    accounting: <AccountingScreenSvg height={25} width={25} />,
    client: <ClientInformationSvg height={25} width={25} />,
    branchInspections: <AllCarsInspectionsSvg height={25} width={25} />,
    deferred: <TbClock style={iconStyle} />,
    recheck: <InspectorRecheckRequestsSvg height={25} width={25} />,
    inspectionRequests: (
        <RequestAssignInspectionFromInspectorsSvg height={25} width={25} />
    ),
    estimation: <GuessCarsSvg height={25} width={25} />,
    previousEstimations: <OldValuationSvg height={25} width={25} />,
    startInspection: <StartVehicleInspectionSvg height={25} width={25} />,
    complete: <TbChecklist style={{ fontSize: '1.7rem' }} />,
    previousInspections: <OldInspectionsSvg height={25} width={25} />,
    carsir: <CarsserSvg style={iconStyle} />,

    // Reports & Settings
    reports: <ReportSvg height={25} width={25} />,
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
