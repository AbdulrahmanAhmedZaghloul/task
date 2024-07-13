
import React from 'react';
import CustomerTable from './CustomerTable';
import TransactionGraphAll from './TransactionGraphAll';
import TransactionGraph from './TransactionGraph';

const App = () => {
  return (<React.Fragment>
    <div className="bg-white m-auto container">
      <CustomerTable />
      <div className="flex items-center flex-wrap p-5">
        <div className="lg:w-1/2 w-full m-auto">
          <TransactionGraph />
        </div>
        <div className="lg:w-1/2 w-full m-auto">
          <TransactionGraphAll />
        </div>
      </div>
    </div>
  </React.Fragment>

  );
};

export default App;
