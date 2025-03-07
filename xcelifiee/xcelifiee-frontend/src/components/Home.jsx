import { Link } from 'react-router-dom';
import { 
  ChartBar, 
  FileText, 
  FlaskConical, 
  BadgeDollarSign 
} from 'lucide-react';

const Home = () => {
  const featureCards = [
    {
      icon: <FileText className="w-12 h-12 text-violet-600" />,
      title: 'Publications',
      description: 'Track and manage your research publications efficiently.',
      link: '/publications',
      color: 'hover:bg-violet-100'
    },
    {
      icon: <FlaskConical className="w-12 h-12 text-green-600" />,
      title: 'Patents',
      description: 'Monitor and record your innovative patent applications.',
      link: '/patents',
      color: 'hover:bg-green-100'
    },
    {
      icon: <BadgeDollarSign className="w-12 h-12 text-blue-600" />,
      title: 'Funding',
      description: 'Manage research funding proposals and grants.',
      link: '/fundingproposals',
      color: 'hover:bg-blue-100'
    },
    {
      icon: <ChartBar className="w-12 h-12 text-orange-600" />,
      title: 'Analytics Dashboard',
      description: 'Visualize your research performance and insights.',
      link: '/dashboard',
      color: 'hover:bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-violet-800 mb-4 tracking-tight">
            Xcelifiee Research Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your research workflow, track publications, patents, and funding proposals with comprehensive analytics and insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, index) => (
            <Link 
              key={index} 
              to={card.link} 
              className={`
                block p-6 bg-white rounded-xl shadow-lg transform transition-all 
                duration-300 hover:-translate-y-2 ${card.color} 
                border border-transparent hover:border-violet-200
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-800 mb-4">
              Your Research, Our Platform
            </h2>
            <p className="text-gray-700 mb-6">
              Xcelifiee provides a comprehensive solution for researchers to manage their academic journey. From tracking publications to analyzing funding proposals, we help you focus on what matters most - your research.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/viewdata"
                className="
                  px-6 py-3 border-2 border-violet-700 text-violet-700 
                  rounded-lg hover:bg-violet-50 transition duration-300 
                  flex items-center space-x-2 shadow-md
                "
              >
                <FileText className="w-5 h-5" />
                <span>View Table Data</span>
              </Link>
              <Link
                to="/editdata"
                className="
                  px-6 py-3 bg-violet-700 text-white rounded-lg 
                  hover:bg-violet-800 transition duration-300 
                  flex items-center space-x-2 shadow-md
                "
              >
                <ChartBar className="w-5 h-5" />
                <span>Edit Data</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;