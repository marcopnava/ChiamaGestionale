"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/shadcn-io/3d-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  monthly: number;
  kind: string;
  active: boolean;
  image?: string;
}

interface ProductsGridProps {
  products: Product[];
  userRole: string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

const getProductImage = (productName: string) => {
  const images = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  
  // Use product name to generate consistent image
  const index = productName.length % images.length;
  return images[index];
};

const getKindColor = (kind: string) => {
  switch (kind.toLowerCase()) {
    case 'saas':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'platform':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function ProductsGrid({ 
  products, 
  userRole, 
  onEdit, 
  onDelete, 
  onView 
}: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {products.map((product) => (
        <CardContainer key={product.id} containerClassName="py-4">
          <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gray-900 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border shadow-lg">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white mb-2"
            >
              {product.name}
            </CardItem>
            
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mb-4 dark:text-neutral-300"
            >
              {product.description}
            </CardItem>
            
            <CardItem translateZ="100" className="w-full mb-4">
              <img
                src={getProductImage(product.name)}
                height="200"
                width="300"
                className="h-32 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={product.name}
              />
            </CardItem>
            
            <div className="flex items-center justify-between mb-4">
              <CardItem
                translateZ={20}
                className="text-2xl font-bold text-green-600 dark:text-green-400"
              >
                € {product.monthly.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/mese</span>
              </CardItem>
              
              <CardItem translateZ={20}>
                <Badge className={getKindColor(product.kind)}>
                  {product.kind}
                </Badge>
              </CardItem>
            </div>
            
            <div className="flex items-center justify-between">
              <CardItem
                translateZ={20}
                as="button"
                onClick={() => onView(product)}
                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Visualizza
              </CardItem>
              
              {userRole === 'ADMIN' && (
                <div className="flex gap-2">
                  <CardItem
                    translateZ={20}
                    as="button"
                    onClick={() => onEdit(product)}
                    className="px-4 py-2 rounded-xl bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifica
                  </CardItem>
                  
                  <CardItem
                    translateZ={20}
                    as="button"
                    onClick={() => onDelete(product.id)}
                    className="px-4 py-2 rounded-xl bg-red-600 dark:bg-red-500 text-white text-xs font-bold hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Elimina
                  </CardItem>
                </div>
              )}
            </div>
            
            {!product.active && (
              <CardItem
                translateZ={30}
                className="absolute top-4 right-4"
              >
                <Badge variant="destructive">
                  Inattivo
                </Badge>
              </CardItem>
            )}
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
} 