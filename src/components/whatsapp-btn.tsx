"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Phone, MessageSquare } from 'lucide-react'
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappBtn() {
  const phone = '+593939595776'
  const hrefWeb = `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9+]/g, '')}`
  const hrefMobile = `whatsapp://send?phone=${phone.replace(/[^0-9+]/g, '')}`

  // Prefer protocol for mobile, fallback to web
  const href = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? hrefMobile : hrefWeb

  return (
    <div className="md:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-14 border right-3 z-[1000]"
      >
        <Button variant="default" className="p-3 shadow-lg border-green-400 bg-green-500 rounded-md z-50">
          <FaWhatsapp className="h-5 w-5 text-white" />
        </Button>
      </a>
    </div>
  )
}
