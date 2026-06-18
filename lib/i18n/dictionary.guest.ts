export const guestDictionary = {
  // invite landing
  invitePre: { en: "You are cordially invited", ar: "يسعدنا دعوتكم" },
  inviteTitle: {
    en: "Inauguration of Banan Residential Villas",
    ar: "افتتاح فلل بنان السكنية",
  },
  inviteLead: {
    en: "An evening to unveil Riyadh's newest landmark in elevated living. Join the Talaat Moustafa Group family for the official opening of Banan.",
    ar: "أمسية للكشف عن أحدث معالم الرياض في الحياة الراقية. انضموا إلى عائلة مجموعة طلعت مصطفى في الافتتاح الرسمي لبنان.",
  },
  factDate: { en: "Date", ar: "التاريخ" },
  factTime: { en: "Time", ar: "الوقت" },
  factVenue: { en: "Venue", ar: "المكان" },
  venueTbd: { en: "To be announced", ar: "سيتم الإعلان عنه" },
  guestGreeting: { en: "Dear", ar: "عزيزي" },
  acceptInvite: { en: "Accept invitation", ar: "قبول الدعوة" },
  declineInvite: { en: "Decline", ar: "تعذر الحضور" },
  alreadyResponded: { en: "You've already responded", ar: "تم تسجيل ردكم مسبقاً" },
  viewYourPass: { en: "View your pass", ar: "عرض بطاقتك" },
  inviteNotFoundTitle: { en: "Invitation not found", ar: "لم يتم العثور على الدعوة" },
  inviteNotFoundBody: {
    en: "This link may have expired or been entered incorrectly. Please check the link sent to you, or contact the organizers.",
    ar: "قد يكون هذا الرابط منتهي الصلاحية أو تم إدخاله بشكل غير صحيح. يرجى التحقق من الرابط المُرسل إليك أو التواصل مع المنظمين.",
  },

  // RSVP form
  rsvpEyebrow: { en: "Reservation", ar: "الحجز" },
  rsvpTitle: { en: "Confirm your attendance", ar: "تأكيد حضورك" },
  fieldPartySize: { en: "Number of guests", ar: "عدد الضيوف" },
  fieldSlot: { en: "Preferred date & time", ar: "التاريخ والوقت المفضل" },
  fieldTransfer: { en: "Transfer request", ar: "طلب التوصيل" },
  transferNone: { en: "Not required", ar: "غير مطلوب" },
  transferShuttle: { en: "Group shuttle", ar: "حافلة جماعية" },
  transferVip: { en: "Private VIP car", ar: "سيارة خاصة" },
  consentLabel: {
    en: "I agree that my information will be used to process this RSVP and to send me communications about the Banan inauguration.",
    ar: "أوافق على استخدام معلوماتي لمعالجة هذا الحجز وإرسال تواصل بخصوص افتتاح بنان.",
  },
  consentRequired: { en: "Please accept to continue.", ar: "يرجى الموافقة للمتابعة." },
  rsvpGenericError: {
    en: "Something went wrong submitting your RSVP. Please try again.",
    ar: "حدث خطأ أثناء إرسال تأكيدك. يرجى المحاولة مرة أخرى.",
  },
  submitRsvp: { en: "Submit RSVP", ar: "إرسال التأكيد" },
  submitting: { en: "Submitting…", ar: "جارٍ الإرسال…" },
  back: { en: "Back", ar: "رجوع" },

  // confirmation
  confEyebrow: { en: "Reservation confirmed", ar: "تم تأكيد الحجز" },
  confTitle: { en: "We look forward to hosting you", ar: "نتطلع لاستضافتكم" },
  confLead: {
    en: "Your personal access pass is ready. Present the QR code at the venue entrance — no printed ticket needed.",
    ar: "بطاقة الدخول الخاصة بك جاهزة. اعرض رمز الاستجابة السريعة عند مدخل الفعالية — دون الحاجة لتذكرة مطبوعة.",
  },
  badgeSub: { en: "Inauguration · Access Pass", ar: "الافتتاح · بطاقة الدخول" },
  badgePre: { en: "This pass admits", ar: "تصرح هذه البطاقة بدخول" },
  badgeGuests: { en: "guests", ar: "ضيوف" },
  badgeTransfer: { en: "Transfer", ar: "التوصيل" },
  next1: {
    en: "Your QR pass is also sent to your mobile and email.",
    ar: "ترسل بطاقتك أيضاً إلى جوالك وبريدك الإلكتروني.",
  },
  next2: {
    en: "A reminder arrives before the event via WhatsApp.",
    ar: "يصلك تذكير قبل الفعالية عبر واتساب.",
  },
  next3: {
    en: "Scan your pass on arrival for contactless accreditation.",
    ar: "اسحب بطاقتك عند الوصول لتسجيل دخول سريع.",
  },

  // declined
  declinedTitle: { en: "Sorry to miss you", ar: "يؤسفنا عدم حضوركم" },
  declinedBody: {
    en: "Thank you for letting us know. We hope to welcome you to Banan another time.",
    ar: "شكراً لإعلامنا. نتمنى أن نستضيفكم في بنان في وقت آخر.",
  },
  changedYourMind: { en: "Changed your mind?", ar: "غيرت رأيك؟" },

  demoBadge: { en: "Preview · not a real invitation", ar: "معاينة · ليست دعوة حقيقية" },
} as const;
