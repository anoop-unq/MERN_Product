import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaArrowLeft,
  FaGraduationCap,
  FaBriefcase,
  FaLink,
  FaUser,
  FaCheckCircle,
  FaCalendarAlt,
  FaStar,
  FaShieldAlt,
  FaGlobe,
  FaBuilding,
  FaUniversity
} from 'react-icons/fa';

const SellerContact = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById } = useContext(AppContext);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contact');

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const sellerData = await getUserById(userId);
        setSeller(sellerData);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [userId, getUserById]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber) => {
    const message = `Hello, I'm interested in your product on the marketplace.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const hasProfileDetails = () => {
    return (
      (seller.education && seller.education.length > 0) ||
      (seller.workExperience && seller.workExperience.length > 0) ||
      (seller.socialLinks && seller.socialLinks.length > 0)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading seller information...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
            <FaUser className="text-4xl text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Seller Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">The seller you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-all duration-300 bg-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl border border-purple-100 hover:border-purple-200 font-medium group hover:scale-105"
        >
          <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" />
          Back to Previous
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 hover:shadow-3xl transition-shadow duration-300">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={seller.photo || assets.user_image}
                      alt={seller.name}
                      className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border-4 border-white/80 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    {seller.isAccountVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg animate-bounce">
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Profile Info */}
                <div className="lg:ml-8 mt-6 lg:mt-0 text-center lg:text-left flex-1">
                  <div className="flex flex-col items-center lg:items-start space-y-3">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <h1 className="text-3xl lg:text-4xl font-bold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                        {seller.name}
                      </h1>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-300/30">
                        <FaStar className="text-yellow-300 animate-pulse" />
                        <span className="font-semibold text-yellow-100">Premium Seller</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-100/90 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <FaCalendarAlt className="mr-2 text-blue-200" />
                      <span>Member since {new Date(seller.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <p className="text-blue-100/80 text-lg leading-relaxed max-w-3xl bg-black/5 backdrop-blur-sm px-4 py-3 rounded-xl">
                      {seller.bio || 'This seller prefers to let their products speak for themselves.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center px-6 py-4 font-semibold transition-all duration-300 ${
                  activeTab === 'contact'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-purple-500'
                }`}
              >
                <FaUser className="mr-2" />
                Contact Info
              </button>
              
              {hasProfileDetails() && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-6 py-4 font-semibold transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                      : 'text-gray-600 hover:text-purple-500'
                  }`}
                >
                  <FaBriefcase className="mr-2" />
                  Profile Details
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('status')}
                className={`flex items-center px-6 py-4 font-semibold transition-all duration-300 ${
                  activeTab === 'status'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-600 hover:text-purple-500'
                }`}
              >
                <FaShieldAlt className="mr-2" />
                Account Status
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8">
            {/* Contact Information */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone Card */}
                {seller.mobile && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                        <FaPhone className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 ml-4">Phone Number</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 font-mono mb-4">{seller.mobile}</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCall(seller.mobile)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                      >
                        <FaPhone className="mr-2 group-hover:scale-110 transition-transform" />
                        <span>Call Now</span>
                      </button>
                      <button
                        onClick={() => handleWhatsApp(seller.mobile)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                      >
                        <FaWhatsapp className="mr-2 text-lg group-hover:scale-110 transition-transform" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Card */}
                {seller.email && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                        <FaEnvelope className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 ml-4">Email Address</h3>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 break-words mb-4">{seller.email}</p>
                    <button
                      onClick={() => handleEmail(seller.email)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                    >
                      <FaEnvelope className="mr-2 group-hover:scale-110 transition-transform" />
                      <span>Send Email</span>
                    </button>
                  </div>
                )}

                {/* Address Card */}
                {seller.address && (
                  <div className="lg:col-span-2 bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl shadow-lg">
                        <FaMapMarkerAlt className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 ml-4">Address</h3>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {seller.address.street && <>{seller.address.street}<br /></>}
                        {seller.address.city && <>{seller.address.city}, </>}
                        {seller.address.state && <>{seller.address.state}<br /></>}
                        {seller.address.country && <>{seller.address.country}, </>}
                        {seller.address.zipCode && <>{seller.address.zipCode}</>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Details */}
            {activeTab === 'profile' && hasProfileDetails() && (
              <div className="space-y-6">
                {/* Education */}
                {seller.education && seller.education.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-indigo-100">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
                        <FaUniversity className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 ml-4">Education</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {seller.education.map((edu, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-400">
                          <h4 className="font-bold text-gray-800 text-lg">{edu.degree}</h4>
                          <div className="text-gray-600 mt-2 space-y-1">
                            {edu.institution && <div className="flex items-center"><FaBuilding className="mr-2 text-indigo-500" />{edu.institution}</div>}
                            {edu.fieldOfStudy && <div className="flex items-center"><FaGraduationCap className="mr-2 text-indigo-500" />{edu.fieldOfStudy}</div>}
                            {edu.startYear && <div className="text-sm">{edu.startYear}{edu.endYear ? ` - ${edu.endYear}` : ''}</div>}
                          </div>
                          {edu.description && <p className="text-gray-500 text-sm mt-2">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {seller.workExperience && seller.workExperience.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                        <FaBriefcase className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 ml-4">Work Experience</h3>
                    </div>
                    <div className="space-y-4">
                      {seller.workExperience.map((work, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-400">
                          <h4 className="font-bold text-gray-800 text-lg">{work.position}</h4>
                          <div className="text-gray-600 mt-2 space-y-2">
                            {work.company && <div className="flex items-center"><FaBuilding className="mr-2 text-blue-500" />{work.company}</div>}
                            {work.startYear && <div className="text-sm bg-blue-50 px-3 py-1 rounded-full inline-block">{work.startYear}{work.endYear ? ` - ${work.endYear}` : ' - Present'}</div>}
                          </div>
                          {work.description && <p className="text-gray-500 mt-3 border-t pt-3">{work.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {seller.socialLinks && seller.socialLinks.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-purple-100">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                        <FaGlobe className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 ml-4">Social Links</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {seller.socialLinks.map((link, index) => (
                        <a 
                          key={index}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-purple-300 text-center group"
                        >
                          <FaLink className="text-purple-500 text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-blue-600 hover:text-blue-800 font-medium block truncate">
                            {link.platform || new URL(link.url).hostname.replace('www.', '')}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Status */}
            {activeTab === 'status' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 ml-4">Account Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className={`w-4 h-4 rounded-full mr-4 ${seller.isAccountActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <div>
                        <span className="font-semibold text-gray-800 text-lg">
                          {seller.isAccountActive ? 'Active' : 'Inactive'} Account
                        </span>
                        <p className="text-gray-600">
                          {seller.isAccountActive ? 'Account is currently active and receiving messages' : 'Account is not active'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className={`w-4 h-4 rounded-full mr-4 ${seller.isAccountVerified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                      <div>
                        <span className="font-semibold text-gray-800 text-lg">
                          {seller.isAccountVerified ? 'Verified' : 'Not Verified'} Account
                        </span>
                        <p className="text-gray-600">
                          {seller.isAccountVerified ? 'Identity verified by platform' : 'Pending verification process'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Status Info */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Seller Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-bold text-green-600">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full w-11/12"></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Duration</span>
                        <span className="font-bold text-blue-600">
                          {Math.floor((new Date() - new Date(seller.createdAt)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerContact;