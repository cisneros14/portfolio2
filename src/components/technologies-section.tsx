"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Code2,
  Server,
  Database,
  Zap,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Función para obtener datos de habilidades con traducciones
const getSkillsData = (t: any) => [
  {
    category: t("technologies_list.tec1"),
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
  },
  {
    category: t("technologies_list.tec2"),
    icon: Server,
    skills: ["Python", "PHP", "Node.js", "APIs"],
  },
  {
    category: t("technologies_list.tec3"),
    icon: Database,
    skills: ["WordPress", "Elementor", "WooCommerce", "Custom Themes"],
  },
  {
    category: t("technologies_list.tec4"),
    icon: ShoppingBag,
    skills: ["Shopify", "Hydrogen", "Oxygen"],
  },
  {
    category: t("technologies_list.tec5"),
    icon: Zap,
    skills: ["n8n", "Make", "Workflows"],
  },
  {
    category: t("technologies_list.tec6"),
    icon: Globe,
    skills: ["Mysql", "PostgreSQL"],
  },
];

type SkillType = {
  category: string;
  icon: any;
  skills: string[];
};

function SkillCard({
  skill,
  index,
  itemVariants,
}: {
  skill: SkillType;
  index: number;
  itemVariants: any;
}) {
  return (
    <motion.div variants={itemVariants} transition={{ delay: index * 0.1 }}>
      <Card
        className={cn(
          `group relative p-5 sm:p-6 lg:p-7 h-full bg-background border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`
        )}
      >
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div
            className={cn(
              "p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary shadow-sm"
            )}
          >
            <skill.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {skill.category}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skill.skills.map((tech) => (
            <Badge
              key={tech}
              variant="default"
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export function TechnologiesSection({
  t,
  itemVariants,
}: {
  t: any;
  itemVariants: any;
}) {
  return (
    <div id="tecnologias" className="scroll-mt-40">
      <motion.div variants={itemVariants} id="skills">
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
              {t("technologies_badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
              {t("technologies")}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              {t("technologies_desc")}
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
          {getSkillsData(t).map((skill, index) => (
            <SkillCard
              key={skill.category}
              skill={skill}
              index={index}
              itemVariants={itemVariants}
            />
          ))}
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
