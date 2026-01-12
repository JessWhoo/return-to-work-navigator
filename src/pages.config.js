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
import Resources from './pages/Resources';
import ReturnPlanning from './pages/ReturnPlanning';
import WellnessResources from './pages/WellnessResources';
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
    "Resources": Resources,
    "ReturnPlanning": ReturnPlanning,
    "WellnessResources": WellnessResources,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};