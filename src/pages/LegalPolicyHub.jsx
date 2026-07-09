import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Globe, Lock, CheckSquare, Search, ArrowRight } from 'lucide-react';
import LegalRights from './LegalRights';
import Accommodations from './Accommodations';
import StateByStateLaws from './StateByStateLaws';
import InternationalLaws from './InternationalLaws';
import LegalRightsChecklist from './LegalRightsChecklist';
import WorkplaceRightsAndDisclosure from '../components/legal/WorkplaceRightsAndDisclosure';

export default function LegalPolicyHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent drop-shadow-sm">
          Legal & Policy Guidance
        </h1>
        <p className="text-lg font-medium text-slate-800">Your rights, accommodations, and laws explained</p>
      </div>

      <Link
        to="/LegalDirectory"
        className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-3">
          <Search className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-extrabold">Searchable Legal Directory</p>
            <p className="text-sm text-white/90 font-medium">Find quick answers on FMLA, ADA, state laws, accommodations, insurance & privacy</p>
          </div>
        </div>
        <ArrowRight className="h-6 w-6 flex-shrink-0" />
      </Link>

      <Tabs defaultValue="disclosure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 bg-white border border-slate-300 h-auto">
          <TabsTrigger value="disclosure" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white text-slate-800">
            <Lock className="h-4 w-4 mr-2" />
            Rights & Disclosure
          </TabsTrigger>
          <TabsTrigger value="rights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-slate-800">
            <Shield className="h-4 w-4 mr-2" />
            Legal Rights
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-slate-800">
            <FileText className="h-4 w-4 mr-2" />
            Accommodations
          </TabsTrigger>
          <TabsTrigger value="state" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-800">
            <Globe className="h-4 w-4 mr-2" />
            State Laws
          </TabsTrigger>
          <TabsTrigger value="international" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-800">
            <Globe className="h-4 w-4 mr-2" />
            International
          </TabsTrigger>
          <TabsTrigger value="checklist" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white text-slate-800">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disclosure">
          <WorkplaceRightsAndDisclosure />
        </TabsContent>
        <TabsContent value="rights">
          <LegalRights />
        </TabsContent>
        <TabsContent value="accommodations">
          <Accommodations />
        </TabsContent>
        <TabsContent value="state">
          <StateByStateLaws />
        </TabsContent>
        <TabsContent value="international">
          <InternationalLaws />
        </TabsContent>
        <TabsContent value="checklist">
          <LegalRightsChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}