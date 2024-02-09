import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <div className='flex items-center flex-col h-[520px] w-[100vw] bg-[#cce705] border-2 border-[#101503]'>
      <Game />
      </div>
    </div>
  );
}

export default App;
