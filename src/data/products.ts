import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'NetHunter Pro',
    description: 'Advanced portable network security testing toolkit with integrated packet analysis and vulnerability scanning.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'network',
    inStock: 15,
    featured: true,
    isNew: true,
    specifications: {
      processor: 'Quad-core 2.0 GHz',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      interfaces: 'USB 3.0, Ethernet, Wi-Fi, Bluetooth'
    },
    compatibleWith: ['Windows', 'Linux', 'macOS']
  },
  {
    id: 'free-demo',
    name: 'CyberGear Demo - FREE',
    description: 'A free demo product to test our ordering and tracking system. No payment required.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'demo',
    inStock: 999,
    featured: false,
    isNew: true,
    specifications: {
      type: 'Demo Product',
      note: 'For testing purposes only'
    }
  },
  {
    id: '2',
    name: 'WifiCracker X7',
    description: 'Long-range wireless security auditing platform with multiple antenna configurations and advanced signal processing.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'wireless',
    inStock: 8,
    featured: true,
    isNew: false,
    specifications: {
      range: 'Up to 500m',
      frequency: '2.4GHz & 5GHz',
      antennas: '4 detachable high-gain',
      battery: '12000mAh rechargeable'
    }
  },
  {
    id: '3',
    name: 'LockPick Elite Kit',
    description: 'Professional-grade lock picking set with 20+ tools for security professionals and locksmiths.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'hardware',
    inStock: 20,
    featured: true,
    isNew: false,
    specifications: {
      tools: '24 professional picks',
      material: 'Hardened stainless steel',
      case: 'Premium leather roll-up case'
    }
  },
  {
    id: '4',
    name: 'CipherShield Pro',
    description: 'Comprehensive cybersecurity software suite with penetration testing tools and encryption modules.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'software',
    inStock: 0,
    featured: true,
    isNew: false,
    specifications: {
      license: '1-year subscription',
      updates: 'Automatic security updates',
      support: '24/7 technical support',
      platforms: 'Windows, Linux, macOS'
    }
  },
  {
    id: '5',
    name: 'RFID Analyzer Kit',
    description: 'Complete RFID testing and cloning toolkit for security researchers and penetration testers.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1563770660941-10e1487291ec?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'hardware',
    inStock: 12,
    featured: false,
    isNew: true,
    specifications: {
      frequency: '125kHz & 13.56MHz',
      readRange: 'Up to 5cm',
      battery: '2000mAh rechargeable',
      memory: '8GB internal storage'
    }
  },
  {
    id: '6',
    name: 'Packet Sniper',
    description: 'High-performance network packet capture and analysis device with customizable filters and alerts.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'network',
    inStock: 5,
    featured: false,
    isNew: false,
    specifications: {
      interfaces: '4x Gigabit Ethernet',
      processor: 'Octa-core 2.5GHz',
      memory: '16GB DDR4',
      storage: '1TB SSD'
    }
  },
  {
    id: '7',
    name: 'BluetoothHunter',
    description: 'Specialized Bluetooth security testing device for identifying vulnerabilities in Bluetooth-enabled systems.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'wireless',
    inStock: 14,
    featured: false,
    isNew: false,
    specifications: {
      range: 'Up to 200m with external antenna',
      version: 'Bluetooth 5.2 compatible',
      interfaces: 'USB-C, external antenna port'
    }
  },
  {
    id: '8',
    name: 'Physical Bypass Tools',
    description: 'Professional set of physical security bypass tools for security testing and lock manipulation.',
    price: 229.99,
    image: 'https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'hardware',
    inStock: 7,
    featured: false,
    isNew: true,
    specifications: {
      tools: '15 specialized tools',
      case: 'Hardshell protective case',
      materials: 'High-strength alloys and polymers'
    }
  },
  {
    id: '9',
    name: 'Security Scanner Pro',
    description: 'Enterprise-grade vulnerability assessment software with regular database updates and reporting tools.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1624969862644-791f3dc98927?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'software',
    inStock: 0,
    featured: false,
    isNew: false,
    specifications: {
      license: '3-year enterprise license',
      updates: 'Daily vulnerability database updates',
      reporting: 'Customizable reports and dashboards'
    }
  },
  {
    id: '10',
    name: 'MiniPwner',
    description: 'Ultra-compact wireless penetration testing device with custom firmware and multiple attack modules.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1526374870839-e155464bb9b2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'wireless',
    inStock: 22,
    featured: false,
    isNew: true,
    specifications: {
      size: '2.4 x 1.2 x 0.5 inches',
      connectivity: 'Wi-Fi, Bluetooth, USB',
      battery: '6 hours continuous operation'
    }
  },
  {
    id: '11',
    name: 'KeyCloner Pro',
    description: 'Advanced key duplication system for security professionals with multiple key blank options.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'hardware',
    inStock: 3,
    featured: false,
    isNew: false,
    specifications: {
      compatibility: 'Over 1000 key types',
      precision: '0.001mm accuracy',
      included: '50 assorted key blanks'
    }
  },
  {
    id: '12',
    name: 'Exploit Development Kit',
    description: 'Complete software package for security researchers to discover and analyze software vulnerabilities.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    category: 'software',
    inStock: 18,
    featured: false,
    isNew: false,
    specifications: {
      features: 'Debuggers, disassemblers, dynamic analysis tools',
      support: 'Active community forum access',
      platforms: 'Windows, Linux'
    }
  }
];
