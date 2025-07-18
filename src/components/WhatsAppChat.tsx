"use client";

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppChatProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppChat({ 
  phoneNumber = "6285739402436",
  message = "Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
}: WhatsAppChatProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 bottom-6 z-50 p-3 bg-[#25D366] hover:bg-[#20BD5C] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
    </a>
  );
} 