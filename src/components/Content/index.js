import scss from './content.module.scss'
import ListBuilder from '../listBuilder'

const Content = () => {
  return (
    <div className={scss.root}>
      <ListBuilder />
    </div>
  );
}

export default Content;
