"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t("footer_privacy_policy")}
          </CardTitle>
          <p className="text-muted-foreground text-center">
            {t("privacy_policy.last_updated")}:{" "}
            {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.intro_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.intro_content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.info_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.info_content")}</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
              <li>{t("privacy_policy.info_list_1")}</li>
              <li>{t("privacy_policy.info_list_2")}</li>
              <li>{t("privacy_policy.info_list_3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.usage_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.usage_content")}</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primary">
              <li>{t("privacy_policy.usage_list_1")}</li>
              <li>{t("privacy_policy.usage_list_2")}</li>
              <li>{t("privacy_policy.usage_list_3")}</li>
              <li>{t("privacy_policy.usage_list_4")}</li>
              <li>{t("privacy_policy.usage_list_5")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.sharing_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.sharing_content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.security_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.security_content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.cookies_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.cookies_content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.rights_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.rights_content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {t("privacy_policy.contact_title")}
            </h2>
            <p className="mb-4">{t("privacy_policy.contact_content")}</p>
            <div className="bg-muted/50 p-6 rounded-lg border border-border">
              <p className="font-bold text-lg mb-2">Agility Software Factory</p>
              <p>Quito, Ecuador</p>
              <p>Email: contacto@agility.com</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
