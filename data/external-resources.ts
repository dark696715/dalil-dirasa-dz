export type Stage = "الكل" | "الابتدائي" | "المتوسط" | "الثانوي";
export type ResourceType = "درس" | "كتاب" | "تمرين" | "فرض" | "اختبار" | "فيديو" | "أداة";

export type ExternalResource = {
  id: string;
  title: string;
  source: string;
  url: string;
  stage: Exclude<Stage, "الكل">;
  grade: string;
  subject: string;
  type: ResourceType;
  description: string;
  color: string;
};

export const stages: Array<{ label: Exclude<Stage, "الكل">; caption: string; icon: string; color: string }> = [
  { label: "الابتدائي", caption: "السنة 1 إلى 5", icon: "01", color: "#168A68" },
  { label: "المتوسط", caption: "السنة 1 إلى 4", icon: "02", color: "#123B7A" },
  { label: "الثانوي", caption: "الجذع المشترك والأقسام النهائية", icon: "03", color: "#A66B12" },
];

export const resourceTypes: ResourceType[] = ["درس", "كتاب", "تمرين", "فرض", "اختبار", "فيديو", "أداة"];

export const externalResources: ExternalResource[] = [
  { id: "onps-books", title: "الكتب المدرسية الرقمية", source: "الديوان الوطني للمطبوعات المدرسية", url: "https://www.onps.dz/", stage: "الابتدائي", grade: "كل السنوات", subject: "كل المواد", type: "كتاب", description: "فهرس الكتب المدرسية الرسمية والموارد التابعة للديوان.", color: "#168A68" },
  { id: "education-primary", title: "موارد التعليم الابتدائي", source: "وزارة التربية الوطنية", url: "https://www.education.gov.dz/", stage: "الابتدائي", grade: "كل السنوات", subject: "كل المواد", type: "أداة", description: "بوابة رسمية للمعلومات والبرامج والخدمات التربوية.", color: "#168A68" },
  { id: "eddirasa-primary", title: "دروس وتمارين الابتدائي", source: "موقع الدراسة الجزائري", url: "https://eddirasa.com/primary/", stage: "الابتدائي", grade: "السنة 1 إلى 5", subject: "كل المواد", type: "درس", description: "محتوى مراجعة مصنف حسب السنوات والمواد.", color: "#168A68" },
  { id: "educationdz-primary", title: "فهرس التعليم الابتدائي", source: "التعليم الجزائري", url: "https://educationdz.com/primary/", stage: "الابتدائي", grade: "السنة 1 إلى 5", subject: "كل المواد", type: "تمرين", description: "صفحات تعليمية وتمارين للمراحل الأولى.", color: "#168A68" },
  { id: "ency-primary", title: "موسوعة الابتدائي", source: "Ency Education", url: "https://www.ency-education.net/", stage: "الابتدائي", grade: "كل السنوات", subject: "كل المواد", type: "كتاب", description: "مراجع وملفات تعليمية مرتبة حسب الطور.", color: "#168A68" },
  { id: "eddirasa-middle", title: "دروس وتمارين المتوسط", source: "موقع الدراسة الجزائري", url: "https://eddirasa.com/moyenne/", stage: "المتوسط", grade: "السنة 1 إلى 4", subject: "كل المواد", type: "درس", description: "مراجعة وملفات وفروض لسنوات التعليم المتوسط.", color: "#123B7A" },
  { id: "educationdz-middle", title: "فهرس التعليم المتوسط", source: "التعليم الجزائري", url: "https://educationdz.com/moyenne/", stage: "المتوسط", grade: "السنة 1 إلى 4", subject: "كل المواد", type: "تمرين", description: "صفحات تصنيفية للمواد والدروس والاختبارات.", color: "#123B7A" },
  { id: "dzexams-bem", title: "موارد شهادة التعليم المتوسط", source: "DzExams", url: "https://www.dzexams.com/", stage: "المتوسط", grade: "4 متوسط", subject: "كل المواد", type: "اختبار", description: "فهرس مراجعة واختبارات سابقة؛ يفتح من المصدر الأصلي.", color: "#123B7A" },
  { id: "elkhadra-bem", title: "اختبارات ومواضيع BEM", source: "الخضرة للامتحانات", url: "https://exams.elkhadra.com/", stage: "المتوسط", grade: "4 متوسط", subject: "كل المواد", type: "اختبار", description: "صفحة مراجعة لشهادة التعليم المتوسط.", color: "#123B7A" },
  { id: "eddirasa-secondary", title: "دروس وتمارين الثانوي", source: "موقع الدراسة الجزائري", url: "https://eddirasa.com/secondaire/", stage: "الثانوي", grade: "كل السنوات", subject: "كل المواد", type: "درس", description: "موارد الثانوي والجذوع المشتركة والشهادات.", color: "#A66B12" },
  { id: "educationdz-secondary", title: "فهرس التعليم الثانوي", source: "التعليم الجزائري", url: "https://educationdz.com/secondaire/", stage: "الثانوي", grade: "كل السنوات", subject: "كل المواد", type: "كتاب", description: "تصنيف دروس وملفات الثانوي حسب المستوى.", color: "#A66B12" },
  { id: "dzexams-bac", title: "موارد شهادة البكالوريا", source: "DzExams", url: "https://www.dzexams.com/", stage: "الثانوي", grade: "3 ثانوي", subject: "كل المواد", type: "اختبار", description: "فهرس مواضيع واختبارات للمراجعة من الموقع الأصلي.", color: "#A66B12" },
  { id: "onefd", title: "التعليم والتكوين عن بعد", source: "ONEFD", url: "https://onefd.edu.dz/", stage: "الثانوي", grade: "كل السنوات", subject: "كل المواد", type: "أداة", description: "المنصة الرسمية للتعليم والتكوين عن بعد.", color: "#A66B12" },
  { id: "education-ministry", title: "بوابة وزارة التربية الوطنية", source: "وزارة التربية الوطنية", url: "https://www.education.gov.dz/", stage: "الثانوي", grade: "كل السنوات", subject: "كل المواد", type: "أداة", description: "المصدر الرسمي للبرامج والأخبار والخدمات التربوية.", color: "#A66B12" },
  { id: "teacher-space", title: "فضاء الأستاذ", source: "وزارة التربية الوطنية", url: "https://ostad.education.dz/auth", stage: "الثانوي", grade: "كل السنوات", subject: "كل المواد", type: "أداة", description: "خدمة رسمية موجهة للأساتذة؛ قد تتطلب تسجيل دخول.", color: "#A66B12" },
];

export const isAllowedResourceUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    const allowed = ["education.gov.dz", "onps.dz", "onefd.edu.dz", "eddirasa.com", "educationdz.com", "ency-education.net", "dzexams.com", "elkhadra.com", "inkidia.com.dz"];
    return parsed.protocol === "https:" && allowed.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
};
