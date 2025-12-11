"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactDialog } from "@/components/contact-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";

const getMetricsHighlights = (t: any) => [
  {
    title: t("metrics.sales_increase"),
    value: t("metrics.sales_increase_value"),
    description: t("metrics.sales_increase_desc"),
    icon: TrendingUp,
  },
  {
    title: t("metrics.conversion_rate"),
    value: t("metrics.conversion_rate_value"),
    description: t("metrics.conversion_rate_desc"),
    icon: Target,
  },
  {
    title: t("metrics.average_roi"),
    value: t("metrics.average_roi_value"),
    description: t("metrics.average_roi_desc"),
    icon: Zap,
  },
  {
    title: t("metrics.satisfied_clients"),
    value: t("metrics.satisfied_clients_value"),
    description: t("metrics.satisfied_clients_desc"),
    icon: Sparkles,
  },
];

const SALES_GROWTH_DATA = [
  { month: "Ene", before: 15000, after: 28000 },
  { month: "Feb", before: 18000, after: 35000 },
  { month: "Mar", before: 16000, after: 42000 },
  { month: "Abr", before: 19000, after: 48000 },
  { month: "May", before: 17000, after: 55000 },
  { month: "Jun", before: 20000, after: 62000 },
];

const CONVERSION_RATE_DATA = [
  { month: "Ene", rate: 1.8 },
  { month: "Feb", rate: 2.4 },
  { month: "Mar", rate: 3.2 },
  { month: "Abr", rate: 4.1 },
  { month: "May", rate: 5.5 },
  { month: "Jun", rate: 6.8 },
];

const CLIENT_GROWTH_DATA = [
  { month: "Ene", clients: 45 },
  { month: "Feb", clients: 78 },
  { month: "Mar", clients: 125 },
  { month: "Abr", clients: 189 },
  { month: "May", clients: 267 },
  { month: "Jun", clients: 354 },
];

export function MetricsSection() {
  const t = useTranslations();
  const METRICS_HIGHLIGHTS = getMetricsHighlights(t);

  return (
    <div id="metricas" className="scroll-mt-24">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-background/80 backdrop-blur-sm border-secondary/20 shadow-sm text-muted-foreground mb-5 sm:mb-6"
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
            {t("metrics.badge")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5 lg:mb-6 px-4 leading-tight">
            {t("metrics.title_part1")}{" "}
            <span className="text-primary">{t("metrics.title_part2")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            {t("metrics.description")}
          </p>
        </motion.div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16">
        {METRICS_HIGHLIGHTS.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative p-5 sm:p-6 h-full bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="relative">
                <div
                  className={cn(
                    "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4"
                  )}
                >
                  <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1.5 sm:mb-2">
                  {metric.value}
                </div>
                <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  {metric.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Sales Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.sales_growth_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.sales_growth_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                before: {
                  label: "Antes",
                  color: "var(--chart-1)",
                },
                after: {
                  label: "Después",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_GROWTH_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="before"
                    stackId="1"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="after"
                    stackId="2"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Conversion Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.conversion_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.conversion_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                rate: {
                  label: t("metrics.conversion_rate"),
                  color: "var(--chart-3)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CONVERSION_RATE_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--chart-3)"
                    strokeWidth={3}
                    dot={{ fill: "var(--chart-3)", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Client Growth Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 min-w-0"
        >
          <Card className="p-5 sm:p-6 lg:p-7 bg-background border border-border/50 shadow-sm">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                {t("metrics.client_growth_chart")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("metrics.client_growth_chart_desc")}
              </p>
            </div>
            <ChartContainer
              config={{
                clients: {
                  label: t("metrics.satisfied_clients"),
                  color: "var(--chart-4)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLIENT_GROWTH_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="clients"
                    fill="var(--chart-4)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:text-center mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="bg-background rounded-2xl sm:rounded-3xl p-2 py-10 md:p-6 sm:p-8 lg:p-12 border border-border/50 shadow-sm">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4 leading-tight">
            {t("metrics.cta_title")}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            {t("you_know")}
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center px-4 w-full sm:w-auto">
            <ContactDialog
              triggerSize="lg"
              triggerClassName="group bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg rounded-xl flex items-center justify-center w-full sm:w-auto"
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
