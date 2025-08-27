"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Shield,
  FileText,
  Home,
  Search,
  Plus,
  LogOut,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { FlipButton } from "@/components/ui/shadcn-io/flip-button"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
        onClick={() => setOpen(true)}
        title="Cerca comandi (⌘K)"
      >
        <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CommandInput placeholder="Digita un comando o cerca..." className="border-0 focus:ring-0" />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
            <CommandGroup heading="Navigazione">
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/customers"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Clienti</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/products"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Prodotti</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/sales"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Vendite</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/reports"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Report</span>
                <CommandShortcut>⌘R</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/tickets"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Ticket</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className="my-2" />
            <CommandGroup heading="Azioni Rapide">
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/customers?action=new"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Nuovo Cliente</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/products?action=new"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Nuovo Prodotto</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/sales?action=new"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Nuova Vendita</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/tickets?action=new"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Nuovo Ticket</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className="my-2" />
            <CommandGroup heading="Sistema">
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/settings" as any))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Impostazioni</span>
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/audit"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Audit Log</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/calendar" as any))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendario</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => router.push("/api/auth/logout"))}
                className="cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
                <CommandShortcut>⌘Q</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  )
} 