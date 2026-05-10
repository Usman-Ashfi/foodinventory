import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      
      {/* 1. Navbar & Hero Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-emerald-950">PantryPro</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How it Works</Link>
            <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Testimonials</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Log in</Link>
            <Link href="/signup" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Hero */}
        <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Now with AI Recipe Generation
          </div>
          <h1 className="max-w-4xl text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            Stop Wasting Food. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Start Saving Money.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            The ultimate food inventory tracker for your kitchen. Monitor expiry dates, generate smart shopping lists, and discover recipes based on what you already have in your pantry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="px-8 py-4 bg-emerald-600 text-white text-lg font-medium rounded-full hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Start Tracking for Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="#demo" className="px-8 py-4 bg-white text-slate-700 text-lg font-medium rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </Link>
          </div>
        </section>

        {/* Section 2: Features */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">Powerful Features</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need to run your food business</h3>
              <p className="text-lg text-slate-600">From stockroom to delivery, our comprehensive suite of tools keeps your operations organized, efficient, and profitable.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Dashboard</h4>
                <p className="text-slate-600 leading-relaxed">Get a comprehensive, real-time overview of your business operations and key metrics at a glance.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Food Inventory</h4>
                <p className="text-slate-600 leading-relaxed">Track stock levels, set alerts for low inventory, and manage all your food items efficiently.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Customer Management</h4>
                <p className="text-slate-600 leading-relaxed">Keep detailed records of your customers, their preferences, and order history to build better relationships.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Order Management</h4>
                <p className="text-slate-600 leading-relaxed">Manage incoming orders seamlessly. Update statuses from pending to completed, keeping everything organized.</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Delivery Tracking</h4>
                <p className="text-slate-600 leading-relaxed">Monitor deliveries with real-time status updates to keep both your team and customers informed every step of the way.</p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Reports</h4>
                <p className="text-slate-600 leading-relaxed">Generate detailed reports on sales, inventory, and activity to make data-driven decisions for your business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How it Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">Simple Process</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Inventory management in 3 easy steps</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 shadow-sm flex items-center justify-center text-2xl font-bold text-emerald-600 mb-6">1</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Scan & Stock</h4>
                <p className="text-slate-600">Bring home groceries and quickly scan them into your digital pantry using your phone.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 shadow-sm flex items-center justify-center text-2xl font-bold text-emerald-600 mb-6">2</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Track & Monitor</h4>
                <p className="text-slate-600">The app automatically organizes your food by expiration date and alerts you before it spoils.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-600 rounded-full border-4 border-emerald-100 shadow-md flex items-center justify-center text-2xl font-bold text-white mb-6">3</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Cook & Enjoy</h4>
                <p className="text-slate-600">Select recipes based on soon-to-expire ingredients, cook delicious meals, and log what you consumed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Testimonials */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">Loved by organized households</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Jenkins", role: "Mother of 3", quote: "This app paid for itself in the first week. I finally stopped throwing away moldy cheese and expired yogurt. The barcode scanner is magic." },
                { name: "David Chen", role: "Meal Prep Enthusiast", quote: "The recipe integration is what sold me. I open the app, it sees my spinach is going bad tomorrow, and gives me 5 spinach-based recipes. Brilliant." },
                { name: "Emily Rodriguez", role: "Budgeting Pro", quote: "I love the cost analytics. Seeing exactly how much money we were wasting was a wake-up call. Our grocery bills are down 20%." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                  <svg className="absolute top-6 left-6 w-8 h-8 text-slate-200" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-slate-700 italic relative z-10 pt-6 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-800">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{testimonial.name}</div>
                      <div className="text-slate-500 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Final CTA & Footer */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor"></circle>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)"></rect>
            </svg>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to take control of your kitchen?</h2>
            <p className="text-xl text-slate-300 mb-10">Join thousands of households saving money and reducing food waste every single day.</p>
            <Link href="/signup" className="inline-block px-8 py-4 bg-emerald-500 text-white text-lg font-bold rounded-full hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-emerald-500/30">
              Get Started for Free
            </Link>
            <p className="mt-4 text-sm text-slate-400">No credit card required. 14-day free trial on premium features.</p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-lg font-bold text-white">PantryPro</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} PantryPro Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
