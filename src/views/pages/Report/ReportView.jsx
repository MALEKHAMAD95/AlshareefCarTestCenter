import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'
import Chart from 'react-apexcharts'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { PiPlus } from 'react-icons/pi'

const ReportView = () => {
    const [openDialogCRUD, setOpenDialogCRUD] = useState(false)
    const [selectItem, setSelectItem] = useState(null)
    const [reportName, setReportName] = useState('')
    const [syncSeconds, setSyncSeconds] = useState('')
    const [chartType, setChartType] = useState('none')
    const [showInMenu, setShowInMenu] = useState('yes')
    const [containerSize, setContainerSize] = useState('')
    const [showInDashboard, setShowInDashboard] = useState('yes')
    const [resultOffset, setResultOffset] = useState('')
    const [sqlQuery, setSqlQuery] = useState('')
    const [chartCode, setChartCode] = useState('')
    const [filterName, setFilterName] = useState('')
    const [filterColumn, setFilterColumn] = useState('')
    const [filterType, setFilterType] = useState('')
    const [allowedUser, setAllowedUser] = useState('')
    const [allowed, setAllowed] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation(useTranslationValue)
    const translationPath = 'views.Report.'

    const chartColors = ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0']

    const getDefaultChartOptions = (type) => {
        const defaults = {
            pie: {
                chart: { height: 320, type: 'pie' },
                series: [44, 55, 41, 17, 15],
                labels: [
                    'Electronics',
                    'Clothing',
                    'Books',
                    'Toys',
                    'Furniture',
                ],
                colors: chartColors,
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    verticalAlign: 'middle',
                    floating: false,
                    fontSize: '14px',
                    offsetX: 0,
                },
                responsive: [
                    {
                        breakpoint: 600,
                        options: {
                            chart: { height: 240 },
                            legend: { show: false },
                        },
                    },
                ],
            },
            bar: {
                chart: { height: 320, type: 'bar' },
                series: [
                    {
                        name: 'Sales',
                        data: [
                            400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380,
                            1500, 1600,
                        ],
                    },
                ],
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ],
                    title: { text: t(`${translationPath}month`) },
                },
                yaxis: { title: { text: t(`${translationPath}sales`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                legend: { position: 'top' },
                responsive: [
                    { breakpoint: 600, options: { chart: { height: 240 } } },
                ],
            },
            line: {
                chart: { height: 320, type: 'line' },
                series: [
                    {
                        name: 'Profit',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                    },
                ],
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                    ],
                    title: { text: t(`${translationPath}month`) },
                },
                yaxis: { title: { text: t(`${translationPath}profit`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth' },
                legend: { position: 'top' },
                responsive: [
                    { breakpoint: 600, options: { chart: { height: 240 } } },
                ],
            },
            area: {
                chart: { height: 320, type: 'area' },
                series: [
                    { name: 'Team A', data: [31, 40, 28, 51, 42, 109, 100] },
                    { name: 'Team B', data: [11, 32, 45, 32, 34, 52, 41] },
                ],
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                    ],
                    title: { text: t(`${translationPath}month`) },
                },
                yaxis: { title: { text: t(`${translationPath}performance`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                fill: { opacity: 0.3 },
                stroke: { curve: 'smooth' },
                legend: { position: 'top' },
                responsive: [
                    { breakpoint: 600, options: { chart: { height: 240 } } },
                ],
            },
        }
        return JSON.stringify(defaults[type] || defaults.pie, null, 2)
    }

    const chartOptionsList = [
        { value: 'none', label: t(`${translationPath}none`) },
        { value: 'pie', label: t(`${translationPath}pieChart`) },
        { value: 'bar', label: t(`${translationPath}barChart`) },
        { value: 'line', label: t(`${translationPath}lineChart`) },
        { value: 'area', label: t(`${translationPath}areaChart`) },
    ]

    const yesNoOptions = [
        { value: 'yes', label: t(`${translationPath}yes`) },
        { value: 'no', label: t(`${translationPath}no`) },
    ]

    const handleSimulate = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/RPTS/ExecSQL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: sqlQuery }),
            })
            const result = await response.json()
            console.log('Simulation Result:', result)
        } catch (error) {
            console.error('Error simulating SQL query:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (chartType !== 'none') {
            setChartCode(getDefaultChartOptions(chartType))
        } else {
            setChartCode('')
        }
    }, [chartType])

    const renderChart = () => {
        try {
            const options = JSON.parse(chartCode)
            return (
                <Chart
                    options={options}
                    series={options.series}
                    type={options.chart.type}
                    height={options.chart.height}
                />
            )
        } catch (error) {
            return (
                <div className="text-red-500">
                    {t(`${translationPath}chartError`)}: {error.message}
                </div>
            )
        }
    }

    return (
        <Container>
            <AdaptiveCard className="mb-6">
                <h5 className="mb-4">
                    {t(`${translationPath}reportInformation`)}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}reportName`)}
                        </label>
                        <Input
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}showInMenu`)}
                        </label>
                        <Select
                            options={yesNoOptions}
                            value={yesNoOptions.find(
                                (option) => option.value === showInMenu,
                            )}
                            onChange={(option) => setShowInMenu(option.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}containerSize`)}
                        </label>
                        <Input
                            value={containerSize}
                            onChange={(e) => setContainerSize(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}resultOffset`)}
                        </label>
                        <Input
                            value={resultOffset}
                            onChange={(e) => setResultOffset(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}syncSeconds`)}
                        </label>
                        <Input
                            value={syncSeconds}
                            onChange={(e) => setSyncSeconds(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}chart`)}
                        </label>
                        <Select
                            options={chartOptionsList}
                            value={chartOptionsList.find(
                                (option) => option.value === chartType,
                            )}
                            onChange={(option) => setChartType(option.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}showInDashboard`)}
                        </label>
                        <Select
                            options={yesNoOptions}
                            value={yesNoOptions.find(
                                (option) => option.value === showInDashboard,
                            )}
                            onChange={(option) =>
                                setShowInDashboard(option.value)
                            }
                        />
                    </div>
                </div>
                {chartType !== 'none' && (
                    <div className="mt-4">
                        <h5 className="mb-4">
                            {t(`${translationPath}${chartType}Chart`)}
                        </h5>
                        {renderChart()}
                    </div>
                )}
            </AdaptiveCard>

            <AdaptiveCard className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    {t(`${translationPath}sqlQuery`)}
                </label>
                <CodeMirror
                    value={sqlQuery}
                    height="200px"
                    extensions={[javascript()]}
                    onChange={(value) => setSqlQuery(value)}
                    placeholder={t(`${translationPath}sqlQueryPlaceholder`)}
                />
            </AdaptiveCard>

            {chartType !== 'none' && (
                <AdaptiveCard className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        {t(`${translationPath}chartCode`)}
                    </label>
                    <CodeMirror
                        value={chartCode}
                        height="200px"
                        extensions={[javascript()]}
                        onChange={(value) => setChartCode(value)}
                        placeholder={t(
                            `${translationPath}chartCodePlaceholder`,
                        )}
                    />
                </AdaptiveCard>
            )}

            <AdaptiveCard className="mb-6">
                <h5 className="mb-4">{t(`${translationPath}reportFilters`)}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}filterName`)}
                        </label>
                        <Input
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}filterColumn`)}
                        </label>
                        <Input
                            value={filterColumn}
                            onChange={(e) => setFilterColumn(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}filterType`)}
                        </label>
                        <Input
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            placeholder=""
                        />
                    </div>
                </div>
            </AdaptiveCard>

            <AdaptiveCard className="mb-6">
                <h5 className="mb-4">{t(`${translationPath}allowedUsers`)}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}user`)}
                        </label>
                        <Input
                            value={allowedUser}
                            onChange={(e) => setAllowedUser(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t(`${translationPath}allowed`)}
                        </label>
                        <Input
                            value={allowed}
                            onChange={(e) => setAllowed(e.target.value)}
                            placeholder=""
                        />
                    </div>
                </div>
            </AdaptiveCard>

            <div className="flex justify-start">
                <Button
                    variant="solid"
                    className="mt-4 flex items-center gap-2 add-new-record-button"
                    onClick={handleSimulate}
                    disabled={isLoading}
                >
                    <PiPlus className="text-lg" />
                    {t(`${translationPath}simulate`)}
                </Button>
            </div>
        </Container>
    )
}

export default ReportView
