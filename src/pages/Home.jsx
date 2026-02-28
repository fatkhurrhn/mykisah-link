// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [headerStyle, setHeaderStyle] = useState({ transform: 'translateY(0)' });

  // Stats data
  const stats = [
    { icon: 'fa-tv', value: '10.000+', label: 'Anime & Episode' },
    { icon: 'fa-theater-masks', value: '5.000+', label: 'Donghua & Drama' },
    { icon: 'fa-film', value: '3.000+', label: 'Film Asia' },
    { icon: 'fa-infinity', value: '100%', label: 'Gratis Selamanya' }
  ];

  // Features data
  const features = [
    { icon: 'fa-closed-captioning', title: 'Subtitle Indonesia Lengkap', desc: 'Semua konten dilengkapi dengan subtitle Indonesia berkualitas tinggi, diterjemahkan oleh tim profesional.' },
    { icon: 'fa-camera', title: 'Kualitas HD & Full HD', desc: 'Nikmati streaming dengan kualitas video HD hingga Full HD 1080p. Gambar jernih dan tajam.' },
    { icon: 'fa-bolt', title: 'Streaming Super Cepat', desc: 'Server berkecepatan tinggi memastikan tidak ada buffering. Tonton langsung tanpa loading lama.' },
    { icon: 'fa-sync-alt', title: 'Update Setiap Hari', desc: 'Episode terbaru dari anime dan drama favorit kamu diupdate setiap hari tepat waktu.' },
    { icon: 'fa-download', title: 'Nonton Offline', desc: 'Download episode favoritmu dan tonton kapan saja tanpa koneksi internet.' },
    { icon: 'fa-palette', title: 'Antarmuka Modern', desc: 'Desain aplikasi yang intuitif dan mudah digunakan. Temukan konten favorit dengan cepat.' }
  ];

  // Categories data
  const categories = [
    { icon: 'fa-torii-gate', title: 'Anime Jepang', desc: 'Ribuan judul anime dari berbagai genre: action, romance, isekai, slice of life.' },
    { icon: 'fa-yin-yang', title: 'Donghua', desc: 'Anime China berkualitas tinggi dengan animasi memukau dan cerita seru.' },
    { icon: 'fa-heart', title: 'Drama Asia', desc: 'Drama Korea, China, Jepang, Thailand terbaru dengan subtitle Indonesia.' },
    { icon: 'fa-dragon', title: 'Film Pilihan', desc: 'Koleksi film Asia terbaik dari berbagai negara dengan kualitas terbaik.' }
  ];

  // Screenshots data
  const screenshots = [
    { src: '/screenshot/fitur1.jpg', alt: 'Home Screen' },
    { src: '/screenshot/fitur2.jpg', alt: 'Anime List' },
    { src: '/screenshot/fitur3.jpg', alt: 'Player Screen' },
    { src: '/screenshot/fitur4.jpg', alt: 'Download Screen' }
  ];

  // FAQ data
  const faqData = [
    { question: 'Apakah aplikasi ini benar-benar gratis?', answer: 'Ya, MyKisah sepenuhnya gratis untuk digunakan. Tidak ada biaya berlangganan, tidak ada biaya tersembunyi. Kami menyediakan semua konten secara gratis untuk semua pengguna.' },
    { question: 'Apakah semua anime dan drama memiliki subtitle Indonesia?', answer: 'Ya, 100% konten kami dilengkapi dengan subtitle Indonesia berkualitas tinggi. Tim kami memastikan setiap episode diterjemahkan dengan akurat dan mudah dipahami.' },
    { question: 'Bisakah saya menonton secara offline?', answer: 'Tentu saja! Fitur download memungkinkan kamu untuk mengunduh episode favorit dan menontonnya kapan saja tanpa koneksi internet.' },
    { question: 'Seberapa sering konten diupdate?', answer: 'Kami mengupdate konten setiap hari! Episode terbaru dari anime ongoing dan drama yang sedang tayang akan segera tersedia.' },
    { question: 'Apakah aplikasi ini aman untuk digunakan?', answer: 'Sangat aman! Aplikasi kami tidak meminta izin yang tidak perlu dan tidak mengumpulkan data pribadi tanpa persetujuan.' },
    { question: 'Perangkat apa saja yang didukung?', answer: 'Saat ini MyKisah tersedia untuk semua perangkat Android (versi 5.0 ke atas). Aplikasi berjalan lancar di smartphone dan tablet.' }
  ];

  // Scroll effect
  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      setIsScrolled(currentScroll > 100);

      if (currentScroll > lastScroll && currentScroll > 100) {
        setHeaderStyle({ transform: 'translateY(-100%)' });
      } else {
        setHeaderStyle({ transform: 'translateY(0)' });
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setIsMenuOpen(false);
    }
  };

  // FAQ Toggle
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(243, 161, 67, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(243, 161, 67, 0.03) 0%, transparent 50%)'
        }}
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#f3a143]/20' : ''
          }`}
        style={headerStyle}
        id="header"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="logo flex items-center gap-2">
              <img src="/logo-circle.png" style={{ width: '45px' }} alt="MyKisah Logo" />
              <div className="flex items-center">
                <span className="text-white text-2xl font-bold">My</span>
                <span className="text-[#f3a143] text-2xl font-bold">Kisah</span>
              </div>
            </div>
            {/* Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-8 items-center">
                <li>
                  <a
                    href="#beranda"
                    onClick={(e) => handleSmoothScroll(e, '#beranda')}
                    className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm font-medium relative py-2 group"
                  >
                    <i className="fas fa-home"></i> Beranda
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f3a143] transition-all group-hover:w-full shadow-[0_0_10px_#f3a143]"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#fitur"
                    onClick={(e) => handleSmoothScroll(e, '#fitur')}
                    className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm font-medium relative py-2 group"
                  >
                    <i className="fas fa-star"></i> Fitur
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f3a143] transition-all group-hover:w-full shadow-[0_0_10px_#f3a143]"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#konten"
                    onClick={(e) => handleSmoothScroll(e, '#konten')}
                    className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm font-medium relative py-2 group"
                  >
                    <i className="fas fa-film"></i> Konten
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f3a143] transition-all group-hover:w-full shadow-[0_0_10px_#f3a143]"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => handleSmoothScroll(e, '#faq')}
                    className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm font-medium relative py-2 group"
                  >
                    <i className="fas fa-question-circle"></i> FAQ
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f3a143] transition-all group-hover:w-full shadow-[0_0_10px_#f3a143]"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#download"
                    onClick={(e) => handleSmoothScroll(e, '#download')}
                    className="bg-[#f3a143] text-black px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#fbc266] transition transform hover:-translate-y-1 shadow-lg shadow-[#f3a143]/30"
                  >
                    <i className="fas fa-download"></i> Download
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-[#f3a143] border-2 border-[#f3a143]/30 rounded-lg hover:bg-[#f3a143]/10 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden fixed left-0 right-0 bg-[#050505]/98 backdrop-blur-3xl border-y border-[#f3a143]/20 transition-all duration-300 ${isMenuOpen ? 'top-16 opacity-100 visible' : 'top-[-400px] opacity-0 invisible'
            }`}>
            <ul className="flex flex-col py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
              <li className="border-b border-[#f3a143]/10">
                <a
                  href="#beranda"
                  onClick={(e) => handleSmoothScroll(e, '#beranda')}
                  className="block px-6 py-4 text-gray-300 hover:text-[#f3a143] transition flex items-center gap-3"
                >
                  <i className="fas fa-home w-5"></i> Beranda
                </a>
              </li>
              <li className="border-b border-[#f3a143]/10">
                <a
                  href="#fitur"
                  onClick={(e) => handleSmoothScroll(e, '#fitur')}
                  className="block px-6 py-4 text-gray-300 hover:text-[#f3a143] transition flex items-center gap-3"
                >
                  <i className="fas fa-star w-5"></i> Fitur
                </a>
              </li>
              <li className="border-b border-[#f3a143]/10">
                <a
                  href="#konten"
                  onClick={(e) => handleSmoothScroll(e, '#konten')}
                  className="block px-6 py-4 text-gray-300 hover:text-[#f3a143] transition flex items-center gap-3"
                >
                  <i className="fas fa-film w-5"></i> Konten
                </a>
              </li>
              <li className="border-b border-[#f3a143]/10">
                <a
                  href="#faq"
                  onClick={(e) => handleSmoothScroll(e, '#faq')}
                  className="block px-6 py-4 text-gray-300 hover:text-[#f3a143] transition flex items-center gap-3"
                >
                  <i className="fas fa-question-circle w-5"></i> FAQ
                </a>
              </li>
              <li className="px-6 py-4">
                <a
                  href="#download"
                  onClick={(e) => handleSmoothScroll(e, '#download')}
                  className="bg-[#f3a143] text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#fbc266] transition"
                >
                  <i className="fas fa-download"></i> Download APK
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="beranda" className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#f3a143]/10 to-transparent animate-pulse-slow pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#f3a143]/10 border border-[#f3a143]/30 text-[#f3a143] px-6 py-3 rounded-full text-sm font-semibold mb-8 backdrop-blur-md animate-glow">
              <i className="fas fa-check-circle"></i> Gratis - 10K+ Koleksi
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Nonton <span className="text-[#f3a143] drop-shadow-[0_8px_25px_rgba(243,161,67,0.3)]">Anime, Donghua</span> Favorit Tanpa Repot!
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Nikmati nonton anime dan donghua secara gratis tanpa iklan, tapi ingat, jangan sampai lupa waktu.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {/* Download Button - Muncul di Mobile & Desktop */}
              <a
                href="#download"
                onClick={(e) => handleSmoothScroll(e, '#download')}
                className="bg-[#f3a143] text-black px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 hover:bg-[#fbc266] transition transform hover:-translate-y-1 shadow-lg shadow-[#f3a143]/30"
              >
                <i className="fas fa-mobile-alt"></i>
                <span>Download Aplikasi</span>
              </a>

              {/* Mockup Button - Hanya muncul di Desktop (sm:flex) */}
              <a
                href="#screenshots"
                onClick={(e) => handleSmoothScroll(e, '#screenshots')}
                className="hidden sm:flex bg-[#f3a143]/10 backdrop-blur-md border-2 border-[#f3a143]/30 text-[#f3a143] px-8 py-4 rounded-full font-bold text-base items-center justify-center gap-3 hover:bg-[#f3a143]/20 transition transform hover:-translate-y-1"
              >
                <i className="fas fa-mobile-screen"></i>
                <span>Tampilan Aplikasi</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#111]/50 backdrop-blur-xl border border-[#f3a143]/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition hover:border-[#f3a143] hover:shadow-[0_10px_40px_rgba(243,161,67,0.2)] group"
              >
                <i className={`fas ${stat.icon} text-4xl text-[#f3a143] mb-3 block group-hover:scale-110 transition`}></i>
                <h3 className="text-3xl md:text-4xl font-black text-[#f3a143] mb-1 drop-shadow-[0_8px_25px_rgba(243,161,67,0.3)]">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#f3a143]/10 border border-[#f3a143]/30 text-[#f3a143] px-5 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-crown"></i> Kenapa Memilih Kami?
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Fitur Unggulan MyKisah</h2>
            <p className="text-gray-400">Platform streaming terlengkap dengan berbagai fitur premium untuk pengalaman menonton terbaik</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-[#111]/50 backdrop-blur-xl border border-[#f3a143]/15 rounded-2xl p-6 md:p-8 hover:-translate-y-2 transition hover:border-[#f3a143] hover:shadow-[0_15px_50px_rgba(243,161,67,0.2)] hover:bg-[#111]/70 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#f3a143] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                {/* Mobile: Icon di tengah */}
                <div className="flex flex-col items-center md:block">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f3a143]/15 border-2 border-[#f3a143]/30 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl text-[#f3a143] mb-3 md:mb-5 group-hover:scale-110 group-hover:bg-[#f3a143]/25 group-hover:border-[#f3a143] group-hover:shadow-[0_0_30px_rgba(243,161,67,0.4)] transition">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>

                  <h3 className="text-base md:text-xl font-bold mb-0 md:mb-3 text-center md:text-left">{feature.title}</h3>

                  {/* Description - hidden di mobile, muncul di desktop */}
                  <p className="hidden md:block text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="konten" className="py-20 px-4 bg-[#111]/30 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#f3a143]/10 border border-[#f3a143]/30 text-[#f3a143] px-5 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-layer-group"></i> Konten Terlengkap
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Jelajahi Ribuan Konten Pilihan</h2>
            <p className="text-gray-400">Dari anime action hingga drama romance, semua ada di sini</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-[#111]/60 backdrop-blur-xl border border-[#f3a143]/15 rounded-2xl p-8 text-center hover:-translate-y-2 transition hover:border-[#f3a143] hover:shadow-[0_20px_50px_rgba(243,161,67,0.25)] hover:bg-[#111]/80 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-radial-gradient from-[#f3a143]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <i className={`fas ${category.icon} text-5xl text-[#f3a143] mb-4 block filter drop-shadow-[0_0_10px_rgba(243,161,67,0.3)] group-hover:scale-110 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_20px_rgba(243,161,67,0.6)] transition`}></i>

                <h3 className="text-xl font-bold mb-2 relative z-10">{category.title}</h3>
                <p className="text-gray-400 text-sm relative z-10">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="fitur" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#f3a143]/10 border border-[#f3a143]/30 text-[#f3a143] px-5 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fas fa-mobile-screen"></i> Tampilan Aplikasi
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Antarmuka yang Menarik & Mudah Digunakan</h2>
            <p className="text-gray-400">Desain modern dan responsif untuk pengalaman menonton yang nyaman</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#f3a143] scrollbar-track-[#111]">
              {screenshots.map((ss, index) => (
                <div
                  key={index}
                  className="flex-none w-[240px] md:w-[280px] h-[460px] md:h-[520px] bg-[#111]/60 backdrop-blur-xl border-2 border-[#f3a143]/20 rounded-2xl overflow-hidden hover:border-[#f3a143] hover:scale-105 transition hover:shadow-[0_15px_50px_rgba(243,161,67,0.3)] snap-center"
                >
                  <img
                    src={ss.src}
                    alt={ss.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/280x520/111/f3a143?text=${ss.alt}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-4 bg-[#f3a143]/5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gradient from-[#f3a143]/15 to-transparent" />

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-[0_0_30px_rgba(243,161,67,0.3)]">
              Download Sekarang
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Merk kami MyKisah, KisahKu, AnimeKu adalah entitas yang Sama.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/aplikasi/mykisah.apk"
                className="group bg-[#111]/70 backdrop-blur-xl border-2 border-[#f3a143]/30 text-white px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-4 hover:border-[#f3a143] hover:-translate-y-1 transition hover:shadow-[0_15px_40px_rgba(243,161,67,0.3)]"
              >
                <i className="fas fa-mobile text-3xl text-[#f3a143] group-hover:scale-110 transition"></i>
                <div className="text-left">
                  <small className="text-xs opacity-80 block">Download</small>
                  <span className="text-lg block">HP Android</span>
                </div>
              </a>

              <a
                href="https://mykisah-web.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#111]/70 backdrop-blur-xl border-2 border-[#f3a143]/30 text-white px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-4 hover:border-[#f3a143] hover:-translate-y-1 transition hover:shadow-[0_15px_40px_rgba(243,161,67,0.3)]"
              >
                <i className="fas fa-globe text-3xl text-[#f3a143] group-hover:scale-110 transition"></i>
                <div className="text-left">
                  <small className="text-xs opacity-80 block">Free Everyone</small>
                  <span className="text-lg block">Website</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-[#f3a143]/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* About */}
            <div>
              <h3 className="text-[#f3a143] font-bold mb-5 flex items-center gap-2 text-lg">
                <i className="fas fa-info-circle"></i> Tentang MyKisah
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Platform streaming anime, donghua, dan drama Asia terlengkap. Gratis selamanya untuk semua pengguna Indonesia.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#f3a143] font-bold mb-5 flex items-center gap-2 text-lg">
                <i className="fas fa-link"></i> Tautan Cepat
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#beranda" onClick={(e) => handleSmoothScroll(e, '#beranda')} className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fas fa-chevron-right text-xs"></i> Beranda
                  </a>
                </li>
                <li>
                  <a href="#fitur" onClick={(e) => handleSmoothScroll(e, '#fitur')} className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fas fa-chevron-right text-xs"></i> Fitur
                  </a>
                </li>
                <li>
                  <a href="#konten" onClick={(e) => handleSmoothScroll(e, '#konten')} className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fas fa-chevron-right text-xs"></i> Konten
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')} className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fas fa-chevron-right text-xs"></i> FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Download */}
            <div>
              <h3 className="text-[#f3a143] font-bold mb-5 flex items-center gap-2 text-lg">
                <i className="fas fa-download"></i> Download
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/aplikasi/mykisah.apk" className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fab fa-android"></i> APK Android
                  </a>
                </li>
                <li>
                  <a href="https://mykisah-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#f3a143] transition flex items-center gap-2 text-sm">
                    <i className="fas fa-globe"></i> Website
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-[#f3a143] font-bold mb-5 flex items-center gap-2 text-lg">
                <i className="fas fa-users"></i> Ikuti Kami
              </h3>
              <div className="flex gap-3 flex-wrap">
                <a href="#" className="w-10 h-10 bg-[#f3a143]/10 border border-[#f3a143]/30 rounded-full flex items-center justify-center text-[#f3a143] hover:bg-[#f3a143] hover:text-black transition transform hover:-translate-y-1">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-[#f3a143]/10 border border-[#f3a143]/30 rounded-full flex items-center justify-center text-[#f3a143] hover:bg-[#f3a143] hover:text-black transition transform hover:-translate-y-1">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-[#f3a143]/10 border border-[#f3a143]/30 rounded-full flex items-center justify-center text-[#f3a143] hover:bg-[#f3a143] hover:text-black transition transform hover:-translate-y-1">
                  <i className="fab fa-discord"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-[#f3a143]/10 border border-[#f3a143]/30 rounded-full flex items-center justify-center text-[#f3a143] hover:bg-[#f3a143] hover:text-black transition transform hover:-translate-y-1">
                  <i className="fab fa-telegram"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-[#f3a143]/15 text-gray-500 text-sm">
            <p>© 2026 MyKisah. All rights reserved. Dari pecinta anime untuk pecinta anime.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; }
          50% { transform: translateX(-50%) scale(1.1); opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(243, 161, 67, 0.3); }
          50% { box-shadow: 0 0 30px rgba(243, 161, 67, 0.6); }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #111;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #f3a143;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(243, 161, 67, 0.5);
        }
      `}</style>
    </div>
  );
}