"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function Home() {
  const { isDarkMode } = useTheme();

  const scrollToInformasiPendaftaran = () => {
    const section = document.getElementById("informasi-pendaftaran");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={`${isDarkMode ? "bg-gray-900" : "bg-blue-700"} py-16 md:py-20 px-8 md:px-12 flex-grow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-white" : "text-white"
            } sm:text-3xl md:text-4xl lg:text-5xl`}
          >
            Bergabunglah dengan Komunitas Inovator Kami
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="my-4 text-base md:text-lg text-white"
          >
            Daftar sekarang untuk menjadi bagian dari organisasi transformatif kami.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 space-x-4"
          >
            <a
              href="/formulir"
              className={`inline-block ${
                isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-blue-700 hover:bg-blue-100"
              } px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition duration-300 text-sm md:text-base`}
            >
              Daftar Sekarang
            </a>
            <button
              onClick={scrollToInformasiPendaftaran}
              className={`inline-block ${
                isDarkMode ? "bg-blue-800 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"
              } px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition duration-300 text-sm md:text-base`}
            >
              Pelajari Lebih Lanjut
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Organization Section */}
      <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} py-8 md:py-10`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-blue-700"
          } mb-4 md:mb-6`}>
            Tentang Organisasi Kami
          </h2>
          <p className={`${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } text-sm md:text-base max-w-3xl mx-auto`}>
            Kami adalah komunitas global yang berdedikasi untuk memajukan inovasi, kolaborasi, dan pertumbuhan. Misi kami adalah memberdayakan individu dan organisasi untuk menciptakan solusi berdampak bagi masa depan yang lebih baik.
          </p>
        </motion.div>
      </section>

      {/* Registration Details Section */}
      <section id="informasi-pendaftaran" className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} py-8 md:py-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-blue-700"
            } mb-4 md:mb-6`}>
              Informasi Pendaftaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-blue-700"
                } mb-2`}>
                  Kelayakan
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm md:text-base`}>
                  Terbuka untuk individu dan tim yang bersemangat tentang inovasi, berusia 18 tahun ke atas.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`${isDarkMode ? "text-white" : "text-blue-700"} text-lg font-bold mb-2`}>
                  Proses
                </h3>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm md:text-base`}>
                  Pendaftaran online yang sederhana dengan konfirmasi instan dan detail tindak lanjut.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-blue-700"
                } mb-2`}>
                  Batas Waktu
                </h3>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm md:text-base`}>
                  Daftar sebelum [Batas Waktu Anda] untuk mengamankan tempat Anda.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`${isDarkMode ? "bg-gray-800" : "bg-white"} py-8 md:py-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-blue-700"
            } mb-4 md:mb-6`}>
              Apa yang Anda Dapatkan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-blue-700"
                } mb-2`}>
                  Jaringan
                </h3>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm md:text-base`}>
                  Terhubung dengan inovator dan pemimpin industri yang memiliki visi serupa.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-blue-700"
                } mb-2`}>
                  Sumber Daya
                </h3>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm md:text-base`}>
                  Akses alat eksklusif, lokakarya, dan program mentorship.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                } p-4 md:p-6 rounded-lg shadow-md`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-blue-700"
                } mb-2`}>
                  Peluang
                </h3>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm md:text-base`}>
                  Buka potensi untuk kolaborasi dan pendanaan proyek.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`${isDarkMode ? "bg-gray-800" : "bg-blue-700"} py-6 md:py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center md:text-left mb-4 md:mb-0"
            >
              <h2 className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-white"
              } mb-2`}>
                Siap Membuat Perubahan?
              </h2>
              <p className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-white"
              }`}>
                Bergabunglah dengan komunitas kami dan mulai perjalanan Anda hari ini.
              </p>
            </motion.div>
            <motion.a
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`inline-block ${
                isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-blue-700 hover:bg-blue-100"
              } px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition duration-300 text-sm md:text-base`}
              href="/formulir"
            >
              Mulai Sekarang
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}