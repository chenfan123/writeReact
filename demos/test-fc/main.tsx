import ReactDOM from 'react-dom';
import React from 'react';

function Child() {
    return <div>Child</div>;
  }
  
  function App() {
    return (
      <div>
        <span>
          <Child />
        </span>
      </div>
    );
  }
  

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
