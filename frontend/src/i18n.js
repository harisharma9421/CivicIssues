import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      common: {
        appName: 'CivicConnect',
        loading: 'Loading...',
        refresh: 'Refresh',
        exportData: 'Export Data',
        generateReport: 'Generate Report',
        logout: 'Logout',
        signIn: 'Sign in',
        signUp: 'Sign up',
        nav: {
          home: 'Home',
          about: 'About',
          services: 'Services',
          contact: 'Contact',
          approvals: 'Approvals'
        },
        adminLayout: {
          dashboard: 'Dashboard',
          analytics: 'Analytics',
          heatmap: 'Heatmap',
          reports: 'Reports',
          leaderboard: 'Leaderboard',
          monthly: 'Monthly',
          portalTitleFallback: 'Admin Portal',
          portalSubtitle: 'Manage civic issues and community engagement'
        }
      },
      auth: {
        districtAdminLogin: 'District Admin Login',
        accessDashboard: 'Access Admin Portal',
        email: 'Email Address',
        password: 'Password',
        login: 'Login',
        forgotPassword: 'Forgot password?',
        registerHere: 'Register here',
        superAdminLogin: 'Use super admin login',
        adminForgotPassword: 'Admin Forgot Password',
        resetWithEmailOtp: 'Reset your password with email OTP',
        sendOtp: 'Send OTP',
        verifyReset: 'Verify & Reset',
        enterOtp: 'Enter OTP',
        newPassword: 'New Password'
      },
      heatmap: {
        title: 'Issue Heatmap',
        subtitle: 'Visualize civic issues across different locations and categories',
        allCategories: 'All Categories',
        allStatus: 'All Status',
        category: 'Category:',
        status: 'Status:',
        issuesOnMap: 'Issues on Map',
        heatmapStats: 'Heatmap Statistics',
        totalIssues: 'Total Issues',
        highPriority: 'High Priority',
        pending: 'Pending',
        resolved: 'Resolved',
        inProgress: 'In Progress',
        rejected: 'Rejected'
      }
    }
  },
  hi: {
    translation: {
      common: {
        appName: 'CivicConnect',
        loading: 'लोड हो रहा है...',
        refresh: 'रिफ्रेश',
        exportData: 'डेटा निर्यात करें',
        generateReport: 'रिपोर्ट बनाएं',
        logout: 'लॉगआउट',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        nav: {
          home: 'होम',
          about: 'हमारे बारे में',
          services: 'सेवाएँ',
          contact: 'संपर्क',
          approvals: 'स्वीकृतियाँ'
        },
        adminLayout: {
          dashboard: 'डैशबोर्ड',
          analytics: 'विश्लेषण',
          heatmap: 'हीटमैप',
          reports: 'रिपोर्ट',
          leaderboard: 'लीडरबोर्ड',
          monthly: 'मासिक',
          portalTitleFallback: 'एडमिन पोर्टल',
          portalSubtitle: 'नागरिक मुद्दों और सामुदायिक भागीदारी का प्रबंधन करें'
        }
      },
      auth: {
        districtAdminLogin: 'जिला प्रशासक लॉगिन',
        accessDashboard: 'एडमिन पोर्टल खोलें',
        email: 'ईमेल पता',
        password: 'पासवर्ड',
        login: 'लॉगिन',
        forgotPassword: 'पासवर्ड भूल गए?',
        registerHere: 'यहाँ पंजीकरण करें',
        superAdminLogin: 'सुपर एडमिन लॉगिन',
        adminForgotPassword: 'एडमिन पासवर्ड रीसेट',
        resetWithEmailOtp: 'ईमेल ओटीपी से पासवर्ड रीसेट करें',
        sendOtp: 'ओटीपी भेजें',
        verifyReset: 'सत्यापित करें और रीसेट करें',
        enterOtp: 'ओटीपी दर्ज करें',
        newPassword: 'नया पासवर्ड'
      },
      heatmap: {
        title: 'इश्यू हीटमैप',
        subtitle: 'विभिन्न स्थानों और श्रेणियों में नागरिक समस्याएँ देखें',
        allCategories: 'सभी श्रेणियाँ',
        allStatus: 'सभी स्थिति',
        category: 'श्रेणी:',
        status: 'स्थिति:',
        issuesOnMap: 'मानचित्र पर समस्याएँ',
        heatmapStats: 'हीटमैप आँकड़े',
        totalIssues: 'कुल समस्याएँ',
        highPriority: 'उच्च प्राथमिकता',
        pending: 'लंबित',
        resolved: 'सुलझा',
        inProgress: 'प्रगति पर',
        rejected: 'अस्वीकृत'
      }
    }
  },
  mr: {
    translation: {
      common: {
        appName: 'CivicConnect',
        loading: 'लोड होत आहे...',
        refresh: 'रिफ्रेश',
        exportData: 'डेटा निर्यात करा',
        generateReport: 'अहवाल तयार करा',
        logout: 'लॉगआउट',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        nav: {
          home: 'मुख्यपृष्ठ',
          about: 'आमच्याबद्दल',
          services: 'सेवा',
          contact: 'संपर्क',
          approvals: 'मंजुरी'
        },
        adminLayout: {
          dashboard: 'डॅशबोर्ड',
          analytics: 'विश्लेषण',
          heatmap: 'हीटमॅप',
          reports: 'अहवाल',
          leaderboard: 'लीडरबोर्ड',
          monthly: 'मासिक',
          portalTitleFallback: 'अॅडमिन पोर्टल',
          portalSubtitle: 'नागरिकांच्या समस्या आणि सहभाग व्यवस्थापित करा'
        }
      },
      auth: {
        districtAdminLogin: 'जिल्हा प्रशासक लॉगिन',
        accessDashboard: 'अॅडमिन पोर्टल उघडा',
        email: 'ईमेल पत्ता',
        password: 'पासवर्ड',
        login: 'लॉगिन',
        forgotPassword: 'पासवर्ड विसरलात?',
        registerHere: 'येथे नोंदणी करा',
        superAdminLogin: 'सुपर अॅडमिन लॉगिन',
        adminForgotPassword: 'अॅडमिन पासवर्ड रीसेट',
        resetWithEmailOtp: 'ईमेल ओटीपीने पासवर्ड रीसेट करा',
        sendOtp: 'ओटीपी पाठवा',
        verifyReset: 'सत्यापित करा आणि रीसेट करा',
        enterOtp: 'ओटीपी प्रविष्ट करा',
        newPassword: 'नवीन पासवर्ड'
      },
      heatmap: {
        title: 'इश्यू हीटमॅप',
        subtitle: 'विविध ठिकाणी आणि श्रेणींमध्ये नागरिकांच्या समस्या पहा',
        allCategories: 'सर्व श्रेण्या',
        allStatus: 'सर्व स्थिती',
        category: 'श्रेणी:',
        status: 'स्थिती:',
        issuesOnMap: 'नकाशावर समस्या',
        heatmapStats: 'हीटमॅप आकडेवारी',
        totalIssues: 'एकूण समस्या',
        highPriority: 'उच्च प्राधान्य',
        pending: 'प्रलंबित',
        resolved: 'निकाली',
        inProgress: 'प्रगतीत',
        rejected: 'नाकारले'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n


