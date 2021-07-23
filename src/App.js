import logo from './logo.svg';
import './App.css';
import MainControll from './component/MainControll';
import { ReactComponent as Logo } from './logo.svg';

function App() {
  return (
    <div className="App">
      {/* <div className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      
      {/* </div> */}
      <MainControll></MainControll>
      {/* <Logo >ABC</Logo> */}
    </div>
  );
}

export default App;
