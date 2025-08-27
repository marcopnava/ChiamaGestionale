"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Package, ShoppingCart, BarChart3, MessageSquare, TrendingUp, Activity, Target, Star, Bell, Zap, Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardAccordionProps {
  data: any
  loading: boolean
}

export function DashboardAccordion({ data, loading }: DashboardAccordionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Dashboard Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="analytics"
        >
          <AccordionItem value="analytics">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analisi Performance
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium text-primary">Ricavi MRR</p>
                      <p className="text-2xl font-bold">€{data?.kpis.mrr.toLocaleString() || '0'}</p>
                      <p className="text-xs text-muted-foreground">+180.1% vs mese scorso</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">Vendite Totali</p>
                      <p className="text-2xl font-bold">{data?.kpis.sales || '0'}</p>
                      <p className="text-xs text-muted-foreground">+201 vs mese scorso</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      <strong>Trend Positivo:</strong> La crescita del MRR indica un forte engagement 
                      dei clienti e un modello di business sostenibile.
                    </p>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="activity">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Attività Recenti
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.recentActivity.slice(0, 3).map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <div className={cnIndicator(activity.color)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="goals">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Obiettivi Mensili
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="space-y-4">
                {[
                  { label: 'Vendite', val: 75, icon: ShoppingCart },
                  { label: 'Nuovi Clienti', val: 60, icon: Users },
                  { label: 'MRR', val: 85, icon: TrendingUp },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium">{val}%</span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  🎯 Obiettivo principale: Raggiungere €50K MRR entro fine mese
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="insights">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Insights & Raccomandazioni
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Performance Eccellente</p>
                    <p className="text-xs text-green-600">Il tasso di conversione è aumentato del 25%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Azione Consigliata</p>
                    <p className="text-xs text-blue-600">Contatta i 15 clienti in scadenza questa settimana</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Prossimi Eventi</p>
                    <p className="text-xs text-yellow-600">3 demo programmate per domani</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function cnIndicator(color: string) {
  const base = 'w-2 h-2 rounded-full';
  if (color === 'green') return `${base} bg-green-500`;
  if (color === 'blue') return `${base} bg-blue-500`;
  if (color === 'yellow') return `${base} bg-yellow-500`;
  return `${base} bg-gray-500`;
} 