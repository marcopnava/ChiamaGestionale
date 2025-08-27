"use client";
import { useState, useEffect } from "react";
import { PixelImage } from "@/components/ui/shadcn-io/pixel-image";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";
import { PinList } from "@/components/ui/shadcn-io/pin-list";
import { Package, BarChart3, Settings, Zap } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string;
  monthly: number;
  kind: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProductsPixelGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, userRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/auth/me")
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // L'API restituisce {rows: [...], total: 5, page: 1, limit: 20}
          // Dobbiamo estrarre l'array 'rows'
          const productsArray = productsData.rows || (Array.isArray(productsData) ? productsData : []);
          setProducts(productsArray);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setIsAdmin(userData.role === "ADMIN");
        }
      } catch (error) {
        toast.error("Errore nel caricamento dei prodotti");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner variant="ring" />
      </div>
    );
  }

  // Immagini di esempio per i prodotti
  const productImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
  ];

  return (
    <div className="space-y-6">
      {/* Header con PinList */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prodotti</h1>
        <PinList
          items={[
            { id: 1, name: "Totale Prodotti", info: (Array.isArray(products) ? products.length : 0).toString(), icon: Package, pinned: true },
            { id: 2, name: "Attivi", info: (Array.isArray(products) ? products.filter(p => p.isActive).length : 0).toString(), icon: Zap, pinned: true },
            { id: 3, name: "Media Prezzo", info: `€${(Array.isArray(products) && products.length > 0 ? (products.reduce((acc, p) => acc + p.monthly, 0) / products.length) : 0).toFixed(2)}`, icon: BarChart3, pinned: true },
            { id: 4, name: "Gestione", info: "Configura", icon: Settings, pinned: false },
          ]}
        />
      </div>

      {/* Griglia di prodotti con PixelImage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(products) && products.map((product, index) => (
          <div key={product.id} className="group">
            <div className="relative overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:shadow-lg">
              {/* PixelImage per ogni prodotto */}
              <div className="relative">
                <PixelImage
                  src={productImages[index % productImages.length]}
                  grid="6x4"
                  grayscaleAnimation={true}
                  pixelFadeInDuration={800}
                  maxAnimationDelay={1000}
                  colorRevealDelay={1200}
                  showReplayButton={false}
                />
                
                {/* Overlay con informazioni del prodotto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-white/80 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">€{product.monthly}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {product.isActive ? 'Attivo' : 'Inattivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informazioni sempre visibili sotto l'immagine */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">€{product.monthly}</span>
                    <span className="text-sm text-muted-foreground ml-1">/mese</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {product.isActive ? 'Attivo' : 'Inattivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messaggio se non ci sono prodotti */}
      {(!Array.isArray(products) || products.length === 0) && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nessun prodotto trovato</h3>
          <p className="text-muted-foreground">Inizia aggiungendo il tuo primo prodotto.</p>
        </div>
      )}
    </div>
  );
} 