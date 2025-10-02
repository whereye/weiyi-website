import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";

// ----------------------------
// Helpers
// ----------------------------
const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Scholar profile URL (provided by user)
const SCHOLAR_URL =
  "https://scholar.google.com/citations?hl=zh-CN&user=Nx7UitgAAAAJ&view_op=list_works&gmla=AH8HC4yyHZUpunnL_-tFbHPJDrw2_P7ceBI8msKiG_rtH5ChHdK4QAyL69oFIyK9T58JaqEWSvleAOtR3RVf_XwyX2hetBHFW-20boOt0HX3tSPCPQOU-riqQG0aj07nFg";

// ----------------------------
// I18N content (EN + ZH)
// ----------------------------
const content = {
  zh: {
    nav: {
      about: "关于我", research: "研究方向", tech: "技术技能", publications: "论文发表", cv: "简历", contact: "联系方式", scholar: "学术",
    },
    heroTitlePrefix: "欢迎来到",
    heroTitleName: "Weiyi Ye",
    heroTitleSuffix: "的大脑世界",
    heroSubtitle: "神经科学研究者 · 数据分析者 · 工程工具创造者",
    aboutTitle: "关于我",
    aboutBody: (
      <>我是 <strong>Weiyi Ye</strong>，研究兴趣包括电路动力学、神经技术方法以及数据驱动的建模。我同时热爱编码、Arduino、3D 打印等工程技能，用以辅助科研与开放科学。</>
    ),
    researchTitle: "研究方向",
    researchBullets: [
      "电路生理学 —— 学习与记忆中的群体动力学。",
      "神经技术方法 —— 开放的实验硬件与协议。",
      "计算与建模 —— 信号处理与机器学习管线。",
    ],
    techTitle: "技术技能",
    techTags: [
      "两光子成像","在体电生理","光遗传学","病毒载体设计","小鼠行为实验","Python 数据分析","机器学习","信号处理","图像配准","统计分析","Arduino & 3D 打印"
    ],
    timelineTitle: "科研时间线",
    timelineItems: [
      { year: "2022/07", title: "加入陈迁课题组", desc: "建立动物行为学分析系统" },
      { year: "2023/08", title: "第16届中国神经科学年会墙报展示", desc: "阐明Chd2缺失对触觉灵敏性的影响" },
      { year: "2024/12", title: "搭建小鼠跑步机装置", desc: "在双光子成像条件下观察被动运动偶联信号" },
      { year: "2025/09", title: "投递文章：AAV在发育期快速表达", desc: "为出生后发育期研究提供新策略与新方法" },
    ],
    publicationsTitle: "论文发表",
    cvTitle: "简历",
    cvText: (
      <>下载我的 <a href="#" className="underline">简历 PDF</a> 或完整学术 CV。</>
    ),
    contactTitle: "联系方式",
    footer: () => `© ${new Date().getFullYear()} Weiyi Ye`,
    langToggle: "English",
  },
  en: {
    nav: {
      about: "About", research: "Research", tech: "Techniques", publications: "Publications", cv: "CV", contact: "Contact", scholar: "Scholar",
    },
    heroTitlePrefix: "Welcome to the world inside",
    heroTitleName: "Weiyi Ye",
    heroTitleSuffix: "'s brain",
    heroSubtitle: "Neuroscience researcher · Data analyst · Builder of tools",
    aboutTitle: "About",
    aboutBody: (
      <>I’m <strong>Weiyi Ye</strong>, focusing on circuit dynamics, neurotech methods, and data-driven modeling. I enjoy coding, Arduino, and 3D printing to build tools for open science.</>
    ),
    researchTitle: "Research",
    researchBullets: [
      "Circuit physiology — population dynamics in learning and memory.",
      "Neurotech methods — open hardware and protocols.",
      "Computation & modeling — signal processing and machine learning pipelines.",
    ],
    techTitle: "Techniques & Skills",
    techTags: [
      "Two-photon imaging","In vivo electrophysiology","Optogenetics","Viral vector design","Behavioral assays","Python data analysis","Machine learning","Signal processing","Image registration","Statistics","Arduino & 3D printing"
    ],
    timelineTitle: "Research Timeline",
    timelineItems: [
      { year: "2022/07", title: "Joined Prof. Chen’s lab", desc: "Built animal behavior analysis system" },
      { year: "2023/08", title: "CNS 2023 poster", desc: "CHD2 loss and tactile sensitivity in rodents" },
      { year: "2024/12", title: "Treadmill rig", desc: "Observed coupling signals under 2P imaging" },
      { year: "2025/09", title: "Manuscript: rapid AAV expression in development", desc: "New strategies for postnatal studies" },
    ],
    publicationsTitle: "Publications",
    cvTitle: "Curriculum Vitae",
    cvText: (
      <>Download a concise <a href="#" className="underline">resume PDF</a> or the full academic CV.</>
    ),
    contactTitle: "Contact",
    footer: () => `© ${new Date().getFullYear()} Weiyi Ye`,
    langToggle: "中文",
  }
};

// ----------------------------
// Timeline component (animated)
// ----------------------------
function ResearchTimeline({ items }: { items: Array<{ year: string; title: string; desc: string }> }) {
  const data = items?.length ? items : [];
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 md:left-1/2" />
      <div className="space-y-8">
        {data.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`relative md:grid md:grid-cols-2 md:gap-8 ${i % 2 ? "md:text-left" : "md:text-right"}`}
          >
            <div className={`p-4 ${i % 2 ? "md:col-start-2" : ""}`}>
              <div className="text-xs uppercase tracking-wide text-slate-400">{it.year}</div>
              <div className="mt-1 font-medium">{it.title}</div>
              <div className="text-sm text-slate-300">{it.desc}</div>
            </div>
            <span className={`absolute left-[10px] md:left-1/2 md:-ml-[6px] top-6 h-3 w-3 rounded-full bg-cyan-300`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------
// Tiny dev checks (act like tests)
// ----------------------------
function useDevChecks(publications: Array<{ title: string; authors?: string; url?: string; doi?: string }>) {
  useEffect(() => {
    // Test 1
    if (!Array.isArray(publications)) {
      console.error("[TEST FAIL] pubs must be an array, got:", typeof publications);
      return;
    }
    // Test 2
    if (publications.length === 0) {
      console.warn("[TEST WARN] pubs list is empty; nothing will render under Publications.");
    }
    // Test 3
    publications.forEach((p, i) => {
      if (!p.title) console.error(`[TEST FAIL] pubs[${i}] missing title`);
    });
    // Test 4
    publications.forEach((p, i) => {
      if (p.authors && !/\w+\s+\w+/.test(p.authors)) {
        console.warn(`[TEST WARN] pubs[${i}] authors may not be full names:`, p.authors);
      }
    });
  }, [publications]);
}

// ----------------------------
// Render authors with bolded "Weiyi Ye"
// ----------------------------
function Authors({ text }: { text?: string }) {
  if (!text) return null;
  const parts = text.split(/(Weiyi\s+Ye)/gi);
  return (
    <>
      {parts.map((p, i) => (p.toLowerCase() === "weiyi ye" ? <strong key={i}>Weiyi Ye</strong> : <span key={i}>{p}</span>))}
    </>
  );
}

// ----------------------------
// Bilingual Fancy Home with language toggle
// ----------------------------

export default function FancyHome() {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const t = content[lang];

  const pubs = [
    {
      title: "Rapid Neuronal Labeling and Functional Imaging in the Developing Mouse Brain with AAV-PHP.eB",
      authors: "Weiyi Ye, Mao Deng, Xiaodong Chen, Sijing Zhao, Simin Su, Bowen Ren, Chuchu Qi, Jialong Li, Mei Fu, Tongtong Gao, Minghan Li, Na Zhou, Shiqian Shen, Wenting Wang, Qian Chen",
      venue: lang === "en" ? "Submitted" : "已投稿",
      year: "",
      doi: "",
      url: "",
    },
    {
      title: "Anterior cingulate cortex parvalbumin and somatostatin interneurons shape social behavior in male mice",
      authors: "Chuchu Qi, Wenqi Sima, Honghui Mao, Erling Hu, Junye Ge, Mao Deng, Andi Chen, Weiyi Ye, Qian Xue, Wenting Wang, Qian Chen, Shengxi Wu",
      venue: "Nature Communications",
      year: "2025",
      doi: "10.1038/s41467-025-59473-z",
      url: "https://www.nature.com/articles/s41467-025-59473-z",
    },
    {
      title: "An ultra-compact promoter drives widespread neuronal expression in mouse and monkey brains",
      authors: "Jing Wang, Jia Lin, Yanan Chen, Jie Liu, Qiang Zheng, Mao Deng, Rui Wang, Yang Zhang, Siqi Feng, Zhi Xu, Weiyi Ye, Yu Hu, Jie Duan, Yan Lin, Jian Dai, Yujun Chen, Yan Li, Tao Luo, Qian Chen, Zhi Lu",
      venue: "Cell Reports",
      year: "2023",
      doi: "10.1016/j.celrep.2023.113348",
      url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01360-8",
    },
  ];

  useDevChecks(pubs);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500/50">
        {/* Top bar with language toggle */}
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-xs backdrop-blur">
          <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="hover:text-white text-slate-200">
            {t.langToggle}
          </button>
        </div>

        {/* 导航栏 / Nav */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between py-4">
              <a onClick={() => scrollToId("home")} className="font-semibold uppercase tracking-[0.12em] text-slate-100 cursor-pointer">
                WEIYI YE
              </a>
              <nav className="hidden gap-6 md:flex">
                {"about research tech publications cv contact".split(" ").map((id) => (
                  <button key={id} onClick={() => scrollToId(id)} className="text-base tracking-wide text-slate-200 hover:text-white px-1">
                    {t.nav[id as keyof typeof t.nav]}
                  </button>
                ))}
                <a href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer" className="text-base tracking-wide text-slate-200 hover:text-white px-1">
                  {t.nav.scholar}
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero with custom background image */}
        <section
          id="home"
          className="relative flex items-center justify-center py-32 text-center"
          style={{
            backgroundImage: "url('/CA1 basal dendrites.png')", // 将你的图片放到 public/bg.jpg
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 半透明遮罩保证文字可读 */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 max-w-2xl px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.heroTitlePrefix} <span className="text-fuchsia-300">{t.heroTitleName}</span> {t.heroTitleSuffix}
            </h1>
            <p className="mt-4 text-lg text-slate-300">{t.heroSubtitle}</p>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-2xl font-bold">{t.aboutTitle}</h2>
          <p className="mt-4 max-w-3xl text-slate-300">{t.aboutBody}</p>
        </section>

        {/* Research */}
        <section id="research" className="border-y border-white/10 bg-white/5 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold">{t.researchTitle}</h2>
            <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-300">
              {t.researchBullets.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Techniques */}
        <section id="tech" className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-2xl font-bold">{t.techTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {t.techTags.map((s: string) => (
              <span key={s} className="inline-block rounded-full border border-white/20 px-3 py-1 text-sm text-slate-200">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section id="timeline" className="border-y border-white/10 bg-white/5 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold">{t.timelineTitle}</h2>
            <ResearchTimeline items={t.timelineItems as any} />
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="border-y border-white/10 bg-white/5 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold">{t.publicationsTitle}</h2>
            </div>
            <div className="mt-2">
              <a
                href={SCHOLAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline opacity-90"
              >
                {lang === "en" ? "Google Scholar (full list)" : "Google 学术（全部)"}
              </a>
            </div>
            <ol className="mt-6 space-y-8">
              {pubs.map((p, idx) => (
                <li key={idx} className="text-slate-300">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl font-semibold text-slate-100 hover:underline">
                      {p.title}
                    </a>
                  ) : (
                    <div className="text-lg sm:text-xl font-semibold text-slate-100">{p.title}</div>
                  )}
                  <div className="mt-2 text-[14px] leading-relaxed">
                    <Authors text={p.authors} />
                  </div>
                  <div className="mt-1 text-[14px] opacity-90">
                    {p.venue && <span>{p.venue}</span>}
                    {p.year && <span> · {p.year}</span>}
                    {p.doi && (
                      <>
                        <span> · </span>
                        <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                          {p.doi}
                        </a>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CV */}
        <section id="cv" className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-2xl font-bold">{t.cvTitle}</h2>
          <p className="mt-4 text-slate-300">{t.cvText}</p>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold">{t.contactTitle}</h2>
            <div className="mt-6 grid gap-2 text-slate-300 text-[15px]">
              <div>Weiyi Ye</div>
              <div>email: weiyiye0510@gmail.com</div>
              <div>Zhongshan Institute for Drug Discovery</div>
              <div>Guangdong, China 524800</div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-400">
          {t.footer()}
        </footer>
      </div>
    </MotionConfig>
  );
}
