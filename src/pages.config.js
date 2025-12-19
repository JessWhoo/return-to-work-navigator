import Home from './pages/Home';
import Checklist from './pages/Checklist';
import Communication from './pages/Communication';
import Accommodations from './pages/Accommodations';
import LegalRights from './pages/LegalRights';
import EnergyManagement from './pages/EnergyManagement';
import Resources from './pages/Resources';
import EmotionalSupport from './pages/EmotionalSupport';
import ReturnPlanning from './pages/ReturnPlanning';
import WellnessResources from './pages/WellnessResources';
import ProgressDashboard from './pages/ProgressDashboard';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';
import FAQ from './pages/FAQ';
import Coach from './pages/Coach';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Checklist": Checklist,
    "Communication": Communication,
    "Accommodations": Accommodations,
    "LegalRights": LegalRights,
    "EnergyManagement": EnergyManagement,
    "Resources": Resources,
    "EmotionalSupport": EmotionalSupport,
    "ReturnPlanning": ReturnPlanning,
    "WellnessResources": WellnessResources,
    "ProgressDashboard": ProgressDashboard,
    "Profile": Profile,
    "Gamification": Gamification,
    "FAQ": FAQ,
    "Coach": Coach,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};