import RoadmapSection from '@/components/dashboard/RoadmapSection';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Roadmap Progetto</h1>
          <p className="text-muted-foreground">
            Gestisci le feature e la pianificazione del progetto con viste multiple
          </p>
        </div>

        {/* Roadmap Section */}
        <div className="h-[calc(100vh-200px)]">
          <RoadmapSection />
        </div>
      </div>
    </div>
  );
} 