"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { usePublicSettings } from '@/hooks/useSettings';
import Logo from './Logo';
import Button from './Button';
import Heading from './Heading';
import Text from './Text';
import LanguageSwitcher from './LanguageSwitcher';
import Blog from './Blog';
import CTA from './CTA';
import Team from './Team';
import Navbar from './Navbar';
import Script from 'next/script';
import { generateWebsiteSchema, generateLocalBusinessSchema } from '@/lib/jsonld';

export default function Home() {
  const { t, language } = useLanguage();
  const { settings: publicSettings, loading: settingsLoading } = usePublicSettings();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode based on user preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage
      const savedMode = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

      setIsDarkMode(shouldEnableDarkMode);

      // Apply dark mode class if needed
      if (shouldEnableDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save preference to localStorage
      localStorage.setItem('darkMode', newMode ? 'true' : 'false');

      return newMode;
    });
  };

  // Generate JSON-LD schema for the website
  const websiteSchema = generateWebsiteSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
      contactType: 'customer service',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
    sameAs: [
      publicSettings?.socialLinks?.facebook,
      publicSettings?.socialLinks?.twitter,
      publicSettings?.socialLinks?.instagram,
      publicSettings?.socialLinks?.linkedin,
    ].filter(Boolean) as string[],
  });

  // Generate local business schema
  const localBusinessSchema = generateLocalBusinessSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
  });

  return (
    <>
      {/* Add structured data for SEO */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Use Navbar component instead of hardcoded header */}
        <Navbar activeTab="home" showDropdown={true} />

        {/* Rest of your component content... */}
        {/* Blog Section */}
        <Blog />

        {/* Team Section */}
        <Team />

        {/* CTA Section */}
        <CTA />

        {/* Tech Stack Section */}
        <section className="py-20 bg-gray-900 dark:bg-gray-950 text-white">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold mb-4">Stack teknologi modern untuk performa maksimal</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {/* Next.js */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <mask id="mask0_408_139" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                                    <circle cx="90" cy="90" r="90" fill="black" />
                                </mask>
                                <g mask="url(#mask0_408_139)">
                                    <circle cx="90" cy="90" r="87" fill="black" stroke="white" strokeWidth="6" />
                                    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_139)" />
                                    <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_139)" />
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_408_139" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" />
                                        <stop offset="1" stopColor="white" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_408_139" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" />
                                        <stop offset="1" stopColor="white" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">Next.js</h3>
                        <p className="text-xs text-gray-400 mt-1">Framework React</p>
                    </div>

                    {/* TypeScript */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path d="M0 200V0H400V400H0" fill="#007ACC"/>
                                <path d="M87.7008 200.696V217.492H122.593V324.169H166.573V217.492H201.465V200.995C201.465 191.897 201.315 184.199 201.015 184.199C200.865 184.199 183.609 184.349 162.874 184.648L125.033 185.247L87.7008 200.696Z" fill="white"/>
                                <path d="M321.631 183.9C332.328 186.339 340.826 191.068 348.275 198.367C352.273 202.365 357.902 209.514 358.501 211.653C358.651 212.252 343.694 222.35 334.597 228.249C334.147 228.549 332.458 226.71 330.619 223.811C324.87 215.013 318.971 211.504 309.574 210.755C296.179 209.705 287.082 217.304 287.082 230.388C287.082 234.836 287.831 237.575 289.52 240.773C292.869 246.972 298.618 250.82 313.125 257.07C340.376 268.816 354.072 276.714 362.419 287.711C371.816 300.057 374.115 319.901 368.516 336.558C362.319 354.613 345.063 366.958 319.611 371.557C311.714 372.906 292.419 372.607 283.922 371.107C266.666 368.068 250.959 359.571 241.562 347.975C237.564 343.228 230.115 332.082 230.564 331.033L233.613 329.034L245.709 322.035L254.806 316.736L257.405 320.435C261.104 325.933 269.601 332.831 275.35 335.57C290.907 342.269 311.264 341.22 321.961 333.322C326.859 329.474 329.458 324.894 329.458 318.446C329.458 312.447 328.409 309.408 324.71 305.41C320.112 300.507 310.564 295.927 290.27 287.281C267.276 277.633 257.105 271.184 247.858 261.087C242.559 255.188 237.71 246.092 235.561 238.195C233.762 231.597 233.163 216.062 234.512 209.315C238.81 187.898 254.507 173.762 277.8 169.164C285.847 167.665 313.575 168.115 321.631 183.9Z" fill="white"/>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">TypeScript</h3>
                        <p className="text-xs text-gray-400 mt-1">JavaScript dengan Type-Safe</p>
                    </div>

                    {/* MySQL */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                                <path fill="#00758F" d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z"/>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">MySQL</h3>
                        <p className="text-xs text-gray-400 mt-1">Database Handal</p>
                    </div>

                    {/* Node.js */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-full h-full">
                                <path fill="#539E43" d="M224 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6.4l47.4 28.1c1.7 1 4.1 1 5.7 0l184.7-106.6c1.7-1 2.8-3 2.8-5V149.3c0-2.1-1.1-4-2.9-5.1L226.8 37.7c-1.7-1-4-1-5.7 0L36.6 144.3c-1.8 1-2.9 3-2.9 5.1v213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7V167.5c0-3 2.4-5.3 5.4-5.3h23.4c2.9 0 5.4 2.3 5.4 5.3V378c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6l-48.4-27.9C8.1 389.2.7 376.3.7 362.4V149.3c0-13.8 7.4-26.8 19.4-33.7L204.6 9c11.7-6.6 27.2-6.6 38.8 0l184.7 106.7c12 6.9 19.4 19.8 19.4 33.7v213.1c0 13.8-7.4 26.7-19.4 33.7L243.4 502.8c-5.9 3.4-12.6 5.2-19.4 5.2zm149.1-210.1c0-39.9-27-50.5-83.7-58-57.4-7.6-63.2-11.5-63.2-24.9 0-11.1 4.9-25.9 47.4-25.9 37.9 0 51.9 8.2 57.7 33.8.5 2.4 2.7 4.2 5.2 4.2h24c1.5 0 2.9-.6 3.9-1.7s1.5-2.6 1.4-4.1c-3.7-44.1-33-64.6-92.2-64.6-52.7 0-84.1 22.2-84.1 59.5 0 40.4 31.3 51.6 81.8 56.6 60.5 5.9 65.2 14.8 65.2 26.7 0 20.6-16.6 29.4-55.5 29.4-48.9 0-59.6-12.3-63.2-36.6-.4-2.6-2.6-4.5-5.3-4.5h-23.9c-3 0-5.3 2.4-5.3 5.3 0 31.1 16.9 68.2 97.8 68.2 58.4-.1 92-23.2 92-63.4z"/>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">Node.js</h3>
                        <p className="text-xs text-gray-400 mt-1">Runtime Server</p>
                    </div>

                    {/* Laravel */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg viewBox="0 0 50 52" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path d="M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-21.483L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z" fill="#FF2D20" fillRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">Laravel</h3>
                        <p className="text-xs text-gray-400 mt-1">Framework PHP</p>
                    </div>

                    {/* Vue.js */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <div className="w-12 h-12 mb-4">
                            <svg viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41b883"/>
                                <path d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495e"/>
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium">Vue.js</h3>
                        <p className="text-xs text-gray-400 mt-1">Framework Progresif</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer Section */}
        {/* Footer will be handled by ClientLayout */}

        {/* Floating Dark Mode Toggle Button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={toggleDarkMode}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group dark-mode-button"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              // Sun icon for light mode
              <svg
                className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
