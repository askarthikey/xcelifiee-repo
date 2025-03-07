import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
// import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Area, AreaChart
} from 'recharts';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [publications, setPublications] = useState([]);
  const [patents, setPatents] = useState([]);
  const [fundingProps, setFundingProps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          // If no token is found, log out and redirect to login page
          setError('Session expired. Please log in again.');
          setLoading(false);
          window.location.href = '/login';
          return;
        }
    
        const headers = {
          'Authorization': `Bearer ${token}`, // Add token to Authorization header
        };
    
        const [pubResponse, patentResponse, fundingResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:4000/user-api/publicationsSortTeamData', { headers }),
          fetch('http://localhost:4000/user-api/patentsSortData', { headers }),
          fetch('http://localhost:4000/user-api/fundingPropsSortData', { headers }),
          fetch('http://localhost:4000/user-api/usersSortData', { headers }),
        ]);
    
        // Check if the responses are unauthorized (e.g., token expired)
        if (pubResponse.status === 401 || patentResponse.status === 401 || fundingResponse.status === 401 || usersResponse.status === 401) {
          setError('Session expired. Please log in again.');
          setLoading(false);
          localStorage.removeItem('token'); // Remove the expired token
          window.location.href = '/login'; // Redirect to login page
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
        setError('Failed to fetch dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAllData();    
  }, []);

  // Enhanced processing functions
  const processTeamPatents = () => {
    return patents.reduce((acc, patent) => {
      const team = patent.teamno || 'Unassigned';
      const existingTeam = acc.find(t => t.team === team);
      if (existingTeam) {
        existingTeam.total += 1;
        if (patent.status === 'Approved') existingTeam.approved += 1;
      } else {
        acc.push({
          team,
          total: 1,
          approved: patent.status === 'Approved' ? 1 : 0
        });
      }
      return acc;
    }, []);
  };

  const processInventorStats = () => {
    return patents.reduce((acc, patent) => {
      const inventor = patent.nameOfInventor;
      const existingInventor = acc.find(i => i.name === inventor);
      if (existingInventor) {
        existingInventor.patents += 1;
        if (patent.status === 'Approved') existingInventor.approved += 1;
      } else {
        acc.push({
          name: inventor,
          patents: 1,
          approved: patent.status === 'Approved' ? 1 : 0
        });
      }
      return acc;
    }, []);
  };

  const processFundingMetrics = () => {
    return fundingProps.reduce((acc, fund) => {
      const team = fund.teamno || 'Unassigned';
      const amount = Number(fund.amount) || 0; 
      const existingTeam = acc.find(t => t.team === team);
      if (existingTeam) {
        existingTeam.totalAmount += amount || 0;
        existingTeam.proposals += 1;
        if (fund.fundStatus === 'Approved') {
          existingTeam.approved += 1;
          existingTeam.approvedAmount += amount || 0;
        }
      } else {
        acc.push({
          team,
          totalAmount: Number(fund.amount) || 0,
          proposals: 1,
          approved: fund.fundStatus === 'Approved' ? 1 : 0,
          approvedAmount: fund.fundStatus === 'Approved' ? fund.amount : 0
        });
      }
      return acc;
    }, []);
  };

  const processFundingAgencyStats = () => {
    return fundingProps.reduce((acc, fund) => {
      const agency = fund.fundingAgency;
      const existingAgency = acc.find(a => a.name === agency);
      if (existingAgency) {
        existingAgency.proposals += 1;
        existingAgency.totalAmount += Number(fund.amount) || 0;
      } else {
        acc.push({
          name: agency,
          proposals: 1,
          totalAmount: Number(fund.amount) || 0
        });
      }
      return acc;
    }, []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <span className="ml-3">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Research Analytics Dashboard</h1>
        <div className="text-sm text-gray-600">
          Total Users: {users.length} | Publications: {publications.length} | 
          Patents: {patents.length} | Funding Proposals: {fundingProps.length}
        </div>
      </div>

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="patents">Patents</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publications by Team</CardTitle>
              </CardHeader>
              <CardContent>
              <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={publications.reduce((acc, pub) => {
                  const teamKey = pub.teamno || 'Unassigned';
                  const existingTeam = acc.find(t => t.team === teamKey);
                  
                  if (existingTeam) {
                    if (pub.typeOfPublication === 'Journal') existingTeam.journals += 1;
                    if (pub.typeOfPublication === 'Conference') existingTeam.conferences += 1;
                  } else {
                    acc.push({
                      team: teamKey,
                      journals: pub.typeOfPublication === 'Journal' ? 1 : 0,
                      conferences: pub.typeOfPublication === 'Conference' ? 1 : 0
                    });
                  }
                  return acc;
                }, [])}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="journals" fill="#82ca9d" name="Journal Publications" />
                <Bar dataKey="conferences" fill="#ffc658" name="Conference Publications" />
              </BarChart>
            </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publications Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Journal', value: publications.filter(p => p.typeOfPublication === 'Journal').length },
                        { name: 'Conference', value: publications.filter(p => p.typeOfPublication === 'Conference').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Author Performance by Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={`team-${users[0]?.teamno || 1}`} className="w-full">
                  <TabsList className="mb-4 overflow-x-auto">
                    {[...new Set(users.map(user => user.teamno))]
                      .sort((a, b) => a - b)
                      .map(teamNo => (
                        <TabsTrigger key={`team-${teamNo}`} value={`team-${teamNo}`}>
                          Team {teamNo}
                        </TabsTrigger>
                      ))
                    }
                  </TabsList>

                  {[...new Set(users.map(user => user.teamno))]
                    .sort((a, b) => a - b)
                    .map(teamNo => (
                      <TabsContent key={`team-${teamNo}`} value={`team-${teamNo}`}>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart 
                            data={users
                              .filter(user => user.teamno === teamNo)
                              .map(user => ({
                                name: user.username,
                                publications: publications.filter(p => p.username === user.username).length,
                                patents: patents.filter(p => p.nameOfInventor === user.username).length,
                                funding: fundingProps.filter(f => f.detailsOfPiCopi.includes(user.username)).length
                              }))
                            }
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            <Radar 
                              name="Publications" 
                              dataKey="publications" 
                              stroke="#8884d8" 
                              fill="#8884d8" 
                              fillOpacity={0.6} 
                            />
                            <Radar 
                              name="Patents" 
                              dataKey="patents" 
                              stroke="#82ca9d" 
                              fill="#82ca9d" 
                              fillOpacity={0.6} 
                            />
                            <Radar 
                              name="Funding" 
                              dataKey="funding" 
                              stroke="#ffc658" 
                              fill="#ffc658" 
                              fillOpacity={0.6} 
                            />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </TabsContent>
                    ))
                  }
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={processFundingMetrics()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="proposals" fill="#8884d8" name="Total Proposals" />
                    <Line yAxisId="right" type="monotone" dataKey="approvedAmount" stroke="#82ca9d" name="Approved Amount" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      <TabsContent value="patents" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patent Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: patents.filter(p => p.status === 'Approved').length },
                      { name: 'Pending', value: patents.filter(p => p.status === 'Pending').length },
                      { name: 'Rejected', value: patents.filter(p => p.status === 'Rejected').length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patent Success Rate by Team</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processTeamPatents()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Total Patents" />
                  <Bar dataKey="approved" fill="#82ca9d" name="Approved Patents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventor Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={processInventorStats()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patents" fill="#8884d8" name="Total Patents" />
                  <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved Patents" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patent Timeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={patents.map(patent => ({
                  name: patent.nameOfInventor,
                  value: patent.status === 'Approved' ? 1 : 0,
                  status: patent.status
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" name="Patent Progress" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="funding" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Distribution by Team</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processFundingMetrics()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
                  <Bar dataKey="approvedAmount" fill="#82ca9d" name="Approved Amount" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: fundingProps.filter(f => f.fundStatus === 'Approved').length },
                      { name: 'Applied', value: fundingProps.filter(f => f.fundStatus === 'Applied').length },
                      { name: 'Rejected', value: fundingProps.filter(f => f.fundStatus === 'Rejected').length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding Agency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={processFundingAgencyStats()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => name === 'totalAmount' ? `₹${value.toLocaleString()}` : value} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="proposals" fill="#8884d8" name="Number of Proposals" />
                  <Line yAxisId="right" type="monotone" dataKey="totalAmount" stroke="#82ca9d" name="Total Amount" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Funding Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={processFundingMetrics()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="team" />
                  <PolarRadiusAxis />
                  <Radar name="Total Amount" dataKey="totalAmount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Approved Amount" dataKey="approvedAmount" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;