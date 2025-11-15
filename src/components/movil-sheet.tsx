"use client"

import React from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import { Package, Component, Github, Mail as MailIcon, Linkedin, Menu } from 'lucide-react'
import Link from 'next/link'

const data = [
  {
    title: 'Tecnologías',
    icon: (
      <Package className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#skills',
  },
  {
    title: 'Proyectos',
    icon: (
      <Component className='h-full w-full text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#projects',
  },
]

const socialData = [
  {
    icon: Github,
    href: 'https://github.com/cisneros14',
    label: 'GitHub',
  },
  {
    icon: MailIcon,
    href: 'mailto:cisnerosgranda14@gmail.com',
    label: 'Correo Electronico',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/carlos-cisneros-granda-059469230/',
    label: 'LinkedIn',
  },
]

export default function MovilSheet() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" className="border z-[1000] border-pink-700 fixed bottom-3 right-3 p-2 rounded-md bg-pink-900" aria-label="Abrir menú">
            <Menu className='h-5 w-5 !text-white' />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="pt-6">
          <SheetHeader>
            <SheetTitle>IR A</SheetTitle>
          </SheetHeader>
          <div className="divide-y">
            <div className="py-4">
              <ul className="flex flex-col gap-3 px-2">
                {data.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                      <span className="w-8 h-8 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-md">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="py-4">
              <div className="px-2 flex gap-3 justify-center">
                {socialData.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 rounded-lg bg-white/60 dark:bg-slate-800/60 flex items-center justify-center shadow-sm"
                    aria-label={s.label}
                  >
                    <s.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <SheetFooter>
            <div className="w-full flex justify-center">
              <Button variant="outline">Cerrar</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
