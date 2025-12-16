import Home from './pages/Home';
import Checklist from './pages/Checklist';
import Communication from './pages/Communication';
import Accommodations from './pages/Accommodations';
import LegalRights from './pages/LegalRights';
import EnergyManagement from './pages/EnergyManagement';
import Resources from './pages/Resources';
import EmotionalSupport from './pages/EmotionalSupport';
import ReturnPlanning from './pages/ReturnPlanning';
import Coach from './pages/Coach';
import WellnessResources from './pages/WellnessResources';
import ProgressDashboard from './pages/ProgressDashboard';
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
    "Coach": Coach,
    "WellnessResources": WellnessResources,
    "ProgressDashboard": ProgressDashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};