"use server";

import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const REPO_OWNER = "cisneros14";
const REPO_NAME = "plantillas-scrap";
const BASE_BRANCH = "abogadosMain";

export async function generateSiteAction(formData: FormData) {
  try {
    const rawInfo = formData.get("rawInfo") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const secondaryColor = formData.get("secondaryColor") as string;
    const logoNav = formData.get("logoNav") as File;
    const logoHero = formData.get("logoHero") as File;
    const logoAbout = formData.get("logoAbout") as File;
    const leadName = formData.get("leadName") as string || "lead-" + Date.now();

    if (!process.env.GITHUB_TOKEN || !GEMINI_API_KEY) {
      throw new Error("Missing environment variables (GITHUB_TOKEN or GEMINI_API_KEY)");
    }

    // 1. IA Content Generation with Gemini
    // 1. IA Content Generation with Gemini
    console.log("Generando contenido con gemini-2.5-flash...");
    
    const fullTemplate = {
      name: "",
      description: "",
      url: "",
      ogImage: "",
      author: { name: "", url: "", twitter: "" },
      keywords: [],
      applicationName: "",
      creator: "",
      language: "es",
      business: {
        name: "",
        phone: "",
        whatsapp: "",
        address: "",
        coordinates: { lat: 0, long: 0 },
        email: "",
        operating_hours: ""
      },
      nav_items: [
        { label: "Inicio", href: "/" },
        { label: "Áreas de Práctica", href: "/services" },
        { label: "El Bufete", href: "/about" },
        { label: "Contacto", href: "/contact" }
      ],
      branding: {
        primary: primaryColor,
        primary_foreground: "0 0% 100%",
        secondary: secondaryColor,
        secondary_foreground: "0 0% 100%",
        background: "#e6decb",
        font_sans: "font-sans",
        logo_nav_url: "/logo.png",
        logo_hero_url: "/logoHero.png",
        logo_text: ""
      },
      social: { facebook: "", instagram: "", twitter: "", linkedin: "", whatsapp: "" },
      services: [
        { id: "", title: "", description: "", icon: "", image: "/placeholder.webp" }
      ],
      testimonials: [
        { name: "", role: "", content: "", avatar: "https://i.pravatar.cc/150?u=unique_id" }
      ],
      faq: [
        { question: "", answer: "" }
      ],
      process: [
        { title: "", description: "", icon: "" }
      ],
      pricing: [
        { name: "", price: "", description: "", features: [], cta: "", popular: false }
      ],
      team: [
        { name: "", role: "", bio: "", image: "/placeholder.webp", specialties: [], education: "", experience: "", social: { twitter: "#", linkedin: "#" } }
      ],
      sectionTitles: {
        services: { title: "", description: "" },
        testimonials: { title: "", description: "" },
        faq: { title: "", description: "" },
        contact: { title: "", description: "", formTitle: "", formDescription: "" }
      },
      hero: {
        badge: { text: "", href: "#", icon: "" },
        title: "",
        description: "",
        primaryCta: { text: "", href: "/services", icon: "" },
        secondaryCta: { text: "", icon: "" },
        image: { src: "/logoHero.png", alt: "" }
      },
      categories: [
        { id: "", name: "", icon: "", href: "", description: "", image: "/placeholder.webp" }
      ],
      featuredProducts: [
        { id: "", name: "", price: 0, rating: 0, reviewsCount: 0, imageLight: "", imageDark: "", discountBadge: "", features: [] }
      ],
      valueProposition: {
        title: "",
        description: "",
        items: [{ icon: "", title: "", description: "" }]
      },
      cta: { title: "", description: "", buttonText: "" },
      about: { title: "", description: "", features: [], image: "/about-image.jpg" },
      catalog: {
        categories: [{ id: "", label: "", count: 0 }],
        shippingRegions: [{ id: "", label: "" }]
      },
      products: [
        { id: "", name: "", price: 0, rating: 0, reviewsCount: 0, imageLight: "", imageDark: "", discountBadge: "", features: [], images: [], description: "", colors: [], capacities: [], specs: [] }
      ]
    };

    const prompt = `Eres un experto en marketing y diseño web. Extrae información de este texto y genera un JSON que siga EXACTAMENTE esta estructura:
    
    ESTRUCTURA REQUERIDA:
    ${JSON.stringify(fullTemplate, null, 2)}
    
    TEXTO DEL NEGOCIO:
    "${rawInfo}"
    
    REGLAS CRÍTICAS:
    1. NO omitas ninguna clave del JSON. Si no hay información para alguna clave, genera contenido creativo y profesional que encaje con el negocio.
    2. Los textos deben ser persuasivos (copywriting de alto nivel).
    3. Asegúrate de que los colores primario (${primaryColor}) y secundario (${secondaryColor}) estén en el campo branding.
    4. IMPORTANTE: NO edites los valores de "logo_nav_url" ("/logo.png"), "logo_hero_url" ("/logoHero.png") ni "about.image" ("/about-image.jpg"). Deben permanecer exactamente así.
    5. Para los avatars de los testimonios, usa siempre el servicio i.pravatar.cc con un ID único para cada persona (ej: https://i.pravatar.cc/150?u=nombre).
    6. Devuelve ÚNICAMENTE el código JSON puro, sin bloques de código markdown ni texto adicional.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini Error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedConfig = data.candidates[0].content.parts[0].text;

    // 2. Prepare Git Workflow
    const branchName = `deploy/${leadName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    console.log(`Creando rama: ${branchName}`);

    // Get base branch SHA
    const baseRef = await octokit.rest.repos.getBranch({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      branch: BASE_BRANCH,
    });
    const baseSha = baseRef.data.commit.sha;

    // Create new branch
    await octokit.rest.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    // 3. Upload Files
    console.log("Subiendo archivos...");

    const getFileSha = async (path: string) => {
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path,
          ref: branchName,
        });
        if (!Array.isArray(data)) return data.sha;
      } catch (e) {
        return undefined;
      }
    };

    // Upload site.ts
    const siteContent = `export type SiteConfig = typeof siteConfig;\n\nexport const siteConfig = ${generatedConfig};`;
    const siteSha = await getFileSha("src/config/site.ts");
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: "src/config/site.ts",
      message: "feat: update site config from factory",
      content: Buffer.from(siteContent).toString("base64"),
      branch: branchName,
      sha: siteSha,
    });

    // Upload Logos
    if (logoNav && logoNav.size > 0) {
      const navBuffer = Buffer.from(await logoNav.arrayBuffer());
      const logoNavSha = await getFileSha("public/logo.png");
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: "public/logo.png",
        message: "feat: update navigation logo",
        content: navBuffer.toString("base64"),
        branch: branchName,
        sha: logoNavSha,
      });
    }

    if (logoHero && logoHero.size > 0) {
      const heroBuffer = Buffer.from(await logoHero.arrayBuffer());
      const logoHeroSha = await getFileSha("public/logoHero.png");
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: "public/logoHero.png",
        message: "feat: update hero logo",
        content: heroBuffer.toString("base64"),
        branch: branchName,
        sha: logoHeroSha,
      });
    }

    if (logoAbout && logoAbout.size > 0) {
      const aboutBuffer = Buffer.from(await logoAbout.arrayBuffer());
      const logoAboutSha = await getFileSha("public/about-image.jpg");
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: "public/about-image.jpg",
        message: "feat: update about image",
        content: aboutBuffer.toString("base64"),
        branch: branchName,
        sha: logoAboutSha,
      });
    }

    return {
      success: true,
      branch: branchName,
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${branchName}`,
    };

  } catch (error: unknown) {
    console.error("Site Factory Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return { success: false, error: errorMessage };
  }
}
