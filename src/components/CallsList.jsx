import { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { formatDate } from '../utils/formatDate';
import Spinner from './Spinner';

const baseUrl = import.meta.env.VITE_API_BASE_URL

const headCells = [
  { id: 'callId', label: 'Call ID' },
  { id: 'email', label: 'User Email' },
  { id: 'phone', label: 'User Phone' },
  { id: 'callStatus', label: 'Status' },
  { id: 'callLength', label: 'Call Length (m)' },
  { id: 'callPrice', label: 'Call Price' },
  { id: 'callAnalysis', label: 'Call Analysis' },
  { id: 'startedAt', label: 'Start Time' },
  { id: 'endedAt', label: 'End Time' },
];

const OrderStatus = ({ status }) => {
  const statusClasses = {
    analyzed: 'text-green-500',
    in_progress: 'text-yellow-500',
    completed: 'text-blue-500',
    none: 'text-red-500',
    no_answer: 'text-orange-500',
    busy: 'text-orange-500',
  };

  const statusLabels = {
    analyzed: 'Analyzed',
    in_progress: 'In Progress',
    completed: 'Completed',
    none: 'Call Error',
    no_answer: 'No Answer',
    busy: 'Busy',
  };

  return <span className={statusClasses[status] || 'text-gray-500'}>{statusLabels[status] || 'Unknown'}</span>;
};

const fetchCallData = async (type) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${baseUrl}/voice-agent/users-calls?type=${type}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page on 401 Unauthorized
      window.location.href = '/login';
    } else {
      // Handle other types of errors (optional)
      console.error('An error occurred:', error);
      throw error;  // Re-throw the error if needed
    }
  }
};

export default function CallsList({ type }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCallData(type);
      setRows(data.data);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 40000);
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <Spinner />
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {headCells.map((cell) => (
                <th
                  key={cell.id}
                  className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.callId} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <a href="#" className="text-indigo-600 hover:underline">
                    {row.callId}
                  </a>
                </td>
                <td className="px-6 py-4">{row.user.email}</td>
                <td className="px-6 py-4">{row.user.phone}</td>
                <td className="px-6 py-4">
                  <OrderStatus status={row.callStatus} />
                </td>
                <td className="px-6 py-4 text-right">{row.callLength || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <NumericFormat value={row.callPrice || '-'} displayType="text" thousandSeparator prefix="$" />
                </td>
                <td className="px-6 py-4">{row.callAnalysis}</td>
                <td className="px-6 py-4">{row.startedAt ? formatDate(row.startedAt) : '-'}</td>
                <td className="px-6 py-4">{row.endedAt ? formatDate(row.endedAt) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
