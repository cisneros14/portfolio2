"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Component } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ContactDialog } from "@/components/contact-dialog";

// Proyectos: generar datos traducibles usando las claves de i18n
const getProjectsData = (t: any) => [
  {
    title: t("projects_data.easyClosers.title"),
    subtitle: t("projects_data.easyClosers.subtitle"),
    href: "https://micky-next.vercel.app",
    image: "easyClosers.png",
  },
  {
    title: t("projects_data.holysin.title"),
    subtitle: t("projects_data.holysin.subtitle"),
    href: "https://github.com/cisneros14/portfolio2",
    image: "holySin.png",
  },
  {
    title: t("projects_data.dash_ecommerce.title"),
    subtitle: t("projects_data.dash_ecommerce.subtitle"),
    href: "https://cisnerosdash.vercel.app/",
    image: "dash.png",
  },
  {
    title: t("projects_data.cainec.title"),
    subtitle: t("projects_data.cainec.subtitle"),
    href: "https://palevioletred-gerbil-452167.hostingersite.com/",
    image: "cainec.png",
  },
];

function ProjectCard({
  title,
  subtitle,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  image?: string;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full"
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="overflow-hidden h-full bg-background border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md py-0">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image.startsWith("/") ? image : `/${image}`}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Component className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {subtitle}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ProjectsSection({
  t,
  itemVariants,
}: {
  t: any;
  itemVariants: any;
}) {
  return (
    <div id="projects" className="scroll-mt-24">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground mb-5 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {t("projects_badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("latest_projects")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t("latest_projects_desc")}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {getProjectsData(t).map((project) => (
              <CarouselItem
                key={project.title}
                className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full p-1">
                  <ProjectCard {...project} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </div>
        </Carousel>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex mt-12 sm:mt-16 lg:mt-20 flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12 lg:mb-16 px-4"
      >
        <ContactDialog
          triggerSize="lg"
          triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
        >
          {t("request_quote")}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </ContactDialog>
      </motion.div>
    </div>
  );
}
