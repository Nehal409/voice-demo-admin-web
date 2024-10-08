import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const headCells = [
  { id: 'delete_call', label: 'Delete Record' },
  { id: 'name', label: 'User Name' },
  { id: 'email', label: 'User Email' },
  { id: 'phone', label: 'User Phone' },
  { id: 'bookingSlot', label: 'Booking Slot' },
];

const fetchBookingData = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${baseUrl}/chat-bot/appointments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page on 401 Unauthorized
      window.location.href = '/login';
    } else {
      // Handle other types of errors (optional)
      console.error('An error occurred:', error);
      throw error; // Re-throw the error if needed
    }
  }
};

const deleteCallRecord = async (callId, setRows, rows) => {
  if (window.confirm('Are you sure you want to delete this booking record?')) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${baseUrl}/voice-agent/calls/${callId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Filter out the deleted record from the state
      setRows(rows.filter(row => row.callId !== callId));
    } catch (error) {
      console.error('Failed to delete the booking record:', error);
    }
  }
};

export default function ChatBotAppointmentList({ type }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBookingData(type);
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
              {headCells.map(cell => (
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
            {rows.map(row => (
              <tr
                key={row.callId}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {/* Delete button */}
                  <button
                    onClick={() => deleteCallRecord(row.callId, setRows, rows)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>

                <td className="px-6 py-4">{row.userName}</td>
                <td className="px-6 py-4">{row.user.email}</td>
                <td className="px-6 py-4">{row.user.phone}</td>
                <td className="px-6 py-4">{row.bookingSlot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
