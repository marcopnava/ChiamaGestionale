'use client';
import { useState, useEffect } from 'react';

interface DashboardData {
  customers: any[];
  products: any[];
  sales: any[];
  kpis: {
    totalRevenue: number;
    mrr: number;
    sales: number;
    activeCustomers: number;
  };
  recentActivity: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel to reduce API calls
        const [customersRes, productsRes, salesRes] = await Promise.all([
          fetch('/api/customers?limit=5'),
          fetch('/api/products?limit=5'),
          fetch('/api/sales?limit=5')
        ]);

        const [customers, products, sales] = await Promise.all([
          customersRes.json(),
          productsRes.json(),
          salesRes.json()
        ]);

        // Calculate KPIs from the data
        const totalRevenue = sales.rows?.reduce((sum: number, sale: any) => sum + Number(sale.amount), 0) || 0;
        const mrr = sales.rows?.filter((sale: any) => sale.status === 'paid').reduce((sum: number, sale: any) => sum + Number(sale.amount), 0) || 0;
        const activeCustomers = customers.rows?.filter((customer: any) => customer.status === 'active').length || 0;

        setData({
          customers: customers.rows || [],
          products: products.rows || [],
          sales: sales.rows || [],
          kpis: {
            totalRevenue,
            mrr,
            sales: sales.rows?.length || 0,
            activeCustomers
          },
          recentActivity: [
            {
              id: 1,
              type: 'customer',
              message: 'Nuovo cliente registrato',
              details: 'Acme Corp si è registrato come lead',
              time: '2 min fa',
              color: 'green'
            },
            {
              id: 2,
              type: 'sale',
              message: 'Vendita completata',
              details: 'Prodotto Premium venduto a €299',
              time: '1 ora fa',
              color: 'blue'
            },
            {
              id: 3,
              type: 'ticket',
              message: 'Ticket di supporto aperto',
              details: 'Problema con l\'integrazione API',
              time: '3 ore fa',
              color: 'yellow'
            }
          ]
        });
      } catch (err) {
        setError('Errore nel caricamento dei dati');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
} 