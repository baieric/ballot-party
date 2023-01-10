import ClickContainer from './components/ClickContainer';

function Home(props){
  const {onGoToGG23} = props;
  return (
    <>
      <p className="secondary-text">Upcoming</p>
      <ClickContainer onClick={onGoToGG23}>
        <p className="main-text">Golden Globes 2023</p>
      </ClickContainer>
    </>
  );
}

export default Home;
