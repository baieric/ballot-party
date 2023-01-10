import ClickContainer from './components/ClickContainer';
import KofiButton from './components/KofiButton';
import {Button} from 'antd';
import {GOLDEN_GLOBES_2023} from './constants/GoldenGlobesConstants';
import './Home.css';

function Home(props){
  const {onGoToGG23} = props;

  const shows = [GOLDEN_GLOBES_2023];
  const today = new Date();
  const upcoming = shows.filter(show => new Date(show['date']) > today);
  const past = shows.filter(show => new Date(show['date']) < today);;

  // TODO make upcoming/past logic scale
  return (
    <>
      <div className="home-body">
        <p className="secondary-text-serif home-subtitle">A tiny website for saving your awards predictions.</p>
        {upcoming.length > 0 && (
          <>
          <p className="secondary-text">Upcoming</p>
          <ClickContainer onClick={onGoToGG23}>
            <p className="main-text">Golden Globes 2023</p>
          </ClickContainer>
          </>
      )}
      {past.length > 0 && (
        <>
          <p className="secondary-text">Past</p>
          <ClickContainer onClick={onGoToGG23}>
            <p className="main-text">Golden Globes 2023</p>
          </ClickContainer>
        </>
      )}
      </div>
      <div className="home-footer">
        <Button type="text" href="https://twitter.com/BaiEric"><p className="main-text">By Eric Bai</p></Button>
        <KofiButton />
      </div>
    </>
  );
}

export default Home;
