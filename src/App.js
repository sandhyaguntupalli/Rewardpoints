import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Customers from './containers/Customers/AllCustomerReward'

function App() {
  return (
    
      <div>
        <BrowserRouter>
        <Customers />
        </BrowserRouter>
      </div>
    
  );
}

export default App;
