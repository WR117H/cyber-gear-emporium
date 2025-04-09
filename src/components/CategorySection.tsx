
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
          <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of specialized cybersecurity and penetration testing equipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link key={category.id} to={category.path} className="block">
                <div className="cyber-card h-full p-6 flex flex-col items-center text-center group">
                  <div className="bg-cyber-blue/10 p-3 rounded-full mb-4 group-hover:bg-cyber-blue/20 transition-colors">
                    <Icon className="h-8 w-8 text-cyber-blue" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-cyber-light">{category.name}</h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  
                  <div className="mt-auto">
                    <span className="text-cyber-blue inline-flex items-center text-sm font-medium">
                      Browse Category
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
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
