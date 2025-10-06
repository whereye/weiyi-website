import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";

// ============================
// Types
// ============================
type SkillItem =
  | string
  | {
      label: string;            // 主体文字（会带圆点）
      note?: string;            // 备注（括号里的内容）
      breakBeforeNote?: boolean // true 时在备注前换行（同一个 li 内，不会出现第二个圆点）
    };

export type TechGroup = {
  title: string;
  subtitle?: string;
  note?: string;
  skills: SkillItem[];
};


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

// ============================
// I18N content (EN + ZH)
// ============================
const content: Record<"zh" | "en", any> = {
  zh: {
    nav: {
      home: "首页",
      about: "关于我",
      research: "研究方向",
      tech: "技术技能",
      publications: "论文发表",
      timeline: "科研时间线",
      contact: "联系方式",
    },
    aboutPhotoNote: "2024/12/22 于厦门半程马拉松",
    heroTitlePrefix: "欢迎来到",
    heroTitleName: "叶苇一",
    heroTitleSuffix: "的脑内世界",
    heroSubtitle: "神经科学 · 数据科学 · 创新工程",
    aboutTitle: "关于我",
    more: "更多",
    aboutBody: (
      <>我是 <strong>叶苇一</strong>，一名专注于研究神经系统发育与功能的科研工作者。我的研究结合先进的病毒标记、显微成像与动物行为范式，以及高度量化与自动化的数据分析方法，<strong>从多维度探索大脑的发育过程和发育性疾病对认知和功能的影响</strong>。
        <br/><br/>除了传统的神经生物学手段，我也将工程学技术融入科研实践——包括 <strong>Arduino 开发、PCB 绘制、3D 建模与打印</strong>等。这些技术帮助我根据实验需求定制专用装置，并搭建创新性的动物行为学范式。
        <br/><br/>我热衷于将跨学科的技术手段与神经科学相结合，推动更开放、精确且富有创造力的研究。</>
    ),
    researchTitle: "研究方向",
    researchBullets: [
      "神经元标记与功能成像方法开发",
      "发育期孤独症模型小鼠的大脑结构与功能研究",
      "双光子成像相关的行为学与刺激系统设计",
    ],
    techTitle: "技术技能",
    techGroups: [
      {
        title: "基础实验操作",
        note: "掌握神经生物学常见实验技能，能够满足基础科研需求",
        skills: [
          "小鼠灌注与取脑", 
          "脑组织振动切片", 
          "免疫荧光染色", 
          "啮齿类动物行为学实验", 
          "基础分子生物学实验",
        ],
      },
      {
        title: "啮齿类动物手术",
        note: "具备针对新生小鼠和成年小鼠的多种常用手术操作经验",
        skills: [
          "新生鼠脑室注射",
          "新生鼠面静脉注射",
          "幼鼠 / 成年鼠颅窗手术",
          "脑立体定位注射",
          "成年鼠尾静脉注射",
        ],
      },
      {
        title: "显微成像系统",
        note: "曾获 Evident (OLYMPUS) 专访，熟练掌握多类显微成像系统",
        skills: [
          "FV3000 共聚焦显微成像",
          "SpinSR 转盘共聚焦显微成像",
          "VS200 扫片机",
          "FVMPE-RS 双光子显微成像",
        ],
      },
      {
        title: "编程语言",
        note: "使用下列语言独立搭建过自动化数据处理与分析流程",
        skills: ["Python", "MATLAB", "Bonsai", "ImageJ Macro"],
      },
      {
        title: "数据分析工具",
        note: "掌握多种数据分析与可视化工具，相关成果已投递或待发表",
        skills: ["ImageJ", "Imaris", "GraphPad Prism", "DeepLabCut"],
      },
      {
        title: "工程技术",
        note: "利用工程技术开发多种实验装置，其中3项已申请专利 (预计2025年1月获批)",
        skills: [
          "Arduino", 
          "PCB 设计", 
          "3D 建模及打印", 
          "硬件组装及焊接",
        ],
      },
      {
        title: "其他技术",
        skills: [
           { label: "Adobe 套件", note: "Photoshop / Premiere / Illustrator", breakBeforeNote: true },
           { label: "Microsoft办公软件", note: "Word / PowerPoint / Excel", breakBeforeNote: true },
        ],
      },
    ],
    timelineTitle: "科研时间线",
    timelineItems: [
      { year: "2022/07", title: "加入陈迁实验室", desc: "开启科研之路，系统学习神经发育研究的实验方法与理念" },
      { year: "2022/08", title: "建立行为学分析系统", desc: "自主搭建小鼠行为学分析系统，实现对旷场与新物体识别等实验的自动识别与量化" },
      { year: "2022/11", title: "触须测试：孤独症模型小鼠的触觉敏感性研究", desc: "通过触须测试探究孤独症模型小鼠的感知觉变化，为后续行为学研究奠定基础" },
      { year: "2023/06", title: "本科毕业（大连理工大学）", desc: "以专业第一的成绩完成本科学业，正式进入科研深耕阶段" },
      { year: "2023/07", title: "CNS 2023 墙报展示", desc: "首次以第一作者身份在学术会议上展示研究成果" },
      { year: "2023/10", title: "第一篇论文见刊", desc: "早期研究成果发表于国际期刊，探讨了 Ponatinib 的潜在药物相互作用风险" },
      { year: "2024/04", title: "设计多天龄小鼠固定器（专利已申请）", desc: "设计标准化固定器，实现不同发育阶段小鼠的高稳定成像" },
      { year: "2024/05", title: "行为学系统硬件升级（专利已申请）", desc: "自主设计行为学硬件，实现对光、气味与声音的控制，提升实验稳定性与重复性" },
      { year: "2024/12", title: "搭建小鼠跑步机（专利已申请）", desc: "搭建双光子兼容跑步机系统，实现运动中脑活动的成像观测" },
      { year: "2025/02", title: "引入新一代 3D 打印机", desc: "新设备大幅提升建模效率，助力定制化科研工具的快速制作" },
      { year: "2025/03", title: "基于ImageJ Macro自动化全脑荧光分析", desc: "开发自动化全脑荧光数据分析流程" },
      { year: "2025/03", title: "基于DeepLabCut的行为学优化", desc: "引入机器学习算法，优化小鼠行为识别精度" },
      { year: "2025/04", title: "搭建 automated von Frey 装置", desc: "实现双光子显微条件下的机械刺激输入系统" },
      { year: "2025/07", title: "提交三项实用新型专利", desc: "三项自主设计装置已申请专利，涵盖成像、行为与固定系统" },
      { year: "2025/09", title: "文章投递 & CNS 2025 墙报展示", desc: "向高水平期刊投稿并在国际会议上展示最新研究成果" },

    ],
    publicationsTitle: "论文发表",
    moreTitle: "更多关于我",
    hobbies: [
      { id: "Marathon",      title: "马拉松",  note: "2024年厦门环东半马" },
      { id: "Climbing",      title: "攀岩",    note: "户外顶绳运动攀岩" },
      { id: "Bouldering",    title: "抱石",    note: "室内抱石攀岩" },
      { id: "Hiking",        title: "徒步",    note: "安利给大家福州的白云洞徒步线路" },
      { id: "RailingRace",   title: "越野赛",  note: "真的超级累，所以没有自己的图" },
      { id: "Spartan",       title: "斯巴达",  note: "好玩爱玩下次还玩" },
      { id: "Cycling",       title: "骑行",    note: "为了去健身房所以买了辆自行车" },
      { id: "Swimming",      title: "游泳",    note: "愈发有种报名铁人三项的冲动" },
      { id: "SkateBoarding", title: "滑板",    note: "滑板代步真的很爽" },
      { id: "Piano",         title: "钢琴",    note: "好想弹钢琴啊可是现在条件不允许" },
      { id: "Cello",         title: "大提琴",  note: "我高中可是管弦乐团大提琴首席，大提琴是世界上最好的乐器！" },
    ],
    contactTitle: "联系方式",
    footer: () => `© ${new Date().getFullYear()} Weiyi Ye`,
    langToggle: "English",
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      research: "Research",
      tech: "Techniques",
      publications: "Publications",
      timeline: "Research Timeline",
      contact: "Contact",
    },
    aboutPhotoNote: "2024/12/22 @ Xiamen Half Marathon",
    heroTitlePrefix: "Welcome to the world inside",
    heroTitleName: "Weiyi Ye",
    heroTitleSuffix: "'s brain",
    heroSubtitle: "Neuroscience · Data Science · Innovation",
    aboutTitle: "About",
    more: "More",
    aboutBody: (
      
      <>I am <strong>Weiyi Ye</strong>, a neuroscience researcher dedicated to studying the development and function of the central nervous system (CNS). My research combines advanced 
      viral labeling, high-resolution imaging, and behavioral paradigms with highly quantitative and automated data analysis to <strong>explore brain development and the 
        impact of developmental disorders on cognition and function.</strong>
        <br/><br/>Beyond traditional neurobiological approaches, I incorporate engineering techniques—such as <strong>Arduino prototyping, PCB design, and 3D modeling and 
         printing</strong>—to build custom devices and design innovative behavioral paradigms tailored to experimental needs.
      <br/><br/>I am passionate about integrating cross-disciplinary technologies with neuroscience to advance research that is open, precise, and creative.</>
    ),
    researchTitle: "Research",
    researchBullets: [
      "Development of neuronal labeling and functional imaging methods",
      "Structural and functional analysis of brain development in autism models",
      "Design of behavioral and sensory-stimulation systems for two-photon imaging",
    ],
    techTitle: "Techniques & Skills",
    techGroups: [
      {
        title: "Basic experimental skills",
        note: "Proficient in essential neurobiology laboratory techniques, sufficient for diverse experimental requirements",
        skills: [
          "Mouse perfusion and brain extraction",
          "Vibratome brain tissue sectioning",
          "Immunofluorescence staining",
          "Rodent behavioral tests",
          "Basic molecular biology experiments",
        ],
      },
      {
        title: "Rodent surgical skills",
        note: "Experienced in a variety of surgical techniques for neonatal and adult mice",
        skills: [
          "P0 Intracerebroventricular (ICV) injection",          
          "P0 Intravenous (facial vein) injection",
          "Cranial window surgery in young and adult mice",
          "Stereotaxic brain injection",
          "Adult mouse tail vein injection",
        ],
      },
      {
        title: "Microscopy",
        note: "Interviewed by Evident (OLYMPUS); experienced in diverse advanced microscopy platforms",
        skills: [
          "FV3000 confocal microscopy",
          "SpinSR spinning‑disk confocal microscopy",
          "VS200 slide scanner",
          "FVMPE‑RS two‑photon microscopy",
        ],
      },
      {
        title: "Programming Languages",
        note: "Applied in developing automated pipelines for data processing and analysis",
        skills: [ "Python", "MATLAB", "Bonsai", "ImageJ Macro",],
      },
      {
        title: "Data analysis skills",
        note: "Experienced in analytical and visualization tools, applied to submitted or in-preparation manuscripts",
        skills: ["ImageJ", "Imaris", "GraphPad Prism", "DeepLabCut"],
      },
      {
        title: "Engineering skills",
        note: "Applied to design and build custom laboratory devices; three inventions have patent applications under review (expected approval: Jan 2025)",
        skills: [
          "Arduino",
          "PCB design",
          "3D modeling and printing",
          "Hardware assembly and soldering",
        ],
      },
      {
        title: "Other skills",
        skills: [
           { label: "Adobe Suite", note: "Photoshop / Premiere / Illustrator", breakBeforeNote: true },
           { label: "Microsoft Office", note: "Word / PowerPoint / Excel", breakBeforeNote: true },
        ],
      },
    ],
    timelineTitle: "Research Timeline",
    timelineItems: [
      { year: "2022/07", title: "Joined Dr. Qian Chen’s Laboratory", desc: "Began scientific training in developmental neuroscience and laboratory techniques" },
      { year: "2022/08", title: "Established a Behavioral Analysis System", desc: "Developed a system capable of identifying and quantifying mouse behaviors in arena-based tests such as the Open Field and Novel Object tests" },
      { year: "2022/11", title: "Whisker Detection Task: Tactile Sensitivity in ASD Model", desc: "Investigated tactile hypersensitivity in autism model mice using whisker-based behavioral paradigms" },
      { year: "2023/06", title: "Bachelor’s Graduation (Dalian University of Technology)", desc: "Graduated first in major, laying the foundation for professional neuroscience research" },
      { year: "2023/07", title: "Poster Presentation at CNS 2023", desc: "Presented a poster on developmental neural circuit imaging at the Cognitive Neuroscience Society 2023 Meeting" },
      { year: "2023/10", title: "First Paper Published", desc: "Published the first research paper (based on 2021–2022 work) on the potential drug–drug interaction (DDI) risk of Ponatinib" },      
      { year: "2024/04", title: "Designed Multi-Age Mouse Holder (Patent Pending)", desc: "Created a standardized holder adaptable for mice of various postnatal ages, improving stability in two-photon imaging" },
      { year: "2024/05", title: "Upgraded Hardware of Behavior Tests (Patent Pending)", desc: "Enhanced behavior tests setup with custom hardware for precise control of illumination, odor, and auditory stimuli" },
      { year: "2024/12", title: "Built a Mouse Treadmill (Patent Pending)", desc: "Constructed a two-photon compatible treadmill to monitor neural calcium dynamics during passive locomotion" },
      { year: "2025/02", title: "Introduced a New-Generation 3D Printer", desc: "Implemented a high-precision 3D printer to accelerate design and fabrication of research tools" },
      { year: "2025/03", title: "Automated Whole-Brain Analysis", desc: "Developed an ImageJ Macro pipeline for fluorescence quantification" },
      { year: "2025/03", title: "Behavioral Optimization", desc: "Integrated DeepLabCut for supervised behavioral tracking" },
      { year: "2025/04", title: "Built Automated von Frey System", desc: "Designed a von Frey stimulation setup compatible with two-photon imaging for mechanical sensory input" },
      { year: "2025/07", title: "Filed Three Utility Model Patents", desc: "Filed patents covering mouse treadmill, behavioral chamber, and head-fixation devices" },
      { year: "2025/09", title: "Manuscript Submission & CNS 2025 Poster", desc: "Submitted Rapid AAV Expression in Development and presented a poster at CNS 2025" },
    ],
    publicationsTitle: "Publications",
    moreTitle: "More About Me",
    hobbies: [
      { id: "Marathon",      title: "Marathon",      note: "Xiamen Half Marathon 2024" },
      { id: "Climbing",      title: "Climbing",      note: "Outdoor top-rope climbing" },
      { id: "Bouldering",    title: "Bouldering",    note: "The perfect mix of power, focus, and fun" },
      { id: "Hiking",        title: "Hiking",        note: "Highly recommend the Baiyun Cave trail" },
      { id: "RailingRace",   title: "Trail Running", note: "It was exhausting… so no photos this time." },
      { id: "Spartan",       title: "Spartan Race",  note: "Tough but fun, I’d totally do it again!" },
      { id: "Cycling",       title: "Cycling",       note: "Bought a bike just to get to the gym, now I love the ride itself" },
      { id: "Swimming",      title: "Swimming",      note: "Feeling an urge to sign up for a triathlon" },
      { id: "SkateBoarding", title: "Skateboarding", note: "Skateboarding as daily transport" },
      { id: "Piano",         title: "Piano",         note: "Really miss playing the piano" },
      { id: "Cello",         title: "Cello",         note: "I was the principal cellist in my high school orchestra!" },
    ],

    contactTitle: "Contact",
    footer: () => `© ${new Date().getFullYear()} Weiyi Ye`,
    langToggle: "中文",
  },
};

// ============================
// Utilities
// ============================
function Authors({ text }: { text?: string }) {
  if (!text) return null;
  const parts = text.split(/(Weiyi\s+Ye)/gi);
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === "weiyi ye" ? <strong key={i}>Weiyi Ye</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

function ResearchTimeline({
  items,
}: {
  items: Array<{ year: string; title: string; desc: string }>;
}) {
  const data = items ?? [];
  return (
    <div className="relative mx-auto max-w-5xl">
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
function ResearchInteractive({ t }: { t: any }) {
  // 当前悬停的条目下标（0/1/2），未悬停时为 null
  const [hovered, setHovered] = useState<number | null>(null);
  // 让右侧高度与左侧模块一致
  const leftRef = useRef<HTMLDivElement | null>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!leftRef.current) return;

    const el = leftRef.current;

    // 初始测量
    const measure = () => setLeftHeight(el.getBoundingClientRect().height);
    measure();

    // 左侧内容发生重排/换行时，同步高度
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // 窗口大小变化也同步
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="research" className="border-y border-white/10 bg-white/5 py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* 用两列网格：左边（标题+列表）与右边（预览图） */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* 左侧：标题 + 列表（整体作为一个模块） */}
          <div ref={leftRef} className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold">{t.researchTitle}</h2>

            <ul className="mt-6 space-y-3 text-slate-300">
              {t.researchBullets.map((b: string, i: number) => (
                <li key={i} className="relative">
                  {/* 用 button 包住文本以获得更好的可交互性（也可用 div） */}
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="group relative w-full text-left pb-1"
                  >
                    {/* 行文字 */}
                    <span className="inline-block">{b}</span>

                    {/* 自定义下划线：从文字“中部”开始向两侧展开 */}
                    <span
                      className="
                        pointer-events-none
                        absolute left-1/2 bottom-0 h-[2px] w-full -translate-x-1/2
                        origin-center scale-x-0
                        bg-slate-300
                        transition-transform duration-300 ease-out
                        group-hover:scale-x-100
                      "
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 右侧：预览图区域（与左侧等高；无灰框） */}
          <div
            className="flex items-center justify-center"
            style={{ height: leftHeight ?? undefined }}
          >
            {hovered !== null && (
              <img
                src={
                  hovered === 0
                    ? "/ResearchStrategy.webp"
                    : hovered === 1
                    ? "/ResearchBrain.webp"
                    : "/ResearchTreadmill.webp"
                }
                alt="Research preview"
                /* 等比缩放，不裁切、不溢出；当某一边先到极限时，另一边按比例收缩 */
                className="block max-h-full max-w-full object-contain"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
function TechSection({ t }: { t: any }) {
  const groups = t.techGroups as TechGroup[];
  return (
    <section id="tech" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-bold mb-10">{t.techTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {groups.map((group, idx) => (
          <div key={idx} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-xl font-semibold">{group.title}</h3>
            {group.subtitle && (
              <div className="text-slate-400 text-sm">{group.subtitle}</div>
            )}
            {group.note && (
              <div className="mt-1 text-slate-500 italic text-xs">{group.note}</div>
            )}
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-slate-200 marker:text-slate-400">
              {group.skills.map((s, i) => {
                // 如果是普通字符串
                if (typeof s === "string") {
                  return (
                    <li key={i} className="-indent-0 pl-2 leading-relaxed">
                      {s}
                    </li>
                  );
                }
                // 如果是对象（带 label / note）
                return (
                  <li key={i} className="-indent-6 pl-2 leading-relaxed">
                    <span>{s.label}</span>
                    {s.note &&
                      (s.breakBeforeNote ? (
                        <span className="block pl-6 text-slate-400">{s.note}</span>
                      ) : (
                        <span className="text-slate-400"> {s.note}</span>
                      ))}
                  </li>
                );
              })}
            </ul>


          </div>
        ))}
      </div>
    </section>
  );
}

function MoreAboutMe({ t }: { t: any }) {
  
  const items: Array<{ id: string; title: string; note: string }> = t.hobbies ?? [];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  // 一次滚动 = 一张卡片的宽度 + 两卡片之间的 gap
  const getScrollStep = () => {
    const track = trackRef.current;
    const card = firstCardRef.current;
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    return card.clientWidth + gap;
  };

  const scrollByCards = (n: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.4; // 一次滚动视口的 80%
    el.scrollBy({ left: n * step, behavior: "smooth" });
  };



  return (
    <section id="more" className="border-y border-white/10 bg-white/5 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{t.moreTitle}</h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollByCards(-1)}
              className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 transition"
              aria-label="Prev"
            >
              ‹
            </button>
            <button
              onClick={() => scrollByCards(1)}
              className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 transition"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        {/* 走马灯 */}
        <div className="relative mt-6">
          {/* 左右按钮（移动端隐藏） */}
          <button
            onClick={() => scrollByCards(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:inline-flex rounded-full border border-white/20 bg-slate-900/70 hover:bg-slate-900/90 px-3 py-1.5"
            aria-label="Prev"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCards(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:inline-flex rounded-full border border-white/20 bg-slate-900/70 hover:bg-slate-900/90 px-3 py-1.5"
            aria-label="Next"
          >
            ›
          </button>

          {/* 横向滚动容器 */}
          <div
            ref={scrollerRef}
            className="overflow-x-auto snap-x snap-mandatory more-scroller"
          >
            

            <div ref={trackRef} className="flex gap-6 px-2">
              {items.map((it, i) => (
                <div
                  key={it.id}
                  ref={i === 0 ? firstCardRef : null}  // 如果你还用“按卡片宽度滚动”，保留首张 ref
                  className="shrink-0 snap-start flex-none"  // ❗不再用 basis-%，让卡片按内容宽度自适应
                >
                  {/* 让图片与文字整体按内容收缩宽度 */}
                  <div className="inline-flex flex-col items-center">
                    {/* 统一高度；宽度由图片自然决定（横图更宽、竖图更窄） */}
                    <div className="h-64 md:h-72 lg:h-80 flex items-center justify-center">
                      <img
                        src={`/${it.id}.webp`}
                        alt={it.title}
                        className="h-full w-auto object-contain"
                      />
                    </div>

                    {/* 文案宽度随图片自然宽度，不再占满整张卡片 */}
                    <div className="pt-2 text-center">
                      <div className="font-medium">{it.title}</div>
                      <div className="mt-1 text-sm text-slate-400">{it.note}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 尾部留白，保证 3.5 张效果不被压满 */}
              <div className="shrink-0 basis-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================
// Main App (default export)
// ============================
export default function App() {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const t = content[lang];

  // --- subtle parallax for hero background (mouse only) ---
  const bgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    const target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      const MAX = 20; // px, adjust 6~16
      target.x = nx * MAX;
      target.y = ny * MAX;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.1; // easing
      cur.y += (target.y - cur.y) * 0.1;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Publications data
  const pubs = [
    {
      title:
        "Rapid Neuronal Labeling and Functional Imaging in the Developing Mouse Brain with AAV-PHP.eB",
      authors:
        "Weiyi Ye, Mao Deng, Xiaodong Chen, Sijing Zhao, Simin Su, Bowen Ren, Chuchu Qi, Jialong Li, Mei Fu, Tongtong Gao, Minghan Li, Na Zhou, Shiqian Shen, Wenting Wang, Qian Chen",
      venue: lang === "en" ? "Submitted" : "已投稿",
      year: "",
      doi: "",
      url: "",
    },
    {
      title:
        "Anterior cingulate cortex parvalbumin and somatostatin interneurons shape social behavior in male mice",
      authors:
        "Chuchu Qi, Wenqi Sima, Honghui Mao, Erling Hu, Junye Ge, Mao Deng, Andi Chen, Weiyi Ye, Qian Xue, Wenting Wang, Qian Chen, Shengxi Wu",
      venue: "Nature Communications",
      year: "2025",
      doi: "10.1038/s41467-025-59473-z",
      url: "https://www.nature.com/articles/s41467-025-59473-z",
    },
    {
      title:
        "An ultra-compact promoter drives widespread neuronal expression in mouse and monkey brains",
      authors:
        "Jingyi Wang, Jianbang Lin, Yefei Chen, Jing Liu, Qiongping Zheng, Mao Deng, Ruiqi Wang, Yujing Zhang, Shijing Feng, Zhenyan Xu, Weiyi Ye, Yu Hu, Jiamei Duan, Yunping Lin, Ji Dai, Yu Chen, Yuantao Li, Tao Luo, Qian Chen, Zhonghua Lu",
      venue: "Cell Reports",
      year: "2023",
      doi: "10.1016/j.celrep.2023.113348",
      url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01360-8",
    },
    {
      title:
        "Potential risk of drug-drug interactions of ponatinib via inhibition against human UDP-glucuronosyltransferases",
      authors:
        "Weiyi Ye, Zhen Wang, Xin Lv, Hang Yin, Lili Jiang, Zhe Wang, Yong Liu",
      venue: "Toxicology in Vitro",
      year: "2023",
      doi: "10.1016/j.tiv.2023.105664",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0887233323001133",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500/50">
        {/* Top bar with language toggle */}
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-xs backdrop-blur">
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="hover:text-white text-slate-200"
          >
            {t.langToggle}
          </button>
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between py-4">
              <a
                onClick={() => scrollToId("home")}
                className="font-semibold uppercase tracking-[0.12em] text-slate-100 cursor-pointer"
              >
                WEIYI YE
              </a>
              <nav className="hidden gap-6 md:flex">
                {"about research publications tech timeline more contact".split(" ").map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollToId(id)}
                    className="text-base tracking-wide text-slate-200 hover:text-white px-1"
                  >
                    {t.nav[id as keyof typeof t.nav]}
                  </button>
                ))}
                <a
                  href={SCHOLAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base tracking-wide text-slate-200 hover:text-white px-1"
                >
                  {t.nav.scholar}
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero: full-width image (contain) + overlay + title */}
        <section id="home" className="relative overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: "2/1" }}>
            <div
              ref={bgRef}
              className="absolute inset-0 will-change-transform"
              style={{
                backgroundImage: "url('/hero.webp')", // 建议重命名 public/hero.webp
                backgroundSize: "95% auto", // 宽度 = 视口宽度，高度按比例
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "black",
                transition: "transform 0.06s linear",
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-start pt-85 justify-center px-4">
              <div className="max-w-4xl text-center">
                <h1 className="text-6xl sm:text-7xl font-extrabold leading-tight tracking-tight">
                  {t.heroTitlePrefix} <span className="text-green-400">{t.heroTitleName}</span> {t.heroTitleSuffix}
                </h1>
                <p className="mt-5 text-xl text-slate-300">{t.heroSubtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">{t.aboutTitle}</h2>

          {/* 用响应式的flex：小屏竖排，大屏左右布局。左侧固定宽度，右侧自适应 */}
          <div className="mt-4 flex flex-col md:flex-row gap-8 items-start">
            {/* 左侧：文字（固定最大宽度，不被挤压） */}
            <div className="max-w-3xl md:flex-none">
              <p className="text-slate-300">{t.aboutBody}</p>
            </div>

            {/* 右侧：图片（占用剩余空间） */}
            <div className="md:flex-1 w-full">
              <div className="w-full">
                <img
                  src="/WeiyiYe.webp"
                  alt="Weiyi Ye"
                  className="w-full h-auto aspect-[4/3] object-contain rounded-xl shadow-lg"
                />
              </div>
              <div className="mt-3 text-sm text-slate-400 text-center">
                {/** 中英双语说明 **/}
                {t.aboutPhotoNote}
              </div>
            </div>
          </div>
        </section>

        {/* Research (interactive) */}
        <ResearchInteractive t={t} />
        {/* Publications */}
        <section id="publications" className="border-y border-white/10 bg-white/5 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-bold">{t.publicationsTitle}</h2>
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

        {/* Techniques */}
        <TechSection t={t} />

        {/* Timeline */}
        <section id="timeline" className="border-y border-white/10 bg-white/5 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">{t.timelineTitle}</h2>
            <ResearchTimeline items={t.timelineItems as any} />
          </div>
        </section>

        {/* More about me */}
        <MoreAboutMe t={t} />


        {/* Contact */}
        <section id="contact" className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">{t.contactTitle}</h2>
                <div className="space-y-2 text-slate-300 text-[15px]">
                  <div>Weiyi Ye</div>
                  <div>weiyiye0510@gmail.com</div>
                  <div>Zhongshan Institute for Drug Discovery</div>
                  <div>Guangdong, China 524800</div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <img
                  src="/contact.webp"
                  alt="Contact"
                  className="rounded-lg shadow-lg w-full h-full object-contain"
                />
              </div>
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
