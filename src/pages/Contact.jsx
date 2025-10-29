import { useState } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Clock, Globe, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Insert directly into Supabase inquiries table
      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            location: formData.location || null,
            company: formData.company || null,
            phone: formData.phone || null,
            message: formData.message,
            subject: 'Contact Form Submission',
            status: 'new'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          location: '',
          company: '',
          phone: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-4 max-w-7xl mr-auto ml-auto pt-3 pr-5 pl-5" aria-labelledby="contact-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-0 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em]">
                  Contact Us
                </p>
                <h1 id="contact-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  Get in Touch
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Ready to transform your business with SAP? Get in touch with our experts to discuss your project and discover how we can help you achieve your goals.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+31622098973"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Call Us Now
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                  <a
                    href="mailto:info@asmitechconsulting.com"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Send Email
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Contact Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://i.pinimg.com/736x/36/32/3b/36323bfae96be417b2a51a5195aea37f.jpg"
                  alt="Contact us for SAP consulting"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="contact-form">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="contact-form" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            Send us a message
          </h2>
          <p className="mt-2 text-slate-700/80">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="your.email@company.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="Your city, country"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="Your company name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="+31 (0)30 123 4567"
                />
              </div>
              <div>
                {/* Empty div for grid balance */}
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Tell us about your project and how we can help..."
              />
            </div>
            
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-none">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-none">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition px-6 py-3 rounded-none font-bold"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-none h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="office-locations">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="office-locations" className="text-3xl md:text-4xl tracking-tight font-bold text-white">
            Visit Us at Our Offices
          </h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Netherlands Office */}
            <div className="flex flex-col">
              <div className="bg-blue-50 p-6 mb-4 rounded-none">
                <h3 className="text-lg font-medium text-slate-700 mb-4">Head Office – Netherlands</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700/80">
                        Asmi Technology Consulting B.V<br />
                        #10, Boudewijn Buchstraat<br />
                        3544HJ Utrecht<br />
                        ​​
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700/80">
                        +31-622098973
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Google Map for Netherlands */}
              <div className="overflow-hidden flex-1 rounded-none">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.123456789!2d5.1234567!3d52.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDA3JzI0LjQiTiA1wrAwNyc0NC4yIkU!5e0!3m2!1sen!2snl!4v1234567890123!5m2!1sen!2snl"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Asmi Technology Consulting B.V - Utrecht, Netherlands"
                  className="w-full h-[300px]"
                ></iframe>
              </div>
            </div>

            {/* India Office */}
            <div className="flex flex-col">
              <div className="bg-blue-50 p-6 mb-4 rounded-none">
                <h3 className="text-lg font-medium text-slate-700 mb-4">India Office</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700/80">
                        Asmi Technology Consulting Pvt. Ltd.<br />
                        #136, Meenakshi Layout,<br />
                        Kalena Agrahara, Bannerghatta Main Road,<br />
                        Bengaluru - 560076
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700/80">
                        +91 98862 00035
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Google Map for India */}
              <div className="overflow-hidden flex-1 rounded-none">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789!2d77.1234567!3d12.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA3JzI0LjQiTiA3N8KwMDcnMjQuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Asmi Technology Consulting Pvt. Ltd. - Bengaluru, India"
                  className="w-full h-[300px]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to transform your business with SAP?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Let's discuss how our SAP expertise can help you achieve your business goals and drive sustainable growth.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+31622098973"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Call Us Now
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:info@asmitechconsulting.com"
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition px-6 py-3 rounded-none font-bold"
                >
                  Send an Email
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
