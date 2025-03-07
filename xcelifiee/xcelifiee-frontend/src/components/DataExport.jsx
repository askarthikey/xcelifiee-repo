import { useState } from 'react';
import { Download } from 'lucide-react';

const DataExport = () => {
  const [loading, setLoading] = useState({
    users: false,
    publications: false,
    patents: false,
    proposals: false,
    all: false
  });
  const [notification, setNotification] = useState(null);

  const handleExport = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setNotification(null);

    try {
      const response = await fetch(`http://localhost:4000/export-api/export-${type}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to export ${type}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type.charAt(0).toUpperCase() + type.slice(1)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      setNotification({
        type: 'success',
        message: `Successfully exported ${type} data!`
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Error exporting ${type}: ${err.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const exportOptions = [
    { 
      id: 'users', 
      label: 'Users',
      description: 'Export user profiles and details'
    },
    { 
      id: 'publications', 
      label: 'Publications',
      description: 'Export research publications data'
    },
    { 
      id: 'patents', 
      label: 'Patents',
      description: 'Export patent information'
    },
    { 
      id: 'funding-proposals', 
      label: 'Funding Proposals',
      description: 'Export funding proposal details'
    },
    { 
      id: 'all', 
      label: 'All Data',
      description: 'Export all available data'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-blue-50 rounded-lg">
            <Download className="w-6 h-6 text-blue-500" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
            <p className="mt-1 text-sm text-gray-500">
              Download your data in Excel format. Choose a specific collection or export all data at once.
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div 
          className={`mx-6 mt-6 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}
        >
          {notification.message}
          <button 
            onClick={() => setNotification(null)}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exportOptions.map(({ id, label, description }) => (
            <div
              key={id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              
              <button
                className={`w-full px-4 py-2 text-sm font-medium rounded-md 
                  flex items-center justify-center gap-2 transition-colors
                  ${loading[id]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleExport(id)}
                disabled={loading[id]}
              >
                {loading[id] ? (
                  <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export {label}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Files will be downloaded in .xlsx format
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Compatible with Excel, Google Sheets, and other spreadsheet applications
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Large datasets may take a few moments to generate
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataExport;