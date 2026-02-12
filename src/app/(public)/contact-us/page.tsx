'use client';

import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        // Add toast or submission logic here
        alert('Thank you for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl text-gray-900 font-sans">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase tracking-wide border-b-2 border-transparent hover:border-black transition-all inline-block w-full">
                Contact US
            </h1>

            <div className="grid grid-cols-1  gap-12 lg:gap-20">
                {/* Contact Form Section */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 font-serif">Get in Touch</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 1234567890"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you?"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md font-semibold text-lg uppercase tracking-wider transition-colors duration-300">
                            Send Message
                        </Button>
                    </form>
                </div>

                {/* Contact Information Section */}
                <div className="flex flex-col justify-center space-y-10 pl-0 md:pl-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 font-serif">Customer Support</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Have a query? We are here to help! Reach out to us via email or phone, or simply fill out the form
                            and our team will get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <Mail />
                            <div>
                                <p className="font-semibold text-gray-900">Email Us</p>
                                <a href="mailto:support@malicc.com" className="text-gray-600 hover:text-black transition-colors">support@malicc.com</a>
                                <br />
                                <a href="mailto:grievance@malicc.com" className="text-gray-600 hover:text-black transition-colors">grievance@malicc.com</a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Phone />
                            <div>
                                <p className="font-semibold text-gray-900">Call Us</p>
                                <a href="tel:+918884443333" className="text-gray-600 hover:text-black transition-colors">+91 888 444 3333</a>
                                <p className="text-sm text-gray-500">(Mon - Fri, 10:00 AM - 6:00 PM)</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <MapPin />
                            <div>
                                <p className="font-semibold text-gray-900">Registered Office</p>
                                <p className="text-gray-600">No 1/1, 1st, 2nd, 3rd, 4th, 5th Floors,</p>
                                <p className="text-gray-600">St. Johns Church Road, Bharathinagar,</p>
                                <p className="text-gray-600">Fraser Town, India - 560005</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
