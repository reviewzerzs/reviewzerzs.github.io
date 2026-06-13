'use client';

import { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const faqs = [
    {
      question: 'What is ReviewZerZ?',
      answer: 'ReviewZerZ is a comprehensive platform for discovering and sharing honest reviews about products, services, and experiences.',
    },
    {
      question: 'How do I submit a review?',
      answer: 'Simply sign up, browse our categories, and click the "Write a Review" button on any product or service page.',
    },
    {
      question: 'Is ReviewZerZ free to use?',
      answer: 'Yes, ReviewZerZ is completely free to browse and submit reviews. No subscriptions required.',
    },
    {
      question: 'How long does it take for my review to be published?',
      answer: 'Most reviews are published within 24 hours after passing our moderation process.',
    },
    {
      question: 'Can I edit or delete my review?',
      answer: 'Yes, you can edit or delete your reviews at any time from your account dashboard.',
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'Use the "Report" button on any review or contact our support team with details about the content.',
    },
  ];

  const socialLinks = [
    { name: 'Facebook', url: '#', icon: 'f' },
    { name: 'Twitter', url: '#', icon: '𝕏' },
    { name: 'Instagram', url: '#', icon: 'ig' },
    { name: 'LinkedIn', url: '#', icon: 'in' },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section className="container-custom section-padding" style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#333333', marginBottom: '16px' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d', maxWidth: '600px', margin: '0 auto' }}>
          Have questions or feedback? We'd love to hear from you. Get in touch with our team today.
        </p>
      </section>

      {/* Contact Form & Info Section */}
      <section className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto items-start">
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333333', marginBottom: '24px' }}>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '6px' }}>
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  style={{ borderColor: '#dee2e6', padding: '10px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '6px' }}>
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  style={{ borderColor: '#dee2e6', padding: '10px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '6px' }}>
                  Subject
                </label>
                <Select value={formData.subject} onValueChange={handleSubjectChange}>
                  <SelectTrigger style={{ borderColor: '#dee2e6', padding: '10px' }}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333333', marginBottom: '6px' }}>
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  rows={6}
                  style={{ borderColor: '#dee2e6', padding: '10px', fontFamily: 'inherit' }}
                />
              </div>

              <Button
                type="submit"
                style={{
                  backgroundColor: '#007BFF',
                  color: '#ffffff',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information — email only */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333333', marginBottom: '24px' }}>
              Get in Touch
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#e7f1ff', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color="#007BFF" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '4px' }}>
                  Email
                </h3>
                <p style={{ fontSize: '14px', color: '#6c757d' }}>
                  support@reviewzerz.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-custom section-padding" style={{ backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#333333', marginBottom: '12px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '16px', color: '#6c757d', textAlign: 'center', marginBottom: '40px' }}>
            Find answers to common questions about ReviewZerZ
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <MessageSquare size={20} color="#007BFF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333333', margin: 0 }}>
                    {faq.question}
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#6c757d', margin: 0, marginLeft: '32px' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="container-custom section-padding">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333333', marginBottom: '24px' }}>
            Follow Us on Social Media
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#007BFF',
                  color: '#ffffff',
                  borderRadius: '50%',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
