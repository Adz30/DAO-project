import { useState } from "react";
import { ethers } from "ethers";
import { PlusIcon, LinkIcon } from "@heroicons/react/24/outline";

const Create = ({ provider, dao, setIsLoading, onProposalCreated }) => {
  const [projectLink, setProjectLink] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const createHandler = async (e) => {
    e.preventDefault();

    if (!provider) {
      alert("Wallet provider not ready. Please wait or connect your wallet.");
      return;
    }

    try {
      setIsWaiting(true);
      setIsLoading?.(true);

      const signer = await provider.getSigner();
      const daoWithSigner = dao.connect(signer);
      const amountParsed = ethers.parseUnits(amount || "0", 18);

      const tx = await daoWithSigner.createProposal(projectLink, amountParsed, address);
      await tx.wait();

      alert("Proposal created successfully!");
      
      // Clear inputs
      setProjectLink("");
      setAmount("");
      setAddress("");
      
      // Notify parent component
      onProposalCreated?.();
    } catch (error) {
      console.error(error);
      alert("Error creating proposal. See console for details.");
    } finally {
      setIsWaiting(false);
      setIsLoading?.(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center mb-6">
        <PlusIcon className="h-6 w-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Create New Proposal</h2>
      </div>

      <form onSubmit={createHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            IPFS Link to Movie Idea *
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="https://ipfs.io/ipfs/your-hash-here"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Upload your movie idea to IPFS first using the "Submit Idea" page
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Funding Amount (MOTN) *
          </label>
          <input
            type="number"
            placeholder="e.g., 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
            min="0"
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address *
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
          <p className="text-gray-400 text-sm mt-2">
            Ethereum address that will receive the funding if proposal passes
          </p>
        </div>

        <button
          type="submit"
          disabled={isWaiting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isWaiting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Proposal...
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Proposal
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Create;