import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Heart } from 'lucide-react';
import EnergyManagement from './EnergyManagement';
import EmotionalSupport from './EmotionalSupport';

export default function WellbeingHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 bg-clip-text text-transparent drop-shadow-sm">
          Health & Well-Being
        </h1>
        <p className="text-lg font-medium text-slate-800">Energy management, fatigue tracking, and emotional support</p>
      </div>

      <Tabs defaultValue="energy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="energy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-slate-300">
            <Zap className="h-4 w-4 mr-2" />
            Energy & Fatigue
          </TabsTrigger>
          <TabsTrigger value="emotional" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white text-slate-300">
            <Heart className="h-4 w-4 mr-2" />
            Emotional Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy">
          <EnergyManagement />
        </TabsContent>
        <TabsContent value="emotional">
          <EmotionalSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
}