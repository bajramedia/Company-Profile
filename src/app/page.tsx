"use client";

import Image from "next/image";
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog } from "@/components";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  return (
      <div className="min-h-screen bg-white"> {/* Removed font-poppins, will inherit from body */}
        <header className="fixed top-0 left-0 right-0 bg-[var(--navbar-background)] shadow-sm z-50 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-7">
              <nav className="flex space-x-6 md:space-x-8">
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.home')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.about')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px] relative group">
                    {t('nav.services')}
                    <span className="inline-block ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  </a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.portfolio')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="/blog" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.blog')}</a>
                </AnimatedText>
              </nav>
              <LanguageSwitcher className="mr-4 text-foreground" />
              <AnimatedText as="span">
                <Button variant="primary" size="sm" className="px-5 py-2 rounded-md font-medium">
                  {t('nav.contact')}
                </Button>
              </AnimatedText>
            </div>
            <div className="flex items-center space-x-4 md:hidden">
              <LanguageSwitcher className="text-foreground" />
              <button className="text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <section className="relative h-screen overflow-hidden pt-16 bg-white">
          <div className="absolute top-16 right-0 h-[calc(100%-4rem)] w-20 pointer-events-none z-10">
            <div className="h-full relative">
              <div className="absolute right-4 top-0 bottom-0">
                <div className="flex flex-col h-full justify-between py-8">
                  {Array(50).fill(0).map((_, i) => (
                      <div key={`edge-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-70"></div>
                  ))}
                </div>
              </div>

              <div className="absolute right-12 top-0 bottom-0">
                <div className="flex flex-col h-full justify-between py-20">
                  {Array(30).fill(0).map((_, i) => (
                      <div key={`col2-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary opacity-50"></div>
                  ))}
                </div>
              </div>

              <div className="absolute right-20 top-0 bottom-0 w-32">
                <div className="relative h-full">
                  {Array(20).fill(0).map((_, i) => (
                      <div
                          key={`random-${i}`}
                          className="absolute w-1.5 h-1.5 rounded-full bg-primary opacity-40"
                          style={{
                            top: `${Math.floor(Math.random() * 100)}%`,
                            right: `${Math.floor(Math.random() * 100)}%`
                          }}
                      ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[calc(25%+4rem)] right-12 opacity-90">
            <div className="grid grid-cols-3 gap-2">
              {Array(15).fill(0).map((_, i) => (
                  <div key={`top-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-60"></div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-1/3 right-16 opacity-80">
            <div className="grid grid-cols-4 gap-2">
              {Array(16).fill(0).map((_, i) => (
                  <div key={`bottom-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-50"></div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-1/6 h-1/3 opacity-70">
            <div className="grid grid-cols-6 h-full">
              {Array(50).fill(0).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20 m-2"></div>
              ))}
            </div>
          </div>

          <div className="h-full flex flex-col md:flex-row">
            <div className="md:w-3/5 h-full relative bg-white overflow-hidden hidden md:block">
              <div className="absolute inset-0">
                <div className="relative w-full h-full">
                  <Image
                      src="/images/team-meeting-alt.jpg"
                      alt={t('hero.imageAlt')}
                      fill
                      style={{objectFit: 'cover', objectPosition: 'center'}}
                      priority
                      className="rounded-br-[120px] shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60"></div>
                  <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
                </div>
              </div>

              <div className="absolute top-1/4 left-12 w-10 h-10">
                <div className="w-full h-full rounded-full border-4 border-dashed border-primary/20 animate-spin-slow"></div>
              </div>

              <div className="absolute bottom-[30%] right-[20%] w-8 h-8 opacity-60">
                <div className="w-full h-full rounded-full bg-primary/10"></div>
              </div>

              <div className="absolute bottom-8 left-10 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-md shadow-sm">
                <p className="text-[13px] font-medium text-foreground">{t('hero.professionalTeam')}</p>
              </div>
            </div>

            <div className="w-full md:w-2/5 flex items-center px-4 sm:px-6 md:px-10 lg:px-14 relative bg-white">
              <div className="absolute top-0 right-0 h-full w-8 hidden md:block pointer-events-none z-10">
                <div className="absolute right-2 top-0 bottom-0">
                  <div className="flex flex-col h-full justify-between py-6">
                    {Array(40).fill(0).map((_, i) => (
                        <div key={`content-edge-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-70"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="max-w-md mt-4">
                <AnimatedText as="div">
                  <Heading variant="h1" color="foreground" className="mb-4 text-[28px] md:text-[34px] lg:text-[40px] font-bold leading-tight">
                    {t('hero.title.part1')}
                    <span className="text-primary relative">
                    <span className="relative z-10"> {t('hero.title.highlight')}</span>
                    <span className="absolute bottom-0.5 left-0 w-full h-2.5 bg-primary/10 -z-0"></span>
                  </span>
                    {t('hero.title.part2')}
                  </Heading>
                </AnimatedText>

                <AnimatedText as="div">
                  <Text color="secondary" className="mb-8 text-[14px] tracking-wide">
                    {t('hero.subtitle')}
                  </Text>
                </AnimatedText>

                <AnimatedText as="div">
                  <div className="flex flex-wrap gap-4 mb-12">
                    <Button variant="primary" size="md" className="px-5 py-2.5 shadow-sm font-medium">
                      {t('hero.cta.consultation')}
                    </Button>
                    <Button variant="outline" size="md" className="px-5 py-2.5 border-primary text-primary hover:bg-primary/5 font-medium">
                      {t('hero.cta.portfolio')}
                    </Button>
                  </div>
                </AnimatedText>

                <div className="mt-4 inline-flex items-center text-xs text-secondary border border-gray-300 px-4 py-1.5 rounded-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 mr-2 group-hover:text-primary transition-colors animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="group-hover:text-primary/80 transition-colors">{t('hero.scrollText')}</span>
                </div>

                <div className="absolute bottom-10 right-12 hidden md:block">
                  <div className="grid grid-cols-4 gap-2">
                    {Array(12).fill(0).map((_, i) => (
                        <div key={`bottom-right-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-60"></div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-1/4 right-10 hidden md:block">
                  <div className="grid grid-cols-3 gap-2">
                    {Array(9).fill(0).map((_, i) => (
                        <div key={`right-side-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-70"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="mb-16 relative">
              <AnimatedText as="h2">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                  {t('services.mainTitle.line1')} <br/>
                  {t('services.mainTitle.line2')} <br/>
                  <span className="text-primary">{t('services.mainTitle.highlight')}</span>
                </h2>
              </AnimatedText>

              <div className="hidden md:block absolute -right-4 -bottom-4 opacity-70">
                <div className="grid grid-cols-3 gap-2">
                  {Array(6).fill(0).map((_, i) => (
                      <div key={`title-dot-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-30"></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-16 items-center">
              <AnimatedText as="div">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{t('services.website.title')}</h3>
                  <p className="text-secondary text-sm md:text-base leading-relaxed mb-6">
                    {t('services.website.description')}
                  </p>
                  <a href="#" className="text-primary font-medium inline-flex items-center hover:text-primary/80 transition-colors group">
                    <span className="text-xs md:text-sm font-medium tracking-wider">{t('services.website.readMore')}</span>
                    <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </AnimatedText>
              
              <div className="relative">
                <div className="bg-primary p-4 md:p-6 rounded-xl shadow-lg relative overflow-hidden max-w-[480px] mx-auto lg:mx-0 group transition-all duration-300 hover:shadow-xl">

                  <div className="relative z-10 flex items-end justify-center pt-3">
                    <div className="w-full relative">
                      <div className="bg-black/70 rounded-t-md overflow-hidden p-1 pb-0 shadow-md">
                        <div className="flex gap-1 mb-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <Image
                            src="/images/team-meeting-2.jpg"
                            alt={t('services.website.imageAlt')}
                            width={450}
                            height={270}
                            className="rounded-b-sm w-full"
                        />
                      </div>
                    </div>

                    <div className="absolute -left-4 -bottom-2 w-1/5">
                      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
                        <Image
                            src="/images/team-meeting-alt.jpg"
                            alt={t('services.website.mobileViewAlt')}
                            width={100}
                            height={200}
                            className="rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 items-center">
              <div className="relative"> {/* Card on the left */}
                <div className="bg-primary p-4 md:p-6 rounded-xl shadow-lg relative overflow-hidden max-w-[480px] mx-auto lg:mx-0 group transition-all duration-300 hover:shadow-xl">

                  <div className="relative z-10 flex items-end justify-center pt-4">
                    <div className="w-[45%] relative -mr-4 transform -rotate-3 transition-all duration-500 group-hover:-rotate-1 group-hover:scale-105">
                      <div className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
                        <Image
                            src="/images/team-meeting.jpg"
                            alt={t('services.mobile.image1Alt')}
                            width={180}
                            height={360}
                            className="rounded-md"
                        />
                      </div>
                    </div>

                    <div className="w-[45%] relative -ml-4 mt-6 transform rotate-3 transition-all duration-500 group-hover:rotate-1 group-hover:scale-105">
                      <div className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
                        <Image
                            src="/images/image 72.png"
                            alt={t('services.mobile.image2Alt')}
                            width={180}
                            height={360}
                            className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AnimatedText as="div"> {/* Text content on the right */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{t('services.mobile.title')}</h3>
                  <p className="text-secondary text-sm md:text-base leading-relaxed mb-6">
                    {t('services.mobile.description')}
                  </p>
                  <a href="#" className="text-primary font-medium inline-flex items-center hover:text-primary/80 transition-colors group">
                    <span className="text-xs md:text-sm font-medium tracking-wider">{t('services.mobile.readMore')}</span>
                    <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </AnimatedText>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-60 -z-0">
            <div className="grid grid-cols-4 gap-2">
              {Array(8).fill(0).map((_, i) => (
                  <div key={`service-right-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-40"></div>
              ))}
            </div>
          </div>

          <div className="absolute right-16 top-24 opacity-60 -z-0">
            <div className="grid grid-cols-3 gap-2">
              {Array(9).fill(0).map((_, i) => (
                  <div key={`service-top-right-${i}`} className="w-2.5 h-2.5 rounded-full bg-primary opacity-30"></div>
              ))}
            </div>
          </div>

          <div className="absolute left-16 bottom-24 opacity-60 -z-0">
            <div className="grid grid-cols-4 gap-2">
              {Array(8).fill(0).map((_, i) => (
                  <div key={`service-bottom-left-${i}`} className="w-2 h-2 rounded-full bg-primary opacity-30"></div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header - Tokopedia Style */}
            <div className="text-center mb-14">
              <AnimatedText as="div">
                <div className="inline-flex items-center justify-center bg-primary/10 px-3 py-1 rounded-full mb-3">
                  <span className="text-xs text-primary font-medium tracking-wider">{t('challenges.badge')}</span>
                </div>
              </AnimatedText>
              <AnimatedText as="h2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{t('challenges.title.main')} <span className="text-primary">{t('challenges.title.highlight')}</span></h2>
              </AnimatedText>
              <AnimatedText as="p">
                <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base">
                  {t('challenges.subtitle')}
                </p>
              </AnimatedText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left column - Info text */}
              <AnimatedText as="div">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-6">{t('challenges.indonesia.title')}</h3>
                  <p className="text-secondary text-sm md:text-base mb-8 leading-relaxed">
                    {t('challenges.indonesia.paragraph1')}
                  </p>
                  <p className="text-secondary text-sm md:text-base mb-10 leading-relaxed">
                    {t('challenges.indonesia.paragraph2')}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-primary text-2xl font-bold block mb-1">{t('challenges.stats.projects.value')}</span>
                      <span className="text-xs text-secondary">{t('challenges.stats.projects.label')}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-primary text-2xl font-bold block mb-1">{t('challenges.stats.experience.value')}</span>
                      <span className="text-xs text-secondary">{t('challenges.stats.experience.label')}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-primary text-2xl font-bold block mb-1">{t('challenges.stats.satisfaction.value')}</span>
                      <span className="text-xs text-secondary">{t('challenges.stats.satisfaction.label')}</span>
                    </div>
                  </div>
                </div>
              </AnimatedText>

              {/* Right column - Indonesia map with dots */}
              <div className="relative">
                <div className="relative w-full h-[450px] bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-slate-400"></div>
                  </div>

                  {/* Indonesia Map with dots (stylistic representation) */}
                  <div className="relative w-[90%] h-[80%] mx-auto">
                    {/* Interactive connection lines */}
                    <div className="absolute w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 800 500">
                        <circle cx="300" cy="210" r="2" className="text-primary fill-current opacity-70"></circle>
                        <circle cx="420" cy="170" r="2" className="text-primary fill-current opacity-70"></circle>
                        <circle cx="550" cy="180" r="2" className="text-primary fill-current opacity-70"></circle>
                        <line x1="300" y1="210" x2="420" y2="170" stroke="currentColor" className="text-primary/20 stroke-1"></line>
                        <line x1="420" y1="170" x2="550" y2="180" stroke="currentColor" className="text-primary/20 stroke-1"></line>
                      </svg>
                    </div>

                    {/* Sumatra */}
                    <div className="absolute top-[15%] left-[5%] w-[20%]">
                      <div className="grid grid-cols-8 gap-0.5">
                        {Array(96).fill(0).map((_, i) => (
                            <div key={`sumatra-${i}`} className={`w-1.5 h-1.5 rounded-full ${i % 5 === 0 ? 'bg-primary' : 'bg-primary/40'}`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Java */}
                    <div className="absolute top-[45%] left-[25%] w-[25%]">
                      <div className="grid grid-cols-10 gap-0.5">
                        {Array(70).fill(0).map((_, i) => (
                            <div key={`java-${i}`} className={`w-1.5 h-1.5 rounded-full ${i % 4 === 0 ? 'bg-primary' : 'bg-primary/40'}`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Kalimantan */}
                    <div className="absolute top-[25%] left-[30%] w-[20%]">
                      <div className="grid grid-cols-8 gap-0.5">
                        {Array(88).fill(0).map((_, i) => (
                            <div key={`kalimantan-${i}`} className={`w-1.5 h-1.5 rounded-full ${i % 6 === 0 ? 'bg-primary' : 'bg-primary/40'}`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Sulawesi */}
                    <div className="absolute top-[30%] left-[55%] w-[15%]">
                      <div className="grid grid-cols-5 gap-0.5">
                        {Array(50).fill(0).map((_, i) => (
                            <div key={`sulawesi-${i}`} className={`w-1.5 h-1.5 rounded-full ${i % 7 === 0 ? 'bg-primary' : 'bg-primary/40'}`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Papua */}
                    <div className="absolute top-[35%] left-[72%] w-[20%]">
                      <div className="grid grid-cols-8 gap-0.5">
                        {Array(64).fill(0).map((_, i) => (
                            <div key={`papua-${i}`} className={`w-1.5 h-1.5 rounded-full ${i % 8 === 0 ? 'bg-primary' : 'bg-primary/40'}`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Connections */}
                    <div className="absolute inset-0">
                      <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-primary rounded-full opacity-50 animate-pulse"></div>
                      <div className="absolute top-[45%] left-[40%] w-4 h-4 bg-primary rounded-full opacity-50 animate-pulse"></div>
                      <div className="absolute top-[35%] left-[60%] w-3 h-3 bg-primary rounded-full opacity-50 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Layered Cards */}
                  <div className="absolute bottom-6 right-6">
                    <div className="bg-white p-3 rounded-lg shadow-md border border-slate-100 w-48">
                      <h4 className="text-xs font-bold mb-1">{t('challenges.map.card1.title')}</h4>
                      <p className="text-xs text-secondary">{t('challenges.map.card1.text')}</p>
                    </div>
                  </div>

                  <div className="absolute top-6 left-6">
                    <div className="bg-white p-3 rounded-lg shadow-md border border-slate-100 w-48">
                      <h4 className="text-xs font-bold mb-1">{t('challenges.map.card2.title')}</h4>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t('challenges.map.card2.tag1')}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t('challenges.map.card2.tag2')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-md border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-3 mr-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{t('challenges.map.bottomCard.title')}</p>
                        <p className="text-xs text-secondary">{t('challenges.map.bottomCard.text')}</p>
                      </div>
                    </div>
                    <Button variant="primary" size="sm" className="px-3 py-1.5 text-xs">{t('challenges.map.bottomCard.cta')}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Enhanced Modern Design */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-20 bg-primary/[0.02] transform -skew-y-3"></div>
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-primary/[0.03] backdrop-blur-sm"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-primary/[0.03] backdrop-blur-sm"></div>
          
          {/* Animated dots */}
          <div className="absolute top-1/4 right-10 opacity-60">
            <div className="grid grid-cols-3 gap-2">
              {Array(6).fill(0).map((_, i) => (
                <div 
                  key={`contact-dots-top-${i}`} 
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ 
                    opacity: 0.2 + (i * 0.1),
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-1/4 left-10 opacity-60">
            <div className="grid grid-cols-3 gap-2">
              {Array(6).fill(0).map((_, i) => (
                <div 
                  key={`contact-dots-bottom-${i}`} 
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ 
                    opacity: 0.2 + (i * 0.1),
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center mb-14 relative">
              <AnimatedText as="div">
                <div className="inline-flex items-center justify-center bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                  <span className="text-xs text-primary font-medium tracking-wider uppercase">{t('contact.badge') || 'GET IN TOUCH'}</span>
                </div>
              </AnimatedText>
              <AnimatedText as="h2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                  {t('contact.header.main')} <span className="text-primary relative">
                    <span className="relative z-10">{t('contact.header.highlight')}</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-0"></span>
                  </span>
                </h2>
              </AnimatedText>
              <AnimatedText as="p">
                <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base">
                  {t('contact.subheader')}
                </p>
              </AnimatedText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <AnimatedText as="div">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="space-y-8 mb-10">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-5">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-2">{t('contact.address.title')}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{t('contact.address.text')}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-5">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-2">{t('contact.phone.title')}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{t('contact.phone.text')}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-5">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-2">{t('contact.email.title')}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{t('contact.email.text')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold mb-4">{t('contact.social.title')}</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group">
                        <svg className="w-5 h-5 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 3.5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h9zm0-1h-9a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-12a3 3 0 0 0-3-3z"/>
                          <path d="M9.5 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8.5 9h-.5v6h1.5v-6H8.5zM12 9h-1.5v6H12c1 0 1.5-1 1.5-2v-2c0-1-.5-2-1.5-2z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group">
                        <svg className="w-5 h-5 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group">
                        <svg className="w-5 h-5 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group">
                        <svg className="w-5 h-5 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedText>

              <AnimatedText as="div">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Background decorative elements */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                  <div className="absolute -top-10 -left-10 w-28 h-28 bg-primary/5 rounded-full"></div>
                  
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-6 inline-flex items-center">
                      {t("contact.title")}
                      <span className="ml-2 inline-flex items-center justify-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        24/7 {t("contact.support")}
                      </span>
                    </h3>
                    
                    <form className="relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1.5">{t("contact.name")}</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input 
                              type="text" 
                              id="name" 
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                              placeholder={t("contact.placeholderName")} 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1.5">{t("contact.email")}</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input 
                              type="email" 
                              id="email" 
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                              placeholder={t("contact.placeholderEmail")} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-5">
                        <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-1.5">{t("contact.subject")}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          <input 
                            type="text" 
                            id="subject" 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                            placeholder={t("contact.placeholderSubject")} 
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-secondary mb-1.5">{t("contact.message")}</label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <textarea 
                            id="message" 
                            rows={4} 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                            placeholder={t("contact.placeholderMessage")}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div>
                        <Button variant="primary" className="w-full py-3 font-medium text-sm relative group">
                          <span className="relative z-10 flex items-center justify-center">
                            <span>{t("contact.submit")}</span>
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </AnimatedText>
            </div>
          </div>
        </section>


           {/* Blog Section */}
        <Blog />
        
        {/* CTA Section */}
        <CTA />
        
        {/* Supported By Section - Now with wave connection */}
        <SupportedBy />
      

        {/* Footer Section - Modern Design */}
        <footer className="bg-gray-900 text-white relative overflow-hidden pt-16 pb-10">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
            
            {/* Dot pattern */}
            <div className="absolute top-10 right-10">
              <div className="grid grid-cols-6 gap-3">
                {Array(24).fill(0).map((_, i) => (
                  <div 
                    key={`footer-dots-${i}`} 
                    className="w-2 h-2 rounded-full bg-primary"
                    style={{ opacity: 0.1 + (Math.random() * 0.2) }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
              <div className="space-y-6">
                <Logo size="lg" variant="light" />
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  {t('footer.description') || 'Membangun teknologi yang menciptakan nilai untuk bisnis Anda. Solusi digital terintegrasi untuk pertumbuhan perusahaan.'}
                </p>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <a 
                      key={social} 
                      href="#" 
                      className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center transition-colors hover:bg-primary"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        {/* Simple icon path placeholder - replace with actual social media icons */}
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-lg mb-5">{t('footer.company') || 'Perusahaan'}</h3>
                <ul className="space-y-3">
                  {['about', 'careers', 'blog', 'partners'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white text-sm transition-colors flex items-center group"
                      >
                        <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 transition-all group-hover:bg-primary group-hover:w-2"></span>
                        {t(`footer.links.${item}`) || item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-lg mb-5">{t('footer.services') || 'Layanan'}</h3>
                <ul className="space-y-3">
                  {['webDevelopment', 'mobileDevelopment', 'uiDesign', 'consultation'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white text-sm transition-colors flex items-center group"
                      >
                        <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 transition-all group-hover:bg-primary group-hover:w-2"></span>
                        {t(`footer.services.${item}`) || item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-lg mb-5">{t('footer.newsletter') || 'Newsletter'}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t('footer.subscribeText') || 'Berlangganan untuk berita dan update terbaru.'}
                </p>
                <form className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder={t('footer.emailPlaceholder') || 'Email Anda'}
                      className="w-full bg-gray-800 text-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors"
                  >
                    {t('footer.subscribe') || 'Berlangganan'}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Bajramedia. {t('footer.rightsReserved') || 'Hak Cipta Dilindungi'}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
                  {t('footer.terms') || 'Syarat & Ketentuan'}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
                  {t('footer.privacy') || 'Kebijakan Privasi'}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
                  {t('footer.cookies') || 'Cookies'}
                </a>
              </div>
            </div>
          </div>
          
          {/* "Back to top" button */}
          <div className="absolute right-6 bottom-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
  );
}
