(() => {
  const languageToggle = document.querySelector("[data-language-toggle]");
  const languageToggleLabel = languageToggle?.querySelector(".portfolio-nav__link-label");
  const isChinese = new URLSearchParams(window.location.search).get("lang") === "zh";

  const chineseCopy = {
    title: "我用 AI 做了三个产品，也重新学会了怎么做产品 - Qian Zhao",
    description: "从 Catfolio、Catfill 到 MOMO：当开发速度不再是瓶颈，真正困难的是边界、判断和取舍",
    heroTitle: "我用 AI 做了三个产品，也重新学会了怎么做产品",
    heroSummary: "从 Catfolio、Catfill 到 MOMO：当开发速度不再是瓶颈，真正困难的是边界、判断和取舍",
    railTitle: "我用 AI 做了三个产品",
    railLinks: [
      "Catfolio：想法与失控",
      "Catfill：清晰的边界",
      "MOMO：从收集一切，到先做好一次旅行",
      "AI 与产品判断",
    ],
    lede: [
      "这几个月，我一直在做各种实验：把脑海里的一些想法，真正做成可以运行、甚至可以上线的产品。",
      "目前，这些产品的大多数用户仍然是我自己。但在这个过程中，我学到了很多关于 AI 编程的技巧，也踩了不少坑。",
      "这不是一篇 AI 编程教程，更像是一份阶段性的产品记录。它可能有一点长，也不一定提供标准答案，但我希望这些真实的经历，能对同样在使用 AI 做产品的人有所帮助。",
    ],
    headings: [
      "Catfolio：AI 把我的想法全部做了出来，也把问题全部放大了",
      "Catfill：一个足够小、足够清晰的产品",
      "MOMO：从收集一切，到先做好一次旅行",
      "AI 编程并没有减少产品判断的重要性",
    ],
    catfolio: [
      [
        "我最开始做的产品，是一个管理个人股票投资组合的 Dashboard，叫作 <strong>Catfolio</strong>。",
        "这个想法来自一个很实际的问题。",
        "我有多个投资账户，在不同时间买入和卖出股票。如果想知道真实的持仓成本、投资收益，以及整个 Portfolio 的表现，手动计算会非常麻烦。",
        "与此同时，我也在学习一些量化投资知识。我希望有一个属于自己的平台，可以测试不同的算法、指标和投资策略，而不是只能使用现成工具提供的固定功能。",
        "所以，我决定自己做一个。",
        "从项目开始，我就做了一个比较激进的决定：<strong>不使用 Figma，也不采用传统的产品设计和开发流程，直接让 AI 完成整个产品。</strong>",
        "界面由 Claude Code 设计，代码也几乎全部由 AI 编写。我通过 Design System 管理组件和样式，再不断地告诉 AI 增加新的功能。",
        "一开始，这种感觉非常好。",
        "一个想法只要说出来，很快就能变成一个真实的功能。过去可能需要设计师和工程师花几天完成的工作，现在几个小时就能看到结果。",
        "但当产品发展到一定规模后，问题开始出现。",
        "功能越来越多，图表越来越多，页面之间的关系变得越来越复杂。AI 每次都可以完成眼前的任务，却很难主动判断这个功能到底应不应该存在，以及它与整个产品之间是什么关系。",
        "结果就是，产品虽然一直在增长，却逐渐失去了清晰的核心。",
        "代码也开始变得难以管理。一个功能的修改会影响其他页面，新的 Bug 不断出现，AI 为了修复一个问题，又可能制造出另外几个问题。项目越大，AI Coding 反而变得越慢。",
        "视觉上也有类似的问题。",
        "即使建立了 Design System，整个产品看起来依然有很强的“AI 味”：组件是统一的，间距也基本正确，但缺少真正的层级、节奏和细致的判断。",
        "<span class=\"article-hand-circle\" data-hand-circle>我后来意识到，Design System 可以让一个产品保持一致，却不能自动让一个产品拥有品味。</span>",
        "为了解决这些问题，我停止继续增加功能，重新回到产品本身。",
        "我砍掉了大部分图表，只保留真正能够帮助我理解投资组合的几个核心视图；重新规划了信息架构，调整了功能优先级，也重新安排了页面层级。",
        "在视觉上，我重新手动设计了主要界面，重新处理字体、间距、信息密度和交互细节，尽量洗掉产品中那种模板化的 AI 感。",
        "现在，我正在逐步加回之前的一些好想法，但不再只是把它们直接堆进产品，而是以更有规则、更容易维护的方式加入。",
      ],
      ["当工具变得更快时，模糊的产品方向反而会变得更加危险。因为在你意识到问题之前，AI 可能已经沿着错误的方向跑了很远。"],
    ],
    catfolioLesson: [
      "Catfolio 给我的第一个教训",
      "AI 可以非常快地执行一个方向，但它不会主动告诉你，这个方向是不是错的。",
    ],
    catfill: [
      [
        "第二个产品是 <strong>Catfill</strong>。",
        "Catfill 是一个 Chrome 填表插件。用户可以让它学习自己的个人资料，也可以手动导入内容。之后在遇到表单时，只需要点击一次，它就可以自动填写页面中的大部分字段。",
        "但它有一个非常重要的边界：",
        "Catfill 只负责填写，不负责提交。",
        "无论是求职申请、注册资料，还是其他重要表单，最终的检查和提交都必须由用户自己完成。",
        "它可以减少重复劳动，但不会替用户做重要决定。",
      ],
      [
        "和 Catfolio 相比，Catfill 的功能非常简单，也非常清晰。它不是一个大而全的平台，只解决一个具体的问题：<strong>帮助用户更快地填写重复表单。</strong>",
        "这一次，我改变了使用 AI 的方式。",
        "在开始写代码之前，我先调研了产品的技术细节，了解浏览器插件可以读取哪些内容、不同表单组件应该如何识别，以及哪些操作可能存在风险。",
        "然后，我先设计完整的产品流程，确定功能边界和异常情况，再把相对明确的任务交给 AI 实现。",
        "<span class=\"article-hand-underline\" data-hand-underline>这一次，我明显感觉自己重新掌握了方向盘。</span>",
        "AI 不再负责决定产品应该是什么，而是负责帮助我更快地实现已经想清楚的方案。",
        "因为范围足够明确，代码也更容易维护。遇到问题时，我能够判断问题出在哪里，而不是让 AI 在一个越来越复杂的系统里反复尝试。",
        "我还为 Catfill 手绘了几张插图，希望它不仅是一个有用的工具，也能够拥有一些属于自己的性格。",
        "最终，这个产品真正上线了。",
        "我甚至开始尝试推广它。虽然推广和商业化仍然是我接下来需要继续学习的部分，但 Catfill 至少让我第一次完整地经历了从想法、设计、开发、测试到发布的全过程。",
        "Catfill 让我意识到，AI 最适合执行的，不是一个模糊而宏大的愿景，而是一个边界清晰、逻辑明确的问题。",
        "在使用 AI 编程之前，最重要的可能不是写出一个更好的 Prompt，而是先回答几个更基础的问题：",
      ],
      ["当这些问题足够清楚时，AI 才真正开始变得高效。"],
    ],
    catfillQuestions: [
      "这个产品到底解决什么问题？",
      "它不解决什么问题？",
      "哪些事情可以自动完成？",
      "哪些决定必须留给用户？",
    ],
    momo: [
      [
        "第三个产品是 <strong>MOMO</strong>。",
        "MOMO 的设想比前两个产品都更大。",
        "我希望它能够在完全本地运行的前提下，收集和理解一个人的各种信息，包括浏览记录、邮件、笔记、照片、日程、待办事项和会议记录。",
        "这些信息不会离开用户自己的设备。未来，我也可能使用 macOS 27 的 Foundation Models framework，让信息理解和 AI 分析同样在本地完成。对 MOMO 来说，隐私不是后续补上的功能，而是产品最基本的设计前提。",
        "当用户需要时，它可以自动整理相关资料，以一种清晰、漂亮的方式呈现出来，并根据现有信息提出下一步建议，帮助用户做决定。",
        "比如，当用户正在计划一次旅行时，MOMO 可以知道哪些酒店和机票已经预订，哪些租车公司只是浏览过，哪些活动还没有决定。",
        "它不只是保存信息，而是希望理解这些信息之间的关系。",
        "这一次，我吸取了 Catfolio 的教训。",
        "我先手动设计界面，再交给 AI 实现。在正式开发之前，我也和 AI 进行了很长时间的技术讨论，寻找合适的实现方案，研究是否有成熟的开源组件可以使用，尽量避免重复造轮子。",
        "我还专门选择了相对成熟、对 AI 编程比较友好的技术栈，希望减少 AI 在冷门框架和复杂环境中出错的概率。",
        "前端使用了 Electron。因为 Electron 本身带有浏览器能力，我希望未来在处理网页和浏览行为时，可以直接利用这些能力，而不是完全依赖外部浏览器。",
        "最初的进展非常顺利。",
        "MOMO 可以记录用户的操作，也可以记录在 Chrome 中访问过的网页。",
        "但很快，一个更根本的问题出现了：",
        "它记录了用户访问过什么，却不真正理解用户看到了什么。",
        "最开始，系统得到的主要信息只是网页标题和链接。",
        "但一个网页标题和一个 URL，远远不足以告诉 AI 页面里真正重要的内容是什么。它不知道用户关注的是价格、日期、地点、产品参数，还是其中的一段文字。",
        "这让我意识到，AI 产品的能力上限，很多时候并不取决于模型有多聪明，而取决于你给它的数据有多好。",
        "如果输入只是杂乱的浏览记录，模型就只能根据有限的信息进行猜测。",
        "如果能够把网页中的正文、结构、价格、日期和用户真正关注的部分提取出来，并清洗成干净的上下文，AI 才有机会生成真正有价值的结果。",
        "于是，我开始加入新的内容提取和预处理组件，帮助系统清洗已经收集到的信息。",
        "但这里仍然需要一定程度的人工干预。",
        "用户需要通过自己的行为，或者通过明确的操作，告诉系统哪些内容是重要的。因为同一个网页里可能包含大量信息，但真正与当前任务有关的，可能只有其中很小的一部分。",
        "网页内容清洗得越准确，最终生成的报告就越有价值。",
        "技术问题逐渐清楚以后，我又遇到了另一个更熟悉的问题。",
        "我再次把产品想得太大了。",
        "我希望 MOMO 可以统一管理所有个人信息，在任何场景里都能自动工作：旅行、研究、购物、求职、会议、日程和个人知识管理。",
        "它似乎什么都能做。",
        "但换一个角度看，这也意味着它没有一个足够明确的起点。",
        "<span class=\"article-hand-underline\" data-hand-underline>我感觉自己不是在做一个产品，而是在尝试做一个新的个人操作系统。这已经远远超出了我和现阶段 AI 的能力。</span>",
        "这其实是我在 Catfolio 中犯过的同一个错误：在一个场景还没有真正做好的时候，就开始想象一个可以覆盖所有场景的平台。",
        "意识到这一点后，我砍掉了大部分功能，并重新建立了一个更小的产品分支。",
        "这个版本只做一件事情：<strong>根据用户已经浏览、收到和保存的信息，生成一份完整的旅行报告。</strong>",
        "它仍然保留后台的信息收集和分析能力，但输出场景被限制在旅行规划中。",
        "它需要先准确回答一些具体问题：",
      ],
      [
        "只有当旅行报告能够稳定、准确、完整地输出时，我才会考虑继续适配研究、购物或者其他场景。",
        "<span class=\"article-hand-underline article-hand-underline--green\" data-hand-underline>这一次，我不再从“它最终可以做什么”开始，而是从“它现在必须把哪一件事情做好”开始。</span>",
      ],
    ],
    momoQuestions: [
      "哪些机票和酒店已经预订？",
      "哪些内容只是浏览过？",
      "还有哪些事项没有完成？",
      "用户下一步应该做什么？",
    ],
    judgement: [
      [
        "回头看，这三个产品分别让我理解了 AI 产品开发的不同层面。",
        "Catfolio 让我看到，当功能缺少控制时，AI 的高效率也会迅速制造大量产品债务和技术债务。",
        "Catfill 让我理解，一个范围足够小、边界足够清晰的产品，更容易真正完成和上线。",
        "MOMO 则让我意识到，对于 AI 产品来说，真正困难的往往不是调用模型，而是如何获得、清洗和组织高质量的上下文，以及如何找到一个足够具体的使用场景。",
        "AI 确实大幅降低了制作产品的门槛。",
        "它可以写代码、搭建界面、处理数据、修复 Bug，甚至提供产品建议。一个人现在可以完成过去需要一个小团队才能完成的事情。",
        "但它并没有替代产品判断。",
        "相反，因为实现变得更快，判断可能变得比以前更加重要。",
        "现在的 AI 往往不会阻止一个不合理的需求。你提出一个没有边界、甚至不太靠谱的想法，它依然会非常积极地帮你实现。",
        "它不会自然地问你：",
      ],
      [
        "也许未来的模型会更擅长挑战用户的假设，但至少在现阶段，方向仍然需要人来控制。",
        "人需要决定问题、边界、优先级、信息层级和产品品味，也需要知道什么时候应该继续，什么时候应该停下来砍掉功能。",
        "AI 更像是一支执行速度极快、永远充满热情，却不太会拒绝需求的团队。",
        "而我们的责任，是在它开始快速执行之前，先想清楚什么值得被做。",
        "这就是我最近几个月使用 AI 制作产品的最新记录。",
      ],
    ],
    judgementQuestions: [
      "这个功能真的有人需要吗？",
      "它是不是让产品变得更复杂了？",
      "这个问题是否值得解决？",
      "我们是不是应该先停下来？",
    ],
    finalQuote: "我现在越来越相信，真正重要的不是 AI 能帮我写多少代码，而是我能否在它写得太快之前，先把问题想清楚。",
  };

  const applyHtmlList = (elements, copy) => {
    elements.forEach((element, index) => {
      if (copy[index] !== undefined) element.innerHTML = copy[index];
    });
  };

  const applySectionCopy = (sectionId, groups) => {
    const section = document.getElementById(sectionId);
    const proseGroups = Array.from(section?.querySelectorAll(".article-prose") || []);
    groups.forEach((copy, index) => {
      applyHtmlList(Array.from(proseGroups[index]?.querySelectorAll("p") || []), copy);
    });
  };

  if (isChinese) {
    document.documentElement.lang = "zh-CN";
    document.title = chineseCopy.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", chineseCopy.description);
    document.getElementById("article-title").textContent = chineseCopy.heroTitle;
    document.querySelector(".article-hero__summary").textContent = chineseCopy.heroSummary;
    document.querySelector(".article-rail").setAttribute("aria-label", "文章章节");
    const railTitles = Array.from(document.querySelectorAll(".article-rail__title"));
    if (railTitles.length) railTitles.at(-1).textContent = chineseCopy.railTitle;
    applyHtmlList(Array.from(document.querySelectorAll("[data-section-link]")), chineseCopy.railLinks);
    document.querySelector(".article-lede").setAttribute("aria-label", "文章引言");
    applyHtmlList(Array.from(document.querySelectorAll(".article-lede > p")), chineseCopy.lede);
    applyHtmlList(Array.from(document.querySelectorAll("[data-article-section] .article-section__header h2")), chineseCopy.headings);
    applySectionCopy("catfolio", chineseCopy.catfolio);
    applyHtmlList(Array.from(document.querySelectorAll("#catfolio .article-lesson > *")), chineseCopy.catfolioLesson);
    applySectionCopy("catfill", chineseCopy.catfill);
    applyHtmlList(Array.from(document.querySelectorAll("#catfill .article-questions li")), chineseCopy.catfillQuestions);
    applySectionCopy("momo", chineseCopy.momo);
    applyHtmlList(Array.from(document.querySelectorAll("#momo .article-questions li")), chineseCopy.momoQuestions);
    applySectionCopy("judgement", chineseCopy.judgement);
    applyHtmlList(Array.from(document.querySelectorAll("#judgement .article-questions li")), chineseCopy.judgementQuestions);
    document.querySelector(".article-final-quote p").textContent = chineseCopy.finalQuote;
  }

  if (languageToggle && languageToggleLabel) {
    languageToggleLabel.textContent = isChinese ? "English" : "中文";
    languageToggle.setAttribute("href", isChinese ? "./ai-products.html" : "?lang=zh");
    languageToggle.setAttribute("aria-label", isChinese ? "切换到英文" : "Switch to Chinese");
    languageToggle.closest("nav")?.setAttribute("aria-label", isChinese ? "语言切换" : "Language switcher");

    languageToggle.addEventListener("click", (event) => {
      event.preventDefault();

      const articleSections = Array.from(document.querySelectorAll("[data-article-section]"));
      const currentSection = articleSections
        .filter((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.42)
        .at(-1);
      const hash = currentSection ? `#${currentSection.id}` : window.location.hash;
      window.location.href = isChinese
        ? `./ai-products.html${hash}`
        : `?lang=zh${hash}`;
    });
  }

  const sections = Array.from(document.querySelectorAll("[data-article-section]"));
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealAnnotation = (target, annotation) => {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      annotation.show();
      return;
    }

    let hasDrawn = false;
    const annotationObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (hasDrawn && annotation.isShowing()) {
          annotation.hide();
          window.requestAnimationFrame(() => annotation.show());
        } else {
          annotation.show();
        }

        hasDrawn = true;
      },
      { rootMargin: "-14% 0px -18%", threshold: 0.55 },
    );

    annotationObserver.observe(target);
  };

  const underlineTargets = Array.from(document.querySelectorAll("[data-hand-underline]"));

  if (underlineTargets.length && window.RoughNotation?.annotate) {
    underlineTargets.forEach((underlineTarget) => {
      const targetStyle = window.getComputedStyle(underlineTarget);
      const markerColor = targetStyle.getPropertyValue("--article-underline-color").trim();
      const underline = window.RoughNotation.annotate(underlineTarget, {
        type: "underline",
        color: markerColor || targetStyle.color,
        strokeWidth: 1.5,
        padding: [0, 1, 3, 1],
        iterations: 2,
        multiline: true,
        animate: !reduceMotion.matches,
        animationDuration: 720,
      });

      revealAnnotation(underlineTarget, underline);
    });
  }

  const circleTargets = Array.from(document.querySelectorAll("[data-hand-circle]"));

  if (circleTargets.length && window.RoughNotation?.annotate) {
    circleTargets.forEach((circleTarget) => {
      const circleStyle = window.getComputedStyle(circleTarget);
      const circleColor = circleStyle.getPropertyValue("--article-circle-color").trim();
      const circle = window.RoughNotation.annotate(circleTarget, {
        type: "circle",
        color: circleColor || circleStyle.color,
        strokeWidth: 1.35,
        padding: [10, 18, 10, 18],
        iterations: 2,
        animate: !reduceMotion.matches,
        animationDuration: 820,
      });

      revealAnnotation(circleTarget, circle);
    });
  }

  const setActiveSection = (sectionId) => {
    sectionLinks.forEach((link) => {
      const active = link.dataset.sectionLink === sectionId;
      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (sections.length && sectionLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -58%", threshold: [0.08, 0.2, 0.4] },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const catfillSection = document.getElementById("catfill");
  const catfillPlayground = document.querySelector("[data-catfill-playground]");

  if (catfillSection && catfillPlayground) {
    const wideViewport = window.matchMedia("(min-width: 1120px)");
    const catfillStickers = Array.from(catfillPlayground.querySelectorAll("[data-catfill-sticker]"));
    let catfillIsVisible = false;

    const updatePlaygroundVisibility = () => {
      const visible = catfillIsVisible && wideViewport.matches && catfillSection.classList.contains("is-open");
      catfillPlayground.classList.toggle("is-visible", visible);
      catfillPlayground.setAttribute("aria-hidden", visible ? "false" : "true");
      catfillPlayground.inert = !visible;
    };

    const catfillObserver = new IntersectionObserver(
      ([entry]) => {
        catfillIsVisible = entry.isIntersecting;
        updatePlaygroundVisibility();
      },
      { rootMargin: "-12% 0px -12%", threshold: 0 },
    );

    catfillObserver.observe(catfillSection);
    wideViewport.addEventListener("change", updatePlaygroundVisibility);
    catfillSection.addEventListener("articlecollapsechange", updatePlaygroundVisibility);
    updatePlaygroundVisibility();

    catfillStickers.forEach((sticker) => {
      sticker.addEventListener("click", () => {
        if (reduceMotion.matches) return;

        const artwork = sticker.querySelector("img");
        const direction = Number(sticker.dataset.stickerDirection) || 1;
        const restingTransform = window.getComputedStyle(artwork).transform;

        artwork.getAnimations().forEach((animation) => animation.cancel());
        artwork.animate(
          [
            { transform: restingTransform },
            { transform: `translate3d(0, -14px, 0) rotate(${direction * 4}deg)`, offset: 0.38 },
            { transform: `translate3d(0, 2px, 0) rotate(${direction * -2}deg)`, offset: 0.72 },
            { transform: restingTransform },
          ],
          { duration: 440, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      });
    });
  }

  const carousels = Array.from(document.querySelectorAll("[data-article-carousel]"));

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector(".article-carousel__viewport");
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const previousButton = carousel.querySelector("[data-carousel-previous]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let currentIndex = 0;
    let touchStartX = null;

    const showSlide = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translate3d(${-currentIndex * 100}%, 0, 0)`;

      slides.forEach((slide, index) => {
        const active = index === currentIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.inert = !active;
      });
    };

    previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton.addEventListener("click", () => showSlide(currentIndex + 1));

    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const wasImageTrigger = event.target.matches("[data-lightbox-trigger]");
      showSlide(currentIndex + (event.key === "ArrowRight" ? 1 : -1));

      if (wasImageTrigger) {
        slides[currentIndex].querySelector("[data-lightbox-trigger]")?.focus({ preventScroll: true });
      }
    });

    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
      },
      { passive: true },
    );

    viewport.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = endX - touchStartX;
        touchStartX = null;

        if (Math.abs(distance) > 44) {
          showSlide(currentIndex + (distance < 0 ? 1 : -1));
        }
      },
      { passive: true },
    );

    showSlide(0);
  });

  const lightbox = document.querySelector(".article-lightbox");
  const lightboxTriggers = Array.from(document.querySelectorAll("[data-lightbox-trigger]"));

  if (lightbox && lightboxTriggers.length) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCount = lightbox.querySelector("[data-lightbox-count]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const previousButton = lightbox.querySelector("[data-lightbox-previous]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    const allItems = lightboxTriggers.map((trigger) => {
      const image = trigger.querySelector("img");

      return {
        trigger,
        group: trigger.dataset.lightboxGroup || "article",
        src: image.currentSrc || image.src,
        alt: image.alt,
      };
    });
    let items = allItems;
    let currentIndex = 0;
    let returnFocus = null;
    let closeTimer = null;

    const updateLightbox = (nextIndex, animate = true) => {
      currentIndex = (nextIndex + items.length) % items.length;
      const item = items[currentIndex];

      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxCount.textContent = `${currentIndex + 1} / ${items.length}`;

      if (animate && !reduceMotion.matches) {
        lightboxImage.animate(
          [
            { opacity: 0, transform: "scale(0.985)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 180, easing: "ease-out" },
        );
      }
    };

    const finishClose = () => {
      window.clearTimeout(closeTimer);
      closeTimer = null;
      lightbox.classList.remove("is-closing");
      document.body.classList.remove("has-open-lightbox");

      if (lightbox.open) {
        lightbox.close();
      }
    };

    const closeLightbox = () => {
      if (!lightbox.open || lightbox.classList.contains("is-closing")) return;

      if (reduceMotion.matches) {
        finishClose();
        return;
      }

      lightbox.classList.add("is-closing");
      closeTimer = window.setTimeout(finishClose, 180);
    };

    const openLightbox = (selectedItem) => {
      window.clearTimeout(closeTimer);
      lightbox.classList.remove("is-closing");
      items = allItems.filter((item) => item.group === selectedItem.group);
      returnFocus = selectedItem.trigger;
      updateLightbox(items.indexOf(selectedItem), false);

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
        document.body.classList.add("has-open-lightbox");
        closeButton.focus({ preventScroll: true });
      } else {
        window.open(selectedItem.src, "_blank", "noopener");
      }
    };

    allItems.forEach((item) => {
      item.trigger.addEventListener("click", () => openLightbox(item));
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => updateLightbox(currentIndex - 1));
    nextButton.addEventListener("click", () => updateLightbox(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.open || lightbox.classList.contains("is-closing")) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateLightbox(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateLightbox(currentIndex + 1);
      }
    });
  }
})();

(() => {
  const collapsibleSections = [
    { id: "catfolio", index: "01" },
    { id: "catfill", index: "02" },
    { id: "momo", index: "03" },
  ];

  const style = document.createElement("style");
  style.textContent = `
    .article-collapsible {
      padding: 0 !important;
      border-top: 1px solid color-mix(in srgb, var(--article-line) 92%, transparent);
      scroll-margin-top: 38px;
    }

    .article-collapsible:last-of-type {
      border-bottom: 1px solid color-mix(in srgb, var(--article-line) 92%, transparent);
    }

    .article-collapsible > .article-section__header {
      display: none;
    }

    .article-collapsible__summary {
      display: grid;
      width: 100%;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 24px;
      align-items: center;
      margin: 0;
      padding: 26px 0;
      border: 0;
      background: transparent;
      color: var(--article-ink);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .article-collapsible__title {
      min-width: 0;
      font-size: 24px;
      font-weight: 520;
      line-height: 1.18;
      letter-spacing: -0.035em;
      text-wrap: balance;
      transition: opacity 160ms ease-out;
    }

    .article-collapsible__meta {
      display: inline-flex;
      gap: 10px;
      align-items: center;
      color: color-mix(in srgb, var(--article-ink) 42%, transparent);
      font-size: 16px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    .article-collapsible__meta::after {
      display: inline-block;
      content: "↘";
      font-size: 14px;
      transform: translateY(-1px);
      transition: transform 180ms ease-out;
    }

    .article-collapsible.is-open .article-collapsible__meta::after {
      transform: translateY(-1px) rotate(180deg);
    }

    .article-collapsible__body {
      padding: 8px 0 72px;
    }

    .article-collapsible__body[hidden] {
      display: none !important;
    }

    .article-collapsible__summary:focus-visible {
      outline: 2px solid var(--article-accent);
      outline-offset: 6px;
      border-radius: 2px;
    }

    @media (hover: hover) and (pointer: fine) {
      .article-collapsible__summary:hover .article-collapsible__title {
        opacity: 0.56;
      }
    }

    @media (max-width: 600px) {
      .article-collapsible__summary {
        gap: 18px;
        padding: 22px 0;
      }

      .article-collapsible__title {
        font-size: 21px;
        line-height: 1.22;
      }

      .article-collapsible__meta {
        font-size: 14px;
      }

      .article-collapsible__body {
        padding-top: 6px;
        padding-bottom: 58px;
      }
    }
  `;
  document.head.append(style);

  const toggleSection = (section, open, { scroll = false } = {}) => {
    const summary = section.querySelector(":scope > .article-collapsible__summary");
    const body = section.querySelector(":scope > .article-collapsible__body");
    if (!summary || !body) return;

    section.classList.toggle("is-open", open);
    summary.setAttribute("aria-expanded", open ? "true" : "false");
    body.hidden = !open;
    section.dispatchEvent(new CustomEvent("articlecollapsechange", { bubbles: true }));

    if (open && scroll) {
      window.requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  collapsibleSections.forEach(({ id, index }) => {
    const section = document.getElementById(id);
    const header = section?.querySelector(":scope > .article-section__header");
    const heading = header?.querySelector("h2");
    if (!section || !header || !heading) return;

    const body = document.createElement("div");
    body.className = "article-collapsible__body";
    body.id = `${id}-content`;
    body.hidden = true;

    Array.from(section.children).forEach((child) => {
      if (child !== header) body.append(child);
    });

    const summary = document.createElement("button");
    summary.className = "article-collapsible__summary";
    summary.type = "button";
    summary.setAttribute("aria-expanded", "false");
    summary.setAttribute("aria-controls", body.id);
    summary.innerHTML = `
      <span class="article-collapsible__title">${heading.innerHTML}</span>
      <span class="article-collapsible__meta" aria-hidden="true">${index}</span>
    `;

    section.classList.add("article-collapsible");
    header.remove();
    section.prepend(summary);
    section.append(body);

    summary.addEventListener("click", () => {
      toggleSection(section, !section.classList.contains("is-open"));
    });

    const railLink = document.querySelector(`[data-section-link="${id}"]`);
    railLink?.addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", `#${id}`);
      toggleSection(section, true, { scroll: true });
    });
  });

  const initialId = window.location.hash.slice(1);
  if (collapsibleSections.some(({ id }) => id === initialId)) {
    const initialSection = document.getElementById(initialId);
    if (initialSection) toggleSection(initialSection, true);
  }
})();
