export const organizerDictionary = {
  orgLoginEyebrow: { en: "Organizer console", ar: "لوحة المنظمين" },
  orgLoginTitle: { en: "Sign in", ar: "تسجيل الدخول" },
  fieldEmail: { en: "Email", ar: "البريد الإلكتروني" },
  fieldPassword: { en: "Password", ar: "كلمة المرور" },
  signIn: { en: "Sign in", ar: "تسجيل الدخول" },
  invalidCredentials: { en: "Incorrect email or password.", ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة." },
  backToEvent: { en: "Back to event", ar: "الرجوع إلى الفعالية" },
  demoAccountsTitle: { en: "Demo accounts (preview only)", ar: "حسابات تجريبية (للمعاينة فقط)" },
  demoAccountsHint: {
    en: "No real backend is connected yet — use any of these to preview each role.",
    ar: "لا يوجد اتصال حقيقي بالخادم بعد — استخدم أحد هذه الحسابات لمعاينة كل صلاحية.",
  },
  useThisAccount: { en: "Use", ar: "استخدام" },
  signOut: { en: "Sign out", ar: "تسجيل الخروج" },

  roleAdmin: { en: "Admin", ar: "مدير" },
  roleCheckinStaff: { en: "Check-in staff", ar: "فريق تسجيل الحضور" },
  roleBroadcastManager: { en: "Broadcast manager", ar: "مسؤول الإشعارات" },
  roleViewer: { en: "Read-only viewer", ar: "مُشاهد فقط" },

  navDashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  navGuests: { en: "Guest List", ar: "قائمة الضيوف" },
  navBroadcasts: { en: "Broadcasts", ar: "الإشعارات" },
  navCheckin: { en: "Check-in", ar: "تسجيل الحضور" },
  navTeam: { en: "Team", ar: "الفريق" },
  navSettings: { en: "Settings", ar: "الإعدادات" },

  orgEyebrow: { en: "Banan Inauguration · Control room", ar: "افتتاح بنان · غرفة التحكم" },
  dashTitle: { en: "Event command dashboard", ar: "لوحة قيادة الفعالية" },

  statRsvp: { en: "Total RSVPs", ar: "إجمالي الحجوزات" },
  statRsvpD: { en: "confirmed reservations", ar: "حجوزات مؤكدة" },
  statGuests: { en: "Expected guests", ar: "الضيوف المتوقعون" },
  statGuestsD: { en: "heads on the night", ar: "الحضور ليلة الفعالية" },
  statTransfer: { en: "Transfer requests", ar: "طلبات التوصيل" },
  statTransferD: { en: "shuttle + VIP", ar: "حافلة + خاصة" },
  statCheck: { en: "Checked in", ar: "تم تسجيلهم" },
  statCheckD: { en: "live on-site", ar: "مباشر في الموقع" },

  chartTrend: { en: "RSVPs over time", ar: "الحجوزات عبر الوقت" },
  chartNationality: { en: "Guests by nationality", ar: "الضيوف حسب الجنسية" },
  chartSlot: { en: "Attendance by slot", ar: "الحضور حسب الموعد" },
  chartTransfer: { en: "Transfer split", ar: "توزيع التوصيل" },

  comingSoonTitle: { en: "Coming in the next phase", ar: "قريباً في المرحلة القادمة" },
  comingSoonGuests: {
    en: "Guest list management, search/filter, and CSV import will land once the database is connected.",
    ar: "ستتوفر إدارة قائمة الضيوف والبحث والفلترة واستيراد CSV بعد ربط قاعدة البيانات.",
  },
  comingSoonBroadcasts: {
    en: "Audience segments and multi-channel broadcasts will land once the database and messaging providers are connected.",
    ar: "ستتوفر شرائح الجمهور والإشعارات متعددة القنوات بعد ربط قاعدة البيانات ومزودي الرسائل.",
  },
  comingSoonCheckin: {
    en: "The live camera QR scanner will land once the database is connected.",
    ar: "سيتوفر ماسح رمز الاستجابة السريعة المباشر بعد ربط قاعدة البيانات.",
  },
  comingSoonTeam: {
    en: "Organizer account management will land once Supabase Auth is connected.",
    ar: "ستتوفر إدارة حسابات المنظمين بعد ربط نظام المصادقة.",
  },
  comingSoonSettings: {
    en: "Editable event date, venue, and slot settings will land once the database is connected.",
    ar: "ستتوفر إعدادات قابلة للتعديل للتاريخ والمكان والمواعيد بعد ربط قاعدة البيانات.",
  },
} as const;
