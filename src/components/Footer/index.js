import scss from './footer.module.scss'
import logo from '../../assets/built-by-systems-tech-white-final.e13cb6fc.png'

const Footer = () => {
  return (
    <div className={scss.root}>
      <div className={scss.footer}>
        <div className={scss.footerBlue}>
          <img className={scss.footerImg} src={logo} alt='logo' />
        </div>
        <div className={scss.footerPink}></div>
      </div>
    </div>
  );
}

export default Footer;
