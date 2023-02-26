import { Loading } from '../Loading';
import styles from './LoadingLazy.module.css';

function LoadingLazy() {
  return (
    <div className={styles.loadinglazy}>
      <Loading
        size={90}
        color='#fc3b56'
      />
    </div>
  );
}

export default LoadingLazy;
