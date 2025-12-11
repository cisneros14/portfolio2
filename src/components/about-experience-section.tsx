"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, ShoppingBag, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AboutExperienceSection({
  t,
  itemVariants,
}: {
  t: any;
  itemVariants: any;
}) {
  return (
    <div id="about" className="scroll-mt-24">
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
            {t("experience_badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("experience_projects")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t("experience_projects_desc")}
          </p>
        </motion.div>
      </div>
      <motion.div className="shadow-none">
        <div className="grid shadow-none grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          {/* About Me - Tall Card */}
          <Card
            id="about"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-6 col-span-12 row-span-2"
            )}
          >
            <div className="flex flex-col items-start justify-start h-full relative z-10">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold font-sans">
                    FM
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-card-foreground font-sans">
                    {t("about_me")}
                  </h2>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-sans">{t("about_me_location")}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm sm:text-base mb-3 sm:mb-4">
                {t("about_me_desc")}
              </p>
              <Image
                src="/beans.png"
                alt="Profile Picture"
                width={400}
                height={400}
                className="w-full max-w-[400px] mx-auto my-10 lg:my-auto rounded-lg object-cover self-start"
              />
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                {["HubSpot CMS", "JavaScript", "React", "Node.js"].map(
                  (tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/20 shadow-sm text-muted-foreground"
                    >
                      {tech}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </Card>

          {/* Experience - Medium Card */}
          <Card
            id="experience"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-3 lg:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.65rem] sm:text-xs font-bold font-sans">
                    TC
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base leading-snug">
                    {t("senior_fullstack")}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-0.5">
                    {t("senior_fullstack_company")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Status - Square Card */}
          <Card
            className={cn(
              "group relative p-5 sm:p-6 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-3 lg:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.65rem] sm:text-xs font-bold font-sans">
                    ST
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base leading-snug">
                    {t("fullstack")}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans mt-0.5">
                    {t("fullstack_company")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Projects - Large Card */}
          <Card
            id="selected-projects-card"
            className={cn(
              "group relative p-5 sm:p-6 lg:p-7 h-full bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
              "xl:col-span-6 col-span-12"
            )}
          >
            <div className="relative z-10">
              <h3 className="font-bold text-card-foreground mb-3 sm:mb-4 lg:mb-5 font-sans text-base sm:text-lg">
                {t("selected_projects")}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    title: t("ecommerce_platform"),
                    desc: t("ecommerce_platform_desc"),
                  },
                  {
                    title: t("task_management_app"),
                    desc: t("task_management_app_desc"),
                  },
                  { title: t("etica3"), desc: t("etica3Descrip") },
                ].map((project) => (
                  <div
                    key={project.title}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground font-sans text-sm sm:text-base mb-1">
                        {project.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center my-10 sm:my-12 lg:my-16 px-4"
      >
        <ContactDialog
          triggerSize="lg"
          triggerClassName="group bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
        >
          {t("request_quote")}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </ContactDialog>
        <Button
          asChild
          size="lg"
          className="group w-full sm:w-auto border border-primary bg-transparent hover:bg-primary/20 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl h-auto"
        >
          <a
            href="#projects"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("view_latest_project")}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
