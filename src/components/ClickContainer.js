import './ClickContainer.css';

function ClickContainer(props) {
  const {children, onClick} = props;
  return (
    <div className="click-container-root" onClick={onClick}>
      {children}
    </div>
  )
}

export default ClickContainer;
