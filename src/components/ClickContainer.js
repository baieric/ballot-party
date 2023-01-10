import './ClickContainer.css';

function ClickContainer(props) {
  const {children, onClick} = props;
  return (
    <div className="root" onClick={onClick}>
      {children}
    </div>
  )
}

export default ClickContainer;
