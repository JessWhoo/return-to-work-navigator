/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Accommodations from './pages/Accommodations';
import Checklist from './pages/Checklist';
import Coach from './pages/Coach';
import Communication from './pages/Communication';
import EmotionalSupport from './pages/EmotionalSupport';
import EnergyManagement from './pages/EnergyManagement';
import FAQ from './pages/FAQ';
import Gamification from './pages/Gamification';
import Home from './pages/Home';
import LegalRights from './pages/LegalRights';
import Profile from './pages/Profile';
import ProgressDashboard from './pages/ProgressDashboard';
import RecordKeeping from './pages/RecordKeeping';
import Resources from './pages/Resources';
import ReturnPlanning from './pages/ReturnPlanning';
import SymptomAnalysis from './pages/SymptomAnalysis';
import WellnessResources from './pages/WellnessResources';
import LinkedInNetworking from './pages/LinkedInNetworking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Accommodations": Accommodations,
    "Checklist": Checklist,
    "Coach": Coach,
    "Communication": Communication,
    "EmotionalSupport": EmotionalSupport,
    "EnergyManagement": EnergyManagement,
    "FAQ": FAQ,
    "Gamification": Gamification,
    "Home": Home,
    "LegalRights": LegalRights,
    "Profile": Profile,
    "ProgressDashboard": ProgressDashboard,
    "RecordKeeping": RecordKeeping,
    "Resources": Resources,
    "ReturnPlanning": ReturnPlanning,
    "SymptomAnalysis": SymptomAnalysis,
    "WellnessResources": WellnessResources,
    "LinkedInNetworking": LinkedInNetworking,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};