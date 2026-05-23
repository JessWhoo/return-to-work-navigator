import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Globe } from 'lucide-react';
import LegalRights from './LegalRights';
import Accommodations from './Accommodations';
import StateByStateLaws from './StateByStateLaws';
import InternationalLaws from './InternationalLaws';

export default function LegalPolicyHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent drop-shadow-sm">
          Legal & Policy Guidance
        </h1>
        <p className="text-lg font-medium text-slate-800">Your rights, accommodations, and laws explained</p>
      </div>

      <Tabs defaultValue="rights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="rights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-slate-300">
            <Shield className="h-4 w-4 mr-2" />
            Legal Rights
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-slate-300">
            <FileText className="h-4 w-4 mr-2" />
            Accommodations
          </TabsTrigger>
          <TabsTrigger value="state" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-300">
            <Globe className="h-4 w-4 mr-2" />
            State Laws
          </TabsTrigger>
          <TabsTrigger value="international" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300">
            <Globe className="h-4 w-4 mr-2" />
            International
          </TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
}