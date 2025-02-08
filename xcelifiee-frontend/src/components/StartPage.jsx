import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Lightbulb, 
  BarChart, 
  Award, 
  Globe, 
  Users, 
  ChevronRight
} from 'lucide-react';

const StartPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FileText className="w-12 h-12 text-violet-600" />,
      title: 'Publication Tracking',
      description: 'Effortlessly manage and track your research publications across journals and conferences.',
      details: [
        'Centralized publication repository',
        'Automatic citation tracking',
        'Collaborative research management'
      ]
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-yellow-600" />,
      title: 'Patent Management',
      description: 'Streamline your intellectual property workflow from invention to approval.',
      details: [
        'Patent application tracking',
        'Status monitoring',
        'Inventor performance insights'
      ]
    },
    {
      icon: <Award className="w-12 h-12 text-green-600" />,
      title: 'Funding Proposals',
      description: 'Simplify research funding management and proposal tracking.',
      details: [
        'Comprehensive funding dashboard',
        'Agency tracking',
        'Proposal success analytics'
      ]
    }
  ];

  const keyBenefits = [
    {
      icon: <Globe className="w-10 h-10 text-blue-600" />,
      title: 'Comprehensive Research Management',
      description: 'All-in-one platform to manage your entire research ecosystem.'
    },
    {
      icon: <BarChart className="w-10 h-10 text-violet-600" />,
      title: 'Advanced Analytics',
      description: 'Gain deep insights into your research performance and impact.'
    },
    {
      icon: <Users className="w-10 h-10 text-green-600" />,
      title: 'Collaborative Environment',
      description: 'Foster teamwork and knowledge sharing across research teams.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-violet-800 mb-6 leading-tight">
            Elevate Your Research Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Xcelifiee is a comprehensive research management platform designed to streamline your academic and innovative pursuits.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="
                px-8 py-3 bg-violet-700 text-white rounded-lg 
                hover:bg-violet-800 transition duration-300 
                flex items-center space-x-2 shadow-md
              "
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-violet-800 mb-4">
            Powerful Research Management Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how Xcelifiee transforms your research workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`
                p-6 bg-white rounded-xl shadow-lg transition-all duration-300
                ${activeFeature === index 
                  ? 'border-2 border-violet-500 scale-105' 
                  : 'border border-transparent'}
                hover:border-violet-300 hover:shadow-xl
              `}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4 text-violet-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="container mx-auto px-4 py-16 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-violet-800 mb-4">
            Why Choose Xcelifiee?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your research management with our innovative platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {keyBenefits.map((benefit, index) => (
            <div 
              key={index} 
              className="
                p-6 bg-violet-50 rounded-xl 
                hover:bg-white transition duration-300 
                hover:shadow-lg text-center
              "
            >
              <div className="mb-4 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <div 
          className="
            bg-gradient-to-r from-violet-600 to-indigo-700 
            text-white rounded-xl p-12 text-center
            shadow-2xl transform transition-all hover:scale-105
          "
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Revolutionize Your Research?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Xcelifiee and unlock the full potential of your academic and innovative journey.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="
                px-8 py-3 bg-white text-violet-800 
                rounded-lg hover:bg-gray-100 
                transition duration-300 font-bold
              "
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="
                px-8 py-3 border-2 border-white text-white 
                rounded-lg hover:bg-white hover:text-violet-800 
                transition duration-300 font-bold
              "
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;