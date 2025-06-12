import { useState } from "react";
import { ethers } from "ethers";
import { CurrencyDollarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function FundDAOForm({ provider, dao, token, onFunded }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!provider || !dao || !token) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-purple-500/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading contracts...</p>
        </div>
      </div>
    );
  }

  const fundDAO = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setStatus("Enter a valid amount.");
      return;
    }

    try {
      setStatus("");
      setIsFunding(true);
      setSuccess(false);

      const signer = await provider.getSigner();
      const tokenWithSigner = token.connect(signer);
      const daoWithSigner = dao.connect(signer);
      const amountParsed = ethers.parseUnits(amount, 18);

      setStatus("Approving tokens...");
      const approveTx = await tokenWithSigner.approve(dao.target, amountParsed);
      await approveTx.wait();

      setStatus("Funding DAO...");
      const fundTx = await daoWithSigner.fundDAO(amountParsed);
      await fundTx.wait();

      setStatus("Successfully funded the DAO!");
      setSuccess(true);
      setAmount("");
      
      // Refresh parent component data
      onFunded?.();
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err.data?.message || err.message || "Transaction failed"));
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <CurrencyDollarIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Fund the DAO</h1>
        <p className="text-gray-300">Support independent filmmakers by contributing to the treasury</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-purple-500/20">
        {success ? (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-gray-300 mb-6">Your contribution has been successfully added to the DAO treasury.</p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Fund Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Fund (MOTN) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount of MOTN tokens"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                disabled={isFunding}
              />
              <p className="text-gray-400 text-sm mt-2">
                Your tokens will be added to the DAO treasury to fund approved movie proposals
              </p>
            </div>

            <button
              onClick={fundDAO}
              disabled={isFunding || !amount || Number(amount) <= 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isFunding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Fund DAO
                </>
              )}
            </button>

            {status && (
              <div className={`p-4 rounded-lg border ${
                status.includes("Error") 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : status.includes("Successfully")
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}>
                <p className="text-center text-sm">{status}</p>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-white font-medium mb-2">How it works:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Your MOTN tokens are transferred to the DAO treasury</li>
                <li>• These tokens fund approved movie proposals</li>
                <li>• You help support independent filmmakers</li>
                <li>• The community decides which projects get funded</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}