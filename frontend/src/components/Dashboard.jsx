import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

const Dashboard = ({ proposals, treasuryBalance, userBalance }) => {
  const activeProposals = proposals.filter(p => !p.finalized);
  const completedProposals = proposals.filter(p => p.finalized);

  const quickActions = [
    {
      title: "Submit Movie Idea",
      description: "Share your creative vision with the community",
      icon: PlusIcon,
      href: "/submit-idea",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Fund the DAO",
      description: "Contribute tokens to support filmmakers",
      icon: CurrencyDollarIcon,
      href: "/fund-dao",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "View All Proposals",
      description: "Browse and vote on movie proposals",
      icon: DocumentTextIcon,
      href: "/proposals",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{action.description}</p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm font-medium">Get Started</span>
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Your Balance</p>
              <p className="text-2xl font-bold text-white">{parseFloat(userBalance).toFixed(2)}</p>
              <p className="text-purple-400 text-sm">MOTN Tokens</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Treasury</p>
              <p className="text-2xl font-bold text-white">{parseFloat(treasuryBalance).toLocaleString()}</p>
              <p className="text-green-400 text-sm">MOTN Available</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Active Proposals</p>
              <p className="text-2xl font-bold text-white">{activeProposals.length}</p>
              <p className="text-blue-400 text-sm">Awaiting Votes</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Funded Projects</p>
              <p className="text-2xl font-bold text-white">{completedProposals.length}</p>
              <p className="text-pink-400 text-sm">Successfully Funded</p>
            </div>
            <FilmIcon className="h-8 w-8 text-pink-400" />
          </div>
        </div>
      </div>

      {/* Recent Proposals Preview */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Proposals</h2>
          <Link 
            to="/proposals"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {proposals.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No proposals yet. Be the first to submit a movie idea!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.slice(0, 3).map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-purple-500/10">
                <div className="flex-1">
                  <h3 className="text-white font-medium truncate">{proposal.name}</h3>
                  <p className="text-gray-400 text-sm">Requesting {proposal.amount} MOTN</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    proposal.finalized 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {proposal.finalized ? 'Funded' : 'Active'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;