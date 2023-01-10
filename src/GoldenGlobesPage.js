import {GOLDEN_GLOBES_2023} from './constants/GoldenGlobesConstants';
import BaseAwardsShowPage from './components/BaseAwardsShowPage';

function GoldenGlobesPage(props) {
  const event = new Date(GOLDEN_GLOBES_2023['date']);

  return <BaseAwardsShowPage
    title={GOLDEN_GLOBES_2023['title']}
    date={event}
    categories={GOLDEN_GLOBES_2023['categories']}
    storageKey="gg23"
  />;
}
export default GoldenGlobesPage;
