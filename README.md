# 🚀 ChiamaGestionale - Piattaforma di Gestione Aziendale

Una moderna piattaforma di gestione aziendale costruita con **Next.js 15**, **TypeScript**, **Tailwind CSS** e **Shadcn/ui**.

## ✨ Caratteristiche Principali

### 🎯 **Dashboard Interattiva**
- **Charts**: RadialBar, Radar, Pie Chart con Recharts
- **Kanban Board**: Todo list con drag & drop
- **Mini Calendar**: Gestione eventi giornalieri
- **Roadmap**: Viste multiple (Gantt, Calendar, List, Kanban, Table)
- **Animated Cursor**: Cursore personalizzato globale
- **Apple-style Dock**: Navigazione elegante

### 🔐 **Sistema di Autenticazione**
- Login/Logout con sessioni HTTP-only
- **RBAC** (Role-Based Access Control)
- Ruoli: ADMIN, SALES, SUPPORT
- Protezione server-side delle route

### 📊 **Gestione Dati**
- **CRUD Completo**: Clienti, Prodotti, Vendite, Ticket
- **API RESTful**: Con validazione Zod
- **Database**: SQLite con Prisma ORM
- **Audit Log**: Tracciamento completo delle azioni

### 🎨 **UI/UX Moderna**
- **Tema**: Grigio chiaro con accenti blu
- **Componenti**: Shadcn/ui avanzati
- **Responsive**: Design mobile-first
- **Animazioni**: Framer Motion e CSS transitions

## 🛠️ Tecnologie Utilizzate

### **Frontend**
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **Framer Motion**
- **Recharts**

### **Backend**
- **Next.js API Routes**
- **Prisma ORM**
- **SQLite Database**
- **bcryptjs** (hashing password)
- **Zod** (validazione)

### **Librerie UI**
- **Radix UI** (componenti base)
- **Lucide React** (icone)
- **Sonner** (toast notifications)
- **cmdk** (command palette)

## 🚀 Installazione

### **Prerequisiti**
- Node.js 18+ 
- npm o yarn
- Git

### **Setup Locale**

```bash
# 1. Clona il repository
git clone https://github.com/tuousername/ChiamaGestionale.git
cd ChiamaGestionale

# 2. Installa le dipendenze
npm install

# 3. Configura il database
npx prisma generate
npx prisma db push

# 4. Avvia il server di sviluppo
npm run dev
```

### **Variabili d'Ambiente**

Crea un file `.env.local`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

## 📁 Struttura del Progetto

```
ChiamaGestionale/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── (auth)/            # Route protette
│   │   └── layout.tsx         # Layout principale
│   ├── components/            # Componenti React
│   │   ├── ui/               # Componenti Shadcn/ui
│   │   ├── dashboard/        # Componenti dashboard
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities
│   └── styles/               # CSS globali
├── prisma/                   # Schema database
├── public/                   # Asset statici
└── package.json
```

## 🎮 Come Utilizzare

### **1. Accesso**
- URL: `http://localhost:3000`
- Credenziali di default:
  - **Admin**: admin@chiama.io / admin123
  - **Sales**: sales@chiama.io / sales123
  - **Support**: support@chiama.io / support123

### **2. Navigazione**
- **Dock**: Navigazione principale in basso
- **Command Palette**: `Cmd+K` per ricerca rapida
- **Breadcrumbs**: Navigazione contestuale

### **3. Funzionalità**
- **Dashboard**: Panoramica completa
- **Clienti**: Gestione anagrafica
- **Prodotti**: Catalogo prodotti
- **Vendite**: Gestione vendite e fatture
- **Ticket**: Sistema di supporto
- **Report**: Analisi e export
- **Audit**: Log attività (solo Admin)
- **Roadmap**: Pianificazione progetti

## 🔧 Sviluppo

### **Comandi Utili**

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Avvio produzione
npm start

# Database
npx prisma studio
npx prisma db push
npx prisma generate

# Linting
npm run lint

# Type checking
npm run type-check
```

### **Aggiungere Nuovi Componenti**

1. **Shadcn/ui**: `npx shadcn@latest add [component]`
2. **Componenti custom**: `src/components/ui/`
3. **Pagine**: `src/app/[route]/page.tsx`

## 📊 Database Schema

### **Tabelle Principali**
- **User**: Utenti e ruoli
- **Customer**: Anagrafica clienti
- **Product**: Catalogo prodotti
- **Sale**: Vendite e fatturazione
- **Ticket**: Sistema supporto
- **AuditLog**: Tracciamento azioni

## 🎨 Personalizzazione

### **Tema Colori**
Modifica `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 95%;     /* Grigio chiaro */
  --foreground: 0 0% 9%;      /* Testo nero */
  --primary: 221.2 83.2% 53.3%; /* Blu */
  /* ... altri colori */
}
```

### **Componenti**
- **Shadcn/ui**: Personalizzabili via CSS variables
- **Custom**: Estendibili con Tailwind

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è sotto licenza MIT. Vedi `LICENSE` per dettagli.

## 🆘 Supporto

- **Issues**: [GitHub Issues](https://github.com/tuousername/ChiamaGestionale/issues)
- **Documentazione**: [Wiki](https://github.com/tuousername/ChiamaGestionale/wiki)

---

**Sviluppato con ❤️ da [Il Tuo Nome]** 