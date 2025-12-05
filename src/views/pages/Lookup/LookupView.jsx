import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import { useTranslation } from 'react-i18next';
import LookupTable from './components/LookupTable';
import { TbPlus } from 'react-icons/tb';
import { Button } from '@/components/ui';

const LookupView = () => {
  const { t } = useTranslation();
  const translationPath = 'views.Lookup.';

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-lg font-bold">{t(`${translationPath}Lookup`)}</h3>
          </div>
                  <div className="flex flex-col md:flex-row gap-3">
 
        </div>
          <LookupTable translationPath={translationPath} />
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default LookupView;
