import React, { useState } from 'react';
import { Mail, Linkedin, Phone, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { ContactTile } from '../../components/ContactTile/ContactTile';
import { personalData } from '../../data/personal';
import './ContactSection.css';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    purpose: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Client-Side Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Aligns with backend cors configuration
        body: JSON.stringify(formData),
      });

      // Safely check if the response is valid JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid non-JSON response.');
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        // Reset form fields
        setFormData({
          name: '',
          email: '',
          organization: '',
          purpose: 'General Inquiry',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      
      // Informative user feedback based on the error type
      if (error.message === 'Server returned an invalid non-JSON response.') {
        setErrorMessage('The server encountered an error processing this request. Please try again later.');
      } else {
        setErrorMessage('Could not connect to the backend server. Please make sure the backend is running.');
      }
    }
  };

  return (
    <section id="contact" className="section container" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <SectionHeading num="06" title="Get In Touch" />

      <div className="contact-grid">
        {/* Left Column: Quote, Info, & Quick Actions */}
        <div className="contact-left">
          <blockquote className="contact-statement">
            "Open to roles in Physical AI, Digital Twin Engineering, and Robotic Simulation."
          </blockquote>
          
          <p className="caption-text" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Currently based in Gurgaon, Haryana. Available for hybrid and remote roles globally. Let's discuss potential integrations.
          </p>
          
          <div className="hero-status-row" style={{ marginTop: '8px', marginBottom: '24px', alignSelf: 'flex-start' }}>
            <span className="status-blip pulse-dot" />
            <span className="mono-text" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          <div className="quick-contact-tiles">
            <ContactTile
              type="email"
              iconName="Mail"
              label="Email Address"
              value={personalData.email}
            />
            <ContactTile
              type="link"
              iconName="Linkedin"
              label="LinkedIn Network"
              value={`linkedin.com/in/${personalData.linkedin}`}
              href={personalData.linkedinUrl}
            />
            <ContactTile
              type="phone"
              iconName="Phone"
              label="Direct Line"
              value={personalData.phone}
              href={personalData.phoneLink}
            />
            
            <a 
              href={personalData.cvFile} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary cta-outlined"
              style={{ width: '100%', marginTop: '16px', display: 'inline-flex', justifyContent: 'center' }}
            >
              View Full CV Document
            </a>
          </div>
        </div>

        {/* Right Column: Professional Connection Portal */}
        <div className="contact-right">
          <div className="portal-container">
            <div className="portal-header">
              <span className="mono-text portal-label">ESTABLISH CONNECTION</span>
              <h3 className="portal-title">Inquiry & Collaboration Portal</h3>
            </div>

            {status === 'success' ? (
              <div className="portal-success-card">
                <CheckCircle className="success-icon" size={40} />
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '16px' }}>Transmission Confirmed</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', lineHeight: '1.5' }}>
                  Your connection request has been securely processed and stored in the database. A verification ping has been registered.
                </p>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setStatus('idle')}
                  style={{ marginTop: '20px', fontSize: '12px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="portal-form" onSubmit={handleSubmit}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name <span className="req-star">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="req-star">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@company.com"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="organization">Organization / Company</label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Tesla / EDAG"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purpose">Classification <span className="req-star">*</span></label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                    >
                      <option value="Recruitment">Recruitment / Role Inquiry</option>
                      <option value="Collaboration">Collaboration Proposal</option>
                      <option value="Consultation">Consultation Request</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message Description <span className="req-star">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Provide details on project scopes, specifications, or opportunities..."
                    required
                    disabled={status === 'submitting'}
                  />
                </div>

                {status === 'error' && (
                  <div className="form-status-alert error">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn" 
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader className="spinner" size={16} />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Transmit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Corporate Standard Footer */}
      <footer className="contact-footer">
        <span className="caption-text" style={{ color: 'var(--text-tertiary)' }}>
          © 2025 Mohit Malik · Built for Physical AI Roles
        </span>
        <span className="mono-text" style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
          ROHTAK, INDIA
        </span>
      </footer>
    </section>
  );
};

export default ContactSection;