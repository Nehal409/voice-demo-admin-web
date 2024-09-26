import { useState } from 'react';
import CallsList from './CallsList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hospital');

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <TabButton
            isActive={activeTab === 'hospital'}
            onClick={() => setActiveTab('hospital')}
            label="Hospital Calls"
          />
          <TabButton
            isActive={activeTab === 'restaurant'}
            onClick={() => setActiveTab('restaurant')}
            label="Restaurant Calls"
          />
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'hospital' && <CallsList type="hospital" />}
        {activeTab === 'restaurant' && <CallsList type="restaurant" />}
      </div>
    </div>
  );
}

function TabButton({ isActive, onClick, label }) {
  return (
    <button
      className={`text-lg px-4 py-2 focus:outline-none ${
        isActive ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-gray-500 hover:text-indigo-500'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
