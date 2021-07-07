// import logo from './logo.svg';
import './App.css';
import scss from './app.module.scss'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
import GlobalContextProvider from './Context/GlobalContext'

function App() {
  return (
    <div className={scss.root}>
      <GlobalContextProvider>
        <Header />
        <Content />
        <Footer />
      </GlobalContextProvider>
    </div>
  );
}

export default App;
