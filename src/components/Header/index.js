import scss from './header.module.scss'

const Header = () => {
  return (
    <div className={scss.root}>
      <div className={scss.topbar}>
        <div className={scss.questions}>
          <a href="mailto:systemstechnewbiz@mediacom.com">Have questions or feedback?</a>
        </div>
      </div>
    </div>
  );
}

export default Header;
