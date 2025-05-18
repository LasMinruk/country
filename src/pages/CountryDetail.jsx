import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiDownload, FiFileText } from "react-icons/fi";
import InfoCard from "../components/InfoCard";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Page component for displaying detailed country information
const CountryDetail = () => {
  // Get country code from URL and initialize state
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [error, setError] = useState(false);
  const reportRef = useRef(null);

  // Function to handle flag download
  const handleDownloadFlag = async () => {
    if (!country?.flags) return;
    
    const flagUrl = country.flags.png;
    const fileName = `${country.name.common.toLowerCase().replace(/\s+/g, '-')}-flag.png`;
    
    try {
      const response = await fetch(flagUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading flag:', error);
    }
  };

  // Function to generate PDF report
  const generateReport = async () => {
    if (!country) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      let yOffset = 20; // Vertical offset for content

      // Add Header
      pdf.setFontSize(24);
      pdf.setTextColor(26, 54, 93); // #1a365d
      pdf.text('Country Report', pdfWidth / 2, yOffset, { align: 'center' });
      yOffset += 15;
      pdf.setFontSize(18);
      pdf.setTextColor(45, 55, 72); // #2d3748
      pdf.text(country.name.common, pdfWidth / 2, yOffset, { align: 'center' });
      yOffset += 8;
      pdf.setFontSize(14);
      pdf.setTextColor(74, 85, 104); // #4a5568
      pdf.text(country.name.official, pdfWidth / 2, yOffset, { align: 'center', fontStyle: 'italic' });
      yOffset += 20;

      // Add Flag Image
      if (country.flags?.png) {
        const imgData = await fetch(country.flags.png)
          .then(response => response.blob())
          .then(blob => new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          }));

        const img = new Image();
        img.onload = () => {
          const imgWidth = 100; // Desired image width in mm
          const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;
          const imgX = (pdfWidth - imgWidth) / 2; // Center the image
          pdf.addImage(imgData, 'PNG', imgX, yOffset, imgWidth, imgHeight);
          yOffset += imgHeight + 10;

          pdf.setFontSize(10);
          pdf.setTextColor(113, 128, 144); // #718096
          pdf.text(`Official flag of ${country.name.common}`, pdfWidth / 2, yOffset, { align: 'center' });
          yOffset += 15;

          // Add Basic Information
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Basic Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          const basicInfo = [
            `Capital: ${country.capital?.[0] || "N/A"}`,
            `Region: ${country.region}`,
            `Subregion: ${country.subregion || "N/A"}`,
            `Population: ${country.population.toLocaleString()}`,
            `Area: ${country.area.toLocaleString()} km²`,
            `Timezones: ${country.timezones?.join(", ")}`,
          ];
          basicInfo.forEach((item, index) => {
            const x = 20 + (index % 2) * (pdfWidth / 2 - 20);
            const y = yOffset + Math.floor(index / 2) * 10;
            pdf.text(item, x, y);
          });
          yOffset += Math.ceil(basicInfo.length / 2) * 10 + 10;

          // Add Cultural Information
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Cultural Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          pdf.text(`Languages: ${languageList}`, 20, yOffset);
          yOffset += 8;
          pdf.text(`Currencies: ${currencyList}`, 20, yOffset);
          yOffset += 15;

          // Add Border Countries
          if (borderCountries.length > 0) {
            pdf.setFontSize(16);
            pdf.setTextColor(45, 55, 72); // #2d3748
            pdf.text('Border Countries', 20, yOffset);
            yOffset += 8;

            pdf.setFontSize(12);
            pdf.setTextColor(74, 85, 104); // #4a5568
            const borderCountryNames = borderCountries.map(b => b.name.common);
            const borderText = borderCountryNames.join(', ');
            const textLines = pdf.splitTextToSize(borderText, pdfWidth - 40);
            pdf.text(textLines, 20, yOffset);
            yOffset += textLines.length * 7 + 10; // Adjust line height
          }

          // Add Footer
          pdf.setFontSize(10);
          pdf.setTextColor(113, 128, 144); // #718096
          pdf.text(`Generated on ${new Date().toLocaleString()}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 15, { align: 'center' });
          pdf.text('Data source: REST Countries API', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

          if (country.maps?.googleMaps) {
             pdf.setTextColor(66, 153, 225); // #4299e1
             pdf.textWithLink('View on Google Maps', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 5, { url: country.maps.googleMaps, align: 'center' });
          }

          // Save the PDF
          pdf.save(`${country.name.common.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
        };

        img.onerror = (error) => {
          console.error('Error loading flag image for PDF:', error);
          alert('Error loading flag image. PDF report may be incomplete.');
          // Continue saving PDF even if image fails to load
           // Add Basic Information (repeated from inside img.onload)
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Basic Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          const basicInfo = [
            `Capital: ${country.capital?.[0] || "N/A"}`,
            `Region: ${country.region}`,
            `Subregion: ${country.subregion || "N/A"}`,
            `Population: ${country.population.toLocaleString()}`,
            `Area: ${country.area.toLocaleString()} km²`,
            `Timezones: ${country.timezones?.join(", ")}`,
          ];
          basicInfo.forEach((item, index) => {
            const x = 20 + (index % 2) * (pdfWidth / 2 - 20);
            const y = yOffset + Math.floor(index / 2) * 10;
            pdf.text(item, x, y);
          });
          yOffset += Math.ceil(basicInfo.length / 2) * 10 + 10;

          // Add Cultural Information (repeated from inside img.onload)
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Cultural Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          pdf.text(`Languages: ${languageList}`, 20, yOffset);
          yOffset += 8;
          pdf.text(`Currencies: ${currencyList}`, 20, yOffset);
          yOffset += 15;

          // Add Border Countries (repeated from inside img.onload)
          if (borderCountries.length > 0) {
            pdf.setFontSize(16);
            pdf.setTextColor(45, 55, 72); // #2d3748
            pdf.text('Border Countries', 20, yOffset);
            yOffset += 8;

            pdf.setFontSize(12);
            pdf.setTextColor(74, 85, 104); // #4a5568
            const borderCountryNames = borderCountries.map(b => b.name.common);
            const borderText = borderCountryNames.join(', ');
            const textLines = pdf.splitTextToSize(borderText, pdfWidth - 40);
            pdf.text(textLines, 20, yOffset);
            yOffset += textLines.length * 7 + 10; // Adjust line height
          }

          // Add Footer (repeated from inside img.onload)
          pdf.setFontSize(10);
          pdf.setTextColor(113, 128, 144); // #718096
          pdf.text(`Generated on ${new Date().toLocaleString()}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 15, { align: 'center' });
          pdf.text('Data source: REST Countries API', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

          if (country.maps?.googleMaps) {
             pdf.setTextColor(66, 153, 225); // #4299e1
             pdf.textWithLink('View on Google Maps', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 5, { url: country.maps.googleMaps, align: 'center' });
          }

          // Save the PDF
          pdf.save(`${country.name.common.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
        };

        img.crossOrigin = 'Anonymous'; // Handle CORS for the image
        img.src = imgData; // Set the source to the data URL

      } else {
         // If no flag image, add the rest of the content immediately
         // Add Basic Information
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Basic Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          const basicInfo = [
            `Capital: ${country.capital?.[0] || "N/A"}`,
            `Region: ${country.region}`,
            `Subregion: ${country.subregion || "N/A"}`,
            `Population: ${country.population.toLocaleString()}`,
            `Area: ${country.area.toLocaleString()} km²`,
            `Timezones: ${country.timezones?.join(", ")}`,
          ];
          basicInfo.forEach((item, index) => {
            const x = 20 + (index % 2) * (pdfWidth / 2 - 20);
            const y = yOffset + Math.floor(index / 2) * 10;
            pdf.text(item, x, y);
          });
          yOffset += Math.ceil(basicInfo.length / 2) * 10 + 10;

          // Add Cultural Information
          pdf.setFontSize(16);
          pdf.setTextColor(45, 55, 72); // #2d3748
          pdf.text('Cultural Information', 20, yOffset);
          yOffset += 8;

          pdf.setFontSize(12);
          pdf.setTextColor(74, 85, 104); // #4a5568
          pdf.text(`Languages: ${languageList}`, 20, yOffset);
          yOffset += 8;
          pdf.text(`Currencies: ${currencyList}`, 20, yOffset);
          yOffset += 15;

          // Add Border Countries
          if (borderCountries.length > 0) {
            pdf.setFontSize(16);
            pdf.setTextColor(45, 55, 72); // #2d3748
            pdf.text('Border Countries', 20, yOffset);
            yOffset += 8;

            pdf.setFontSize(12);
            pdf.setTextColor(74, 85, 104); // #4a5568
            const borderCountryNames = borderCountries.map(b => b.name.common);
            const borderText = borderCountryNames.join(', ');
            const textLines = pdf.splitTextToSize(borderText, pdfWidth - 40);
            pdf.text(textLines, 20, yOffset);
            yOffset += textLines.length * 7 + 10; // Adjust line height
          }

          // Add Footer
          pdf.setFontSize(10);
          pdf.setTextColor(113, 128, 144); // #718096
          pdf.text(`Generated on ${new Date().toLocaleString()}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 15, { align: 'center' });
          pdf.text('Data source: REST Countries API', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

          if (country.maps?.googleMaps) {
             pdf.setTextColor(66, 153, 225); // #4299e1
             pdf.textWithLink('View on Google Maps', pdfWidth / 2, pdf.internal.pageSize.getHeight() - 5, { url: country.maps.googleMaps, align: 'center' });
          }

          // Save the PDF
          pdf.save(`${country.name.common.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Fetch country details and border countries
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then((data) => {
        const found = data[0];
        if (found) {
          setCountry(found);
          setError(false);

          // Fetch border countries if exist
          if (found.borders?.length) {
            fetch(
              `https://restcountries.com/v3.1/alpha?codes=${found.borders.join(",")}`
            )
              .then((res) => res.json())
              .then(setBorderCountries);
          }
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching country detail:", err);
        setError(true);
      });
  }, [code]);

  // Error state display
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-600 p-6">
        <h1 className="text-3xl font-bold">Country Not Found</h1>
        <p className="text-gray-600 mt-2">
          Something went wrong.{" "}
          <Link to="/" className="text-blue-600 underline">
            Go back home
          </Link>
        </p>
      </div>
    );
  }

  // Loading state display
  if (!country) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mr-4"></div>
        Loading country details...
      </div>
    );
  }

  // Destructure country data
  const {
    name,
    flags,
    capital,
    region,
    subregion,
    population,
    area,
    languages,
    timezones,
    currencies,
    maps,
  } = country;

  // Format language and currency lists
  const languageList = languages ? Object.values(languages).join(", ") : "N/A";
  const currencyList = currencies
    ? Object.values(currencies)
        .map((cur) => `${cur.name} (${cur.symbol})`)
        .join(", ")
    : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 px-6 py-10 sm:px-10"
    >
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center text-blue-600 font-medium mb-4 hover:underline"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>

          {/* Flag */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-md w-full max-w-xl border border-blue-100">
              <div className="overflow-hidden rounded-md relative">
                <img
                  src={flags?.svg || flags?.png}
                  alt={`${name.common} flag`}
                  className="w-full h-[240px] object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleDownloadFlag}
                    className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                    title="Download Flag"
                  >
                    <FiDownload className="text-lg" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm mt-2 italic">
                Official flag of {name.common}
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {name.common}
          </h2>
          <p className="text-gray-500 mb-6 italic">{name.official}</p>

          {/* Country information cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoCard label="Capital" value={capital?.[0] || "N/A"} />
            <InfoCard label="Region" value={region} />
            <InfoCard label="Subregion" value={subregion || "N/A"} />
            <InfoCard label="Population" value={population.toLocaleString()} />
            <InfoCard label="Area" value={`${area.toLocaleString()} km²`} />
            <InfoCard label="Languages" value={languageList} />
            <InfoCard label="Timezones" value={timezones?.join(", ")} />
            <InfoCard label="Currencies" value={currencyList} />
          </div>

          {/* Border Countries */}
          {borderCountries.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-2">Border Countries:</h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((b) => (
                  <Link
                    key={b.cca3}
                    to={`/country/${b.cca3}`}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    {b.name.common}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps link and Report button */}
          <div className="mt-10 text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-y-4 sm:gap-x-4">
              <a
                href={maps?.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                🌐 View on Google Maps
              </a>
              <button
                onClick={generateReport}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
              >
                <FiFileText className="text-lg" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryDetail;
