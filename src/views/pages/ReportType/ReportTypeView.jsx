import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslationValue } from '@/locales';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const ReportTypeView = () => {
    const [reportTypeName, setReportTypeName] = useState('');
    const [reportTypeScript, setReportTypeScript] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation(useTranslationValue);
    const translationPath = 'views.ReportType.';

    // Chart colors consistent with ECME design
    const chartColors = ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0'];

    // Chart types and default configurations
    const getDefaultChartOptions = (type) => {
        const defaults = {
            pie: {
                chart: { height: 320, type: 'pie' },
                series: [44, 55, 41, 17, 15],
                labels: ["Electronics", "Clothing", "Books", "Toys", "Furniture"],
                colors: chartColors,
                legend: { show: true, position: 'bottom', horizontalAlign: 'center', verticalAlign: 'middle', floating: false, fontSize: '14px', offsetX: 0 },
                responsive: [{ breakpoint: 600, options: { chart: { height: 240 }, legend: { show: false } } }],
            },
            bar: {
                chart: { height: 320, type: 'bar' },
                series: [{ name: 'Sales', data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380, 1500, 1600] }],
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], title: { text: t(`${translationPath}month`) } },
                yaxis: { title: { text: t(`${translationPath}sales`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                legend: { position: 'top' },
                responsive: [{ breakpoint: 600, options: { chart: { height: 240 } } }],
            },
            line: {
                chart: { height: 320, type: 'line' },
                series: [{ name: 'Profit', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] }],
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], title: { text: t(`${translationPath}month`) } },
                yaxis: { title: { text: t(`${translationPath}profit`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth' },
                legend: { position: 'top' },
                responsive: [{ breakpoint: 600, options: { chart: { height: 240 } } }],
            },
            area: {
                chart: { height: 320, type: 'area' },
                series: [{ name: 'Team A', data: [31, 40, 28, 51, 42, 109, 100] }, { name: 'Team B', data: [11, 32, 45, 32, 34, 52, 41] }],
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], title: { text: t(`${translationPath}month`) } },
                yaxis: { title: { text: t(`${translationPath}performance`) } },
                colors: chartColors,
                dataLabels: { enabled: false },
                fill: { opacity: 0.3 },
                stroke: { curve: 'smooth' },
                legend: { position: 'top' },
                responsive: [{ breakpoint: 600, options: { chart: { height: 240 } } }],
            },
        };
        return JSON.stringify(defaults[type] || defaults.pie, null, 2);
    };

    // Chart options for dropdown
    const chartOptionsList = [
        { value: '', label: t(`${translationPath}selectReportType`) },
        { value: 'pie', label: t(`${translationPath}pieChart`) },
        { value: 'bar', label: t(`${translationPath}barChart`) },
        { value: 'line', label: t(`${translationPath}lineChart`) },
        { value: 'area', label: t(`${translationPath}areaChart`) },
    ];

    const handleCreateNew = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://91.106.107.178:9032/RPTTYPE/AddUpdateRPTTYPE', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    RPTTYPEID: '0', // 0 indicates a new record
                    RPTTYPENAME: reportTypeName,
                    RPTTYPESCRIPT: reportTypeScript,
                }),
            });
            const result = await response.json();
            console.log('Create Result:', result);
            if (response.ok) {
                setReportTypeName('');
                setReportTypeScript('');
                setSelectedReportType(''); // Reset dropdown
            }
        } catch (error) {
            console.error('Error creating report type:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (option) => {
        setSelectedReportType(option.value);
        if (option.value) {
            setReportTypeName(t(`${translationPath}${option.value}Chart`));
            setReportTypeScript(getDefaultChartOptions(option.value));
        } else {
            setReportTypeName('');
            setReportTypeScript('');
        }
    };

    const handleNavigateToReport = () => {
        window.location.href = '/Report'; // Basic navigation; replace with React Router if applicable
    };

    return (
        <Container>
            <AdaptiveCard className="mb-6">
                <h5 className="mb-4">{t(`${translationPath}reportTypeInformation`)}</h5>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t(`${translationPath}reportTypeName`)}</label>
                        <Input
                            value={reportTypeName}
                            onChange={(e) => setReportTypeName(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium ">{t(`${translationPath}selectReportType`)}</label>
                            <Select
                                options={chartOptionsList}
                                value={chartOptionsList.find(option => option.value === selectedReportType)}
                                onChange={handleSelectChange}
                            />
                        </div>
                        <Button
                            variant="solid"
                            className="btn btn-sm btn-info mt-6 "
                            onClick={handleNavigateToReport}
                        >
                            {t(`${translationPath}goToReport`)}
                        </Button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t(`${translationPath}reportTypeScript`)}</label>
                        <CodeMirror
                            value={reportTypeScript}
                            height="300px"
                            extensions={[javascript()]}
                            onChange={(value) => setReportTypeScript(value)}
                            placeholder={t(`${translationPath}reportTypeScriptPlaceholder`)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="solid"
                            className="btn btn-sm btn-success"
                            onClick={handleCreateNew}
                            disabled={isLoading}
                        >
                            {t(`${translationPath}updates`)}
                        </Button>
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    );
};

export default ReportTypeView;