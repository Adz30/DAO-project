import { FilmIcon, CurrencyDollarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const Hero = ({ treasuryBalance, proposalCount }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Democratizing
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Film Funding
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the revolution in independent filmmaking. Submit your movie ideas, 
            vote on promising projects, and help bring the next generation of cinema to life.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {parseFloat(treasuryBalance).toLocaleString()}
              </div>
              <div className="text-gray-300">MOTN in Treasury</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {proposalCount}
              </div>
              <div className="text-gray-300">Active Proposals</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-center mb-4">
                <FilmIcon className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ∞
              </div>
              <div className="text-gray-300">Creative Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;