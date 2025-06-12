import { useState } from "react";
import axios from "axios";
import { FilmIcon, DocumentTextIcon, LinkIcon } from "@heroicons/react/24/outline";

export default function SaveIdea() {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Horror", "Romance", 
    "Sci-Fi", "Thriller", "Documentary", "Animation", "Fantasy", "Mystery"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const metadata = {
      pinataMetadata: { name: title },
      pinataContent: { 
        title, 
        synopsis, 
        genre, 
        estimatedBudget: budget,
        estimatedDuration: duration,
        submittedAt: new Date().toISOString()
      },
    };

    try {
      const res = await axios.post("http://localhost:4000/pinJSONToIPFS", metadata, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const cid = res.data.IpfsHash;
      const url = `https://ipfs.io/ipfs/${cid}`;
      setIpfsUrl(url);
      setPreviewVisible(false);
      
      // Reset form
      setTitle("");
      setSynopsis("");
      setGenre("");
      setBudget("");
      setDuration("");
    } catch (err) {
      console.error("IPFS upload error:", err);
      alert("Failed to upload to IPFS. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <FilmIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Submit Your Movie Idea</h1>
        <p className="text-gray-300">Share your creative vision with the CinemaDAO community</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-purple-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movie Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your movie title"
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Genre and Budget Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="bg-gray-800">Select a genre</option>
                {genres.map((g) => (
                  <option key={g} value={g} className="bg-gray-800">{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Budget (MOTN)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 120"
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Synopsis *
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Describe your movie in 2-3 paragraphs. Include the plot, main characters, and what makes your story unique..."
              rows="8"
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              {synopsis.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !title || !synopsis}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Submit Idea
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPreviewVisible(!previewVisible)}
              className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 border border-purple-500/30"
            >
              {previewVisible ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        </form>

        {/* Preview */}
        {previewVisible && (
          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white">{title || "Movie Title"}</h4>
                {genre && <span className="inline-block bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-sm mt-1">{genre}</span>}
              </div>
              
              {(budget || duration) && (
                <div className="flex gap-4 text-sm text-gray-300">
                  {budget && <span>Budget: {budget} MOTN</span>}
                  {duration && <span>Duration: {duration} minutes</span>}
                </div>
              )}
              
              <div>
                <p className="text-gray-300 whitespace-pre-line">{synopsis || "Synopsis will appear here..."}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {ipfsUrl && (
          <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center mb-4">
              <LinkIcon className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-green-400">Successfully Uploaded!</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your movie idea has been uploaded to IPFS. You can now create a proposal using this link:
            </p>
            <div className="bg-white/10 p-3 rounded border border-purple-500/20">
              <a 
                href={ipfsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-400 hover:text-purple-300 break-all text-sm"
              >
                {ipfsUrl}
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Copy this link and use it when creating a new proposal in the Proposals section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}