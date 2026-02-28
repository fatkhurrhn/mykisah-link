import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SamaHDAnimeApp = () => {
  // State Management
  const [homeData, setHomeData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState('');
  const [qualityOptions, setQualityOptions] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [selectedServer, setSelectedServer] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef(null);

  // API Base URL
  const API_BASE = 'https://www.sankavollerei.com/anime/samehadaku';

  // Fetch Home Data
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/home`);
      setHomeData(response.data.data);
      setAnimeList(response.data.data.recent.animeList);
    } catch (err) {
      setError('Gagal memuat data');
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Fetch Recent Anime
  const fetchRecentAnime = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/recent`);
      setAnimeList(response.data.data.animeList);
      setActiveTab('recent');
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Fetch Ongoing Anime
  const fetchOngoingAnime = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/ongoing`);
      setAnimeList(response.data.data.animeList);
      setActiveTab('ongoing');
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Fetch All Anime
  const fetchAllAnime = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/list`);
      // Flatten the anime list from grouped structure
      const allAnime = response.data.data.list.flatMap(group => group.animeList);
      setAnimeList(allAnime);
      setActiveTab('all');
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Search Anime
  const searchAnime = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await axios.get(`${API_BASE}/search?q=${encodedQuery}`);
      setSearchResults(response.data.data.animeList || []);
      setActiveTab('search');
    } catch (err) {
      console.error('Search error:', err);
      setError('Gagal mencari anime');
    }
    setIsSearching(false);
  };

  // Fetch Anime Details
  const fetchAnimeDetails = async (animeId) => {
    setLoading(true);
    setSelectedAnime(null);
    setEpisodeData(null);
    setStreamingUrl('');

    try {
      const response = await axios.get(`${API_BASE}/anime/${animeId}`);
      const animeInfo = response.data.data;

      // Format the anime data
      const formattedAnime = {
        ...animeInfo,
        id: animeId,
        episodes: animeInfo.episodeList || []
      };

      setSelectedAnime(formattedAnime);

      // If there are episodes, fetch the first one
      if (animeInfo.episodeList && animeInfo.episodeList.length > 0) {
        const firstEpisode = animeInfo.episodeList[animeInfo.episodeList.length - 1]; // Latest episode
        fetchEpisodeDetails(firstEpisode.episodeId);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat detail anime');
    }
    setLoading(false);
  };

  // Fetch Episode Details
  const fetchEpisodeDetails = async (episodeId) => {
    setLoading(true);
    setEpisodeData(null);
    setStreamingUrl('');
    setQualityOptions([]);

    try {
      const response = await axios.get(`${API_BASE}/episode/${episodeId}`);
      const episodeInfo = response.data.data;

      setEpisodeData(episodeInfo);
      setSelectedEpisode(episodeInfo);

      // Extract quality options from server data
      if (episodeInfo.server && episodeInfo.server.qualities) {
        const qualities = episodeInfo.server.qualities
          .filter(q => q.serverList.length > 0)
          .map(q => ({
            quality: q.title,
            servers: q.serverList
          }));

        setQualityOptions(qualities);

        // Auto-select the highest quality (1080p or 720p)
        const preferredQuality = qualities.find(q => q.quality === '1080p') ||
          qualities.find(q => q.quality === '720p') ||
          qualities[0];

        if (preferredQuality) {
          setSelectedQuality(preferredQuality.quality);
          // Auto-select first server for the selected quality
          if (preferredQuality.servers.length > 0) {
            setSelectedServer(preferredQuality.servers[0].serverId);
            fetchStreamingUrl(preferredQuality.servers[0].serverId);
          }
        }
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat detail episode');
    }
    setLoading(false);
  };

  // Fetch Streaming URL
  const fetchStreamingUrl = async (serverId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/server/${serverId}`);
      if (response.data.status === 'success' && response.data.data.url) {
        setStreamingUrl(response.data.data.url);
      }
    } catch (err) {
      console.error('Stream error:', err);
      setError('Gagal memuat streaming URL');
    }
    setLoading(false);
  };

  // Handle Quality Change
  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    const qualityOption = qualityOptions.find(q => q.quality === quality);
    if (qualityOption && qualityOption.servers.length > 0) {
      const serverId = qualityOption.servers[0].serverId;
      setSelectedServer(serverId);
      fetchStreamingUrl(serverId);
    }
  };

  // Handle Server Change
  const handleServerChange = (serverId) => {
    setSelectedServer(serverId);
    fetchStreamingUrl(serverId);
  };

  // Navigate to Previous/Next Episode
  const navigateEpisode = (direction) => {
    if (!episodeData) return;

    const targetEpisode = direction === 'prev'
      ? episodeData.prevEpisode
      : episodeData.nextEpisode;

    if (targetEpisode && targetEpisode.episodeId) {
      fetchEpisodeDetails(targetEpisode.episodeId);
    }
  };

  // Handle Back
  const handleBack = () => {
    setSelectedAnime(null);
    setEpisodeData(null);
    setStreamingUrl('');
    setQualityOptions([]);
  };

  // Loading Component
  if (loading && !selectedAnime) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">▶</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  SamaHD Stream
                </h1>
                <p className="text-xs text-gray-500">Powered by Sanka Vollerei API</p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={searchAnime} className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari anime (contoh: one piece, naruto)..."
                  className="w-full px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {isSearching ? '🔍' : 'Cari'}
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Tabs */}
          {!selectedAnime && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                onClick={() => { setActiveTab('home'); setAnimeList(homeData?.recent?.animeList || []); }}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'home'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                🏠 Home
              </button>
              <button
                onClick={fetchRecentAnime}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'recent'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                🆕 Terbaru
              </button>
              <button
                onClick={fetchOngoingAnime}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'ongoing'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                📺 Sedang Tayang
              </button>
              <button
                onClick={fetchAllAnime}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'all'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                📚 Semua Anime
              </button>
              <button
                onClick={() => setActiveTab('top10')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'top10'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                ⭐ Top 10
              </button>
              <button
                onClick={() => setActiveTab('movie')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'movie'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                🎬 Movie
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            ⚠️ {error}
          </div>
        )}

        {selectedAnime ? (
          // 🎬 ANIME DETAIL VIEW
          <div className="space-y-8 animate-fadeIn">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-3 text-red-600 hover:text-red-800 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <span className="text-xl">←</span>
              </div>
              <span className="font-medium">Kembali ke Daftar</span>
            </button>

            {/* Anime Info & Streaming Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Anime Info */}
                <div className="lg:w-1/3 space-y-6">
                  {/* Anime Poster */}
                  <div className="sticky top-24">
                    <img
                      src={selectedAnime.poster}
                      alt={selectedAnime.title || selectedAnime.english}
                      className="w-full rounded-xl shadow-lg"
                    />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <div className="text-gray-600 text-sm">Score</div>
                        <div className="text-2xl font-bold text-red-600">
                          {selectedAnime.score?.value || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <div className="text-gray-600 text-sm">Status</div>
                        <div className="text-lg font-bold text-orange-600">
                          {selectedAnime.status}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-gray-600 text-sm">Type</div>
                        <div className="text-lg font-bold text-blue-600">
                          {selectedAnime.type}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-gray-600 text-sm">Episodes</div>
                        <div className="text-2xl font-bold text-green-600">
                          {selectedAnime.episodes?.length || '?'}
                        </div>
                      </div>
                    </div>

                    {/* Anime Details */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-700">Japanese:</h4>
                        <p className="text-gray-600">{selectedAnime.japanese}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">English:</h4>
                        <p className="text-gray-600">{selectedAnime.english}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Aired:</h4>
                        <p className="text-gray-600">{selectedAnime.aired}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Studios:</h4>
                        <p className="text-gray-600">{selectedAnime.studios}</p>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="mt-6">
                      <h4 className="font-bold text-gray-700 mb-3">Genres:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.genreList?.map((genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-red-100 transition-colors"
                          >
                            {genre.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Streaming & Episodes */}
                <div className="lg:w-2/3 space-y-8">
                  {/* Anime Title */}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedAnime.title || selectedAnime.english}
                    </h1>
                    <p className="text-gray-600 text-lg">{selectedAnime.japanese}</p>
                  </div>

                  {/* Synopsis */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Sinopsis</h3>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {selectedAnime.synopsis?.paragraphs?.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      )) || 'Sinopsis tidak tersedia.'}
                    </div>
                  </div>

                  {/* 🎥 Video Player Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {episodeData ? `Episode ${episodeData.title}` : 'Pilih Episode'}
                      </h3>

                      {/* Episode Navigation */}
                      {episodeData && (
                        <div className="flex space-x-4">
                          {episodeData.hasPrevEpisode && (
                            <button
                              onClick={() => navigateEpisode('prev')}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2"
                            >
                              <span>←</span>
                              <span>Prev</span>
                            </button>
                          )}
                          {episodeData.hasNextEpisode && (
                            <button
                              onClick={() => navigateEpisode('next')}
                              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center space-x-2"
                            >
                              <span>Next</span>
                              <span>→</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Video Player */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                      {streamingUrl ? (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            key={streamingUrl}
                            controls
                            autoPlay
                            className="w-full h-auto max-h-[70vh]"
                            poster={selectedAnime.poster}
                          >
                            <source src={streamingUrl} type="video/mp4" />
                            Browser tidak mendukung pemutar video.
                          </video>
                          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                            Streaming via Filedon
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-96 bg-gray-800">
                          <div className="text-center">
                            {loading ? (
                              <>
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
                                <p className="text-white">Memuat streaming...</p>
                              </>
                            ) : (
                              <p className="text-white">Pilih episode dan kualitas untuk memulai streaming</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quality & Server Selection */}
                    {qualityOptions.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold mb-4 text-gray-800">Kualitas & Server</h4>

                        {/* Quality Selection */}
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-700 mb-3">Kualitas:</h5>
                          <div className="flex flex-wrap gap-2">
                            {qualityOptions.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQualityChange(q.quality)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedQuality === q.quality
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                              >
                                {q.quality}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Server Selection */}
                        {selectedQuality && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3">Server {selectedQuality}:</h5>
                            <div className="flex flex-wrap gap-2">
                              {qualityOptions
                                .find(q => q.quality === selectedQuality)
                                ?.servers.map((server, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleServerChange(server.serverId)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${selectedServer === server.serverId
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                      }`}
                                  >
                                    {server.title}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Episode List */}
                  {selectedAnime.episodes && selectedAnime.episodes.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Daftar Episode</h3>
                        <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                          {selectedAnime.episodes.length} Episode
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {selectedAnime.episodes.slice().reverse().map((episode, index) => (
                          <button
                            key={episode.episodeId || index}
                            onClick={() => fetchEpisodeDetails(episode.episodeId)}
                            className={`group relative bg-gradient-to-br from-white to-gray-50 border rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 ${episodeData?.episodeId === episode.episodeId
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-red-300'
                              }`}
                          >
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {episode.title}
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-2">
                              Episode {episode.title}
                            </div>
                            <div className="mt-3 text-xs text-red-600 font-medium">
                              Tonton
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Batch Downloads */}
                  {selectedAnime.batchList && selectedAnime.batchList.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-800">Download Batch</h3>
                      <div className="space-y-3">
                        {selectedAnime.batchList.map((batch, idx) => (
                          <a
                            key={idx}
                            href={`${API_BASE}${batch.href}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-blue-300 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="font-medium text-blue-700">{batch.title}</div>
                            <div className="text-blue-600">⬇️</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 🏠 MAIN BROWSE VIEW
          <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center py-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'home' && 'Anime Terbaru'}
                {activeTab === 'recent' && 'Episode Terbaru'}
                {activeTab === 'ongoing' && 'Anime Sedang Tayang'}
                {activeTab === 'all' && 'Semua Anime'}
                {activeTab === 'top10' && 'Top 10 Anime'}
                {activeTab === 'movie' && 'Movie Anime'}
                {activeTab === 'search' && `Hasil Pencarian: "${searchQuery}"`}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'home' && 'Rekomendasi anime terbaru untuk kamu'}
                {activeTab === 'recent' && 'Episode anime yang baru dirilis'}
                {activeTab === 'ongoing' && 'Anime yang masih berlanjut musim ini'}
                {activeTab === 'all' && 'Koleksi lengkap anime dari A-Z'}
                {activeTab === 'top10' && 'Anime dengan rating tertinggi'}
                {activeTab === 'movie' && 'Film anime berkualitas'}
                {activeTab === 'search' && `Ditemukan ${searchResults.length} anime`}
              </p>
            </div>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {(activeTab === 'search' ? searchResults : animeList).map((anime, index) => (
                <div
                  key={anime.animeId || index}
                  onClick={() => fetchAnimeDetails(anime.animeId)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-red-300 transform hover:-translate-y-1"
                >
                  {/* Anime Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3">
                      {anime.score && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                          ⭐ {anime.score}
                        </div>
                      )}
                      {anime.rank && (
                        <div className="mt-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          #{anime.rank}
                        </div>
                      )}
                    </div>

                    {/* Episode/Status Badge */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`px-3 py-1 rounded-full text-sm ${anime.status === 'Ongoing'
                          ? 'bg-green-600 text-white'
                          : anime.episodes
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                        {anime.episodes ? `EP ${anime.episodes}` : anime.status || 'TV'}
                      </div>
                    </div>
                  </div>

                  {/* Anime Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {anime.title}
                    </h3>

                    {/* Genre Tags */}
                    {anime.genreList && anime.genreList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {anime.genreList.slice(0, 2).map((genre, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {genre.title}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{anime.releasedOn || anime.status || ''}</span>
                      <span>{anime.type || 'TV'}</span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-red-600 font-medium group-hover:text-red-800 transition-colors flex items-center justify-between">
                        <span>Tonton Sekarang</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty States */}
            {activeTab === 'search' && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500 text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Tidak Ditemukan</h3>
                <p className="text-gray-600">Tidak ada anime yang cocok dengan "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg"></div>
              <span className="text-lg font-bold text-gray-800">SamaHD Stream</span>
            </div>
            <p className="text-gray-600 mb-2">
              © {new Date().getFullYear()} Anime Streaming App • Untuk Tujuan Edukasi
            </p>
            <p className="text-sm text-gray-500">
              API oleh Sanka Vollerei • Streaming via Filedon • Data dari Samehadaku
            </p>
            <div className="mt-4 text-xs text-gray-400">
              ⚠️ Aplikasi ini untuk demonstrasi teknis penggunaan API
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SamaHDAnimeApp;