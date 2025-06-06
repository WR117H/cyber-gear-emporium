
import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Server, Database, Lock } from 'lucide-react';
import { IconHover3D } from '@/components/ui/icon-3d-hover';

const categories = [
  {
    id: 'network',
    name: 'Network Tools',
    description: 'Hardware for analyzing and testing network security',
    icon: Server,
    path: '/products?category=network',
  },
  {
    id: 'wireless',
    name: 'Wireless Devices',
    description: 'Equipment for wireless security auditing and research',
    icon: Wifi,
    path: '/products?category=wireless',
  },
  {
    id: 'hardware',
    name: 'Hardware Kits',
    description: 'Physical security testing and bypass equipment',
    icon: Lock,
    path: '/products?category=hardware',
  },
  {
    id: 'software',
    name: 'Software Tools',
    description: 'Digital tools for comprehensive security testing',
    icon: Database,
    path: '/products?category=software',
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="categories">
      {/* Enhanced bubble gradients for this section */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%)',
            animationDelay: '4s'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of specialized cybersecurity and penetration testing equipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link key={category.id} to={category.path} className="block">
                <IconHover3D
                  heading={category.name}
                  text={category.description}
                  className="w-full"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
