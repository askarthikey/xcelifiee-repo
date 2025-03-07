import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { AlertCircle, ArrowUpDown } from 'lucide-react';

const ViewTable = () => {
  const [publications, setPublications] = useState([]);
  const [patents, setPatents] = useState([]);
  const [fundingProps, setFundingProps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortData = (data, key) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return sortedData;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Session expired. Please log in again.');
          setLoading(false);
          window.location.href = '/login';
          return;
        }
    
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
    
        const [pubResponse, patentResponse, fundingResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:4000/user-api/publicationsSortTeamData', { headers }),
          fetch('http://localhost:4000/user-api/patentsSortData', { headers }),
          fetch('http://localhost:4000/user-api/fundingPropsSortData', { headers }),
          fetch('http://localhost:4000/user-api/usersSortData', { headers }),
        ]);
    
        if (pubResponse.status === 401 || patentResponse.status === 401 || fundingResponse.status === 401 || usersResponse.status === 401) {
          setError('Session expired. Please log in again.');
          setLoading(false);
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
    
        const pubData = await pubResponse.json();
        const patentData = await patentResponse.json();
        const fundingData = await fundingResponse.json();
        const userData = await usersResponse.json();
    
        setPublications(pubData);
        setPatents(patentData);
        setFundingProps(fundingData);
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAllData();    
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-violet-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        <span className="ml-3 text-violet-700">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-red-50">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-violet-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-800">Research Data Tables</h1>
        <div className="text-sm text-violet-600">
          Total Users: {users.length} | Publications: {publications.length} | 
          Patents: {patents.length} | Funding Proposals: {fundingProps.length}
        </div>
      </div>

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="mb-4 bg-white shadow-md">
          <TabsTrigger value="publications" className="text-violet-700 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900">Publications</TabsTrigger>
          <TabsTrigger value="patents" className="text-violet-700 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900">Patents</TabsTrigger>
          <TabsTrigger value="funding" className="text-violet-700 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900">Funding</TabsTrigger>
          <TabsTrigger value="users" className="text-violet-700 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-violet-100 border-b border-violet-200">
              <CardTitle className="text-violet-800">Publications Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-violet-50">
                    <tr>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('teamno')}>
                        <div className="flex items-center justify-between">
                          Team<ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('authorPosition')}>
                        <div className="flex items-center justify-between">
                          Position <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('username')}>
                        <div className="flex items-center justify-between">
                          Username <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                       <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('typeOfPublication')}>
                        <div className="flex items-center justify-between">
                          Type <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th> 
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('nameOfJournal')}>
                        <div className="flex items-center justify-between">
                          Name Of Journal <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th> 
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('titleOfPaper')}>
                        <div className="flex items-center justify-between">
                          Title <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('indexing')}>
                        <div className="flex items-center justify-between">
                          Indexing <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('dateOfPublication')}>
                        <div className="flex items-center justify-between">
                          Date <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer">
                        <div className="flex items-center justify-between">
                          Link for Proof 
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer">
                        <div className="flex items-center justify-between">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(publications, sortConfig.key).map((pub, index) => (
                      <tr key={index} className="hover:bg-violet-50 transition duration-200">
                        <td className="border p-2 text-center">{pub.teamno}</td>
                        <td className="border p-2">{pub.authorPosition}</td>
                        <td className="border p-2">{pub.username}</td>
                        <td className="border p-2">{pub.typeOfPublication}</td>
                        <td className="border p-2">{pub.nameOfJournal}</td>
                        <td className="border p-2">{pub.titleOfPaper}</td>
                        <td className="border p-2">{pub.indexing}</td>
                        <td className="border p-2">{pub.dateOfPublication}</td>
                        <td className="border p-2">
                          <a href={pub.linkForProof} target="_blank" rel="noopener noreferrer" className="text-blue-500">{pub.linkForProof}</a>
                        </td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                            Modify
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar styling applied to other tabs */}
        <TabsContent value="patents" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-violet-100 border-b border-violet-200">
              <CardTitle className="text-violet-800">Patents Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-violet-50">
                    <tr>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('teamno')}>
                        <div className="flex items-center justify-between">
                          Team No <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('titleOfPatent')}>
                        <div className="flex items-center justify-between">
                          Title Of Patent <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('nameOfInventor')}>
                        <div className="flex items-center justify-between">
                          Inventor <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center justify-between">
                          Status <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer">
                        <div className="flex items-center justify-between">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(patents, sortConfig.key).map((patent, index) => (
                      <tr key={index} className="hover:bg-violet-50 transition duration-200">
                        <td className="border p-2 text-center">{patent.teamno}</td>
                        <td className="border p-2">{patent.titleOfPatent}</td>
                        <td className="border p-2">{patent.nameOfInventor}</td>
                        <td className="border p-2">{patent.status}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                            Modify
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-violet-100 border-b border-violet-200">
              <CardTitle className="text-violet-800">Funding Proposals Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-violet-50">
                    <tr>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('teamno')}>
                        <div className="flex items-center justify-between">
                          Team No<ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('titleOfProposal')}>
                        <div className="flex items-center justify-between">
                          Title Of Proposal<ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('fundingAgency')}>
                        <div className="flex items-center justify-between">
                          Funding Agency <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center justify-between">
                          Amount <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('fundStatus')}>
                        <div className="flex items-center justify-between">
                          Status <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer">
                        <div className="flex items-center justify-between">
                          Details of PI and CoPI
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer">
                        <div className="flex items-center justify-between">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(fundingProps, sortConfig.key).map((fund, index) => (
                      <tr key={index} className="hover:bg-violet-50 transition duration-200">
                        <td className="border p-2">{fund.teamno}</td>
                        <td className="border p-2">{fund.titleOfProposal}</td>
                        <td className="border p-2">{fund.fundingAgency}</td>
                        <td className="border p-2">₹{fund.amount.toLocaleString()}</td>
                        <td className="border p-2">{fund.fundStatus}</td>
                        <td className="border p-2 text-center">{fund.detailsOfPiCopi}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                            Modify
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-violet-100 border-b border-violet-200">
              <CardTitle className="text-violet-800">Users Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-violet-50">
                    <tr>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('teamno')}>
                        <div className="flex items-center justify-between">
                          Team No <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                    <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('empid')}>
                        <div className="flex items-center justify-between">
                          Employee id <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('username')}>
                        <div className="flex items-center justify-between">
                          Username <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                      <th className="border p-2 hover:bg-violet-100 cursor-pointer" onClick={() => handleSort('userType')}>
                        <div className="flex items-center justify-between">
                          User Type <ArrowUpDown className="w-4 h-4 ml-2 text-violet-500" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(users, sortConfig.key).map((user, index) => (
                      <tr key={index} className="hover:bg-violet-50 transition duration-200">
                        <td className="border p-2">{user.teamno}</td>
                        <td className="border p-2">{user.empid}</td>
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.userType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewTable;