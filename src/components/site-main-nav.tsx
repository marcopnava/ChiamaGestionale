"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  FileText, 
  Calendar,
  Activity,
  Target,
  Settings,
  CreditCard
} from "lucide-react"

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function SiteMainNav() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gestione</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/customers"
                  >
                    <Users className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Gestione Clienti
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Gestisci i tuoi clienti, lead e contatti in modo efficiente
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/products" title="Prodotti">
                Gestisci il catalogo prodotti e servizi
              </ListItem>
              <ListItem href="/sales" title="Vendite">
                Monitora le vendite e i ricavi
              </ListItem>
              <ListItem href="/tickets" title="Supporto">
                Gestisci i ticket di supporto
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Analisi</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/reports" title="Report e Analytics">
                Analizza i dati e monitora le performance aziendali
              </ListItem>
              <ListItem href="/reports" title="KPI Dashboard">
                Visualizza i principali indicatori di performance
              </ListItem>
              <ListItem href="/reports" title="Analisi Churn">
                Monitora il tasso di abbandono clienti
              </ListItem>
              <ListItem href="/reports" title="Export Dati">
                Esporta i dati in vari formati
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Amministrazione</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/audit"
                  >
                    <Shield className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Amministrazione
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Gestisci utenti, permessi e configurazioni di sistema
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/reports" title="Report">
                Genera report personalizzati
              </ListItem>
              <ListItem href="/" title="Dashboard">
                Pannello di controllo principale
              </ListItem>
              <ListItem href="/users" title="Utenti">
                Gestione utenti e permessi
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/calendar" className={navigationMenuTriggerStyle()}>
              <Calendar className="mr-2 h-4 w-4" />
              Calendario
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
} 