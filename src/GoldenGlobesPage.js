import {GOLDEN_GLOBES_2023} from './constants/GoldenGlobesConstants';
import BaseAwardsShowPage from './components/BaseAwardsShowPage';

function GoldenGlobesPage(props) {
  return <BaseAwardsShowPage
    title={GOLDEN_GLOBES_2023['title']}
    categories={GOLDEN_GLOBES_2023['categories']}
    storageKey="gg23"
  />;
}
export default GoldenGlobesPage;
