import { useEffect, useState } from "react";
import { 
  FilmIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon 
} from "@heroicons/react/24/outline";

const ProposalCards = ({ proposals }) => {
  const [proposalData, setProposalData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proposals || proposals.length === 0) {
      setProposalData([]);
      return;
    }

    const normalizeUrl = (link) => {
      if (link.startsWith("ipfs://")) {
        return link.replace("ipfs://", "https://ipfs.io/ipfs/");
      }
      if (!link.startsWith("http")) {
        return `https://${link}`;
      }
      return link;
    };

    const fetchData = async () => {
      setLoading(true);
      const fetched = await Promise.all(
        proposals.map(async (proposal) => {
          const link = proposal.name;

          if (!link || typeof link !== "string") {
            return {
              title: "Invalid Proposal",
              synopsis: "No valid link provided.",
              genre: "Unknown",
              estimatedBudget: "0",
              estimatedDuration: "0",
              id: proposal.id || Math.random().toString(36).slice(2),
              originalProposal: proposal,
            };
          }

          try {
            const url = normalizeUrl(link);
            const response = await fetch(url);

            if (!response.ok) {
              return {
                title: "Error loading",
                synopsis: `Failed to load proposal data (status ${response.status})`,
                genre: "Unknown",
                estimatedBudget: "0",
                estimatedDuration: "0",
                id: proposal.id || link,
                originalProposal: proposal,
              };
            }

            const data = await response.json();

            return {
              title: data.title || "Untitled",
              synopsis: data.synopsis || "No synopsis provided.",
              genre: data.genre || "Unknown",
              estimatedBudget: data.estimatedBudget || "0",
              estimatedDuration: data.estimatedDuration || "0",
              id: proposal.id || link,
              originalProposal: proposal,
            };
          } catch (err) {
            console.error("Error fetching proposal from IPFS:", err);
            return {
              title: "Error loading",
              synopsis: "Could not fetch proposal details.",
              genre: "Unknown",
              estimatedBudget: "0",
              estimatedDuration: "0",
              id: proposal.id || link,
              originalProposal: proposal,
            };
          }
        })
      );
      setProposalData(fetched);
      setLoading(false);
    };

    fetchData();
  }, [proposals]);

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <FilmIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No movie proposals to display.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Movie Details</h2>
        <p className="text-gray-300">Detailed information about each film proposal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposalData.map((movie) => (
          <div key={movie.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
            {/* Movie Poster Placeholder */}
            <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <FilmIcon className="h-16 w-16 text-white/80" />
            </div>

            {/* Movie Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-white line-clamp-2 flex-1">
                  {movie.title}
                </h3>
                {movie.originalProposal.finalized ? (
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                    Funded
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                    Active
                  </span>
                )}
              </div>

              {/* Genre */}
              {movie.genre !== "Unknown" && (
                <div className="mb-3">
                  <span className="inline-block bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">
                    {movie.genre}
                  </span>
                </div>
              )}

              {/* Synopsis */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {movie.synopsis}
              </p>

              {/* Movie Stats */}
              <div className="space-y-2 mb-4">
                {movie.estimatedDuration !== "0" && (
                  <div className="flex items-center text-sm text-gray-300">
                    <ClockIcon className="h-4 w-4 mr-2 text-blue-400" />
                    <span>{movie.estimatedDuration} minutes</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-300">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-400" />
                  <span>Requesting {movie.originalProposal.amount} MOTN</span>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Votes Received</span>
                  <span>{BigInt(movie.originalProposal.votes || "0").toString()} MOTN</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(
                        (Number(movie.originalProposal.votes || "0") / Number(movie.originalProposal.amount || "1")) * 100, 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* View Details Link */}
              {movie.originalProposal.name && movie.originalProposal.name.startsWith('http') && (
                <a
                  href={movie.originalProposal.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                  View Full Details
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalCards;