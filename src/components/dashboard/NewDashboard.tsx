'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PinList } from '@/components/ui/shadcn-io/pin-list';
import { DashboardAccordion } from '@/components/dashboard/DashboardAccordion';
import TodoList from '@/components/dashboard/TodoList';
import { ChartPieInteractive } from '@/components/ui/shadcn-io/pie-chart-11';
import RoadmapSection from '@/components/dashboard/RoadmapSection';


import { Users, Package, ShoppingCart, BarChart3, MessageSquare, Shield, FileText, Calendar, TrendingUp, DollarSign, Activity, Target, ChevronDown, Star, Settings, Bell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function NewDashboard() {
  const { data, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-red-500">
            <p>Errore nel caricamento dei dati: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">ChiamaGestionale</h1>
          <p className="text-muted-foreground">
            Piattaforma di gestione completa per la tua azienda
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ricavi Totali</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">€{data?.kpis.totalRevenue.toLocaleString() || '0'}</div>
              )}
              <p className="text-xs text-muted-foreground">+20.1% rispetto al mese scorso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">€{data?.kpis.mrr.toLocaleString() || '0'}</div>
              )}
              <p className="text-xs text-muted-foreground">+180.1% rispetto al mese scorso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendite</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{data?.kpis.sales || '0'}</div>
              )}
              <p className="text-xs text-muted-foreground">+201 rispetto al mese scorso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clienti Attivi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{data?.kpis.activeCustomers || '0'}</div>
              )}
              <p className="text-xs text-muted-foreground">+180.1% rispetto al mese scorso</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Analytics Accordion */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <DashboardAccordion data={data} loading={loading} />
          </div>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Metriche rapide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Nuovi Clienti</span>
                  </div>
                  <span className="font-bold text-primary">+12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vendite Oggi</span>
                  </div>
                  <span className="font-bold text-primary">8</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Ticket Aperti</span>
                  </div>
                  <span className="font-bold text-primary">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todo List Kanban */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Todo List</CardTitle>
              <CardDescription>Gestisci i task del team con drag & drop</CardDescription>
            </CardHeader>
            <CardContent>
              <TodoList />
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart Interactive */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Analisi Vendite Mensili</CardTitle>
              <CardDescription>Distribuzione delle vendite per mese</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPieInteractive />
            </CardContent>
          </Card>
        </div>

        {/* Roadmap Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Progetto</CardTitle>
              <CardDescription>Gestisci le feature e la pianificazione del progetto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <RoadmapSection />
              </div>
            </CardContent>
          </Card>
        </div>





        {/* PinList - Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
              <CardDescription>Pinna le azioni più frequenti</CardDescription>
            </CardHeader>
            <CardContent>
              <PinList
                items={[
                  {
                    id: 1,
                    name: 'Nuovo Cliente',
                    info: 'Aggiungi un nuovo cliente · Gestione Clienti',
                    icon: Users,
                    pinned: true,
                  },
                  {
                    id: 2,
                    name: 'Nuova Vendita',
                    info: 'Registra una vendita · Gestione Vendite',
                    icon: ShoppingCart,
                    pinned: true,
                  },
                  {
                    id: 3,
                    name: 'Report Analytics',
                    info: 'Visualizza report · Analisi Dati',
                    icon: BarChart3,
                    pinned: false,
                  },
                  {
                    id: 4,
                    name: 'Supporto Ticket',
                    info: 'Gestisci ticket · Supporto Clienti',
                    icon: MessageSquare,
                    pinned: false,
                  },
                ]}
                labels={{ pinned: 'Azioni Pinnate', unpinned: 'Altre Azioni' }}
                className="max-w-2xl"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cnIndicator(color: string) {
  const base = 'w-2 h-2 rounded-full';
  if (color === 'green') return `${base} bg-green-500`;
  if (color === 'blue') return `${base} bg-blue-500`;
  if (color === 'yellow') return `${base} bg-yellow-500`;
  return `${base} bg-gray-500`;
}
