/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDOM from 'react-dom';
import React from 'react';
import { useState } from 'react';

function Child() {
	const [num, setNum] = useState(12);
	window.setNum = setNum;
	return <div>{num}</div>;
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
