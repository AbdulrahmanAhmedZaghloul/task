import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ name: '', amount: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersRes = await axios.get('https://abdulrahmanahmedzaghloul.github.io/api/db.json');
        const transactionsRes = await axios.get('https://abdulrahmanahmedzaghloul.github.io/api/db.json');
        setCustomers(customersRes.data.customers);
        setTransactions(transactionsRes.data.transactions);
        setFilteredData(transactionsRes.data.transactions);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });

    const filtered = transactions.filter((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customer_id);
      return (
        (!filter.name || (customer && customer.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
        (!filter.amount || transaction.amount >= parseFloat(filter.amount))
      );
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return <div className='flex items-center justify-center py-16'><MoonLoader /></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (<React.Fragment>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Transactions</h2>
      <div className="mb-4">
        <label className="block mb-2">
          Filter by Name:
          <input
            type="text"
            name="name"
            value={filter.name}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
     
      </div>
      {filteredData.length === 0 ? (
        <div className="text-red-500 text-center font-bold text-2xl">No matching records found</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Customer ID</th>
              <th className="py-2 px-4 border-b text-center">Customer Name</th>
              <th className="py-2 px-4 border-b text-center">Date</th>
              <th className="py-2 px-4 border-b text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((transaction) => {
              const customer = customers.find((c) => c.id === transaction.customer_id);
              const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b text-center">{customer ? customer.id : 'Unknown'}</td>
                  <td className="py-2 px-4 border-b text-center">{customer ? customer.name : 'Unknown'}</td>
                  <td className="py-2 px-4 border-b text-center">{formattedDate}</td>
                  <td className="py-2 px-4 border-b text-center">{transaction.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  </React.Fragment>

  );
};

export default CustomerTable;
