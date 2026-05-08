import Dashboard from './pages/Dashboard';
import NewResearch from './pages/NewResearch';
import AppConcepts from './pages/AppConcepts';
import ResearchResults from './pages/ResearchResults';
import ConceptDetails from './pages/ConceptDetails';
import ResearchDetails from './pages/ResearchDetails';
import Landing from './pages/Landing';
import About from './pages/About';
import SuiteGuide from './pages/SuiteGuide';
import MarketTrends from './pages/MarketTrends';
import ComfortSettings from './pages/ComfortSettings';
import Tutorial from './pages/Tutorial';
import SuiteLanding from './pages/SuiteLanding';
import SuiteDemonstrationWalkThrough from './pages/SuiteDemonstrationWalkThrough';
import PromptCreator from './pages/PromptCreator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "NewResearch": NewResearch,
    "AppConcepts": AppConcepts,
    "ResearchResults": ResearchResults,
    "ConceptDetails": ConceptDetails,
    "ResearchDetails": ResearchDetails,
    "Landing": Landing,
    "About": About,
    "SuiteGuide": SuiteGuide,
    "MarketTrends": MarketTrends,
    "ComfortSettings": ComfortSettings,
    "Tutorial": Tutorial,
    "SuiteLanding": SuiteLanding,
    "SuiteDemonstrationWalkThrough": SuiteDemonstrationWalkThrough,
    "PromptCreator": PromptCreator,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};