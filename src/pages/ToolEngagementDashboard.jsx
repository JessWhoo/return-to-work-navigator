import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, Mail, MessageCircle, Scale, TrendingUp, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const TOOLS = [
  { id: 'accommodation_letter_generator', label: 'Accommodation Letter Generator', icon: FileText, color: 'var(--brand-primary)' },
  { id: 'employer_email_generator', label: 'Employer Email Generator', icon: Mail, color: '#9E6F7E' },
  { id: 'legal_rights_advisor', label: 'Legal Rights Advisor', icon: Scale, color: 'var(--brand-secondary)' },
  { id: 'ai_coach', label: 'AI Coach', icon: MessageCircle, color: '#7E8AA6' },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ToolEngagementDashboard() {
  useSEO({
    title: 'Tool Engagement Metrics',
    description: 'Admin dashboard tracking usage of the Navigator tools.',
    path: '/ToolEngagementDashboard',
  });

  const { user, isLoadingAuth } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [perTool, setPerTool] = useState({});
  const [trend, setTrend] = useState([]);
  const [last7, setLast7] = useState(0);
  const [prev7, setPrev7] = useState(0);

  useEffect(() => {
    if (!isLoadingAuth && !isAdmin) { setLoading(false); return; }
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const since = (days) => {
          const d = new Date();
          d.setDate(d.getDate() - days);
          return d.toISOString();
        };

        const [countRes, perToolRes, trendRes, last7Res, prev7Res] = await Promise.all([
          base44.entities.ToolEngagement.count({}),
          base44.entities.ToolEngagement.aggregate({ groupBy: 'tool', count: true }),
          base44.entities.ToolEngagement.aggregate({
            query: { created_date: { $gte: since(13) } },
            dateBucket: { field: 'created_date', unit: 'day' },
            count: true,
            sort: '_id',
            limit: 30,
          }),
          base44.entities.ToolEngagement.count({ created_date: { $gte: since(7) } }),
          base44.entities.ToolEngagement.count({
            created_date: { $gte: since(14), $lt: since(7) },
          }),
        ]);

        if (cancelled) return;
        setTotal(countRes || 0);
        setLast7(last7Res || 0);
        setPrev7(prev7Res || 0);
        const map = {};
        (perToolRes?.rows || []).forEach((r) => { map[r.tool] = r.count; });
        setPerTool(map);
        setTrend((trendRes?.rows || []).map((r) => ({ date: r._id, count: r.count })));
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load metrics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin, isLoadingAuth]);

  const maxToolCount = useMemo(
    () => Math.max(1, ...TOOLS.map((t) => perTool[t.id] || 0)),
    [perTool]
  );
  const trendChange = last7 - prev7;

  if (!isLoadingAuth && !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <PageHeader eyebrow="Admin" title="Tool Engagement Metrics" subtitle="This dashboard is restricted to app admins." />
        <Card className="mt-8"><CardContent className="p-8 text-center space-y-4">
          <BarChart3 className="h-10 w-10 mx-auto text-brand-muted-foreground" />
          <p className="text-brand-muted-foreground">You need an admin account to view engagement metrics.</p>
          <Button asChild><Link to={createPageUrl('Home')}>Back to home</Link></Button>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader eyebrow="Admin" title="Tool Engagement Metrics" subtitle="How often survivors are completing actions in each Navigator tool." />
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm"><Link to={createPageUrl('Home')}><ArrowLeft className="h-4 w-4" /> Home</Link></Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-muted border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <Card><CardContent className="p-6 text-destructive">{error}</CardContent></Card>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="nv-card p-5">
              <div className="nv-eyebrow">Total engagements</div>
              <div className="font-heading text-3xl font-bold mt-1">{total.toLocaleString()}</div>
              <div className="text-sm text-brand-muted-foreground mt-1">All time</div>
            </div>
            <div className="nv-card p-5">
              <div className="nv-eyebrow">Last 7 days</div>
              <div className="font-heading text-3xl font-bold mt-1">{last7.toLocaleString()}</div>
              <div className="text-sm mt-1 flex items-center gap-1" style={{ color: trendChange >= 0 ? 'var(--brand-secondary)' : 'var(--brand-destructive)' }}>
                <TrendingUp className="h-3.5 w-3.5" />
                {trendChange >= 0 ? '+' : ''}{trendChange} vs prior week
              </div>
            </div>
            <div className="nv-card p-5 col-span-2 lg:col-span-1">
              <div className="nv-eyebrow">Prior 7 days</div>
              <div className="font-heading text-3xl font-bold mt-1">{prev7.toLocaleString()}</div>
              <div className="text-sm text-brand-muted-foreground mt-1">Baseline</div>
            </div>
          </div>

          {/* Per-tool breakdown */}
          <div>
            <h2 className="font-heading text-xl font-bold mb-3">Engagements by tool</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((t) => {
                const count = perTool[t.id] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const barWidth = `${Math.round((count / maxToolCount) * 100)}%`;
                const Icon = t.icon;
                return (
                  <div key={t.id} className="nv-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="rounded-pill bg-muted p-2.5" style={{ color: t.color }}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="font-heading font-bold leading-tight truncate">{t.label}</div>
                          <div className="text-sm text-brand-muted-foreground">{count.toLocaleString()} engagements</div>
                        </div>
                      </div>
                      <span className="nv-chip nv-chip--muted shrink-0">{pct}%</span>
                    </div>
                    <div className="nv-bar mt-4"><i style={{ width: barWidth, background: t.color }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 14-day trend */}
          <div>
            <h2 className="font-heading text-xl font-bold mb-3">Last 14 days</h2>
            <div className="nv-card p-5">
              {trend.length === 0 ? (
                <p className="text-sm text-brand-muted-foreground py-8 text-center">No engagements recorded yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: 'var(--brand-muted-foreground)' }} tickLine={false} axisLine={{ stroke: 'var(--brand-border)' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--brand-muted-foreground)' }} tickLine={false} axisLine={{ stroke: 'var(--brand-border)' }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 'var(--brand-radius-md)', fontSize: 13 }}
                      labelFormatter={formatDate}
                      formatter={(v) => [`${v} engagements`, 'Engagements']}
                    />
                    <Bar dataKey="count" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <p className="text-xs text-brand-muted-foreground">
            An engagement is recorded when a survivor completes a meaningful action in a tool: generating an accommodation letter, producing an employer email draft, sending the first message to the Legal Rights Advisor, or starting an AI Coach session.
          </p>
        </>
      )}
    </div>
  );
}