import ClickContainer from './components/ClickContainer';
import KofiButton from './components/KofiButton';
import {Button} from 'antd';
import {GOLDEN_GLOBES_2023} from './constants/GoldenGlobesConstants';
import './Home.css';
import {useState, useEffect} from 'react';
import AwardsDbApi from './awardsdb/AwardsDbApi';
import {numToNth} from './util/stringUtil';
import Spinner from './components/Spinner';

function datesAreOnSameDay(first, second){
    return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
}

function Home(props){
  const {onGoToOscars} = props;

  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    const api = new AwardsDbApi();
    const oscars = api.oscars();
    const todayDate = new Date();
    // 95th Oscars happens on 2023, assume future Oscars happen once every year
    const numToGet = todayDate.getFullYear() - 1928;
    oscars.search(numToGet, (latestDate, categories) => {
      const numsForPast = Array.from({length: numToGet - 1}, (_, i) => i + 1).reverse();
      if (Object.keys(categories).length > 0) {
        if (datesAreOnSameDay(latestDate, todayDate)) {
          setToday([numToGet]);
        } else if(latestDate > todayDate) {
          // TODO check if there's any nominees before setting upcoming.
          setUpcoming([numToGet]);
        } else {
          numsForPast.unshift(numToGet);
        }
      }
      setPast(numsForPast);
    });
  }, []);

  return (
    <>
      <div className="home-body">
        <p className="secondary-text-serif home-subtitle">A tiny website for saving your awards predictions.</p>
        {past.length == 0 && <Spinner />}
        {upcoming.length > 0 && (
          <>
            <p className="secondary-text">Upcoming</p>
            {upcoming.map(i =>
              <ClickContainer key={i} onClick={() => onGoToOscars(i)}>
                <p className="main-text">{`${numToNth(i)} Academy Awards`}</p>
              </ClickContainer>
            )}
          </>
        )}
        {today.length > 0 && (
          <>
            <p className="secondary-text">Today</p>
            {today.map(i =>
              <ClickContainer key={i} onClick={() => onGoToOscars(i)}>
                <p className="main-text">{`${numToNth(i)} Academy Awards`}</p>
              </ClickContainer>
            )}
          </>
        )}
      {past.length > 0 && (
        <>
          <p className="secondary-text">Past</p>
          {past.map(i =>
            <ClickContainer key={i} onClick={() => onGoToOscars(i)}>
              <p className="main-text">{`${numToNth(i)} Academy Awards`}</p>
            </ClickContainer>
          )}
        </>
      )}
      </div>
      <div className="home-footer">
        <Button type="text" href="https://twitter.com/BaiEric"><p className="main-text author-text">By Eric Bai</p></Button>
        <KofiButton />
      </div>
    </>
  );
}

export default Home;
