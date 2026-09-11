export const translations = {
  en: {
    // App & Brand
    brandName: 'SpendWise',
    saasBadge: 'SaaS',
    demoModeBadge: 'Interactive Demo Mode',
    demoModeTooltip: 'Running in Interactive Demo Mode. Provide credentials in .env to connect live Firebase.',

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      expenses: 'Expenses',
      analytics: 'Analytics',
      profile: 'Profile',
      myProfile: 'My Profile',
      logOut: 'Log Out',
      addExpense: 'Add Expense'
    },

    // Categories
    categories: {
      Food: 'Food',
      Transportation: 'Transportation',
      Shopping: 'Shopping',
      Bills: 'Bills',
      Entertainment: 'Entertainment',
      Health: 'Health',
      Education: 'Education',
      Other: 'Other',
      all: 'All Categories'
    },

    // Dashboard
    dashboard: {
      welcomeBack: 'Welcome back',
      snapshot: 'Here is your financial snapshot for',
      totalExpenses: 'Total Expenses',
      allTimeCumulative: 'All-time cumulative',
      thisMonth: 'This Month',
      currentCalendarMonth: 'Current calendar month',
      today: 'Today',
      spentLast24h: 'Spent in last 24h',
      totalTransactions: 'Total Transactions',
      loggedTransactions: 'Logged transactions',
      monthlyTrend: 'Monthly Expenditure Trend',
      monthlySubtitle: 'Spending history across recent months',
      expensesByCategory: 'Expenses by Category',
      categorySubtitle: 'Distribution of your spending',
      recentExpenses: 'Recent Expenses',
      recentSubtitle: 'Your latest recorded transactions',
      viewAll: 'View All',
      analyticsLink: 'Analytics',
      logExpense: 'Log Expense',
      noDataYet: 'No expenses recorded yet',
      noSpendingPeriod: 'No spending recorded for this period'
    },

    // Expenses Page
    expensesPage: {
      title: 'Expenses',
      subtitle: 'Manage, filter, search, and track all your logged transactions',
      exportCsv: 'Export CSV',
      addExpense: 'Add Expense',
      searchPlaceholder: 'Search by expense name or description...',
      filterByDate: 'Filter by date',
      sortBy: 'Sort by',
      sortNewest: 'Newest to Oldest',
      sortOldest: 'Oldest to Newest',
      sortHighest: 'Highest to Lowest ($)',
      sortLowest: 'Lowest to Highest ($)',
      resetFilters: 'Reset',
      showing: 'Showing',
      of: 'of',
      expensesCount: 'expenses',
      filteredTotal: 'Filtered Total',
      noExpensesFound: 'No expenses found',
      noExpensesDesc: 'No records match your criteria, or you have not logged any expenses yet.',
      addFirstExpense: 'Add First Expense',
      tableHeaders: {
        details: 'Expense Details',
        category: 'Category',
        date: 'Date',
        amount: 'Amount',
        actions: 'Actions'
      }
    },

    // Expense Form / Modal
    expenseForm: {
      addTitle: 'Add New Expense',
      editTitle: 'Edit Expense',
      nameLabel: 'Expense Name',
      namePlaceholder: 'e.g. Grocery Shopping, Electric Bill',
      amountLabel: 'Amount ($)',
      dateLabel: 'Date',
      categoryLabel: 'Category',
      descriptionLabel: 'Description (Optional)',
      descPlaceholder: 'Add notes, store location, or items purchased...',
      cancelBtn: 'Cancel',
      addBtn: 'Add Expense',
      saveBtn: 'Save Changes',
      errors: {
        titleRequired: 'Expense title is required.',
        titleShort: 'Title must be at least 2 characters.',
        amountRequired: 'Amount is required.',
        amountInvalid: 'Please enter a valid amount greater than 0.',
        categoryInvalid: 'Please select a valid category.',
        dateRequired: 'Expense date is required.'
      },
      toastAddSuccess: 'New expense logged successfully!',
      toastEditSuccess: 'Expense updated successfully!',
      toastDeleteSuccess: 'Expense deleted successfully.'
    },

    // Confirm Delete Modal
    confirmModal: {
      title: 'Delete Expense',
      confirmMessage: 'Are you sure you want to delete "{title}" (${amount})? This action cannot be undone.',
      cancelBtn: 'Cancel',
      deleteBtn: 'Delete Expense'
    },

    // Analytics Page
    analytics: {
      title: 'Financial Analytics',
      subtitle: 'Deep-dive visual breakdown of your expenditures, distributions, and trends',
      monthlyTrend: 'Monthly Expenditure Trend',
      monthlySubtitle: 'Aggregated monthly spending over time',
      spendingByCategory: 'Spending by Category',
      categorySubtitle: 'Relative share of each category',
      distributionTitle: 'Category Distribution Analysis',
      distributionSubtitle: 'Breakdown by volume, average transaction size, and share of wallet',
      tableCategory: 'Category',
      tableTotal: 'Total Spent',
      tableShare: 'Share (%)',
      tableTx: 'Transactions',
      tableAvg: 'Avg / Transaction',
      noData: 'No expense data available for analytics yet.',
      topExpensesTitle: 'Top Largest Transactions',
      topExpensesSubtitle: 'The three highest single expenses in your account history',
      biggestBadge: 'BIGGEST'
    },

    // Profile Page
    profile: {
      title: 'Account Profile',
      subtitle: 'Manage your personal details, credentials, and account preferences',
      activeAccount: 'Active Account',
      loggedTransactions: 'Logged Transactions',
      editInfo: 'Personal Information',
      fullNameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailHelpText: 'Your registered email address used for sign-in.',
      accountCreated: 'Account Created',
      saveNameBtn: 'Save Name Changes',
      privacyTitle: 'Firestore Data Privacy & Isolation',
      privacyDesc: 'Your account strictly owns its private data tree under users/{userId}/expenses. Firestore security rules guarantee that no other user can read or modify your financial logs.',

      // Email Change Section
      changeEmailTitle: 'Change Email Address',
      changeEmailDesc: 'Update your login email address. For security, your current password is required.',
      newEmailLabel: 'New Email Address',
      newEmailPlaceholder: 'new-email@company.com',
      currentPasswordLabel: 'Current Password',
      currentPasswordPlaceholder: '••••••••',
      updateEmailBtn: 'Update Email Address',

      // Danger Zone / Delete Account
      dangerZoneTitle: 'Danger Zone',
      deleteAccountDesc: 'Permanently delete your account and all associated Firestore expenses. This action is irreversible.',
      deleteAccountBtn: 'Delete Account',
      deleteModalTitle: 'Permanently Delete Account',
      deleteModalWarning: 'This action cannot be undone. All your expenses, analytics history, and profile data will be permanently wiped from Cloud Firestore and Firebase Authentication.',
      deletePasswordConfirmPrompt: 'Please enter your current password to confirm account deletion:',
      confirmDeleteBtn: 'Permanently Delete My Account',

      // Validation & Toasts
      nameRequired: 'Full name cannot be empty.',
      nameShort: 'Full name must be at least 2 characters.',
      emailInvalid: 'Please enter a valid email address.',
      passwordRequired: 'Password is required to confirm this action.',
      toastNameSuccess: 'Profile name updated successfully!',
      toastEmailSuccess: 'Email address updated successfully!',
      toastDeleteSuccess: 'Your account has been deleted successfully.'
    },

    // Auth Pages
    auth: {
      loginTitle: 'Sign in to your account',
      loginSubtitle: 'Welcome back! Manage your spending with confidence.',
      registerTitle: 'Create your account',
      registerSubtitle: 'Start tracking your personal expenses effortlessly',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. Alex Morgan',
      emailLabel: 'Email Address',
      emailPlaceholder: 'name@company.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter password',
      signInBtn: 'Sign In',
      createAccountBtn: 'Create Account',
      orExplore: 'or explore instantly',
      exploreDemoInstant: 'Explore Demo Account (Instant Access)',
      exploreDemo: 'Explore Demo Account',
      noAccountPrompt: "Don't have an account yet?",
      haveAccountPrompt: 'Already have an account?',
      signInLink: 'Sign in',
      createAccountLink: 'Create an account',
      errors: {
        fullNameRequired: 'Full name is required.',
        fullNameShort: 'Full name must be at least 2 characters.',
        emailRequired: 'Email address is required.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Password is required.',
        passwordShort: 'Password must be at least 6 characters.',
        confirmRequired: 'Confirm your password.',
        passwordsMismatch: 'Passwords do not match.',
        invalidCredential: 'Invalid email or password. Please try again.',
        emailInUse: 'An account already exists with this email address.',
        weakPassword: 'The password provided is too weak. Must be at least 6 characters.'
      }
    },

    // Common
    common: {
      loading: 'Loading...',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit'
    }
  },

  ar: {
    // App & Brand
    brandName: 'سبيند وايز',
    saasBadge: 'سحابي',
    demoModeBadge: 'الوضع التجريبي التفاعلي',
    demoModeTooltip: 'يعمل في الوضع التجريبي. أدخل بيانات فايربيس في ملف .env للمزامنة المباشرة.',

    // Navigation
    nav: {
      dashboard: 'لوحة التحكم',
      expenses: 'المصروفات',
      analytics: 'التحليلات',
      profile: 'الملف الشخصي',
      myProfile: 'حسابي',
      logOut: 'تسجيل الخروج',
      addExpense: 'إضافة مصروف'
    },

    // Categories
    categories: {
      Food: 'طعام ومشروبات',
      Transportation: 'المواصلات والنقل',
      Shopping: 'تسوق ومشتريات',
      Bills: 'فواتير ومرافق',
      Entertainment: 'ترفيه وأنشطة',
      Health: 'صحة وعناية',
      Education: 'تعليم ودورات',
      Other: 'أخرى ومتنوعة',
      all: 'جميع الفئات'
    },

    // Dashboard
    dashboard: {
      welcomeBack: 'مرحبًا بك مجددًا',
      snapshot: 'إليك ملخصك المالي ليوم',
      totalExpenses: 'إجمالي المصروفات',
      allTimeCumulative: 'تراكمي لجميع الأوقات',
      thisMonth: 'هذا الشهر',
      currentCalendarMonth: 'الشهر الحالي',
      today: 'اليوم',
      spentLast24h: 'خلال آخر 24 ساعة',
      totalTransactions: 'إجمالي المعاملات',
      loggedTransactions: 'معاملة مسجلة',
      monthlyTrend: 'مسار الإنفاق الشهري',
      monthlySubtitle: 'سجل الإنفاق على مدار الأشهر السابقة',
      expensesByCategory: 'المصروفات حسب الفئة',
      categorySubtitle: 'توزيع ميزانيتك على الفئات',
      recentExpenses: 'أحدث المصروفات',
      recentSubtitle: 'آخر المعاملات المسجلة في حسابك',
      viewAll: 'عرض الكل',
      analyticsLink: 'التحليلات',
      logExpense: 'تسجيل مصروف',
      noDataYet: 'لا توجد مصروفات مسجلة بعد',
      noSpendingPeriod: 'لا يوجد إنفاق مسجل لهذه الفترة'
    },

    // Expenses Page
    expensesPage: {
      title: 'المصروفات',
      subtitle: 'إدارة وتصفية وبحث وتتبع جميع معاملاتك المسجلة',
      exportCsv: 'تصدير CSV',
      addExpense: 'إضافة مصروف',
      searchPlaceholder: 'ابحث باسم المصروف أو الوصف...',
      filterByDate: 'تصفية حسب التاريخ',
      sortBy: 'ترتيب حسب',
      sortNewest: 'من الأحدث إلى الأقدم',
      sortOldest: 'من الأقدم إلى الأحدث',
      sortHighest: 'من الأعلى قيمة إلى الأقل ($)',
      sortLowest: 'من الأقل قيمة إلى الأعلى ($)',
      resetFilters: 'إعادة تعيين',
      showing: 'عرض',
      of: 'من أصل',
      expensesCount: 'مصروفات',
      filteredTotal: 'إجمالي التصفية',
      noExpensesFound: 'لم يتم العثور على مصروفات',
      noExpensesDesc: 'لا توجد سجلات تطابق بحثك، أو أنك لم تقم بتسجيل أي مصروف بعد.',
      addFirstExpense: 'أضف أول مصروف',
      tableHeaders: {
        details: 'تفاصيل المصروف',
        category: 'الفئة',
        date: 'التاريخ',
        amount: 'المبلغ',
        actions: 'الإجراءات'
      }
    },

    // Expense Form / Modal
    expenseForm: {
      addTitle: 'إضافة مصروف جديد',
      editTitle: 'تعديل المصروف',
      nameLabel: 'اسم المصروف',
      namePlaceholder: 'مثال: مشتريات البقالة، فاتورة الكهرباء',
      amountLabel: 'المبلغ ($)',
      dateLabel: 'التاريخ',
      categoryLabel: 'الفئة',
      descriptionLabel: 'الوصف (اختياري)',
      descPlaceholder: 'أضف ملاحظات أو اسم المتجر أو العناصر المشتراة...',
      cancelBtn: 'إلغاء',
      addBtn: 'إضافة المصروف',
      saveBtn: 'حفظ التعديلات',
      errors: {
        titleRequired: 'اسم المصروف مطلوب.',
        titleShort: 'يجب أن يتكون الاسم من حرفين على الأقل.',
        amountRequired: 'المبلغ مطلوب.',
        amountInvalid: 'يرجى إدخال مبلغ صحيح أكبر من 0.',
        categoryInvalid: 'يرجى اختيار فئة صحيحة.',
        dateRequired: 'تاريخ المصروف مطلوب.'
      },
      toastAddSuccess: 'تم تسجيل المصروف بنجاح!',
      toastEditSuccess: 'تم تحديث المصروف بنجاح!',
      toastDeleteSuccess: 'تم حذف المصروف بنجاح.'
    },

    // Confirm Delete Modal
    confirmModal: {
      title: 'حذف المصروف',
      confirmMessage: 'هل أنت متأكد من رغبتك في حذف "{title}" (${amount})؟ لا يمكن التراجع عن هذا الإجراء.',
      cancelBtn: 'إلغاء',
      deleteBtn: 'حذف المصروف'
    },

    // Analytics Page
    analytics: {
      title: 'التحليلات المالية',
      subtitle: 'تحليل بياني معمق لمصروفاتك وتوزيعاتها واتجاهاتها',
      monthlyTrend: 'مسار الإنفاق الشهري',
      monthlySubtitle: 'إجمالي الإنفاق الشهري عبر الفترات الزمنية',
      spendingByCategory: 'الإنفاق حسب الفئة',
      categorySubtitle: 'الحصة النسبية لكل فئة',
      distributionTitle: 'تحليل توزيع الفئات',
      distributionSubtitle: 'توزيع المصروفات حسب الحجم ومتوسط المعاملة والنسبة المئوية',
      tableCategory: 'الفئة',
      tableTotal: 'إجمالي الإنفاق',
      tableShare: 'النسبة (%)',
      tableTx: 'المعاملات',
      tableAvg: 'المتوسط / معاملة',
      noData: 'لا توجد بيانات مصروفات متاحة للتحليل حتى الآن.',
      topExpensesTitle: 'أكبر المعاملات المسجلة',
      topExpensesSubtitle: 'أعلى 3 مصروفات فردية في سجل حسابك',
      biggestBadge: 'الأكبر'
    },

    // Profile Page
    profile: {
      title: 'الملف الشخصي',
      subtitle: 'إدارة بياناتك الشخصية وبيانات الدخول وتفضيلات الحساب',
      activeAccount: 'حساب نشط',
      loggedTransactions: 'معاملة مسجلة',
      editInfo: 'المعلومات الشخصية',
      fullNameLabel: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسمك الكامل',
      emailLabel: 'البريد الإلكتروني',
      emailHelpText: 'بريدك الإلكتروني المسجل المستخدم لتسجيل الدخول.',
      accountCreated: 'تاريخ إنشاء الحساب',
      saveNameBtn: 'حفظ تغييرات الاسم',
      privacyTitle: 'خصوصية وعزل بيانات فايرستور',
      privacyDesc: 'يمتلك حسابك شجرة بياناته الخاصة حصريًا تحت مسار users/{userId}/expenses. تضمن قواعد أمان فايرستور عدم قدرة أي مستخدم آخر على قراءة أو تعديل بياناتك المالية.',

      // Email Change Section
      changeEmailTitle: 'تغيير البريد الإلكتروني',
      changeEmailDesc: 'قم بتحديث بريدك الإلكتروني لتسجيل الدخول. لأسباب أمنية، يلزم إدخال كلمة المرور الحالية.',
      newEmailLabel: 'البريد الإلكتروني الجديد',
      newEmailPlaceholder: 'new-email@company.com',
      currentPasswordLabel: 'كلمة المرور الحالية',
      currentPasswordPlaceholder: '••••••••',
      updateEmailBtn: 'تحديث البريد الإلكتروني',

      // Danger Zone / Delete Account
      dangerZoneTitle: 'منطقة الخطورة',
      deleteAccountDesc: 'حذف حسابك وجميع مصروفات فايرستور المرتبطة به نهائيًا. لا يمكن التراجع عن هذا الإجراء.',
      deleteAccountBtn: 'حذف الحساب نهائيًا',
      deleteModalTitle: 'تأكيد حذف الحساب نهائيًا',
      deleteModalWarning: 'لا يمكن التراجع عن هذا الإجراء إطلاقًا. سيتم مسح جميع مصروفاتك وسجلاتك المالية وحسابك بشكل دائم من فايرستور وفايربيس.',
      deletePasswordConfirmPrompt: 'يرجى إدخال كلمة المرور الحالية لتأكيد حذف الحساب:',
      confirmDeleteBtn: 'نعم، احذف حسابي نهائيًا',

      // Validation & Toasts
      nameRequired: 'الاسم الكامل مطلوب.',
      nameShort: 'يجب أن يتكون الاسم من حرفين على الأقل.',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
      passwordRequired: 'كلمة المرور مطلوبة لتأكيد هذا الإجراء.',
      toastNameSuccess: 'تم تحديث الاسم بنجاح!',
      toastEmailSuccess: 'تم تحديث البريد الإلكتروني بنجاح!',
      toastDeleteSuccess: 'تم حذف حسابك بنجاح.'
    },

    // Auth Pages
    auth: {
      loginTitle: 'تسجيل الدخول إلى حسابك',
      loginSubtitle: 'مرحبًا بك مجددًا! تتبع نفقاتك المالية بكل سهولة.',
      registerTitle: 'إنشاء حساب جديد',
      registerSubtitle: 'ابدأ في تتبع ميزانيتك ومصروفاتك اليومية باحترافية',
      fullNameLabel: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: أحمد محمد',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'name@company.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      signInBtn: 'تسجيل الدخول',
      createAccountBtn: 'إنشاء الحساب',
      orExplore: 'أو استكشف التطبيق فورًا',
      exploreDemoInstant: 'استكشاف الحساب التجريبي (دخول فوري)',
      exploreDemo: 'استكشاف الحساب التجريبي',
      noAccountPrompt: 'ليس لديك حساب بعد؟',
      haveAccountPrompt: 'هل لديك حساب بالفعل؟',
      signInLink: 'تسجيل الدخول',
      createAccountLink: 'إنشاء حساب جديد',
      errors: {
        fullNameRequired: 'الاسم الكامل مطلوب.',
        fullNameShort: 'يجب أن يتكون الاسم من حرفين على الأقل.',
        emailRequired: 'البريد الإلكتروني مطلوب.',
        emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
        passwordRequired: 'كلمة المرور مطلوبة.',
        passwordShort: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',
        confirmRequired: 'يرجى تأكيد كلمة المرور.',
        passwordsMismatch: 'كلمتا المرور غير متطابقتين.',
        invalidCredential: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        emailInUse: 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.',
        weakPassword: 'كلمة المرور ضعيفة جدًا، يجب أن تكون 6 أحرف على الأقل.'
      }
    },

    // Common
    common: {
      loading: 'جاري التحميل...',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل'
    }
  }
};
