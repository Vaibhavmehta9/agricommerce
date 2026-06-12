import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowRight, FiStar, FiTruck, FiShield, FiAward, FiUsers,
  FiChevronLeft, FiChevronRight, FiSend, FiShoppingBag,
} from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import ProductCard from '../../components/common/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useMode } from '../../context/ModeContext'
import { getHomepage } from '../../api/homepageAPI'
import { getCategories } from '../../api/categoriesAPI'
import { getProducts } from '../../api/productsAPI'
import { getImageUrl } from '../../utils/formatPrice'

// Fallback data for when API isn't connected
const FALLBACK_HERO = {
  title: 'Farm Fresh Straight to Your Door',
  subtitle: 'Premium quality agricultural products sourced directly from trusted farmers. Fresh, organic, sustainable.',
  image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=80',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  secondaryCtaText: 'Request Bulk Quote',
  secondaryCtaLink: '/enquiry',
}

const FALLBACK_WHY_CHOOSE = [
  { icon: 'FiTruck', title: 'Farm to Doorstep', description: 'Direct from farms with minimal handling. Freshness guaranteed on every order.' },
  { icon: 'FiShield', title: 'Quality Assured', description: 'All products go through rigorous quality checks before reaching you.' },
  { icon: 'FiAward', title: 'Certified Organic', description: 'Wide range of organically grown products with certifications.' },
  { icon: 'FiUsers', title: 'Trusted Network', description: 'Over 500+ verified farmers and suppliers in our network.' },
]

const FALLBACK_TESTIMONIALS = [
  { name: 'Ramesh Patel', role: 'Restaurant Owner, Mumbai', quote: 'AgriCommerce transformed our supply chain. Fresh produce at wholesale rates with zero hassle.', rating: 5 },
  { name: 'Priya Sharma', role: 'Home Cook, Pune', quote: 'I love the quality of vegetables here. Noticeably fresher than the local market!', rating: 5 },
  { name: 'Arjun Industries', role: 'Food Processing Unit, Delhi', quote: 'Bulk ordering is seamless. Their B2B team is responsive and always delivers on time.', rating: 5 },
]

const ICON_MAP = { FiTruck, FiShield, FiAward, FiUsers }

function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

function HeroSection({ hero, isB2B }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(hero?.image) || FALLBACK_HERO.image}
          alt="Hero"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = FALLBACK_HERO.image }}
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-green-800/70 to-amber-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Mode badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6 text-white text-sm font-medium animate-fade-in">
          <span className={`w-2 h-2 rounded-full ${isB2B ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
          {isB2B ? 'Wholesale Mode — Best prices for bulk orders' : 'Retail Mode — Farm fresh for your family'}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          {hero?.title || FALLBACK_HERO.title}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up font-light">
          {hero?.subtitle || FALLBACK_HERO.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link
            to={isB2B ? (hero?.secondaryCtaLink || FALLBACK_HERO.secondaryCtaLink) : (hero?.ctaLink || FALLBACK_HERO.ctaLink)}
            className="group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
          >
            {isB2B ? <FiSend className="w-5 h-5" /> : <FiShoppingBag className="w-5 h-5" />}
            {isB2B ? (hero?.secondaryCtaText || 'Request Bulk Quote') : (hero?.ctaText || 'Shop Now')}
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={isB2B ? (hero?.ctaLink || FALLBACK_HERO.ctaLink) : (hero?.secondaryCtaLink || FALLBACK_HERO.secondaryCtaLink)}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-105 text-lg"
          >
            {isB2B ? 'Browse Products' : 'Bulk Orders'}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: '500+', label: 'Farmers' },
            { value: '1000+', label: 'Products' },
            { value: '50K+', label: 'Happy Customers' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">{value}</div>
              <div className="text-green-300 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  )
}

function HomePage() {
  const { isB2B } = useMode()
  const [homepageData, setHomepageData] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hpRes, catRes, prodRes] = await Promise.allSettled([
          getHomepage(),
          getCategories({ status: 'active', limit: 6 }),
          getProducts({ featured: true, limit: 6, status: 'active' }),
        ])

        if (hpRes.status === 'fulfilled') {
          const raw = hpRes.value.data?.data || hpRes.value.data
          setHomepageData(raw?.content ?? raw)
        }
        if (catRes.status === 'fulfilled') {
          const data = catRes.value.data?.data || catRes.value.data || []
          setCategories(Array.isArray(data) ? data : data.categories || [])
        }
        if (prodRes.status === 'fulfilled') {
          const data = prodRes.value.data?.data || prodRes.value.data || []
          setProducts(Array.isArray(data) ? data : data.products || [])
        }
      } catch (err) {
        console.error('Homepage fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const hero = homepageData?.hero || FALLBACK_HERO
  const whyChooseUs = homepageData?.whyChooseUs || FALLBACK_WHY_CHOOSE
  const testimonials = (homepageData?.testimonials || FALLBACK_TESTIMONIALS).map((t) => ({
    ...t,
    quote: t.quote || t.content,
  }))

  const prevTestimonial = () => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const nextTestimonial = () => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  return (
    <PageWrapper title="Farm Fresh Marketplace">
      <CustomerLayout>
        {/* Hero */}
        <HeroSection hero={hero} isB2B={isB2B} />

        {/* Featured Categories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of fresh agricultural products</p>

            {loading ? (
              <LoadingSpinner />
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat._id}`}
                    className="group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm text-center leading-tight">{cat.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {['Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy', 'Herbs'].map((cat, i) => (
                  <Link
                    key={cat}
                    to={`/products`}
                    className="group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-green-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center">
                      <span className="text-white font-bold text-lg text-center px-2">{cat}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                View All Products <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {(products.length > 0 || !loading) && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                {isB2B ? 'Premium bulk-order products from verified suppliers' : 'Handpicked fresh products just for you'}
              </p>

              {loading ? (
                <LoadingSpinner />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <FiShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Products coming soon. Check back later!</p>
                </div>
              )}

              <div className="text-center mt-10">
                <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
                  Browse All Products <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Why Choose AgriCommerce?</h2>
            <p className="section-subtitle">We stand for quality, trust, and sustainability in every transaction</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => {
                const Icon = ICON_MAP[item.icon] || FiStar
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100 text-center group"
                  >
                    <div className="w-14 h-14 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Icon className="w-7 h-7 text-green-700" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-green-800 via-green-700 to-green-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              {isB2B ? 'Ready to Scale Your Business?' : 'Start Shopping Fresh Today!'}
            </h2>
            <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
              {isB2B
                ? 'Get exclusive wholesale pricing, dedicated account manager, and reliable bulk supply for your business.'
                : 'Join thousands of happy customers enjoying farm-fresh produce delivered right to their homes.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isB2B ? '/enquiry' : '/products'}
                className="group flex items-center justify-center gap-2 bg-white text-green-800 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:bg-green-50 transition-all hover:scale-105 text-lg"
              >
                {isB2B ? <FiSend className="w-5 h-5" /> : <FiShoppingBag className="w-5 h-5" />}
                {isB2B ? 'Request Bulk Quote' : 'Shop Now'}
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Trusted by thousands across India</p>

            {/* Testimonial carousel */}
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 sm:p-12 border border-green-100 shadow-lg">
                <div className="text-6xl text-green-300 font-serif leading-none mb-4">"</div>
                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-6 italic">
                  {testimonials[testimonialIndex]?.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[testimonialIndex]?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{testimonials[testimonialIndex]?.name}</p>
                    <p className="text-gray-500 text-sm">{testimonials[testimonialIndex]?.role}</p>
                    <StarRating rating={testimonials[testimonialIndex]?.rating || 5} />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === testimonialIndex ? 'bg-green-600 w-6' : 'bg-green-200 w-2'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default HomePage
