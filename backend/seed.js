require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const Product  = require('./models/Product');
const Order    = require('./models/Order');

const products = [
  // ── Electronics ────────────────────────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro Max 256GB',
    slug: 'apple-iphone-15-pro-max-256gb',
    shortDesc: 'A17 Pro chip, Titanium design, 48MP camera system',
    description: 'Experience the most powerful iPhone ever. The A17 Pro chip delivers unparalleled performance. Titanium build keeps it light yet durable. The 48MP main camera with 5x optical zoom captures stunning photos and videos.',
    price: 134900,
    originalPrice: 149900,
    category: 'Electronics',
    subCategory: 'Smartphones',
    brand: 'Apple',
    stock: 50,
    isFeatured: true,
    rating: 4.8,
    numReviews: 2450,
    images: [
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', public_id: 'ip15-1' },
      { url: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80', public_id: 'ip15-2' },
    ],
    tags: ['apple', 'iphone', '5g', 'smartphone'],
    specifications: new Map([['Display', '6.7" Super Retina XDR'], ['Storage', '256GB'], ['RAM', '8GB'], ['Battery', '4422mAh'], ['OS', 'iOS 17']]),
  },
  {
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    shortDesc: 'Galaxy AI, S Pen, 200MP camera, Snapdragon 8 Gen 3',
    description: 'Unleash Galaxy AI on the ultimate Samsung smartphone. Built-in S Pen for enhanced productivity. 200MP camera captures every detail. Snapdragon 8 Gen 3 delivers blazing performance.',
    price: 129999,
    originalPrice: 139999,
    category: 'Electronics',
    subCategory: 'Smartphones',
    brand: 'Samsung',
    stock: 40,
    isFeatured: true,
    rating: 4.7,
    numReviews: 1830,
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80', public_id: 'sg24-1' },
    ],
    tags: ['samsung', 'galaxy', '5g', 'spen'],
    specifications: new Map([['Display', '6.8" Dynamic AMOLED'], ['Storage', '512GB'], ['RAM', '12GB'], ['Battery', '5000mAh']]),
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    shortDesc: 'Industry-leading noise cancellation, 30hr battery',
    description: 'The WH-1000XM5 headphones deliver the world\'s best noise cancellation with HD noise cancelling processors. 30-hour battery life keeps you immersed in music all day.',
    price: 26990,
    originalPrice: 34990,
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'Sony',
    stock: 75,
    isFeatured: true,
    rating: 4.9,
    numReviews: 3200,
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', public_id: 'sony-h1' },
    ],
    tags: ['sony', 'headphones', 'wireless', 'noise-cancelling'],
    specifications: new Map([['Driver', '30mm'], ['Battery', '30hrs'], ['Connectivity', 'Bluetooth 5.2'], ['Weight', '250g']]),
  },
  {
    name: 'MacBook Pro 14" M3 Pro Chip 18GB',
    slug: 'macbook-pro-14-m3-pro-18gb',
    shortDesc: 'M3 Pro chip, Liquid Retina XDR display, 18GB RAM',
    description: 'MacBook Pro with M3 Pro chip delivers game-changing performance for demanding workflows. Stunning 14" Liquid Retina XDR display. Up to 18 hours of battery life.',
    price: 199900,
    originalPrice: 209900,
    category: 'Electronics',
    subCategory: 'Laptops',
    brand: 'Apple',
    stock: 25,
    isFeatured: true,
    rating: 4.9,
    numReviews: 890,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', public_id: 'mbp14-1' },
    ],
    tags: ['apple', 'macbook', 'laptop', 'm3'],
    specifications: new Map([['Chip', 'Apple M3 Pro'], ['RAM', '18GB'], ['Storage', '512GB SSD'], ['Display', '14.2" XDR'], ['Battery', '18hrs']]),
  },
  {
    name: 'Dell XPS 15 Laptop Intel i7 32GB',
    slug: 'dell-xps-15-laptop-i7-32gb',
    shortDesc: 'Intel Core i7-13700H, 32GB RAM, OLED display',
    description: 'The XPS 15 pushes the boundaries of what a 15-inch laptop can do. OLED display with 100% DCI-P3 color accuracy. Intel Core i7 13th Gen delivers professional-grade performance.',
    price: 179990,
    originalPrice: 199990,
    category: 'Electronics',
    subCategory: 'Laptops',
    brand: 'Dell',
    stock: 20,
    isFeatured: false,
    rating: 4.6,
    numReviews: 450,
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', public_id: 'dxps-1' },
    ],
    tags: ['dell', 'laptop', 'oled', 'i7'],
    specifications: new Map([['Processor', 'Intel i7-13700H'], ['RAM', '32GB DDR5'], ['Storage', '1TB SSD'], ['Display', '15.6" OLED']]),
  },
  {
    name: 'LG OLED 4K Smart TV 55"',
    slug: 'lg-oled-4k-smart-tv-55',
    shortDesc: 'OLED evo panel, α9 AI Processor 4K, Dolby Vision',
    description: 'Experience picture quality that goes beyond 4K with LG OLED evo. Infinite contrast, perfect blacks, and vivid colors. Powered by the α9 AI Processor 4K for exceptional clarity.',
    price: 89990,
    originalPrice: 119990,
    category: 'Electronics',
    subCategory: 'TVs',
    brand: 'LG',
    stock: 15,
    isFeatured: true,
    rating: 4.8,
    numReviews: 1200,
    images: [
      { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80', public_id: 'lgtv-1' },
    ],
    tags: ['lg', 'oled', 'tv', '4k', 'smart'],
    specifications: new Map([['Size', '55"'], ['Resolution', '4K UHD'], ['Panel', 'OLED evo'], ['HDR', 'Dolby Vision IQ'], ['OS', 'webOS 23']]),
  },

  // ── Fashion ────────────────────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270 Running Shoes',
    slug: 'nike-air-max-270-running-shoes',
    shortDesc: 'Max Air unit, breathable mesh upper, lifestyle design',
    description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for an incredibly plush ride. Breathable mesh upper keeps feet cool. Lightweight foam midsole for all-day comfort.',
    price: 12495,
    originalPrice: 14995,
    category: 'Fashion',
    subCategory: 'Footwear',
    brand: 'Nike',
    stock: 100,
    isFeatured: true,
    rating: 4.6,
    numReviews: 5600,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', public_id: 'nike-1' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', public_id: 'nike-2' },
    ],
    tags: ['nike', 'shoes', 'running', 'airmax'],
    specifications: new Map([['Material', 'Mesh + Synthetic'], ['Sole', 'Rubber'], ['Closure', 'Lace-up'], ['Available Sizes', '6-12 UK']]),
  },
  {
    name: "Levi's 511 Slim Fit Jeans Dark Blue",
    slug: 'levis-511-slim-fit-jeans-dark-blue',
    shortDesc: 'Slim fit, 99% cotton, sits at waist',
    description: 'The Levi\'s 511 Slim Fit Jeans are a refined, tailored fit that sits at the waist and is slim through the thigh and leg. Made with 99% cotton for comfort and durability.',
    price: 2499,
    originalPrice: 3999,
    category: 'Fashion',
    subCategory: 'Men Clothing',
    brand: "Levi's",
    stock: 200,
    isFeatured: false,
    rating: 4.4,
    numReviews: 3800,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', public_id: 'lv-1' },
    ],
    tags: ["levi's", 'jeans', 'denim', 'slim'],
    specifications: new Map([['Material', '99% Cotton 1% Elastane'], ['Fit', 'Slim'], ['Rise', 'Mid Rise'], ['Wash', 'Dark Blue']]),
  },
  {
    name: 'Adidas Ultraboost 23 Running Shoes',
    slug: 'adidas-ultraboost-23-running-shoes',
    shortDesc: 'BOOST midsole, Primeknit+ upper, Continental rubber',
    description: 'Every step you take in the Ultraboost 23 is energized by BOOST midsole technology. The Primeknit+ upper adapts to your foot\'s natural shape for a snug, flexible fit.',
    price: 15999,
    originalPrice: 19999,
    category: 'Fashion',
    subCategory: 'Footwear',
    brand: 'Adidas',
    stock: 80,
    isFeatured: true,
    rating: 4.7,
    numReviews: 4200,
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', public_id: 'adi-1' },
    ],
    tags: ['adidas', 'ultraboost', 'running', 'shoes'],
    specifications: new Map([['Upper', 'Primeknit+'], ['Midsole', 'BOOST'], ['Outsole', 'Continental Rubber'], ['Drop', '10mm']]),
  },

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt',
    slug: 'instant-pot-duo-7in1-pressure-cooker-6qt',
    shortDesc: '7 appliances in 1, 13 one-touch programs, 6-quart',
    description: 'Instant Pot Duo combines 7 kitchen appliances in one: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and food warmer. Cook up to 70% faster.',
    price: 7999,
    originalPrice: 11999,
    category: 'Home & Kitchen',
    subCategory: 'Cookware',
    brand: 'Instant Pot',
    stock: 120,
    isFeatured: false,
    rating: 4.7,
    numReviews: 8900,
    images: [
      { url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80', public_id: 'ip-1' },
    ],
    tags: ['instant pot', 'pressure cooker', 'kitchen', 'appliance'],
    specifications: new Map([['Capacity', '6 Quart'], ['Programs', '13'], ['Wattage', '1000W'], ['Material', 'Stainless Steel']]),
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    slug: 'dyson-v15-detect-cordless-vacuum',
    shortDesc: 'Laser dust detection, HEPA filtration, 60 min runtime',
    description: 'The Dyson V15 Detect automatically adapts suction to the task using a laser that reveals hidden dust. HEPA filtration captures 99.97% of microscopic particles.',
    price: 55900,
    originalPrice: 65900,
    category: 'Home & Kitchen',
    subCategory: 'Cleaning',
    brand: 'Dyson',
    stock: 35,
    isFeatured: true,
    rating: 4.8,
    numReviews: 2100,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', public_id: 'dys-1' },
    ],
    tags: ['dyson', 'vacuum', 'cordless', 'cleaning'],
    specifications: new Map([['Runtime', '60 min'], ['Suction', '230 AW'], ['Filter', 'HEPA'], ['Weight', '3.1 kg']]),
  },

  // ── Books ──────────────────────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    slug: 'atomic-habits-james-clear',
    shortDesc: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies.',
    price: 399,
    originalPrice: 799,
    category: 'Books',
    subCategory: 'Self Help',
    brand: 'James Clear',
    stock: 500,
    isFeatured: false,
    rating: 4.9,
    numReviews: 45000,
    images: [
      { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', public_id: 'bk-1' },
    ],
    tags: ['books', 'habits', 'self help', 'productivity'],
    specifications: new Map([['Author', 'James Clear'], ['Pages', '320'], ['Language', 'English'], ['Publisher', 'Random House']]),
  },

  // ── Sports & Fitness ───────────────────────────────────────────────────────
  {
    name: 'Yoga Mat Premium Non-Slip 6mm',
    slug: 'yoga-mat-premium-non-slip-6mm',
    shortDesc: 'Extra thick 6mm, eco-friendly TPE, carrying strap',
    description: 'Our premium yoga mat provides superior grip and cushioning for all types of yoga. Made from eco-friendly TPE material. Double-sided non-slip texture. Lightweight and easy to carry.',
    price: 1299,
    originalPrice: 2499,
    category: 'Sports & Fitness',
    subCategory: 'Yoga',
    brand: 'FitLife',
    stock: 300,
    isFeatured: false,
    rating: 4.5,
    numReviews: 6700,
    images: [
      { url: 'https://images.unsplash.com/photo-1601925228026-5fa1d32f4e2f?w=600&q=80', public_id: 'ym-1' },
    ],
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    specifications: new Map([['Thickness', '6mm'], ['Material', 'TPE'], ['Size', '183cm x 61cm'], ['Weight', '1.1kg']]),
  },
  {
    name: 'Adjustable Dumbbell Set 5-52.5 lbs',
    slug: 'adjustable-dumbbell-set-5-52-5-lbs',
    shortDesc: 'Quick-adjust dial, replaces 15 sets of weights',
    description: 'The Bowflex SelectTech 552 replaces 15 sets of weights. Simply turn the dial to select the weight you want. Innovative weight selector system adjusts in 2.5 lb increments.',
    price: 24999,
    originalPrice: 34999,
    category: 'Sports & Fitness',
    subCategory: 'Weights',
    brand: 'Bowflex',
    stock: 45,
    isFeatured: true,
    rating: 4.8,
    numReviews: 3400,
    images: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', public_id: 'db-1' },
    ],
    tags: ['dumbbell', 'weights', 'gym', 'fitness'],
    specifications: new Map([['Range', '5-52.5 lbs'], ['Increments', '2.5 lbs'], ['Material', 'Metal + Plastic'], ['Warranty', '2 years']]),
  },

  // ── Beauty ─────────────────────────────────────────────────────────────────
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1% Serum',
    slug: 'the-ordinary-niacinamide-10-zinc-1-serum',
    shortDesc: 'High-strength vitamin B3 serum, reduces blemishes',
    description: 'Niacinamide (Vitamin B3) is indicated to reduce the appearance of skin blemishes and congestion. A high 10% concentration of this vitamin is supported in the formula by zinc salt.',
    price: 599,
    originalPrice: 999,
    category: 'Beauty',
    subCategory: 'Skincare',
    brand: 'The Ordinary',
    stock: 400,
    isFeatured: false,
    rating: 4.6,
    numReviews: 12000,
    images: [
      { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', public_id: 'to-1' },
    ],
    tags: ['skincare', 'serum', 'niacinamide', 'the ordinary'],
    specifications: new Map([['Volume', '30ml'], ['Key Ingredient', 'Niacinamide 10%'], ['Skin Type', 'All'], ['Fragrance', 'Free']]),
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin ShopKart',
      email: 'admin@shopkart.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@shopkart.com',
      password: 'user1234',
      role: 'user',
    });

    console.log('👤 Users created');

    // Seed products
    const createdProducts = await Product.insertMany(products.map(p => ({ ...p, createdBy: admin._id })));
    console.log(`📦 ${createdProducts.length} Products created`);

    // Create sample orders
    await Order.create({
      user: user._id,
      orderItems: [
        {
          product:  createdProducts[0]._id,
          name:     createdProducts[0].name,
          image:    createdProducts[0].images[0].url,
          price:    createdProducts[0].price,
          quantity: 1,
        },
      ],
      shippingAddress: { name: 'John Doe', phone: '9876543210', street: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      paymentMethod: 'COD',
      itemsPrice:    createdProducts[0].price,
      shippingPrice: 0,
      taxPrice:      Math.round(createdProducts[0].price * 0.18),
      totalPrice:    createdProducts[0].price + Math.round(createdProducts[0].price * 0.18),
      orderStatus:   'Delivered',
      paymentStatus: 'Paid',
      deliveredAt:   new Date(),
      statusHistory: [
        { status: 'Processing', note: 'Order placed' },
        { status: 'Confirmed',  note: 'Order confirmed' },
        { status: 'Shipped',    note: 'Package shipped via Blue Dart' },
        { status: 'Delivered',  note: 'Delivered successfully' },
      ],
    });

    console.log('📋 Sample order created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Admin Login:  admin@shopkart.com / admin123');
    console.log('User  Login:  john@shopkart.com  / user1234\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}