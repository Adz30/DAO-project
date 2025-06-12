import { useState } from "react";
import { ethers } from "ethers";
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon,
  ClockIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import Create from "./Create";
import ProposalCards from "./ProposalCards";

const Proposals = ({
  proposals,
  contract,
  provider,
  setIsLoading,
  onProposalsUpdated,
  tokenAddress,
  tokenAbi
}) => {
  const [voteAmounts, setVoteAmounts] = useState({});
  const [txLoadingIds, setTxLoadingIds] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const handleVoteChange = (proposalId, value) => {
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setVoteAmounts((prev) => ({ ...prev, [proposalId]: value }));
    }
  };

  const shortenAddress = (addr) =>
    addr && addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr || "";

  const isValidProposalId = (id) => {
    return proposals.some((p) => p.id === id);
  };

  const voteHandler = async (proposalId) => {
    if (!contract) {
      alert("DAO contract not connected.");
      return;
    }
    if (!isValidProposalId(proposalId)) {
      alert("Invalid proposal ID.");
      return;
    }

    const amountStr = voteAmounts[proposalId];
    if (!amountStr || Number(amountStr) <= 0) {
      alert("Enter a valid vote amount.");
      return;
    }

    try {
      setTxLoadingIds((prev) => ({ ...prev, [proposalId]: true }));
      setIsLoading?.(true);

      const amount = ethers.parseUnits(amountStr.toString(), 18);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const contractWithSigner = contract.connect(signer);
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      const allowance = await tokenContract.allowance(signerAddress, contract.address);
      if (allowance.lt(amount)) {
        const approveTx = await tokenContract.approve(contract.address, amount);
        await approveTx.wait();
      }

      const tx = await contractWithSigner.vote(proposalId, amount);
      await tx.wait();

      alert("Vote successful!");
      setVoteAmounts((prev) => ({ ...prev, [proposalId]: "" }));
      onProposalsUpdated?.();
    } catch (err) {
      console.error("Voting error:", err);
      alert("Failed to vote. See console for details.");
    } finally {
      setTxLoadingIds((prev) => ({ ...prev, [proposalId]: false }));
      setIsLoading?.(false);
    }
  };

  const finalizeHandler = async (proposalId) => {
    if (!contract) {
      alert("DAO contract not connected.");
      return;
    }
    if (!isValidProposalId(proposalId)) {
      alert("Invalid proposal ID.");
      return;
    }

    try {
      setTxLoadingIds((prev) => ({ ...prev, [proposalId]: true }));
      setIsLoading?.(true);

      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.finalizeProposal(proposalId);
      await tx.wait();

      alert("Proposal finalized!");
      onProposalsUpdated?.();
    } catch (err) {
      console.error("Finalize error:", err);
      alert("Failed to finalize proposal. See console for details.");
    } finally {
      setTxLoadingIds((prev) => ({ ...prev, [proposalId]: false }));
      setIsLoading?.(false);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (filter === 'active') return !proposal.finalized;
    if (filter === 'completed') return proposal.finalized;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <DocumentTextIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Movie Proposals</h1>
        <p className="text-gray-300">Vote on promising film projects and help bring them to life</p>
      </div>

      {/* Create Proposal Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {showCreateForm ? 'Hide Form' : 'Create New Proposal'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8">
          <Create 
            provider={provider} 
            dao={contract} 
            setIsLoading={setIsLoading}
            onProposalCreated={() => {
              setShowCreateForm(false);
              onProposalsUpdated?.();
            }}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
          {[
            { key: 'all', label: 'All Proposals' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Funded' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">No proposals found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "Be the first to submit a movie proposal!" 
              : `No ${filter} proposals at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProposals.map((proposal) => {
            const id = proposal.id;
            const isFinalized = proposal.finalized === true;
            const loading = !!txLoadingIds[id];

            return (
              <div key={id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                {/* Proposal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {proposal.name || "Untitled Proposal"}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span>#{id}</span>
                      <span>•</span>
                      <span>{shortenAddress(proposal.recipient)}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isFinalized 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {isFinalized ? (
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Funded
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Active
                      </div>
                    )}
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Requested Amount:</span>
                    <span className="text-white font-semibold flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1 text-green-400" />
                      {proposal.amount} MOTN
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Votes:</span>
                    <span className="text-purple-400 font-semibold">
                      {BigInt(proposal.votes || "0").toString()} MOTN
                    </span>
                  </div>
                </div>

                {/* Voting Section */}
                {!isFinalized && (
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Tokens to vote"
                        value={voteAmounts[id] || ""}
                        onChange={(e) => handleVoteChange(id, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        disabled={loading}
                      />
                      <button
                        onClick={() => voteHandler(id)}
                        disabled={!contract || loading || !voteAmounts[id] || Number(voteAmounts[id]) <= 0}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                      >
                        {loading ? "Voting..." : "Vote"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Finalize Button */}
                {!isFinalized && BigInt(proposal.votes || "0") > BigInt("0") && (
                  <div className="border-t border-purple-500/20 pt-4 mt-4">
                    <button
                      onClick={() => finalizeHandler(id)}
                      disabled={!contract || loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? "Finalizing..." : "Finalize Proposal"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Cards Section */}
      <div className="mt-12">
        <ProposalCards proposals={filteredProposals} />
      </div>
    </div>
  );
};

export default Proposals;