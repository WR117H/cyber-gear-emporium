
import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Server, Database, Lock } from 'lucide-react';

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
    <section className="py-12 px-4 sm:px-6 lg:px-8" id="categories">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Product Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of specialized cybersecurity and penetration testing equipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link
                key={category.id}
                to={category.path}
                className="cyber-card group hover:scale-105 transition-all duration-300"
              >
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
