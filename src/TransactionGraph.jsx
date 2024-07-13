import  { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

const TransactionGraph = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://abdulrahmanahmedzaghloul.github.io/api/db.json');
        setCustomers(res.data.customers);
        setTransactions(res.data.transactions);

        // تعيين "Ahmed Ali" كاسم افتراضي
        setSelectedCustomerName('Ahmed Ali');
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const customer = customers.find(c => c.name === selectedCustomerName);
    if (customer) {
      const customerTransactions = transactions.filter((t) => t.customer_id === customer.id);
      const data = customerTransactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][selectedCustomerName] = (acc[date][selectedCustomerName] || 0) + transaction.amount;
        return acc;
      }, {});
      setGraphData(Object.values(data));
    }
  }, [selectedCustomerName, customers, transactions]);

  if (loading) {
    return <div className='flex items-center justify-center py-16'><MoonLoader /></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction Graph for Customer</h2>
      <label className="w-1/2 mb-4">
        Select Customer:
        <input
          type="text"
          list="customer-names"
          value={selectedCustomerName}
          onChange={(e) => setSelectedCustomerName(e.target.value)}
          className="border border-gray-300 rounded p-2 mt-1 my-4"
        />
        <datalist id="customer-names">
          {customers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </datalist>
      </label>
      {selectedCustomerName && graphData.length > 0 ? (
        <ResponsiveContainer width="90%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={selectedCustomerName} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>No transactions found for the selected customer</div>
      )}
    </div>
  );
};

export default TransactionGraph;
