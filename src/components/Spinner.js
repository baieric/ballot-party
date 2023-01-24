import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';

function Spinner(props){
  const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: "#edcc6d" }} spin />;
  return <Spin indicator={loadingIcon} />;
}

export default Spinner;
