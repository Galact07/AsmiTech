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
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="contact-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                  Contact Us
                </p>
                <h1 id="contact-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  Get in Touch
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Ready to transform your business with SAP? Get in touch with our experts to discuss your project and discover how we can help you achieve your goals.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+31622098973"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3 focus:outline-none"
                  >
                    Call Us Now
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                  <a
                    href="mailto:info@asmitechconsulting.com"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
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
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-2xl pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="contact-form">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="contact-form" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Tell us about your project and how we can help..."
              />
            </div>
            
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition px-6 py-3 rounded-lg font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="office-locations" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Visit Us at Our Offices
          </h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Netherlands Office */}
            <div className="flex flex-col">
              <div className="rounded-xl border border-slate-200 bg-white p-6 mb-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Head Office – Netherlands</h3>
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
                </div>
              </div>
              {/* Google Map for Netherlands */}
              <div className="rounded-xl overflow-hidden border border-slate-200 flex-1">
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
              <div className="rounded-xl border border-slate-200 bg-white p-6 mb-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Branch Office – India</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700/80">
                        Asmi Technology Consulting Private Limited<br />
                        #136, Meenakshi Layout, Kalena Agrahara<br />
                        Bannerghatta Main Road, Bengaluru<br />
                        PIN – 560076
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Google Map for India */}
              <div className="rounded-xl overflow-hidden border border-slate-200 flex-1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789!2d77.1234567!3d12.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA3JzI0LjQiTiA3N8KwMDcnMjQuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Asmi Technology Consulting Private Limited - Bengaluru, India"
                  className="w-full h-[300px]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="direct-contact">
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="text-center mb-8">
            <h2 id="direct-contact" className="text-xl md:text-2xl tracking-tight font-light text-slate-900 mb-3">
              Prefer to reach us directly?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get in touch with us instantly through phone or email. We're here to help with your SAP consulting needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone Contact */}
            <div className="group">
              <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Call Us</h3>
                <p className="text-slate-600 mb-6">Speak directly with our SAP experts</p>
                <div className="space-y-3">
                  <div className="group/phone flex items-center justify-center gap-3">
                    <a 
                      href="tel:+31622098973" 
                      className="flex items-center gap-2 text-lg font-medium text-slate-900 hover:text-primary transition-colors duration-200 group-hover/phone:scale-105"
                    >
                      <span>+31-622098973</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                    <p className="text-sm text-slate-500">Netherlands</p>
                  </div>
                  <div className="group/phone flex items-center justify-center gap-3">
                    <a 
                      href="tel:+310613347042" 
                      className="flex items-center gap-2 text-lg font-medium text-slate-900 hover:text-primary transition-colors duration-200 group-hover/phone:scale-105"
                    >
                      <span>+31-0613347042</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                    <p className="text-sm text-slate-500">Netherlands</p>
                  </div>
                  <div className="group/phone flex items-center justify-center gap-3">
                    <a 
                      href="tel:+918746034970" 
                      className="flex items-center gap-2 text-lg font-medium text-slate-900 hover:text-primary transition-colors duration-200 group-hover/phone:scale-105"
                    >
                      <span>+91-8746034970</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                    <p className="text-sm text-slate-500">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Contact */}
            <div className="group">
              <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Email Us</h3>
                <p className="text-slate-600 mb-6">Send us your project details</p>
                <div className="group/email flex items-center justify-center gap-3">
                  <a 
                    href="mailto:info@asmitechconsulting.com" 
                    className="flex items-center gap-2 text-lg font-medium text-slate-900 hover:text-primary transition-colors duration-200 group-hover/email:scale-105 break-all"
                  >
                    <span>info@asmitechconsulting.com</span>
                    <ArrowUpRight className="h-4 w-4 opacity-60" />
                  </a>
                  <p className="text-sm text-slate-500 mt-2">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Options */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-white/50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 text-center mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Business Hours</h4>
                    <p className="text-sm text-slate-600">Monday - Friday</p>
                    <p className="text-sm text-slate-600">9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <Globe className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Time Zones</h4>
                    <p className="text-sm text-slate-600">CET (UTC+1)</p>
                    <p className="text-sm text-slate-600 ">IST (UTC+5:30)</p>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Response Time</h4>
                    <p className="text-sm text-slate-600">Email inquiries</p>
                    <p className="text-sm text-slate-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-2xl bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="cta" className="text-2xl md:text-3xl font-light tracking-tight">
            Ready to transform your business?
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Let's discuss your SAP transformation goals and create a roadmap for success.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-slate-50 transition px-6 py-3 rounded-full font-medium"
            >
              Request a Consultation
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:info@asmitechconsulting.com"
              className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 transition px-6 py-3 rounded-full font-medium"
            >
              Send an Email
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
