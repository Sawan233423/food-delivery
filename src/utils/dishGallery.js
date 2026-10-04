// Multi-angle realistic photo gallery for dishes (Front, Side, Cross-section, Garnish views)
export const getDishGallery = (dish) => {
  if (!dish) return [];

  const name = (dish.name || '').toLowerCase();
  const category = (dish.category || '').toLowerCase();
  const baseImg = dish.image;

  // Custom curated multiple angle high-res photos for different categories
  if (category === 'burger' || name.includes('burger')) {
    return [
      {
        url: baseImg,
        title: 'Freshly Assembled Burger',
        subtitle: 'Toasted brioche bun with crispy patty'
      },
      {
        url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
        title: 'Side Angle & Melted Cheese View',
        subtitle: 'Slow melted cheddar dripping over seasoned patty'
      },
      {
        url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
        title: 'Juicy Cross-Section Layers',
        subtitle: 'Lettuce, sliced tomatoes, secret house mayo, and tender patty'
      },
      {
        url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
        title: 'Served with Golden Fries',
        subtitle: 'Crispy salted fries and spicy dip on the side'
      }
    ];
  }

  if (category === 'pizza' || name.includes('pizza')) {
    return [
      {
        url: baseImg,
        title: 'Whole Artisan Sourdough Pie',
        subtitle: 'Fresh out of 400°C stone oven'
      },
      {
        url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
        title: 'Cheese Pull & Slice View',
        subtitle: 'Stretchy buffalo mozzarella and basil garnish'
      },
      {
        url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
        title: 'Crispy Blistered Crust',
        subtitle: 'Charred leopard-spotted Italian crust'
      },
      {
        url: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=800&auto=format&fit=crop&q=80',
        title: 'Herbs & Olive Oil Drizzle',
        subtitle: 'Crushed San Marzano tomatoes with cold-pressed olive oil'
      }
    ];
  }

  if (category === 'biryani' || name.includes('biryani')) {
    return [
      {
        url: baseImg,
        title: 'Authentic Handi Plating',
        subtitle: 'Long grain aged basmati with royal saffron aroma'
      },
      {
        url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
        title: 'Slow Dum Clay Pot View',
        subtitle: 'Sealed dough lid opened for steam release'
      },
      {
        url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
        title: 'Tender Spiced Meat / Paneer',
        subtitle: 'Marinated in 21 hand-ground royal spices'
      },
      {
        url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop&q=80',
        title: 'Served with Burani Raita & Salan',
        subtitle: 'Garlic spiced chilled curd and rich mirchi ka salan'
      }
    ];
  }

  if (category === 'chinese' || name.includes('noodles') || name.includes('dimsum')) {
    return [
      {
        url: baseImg,
        title: 'Wok-Tossed Platter',
        subtitle: 'Stir fried on high flames with scallions'
      },
      {
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
        title: 'Chopstick Lift & Texture View',
        subtitle: 'Silky smooth noodles coated in dark soy chili oil'
      },
      {
        url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
        title: 'Bamboo Steamer / Sizzle Shot',
        subtitle: 'Steaming hot dumplings with spicy garlic dip'
      }
    ];
  }

  if (category === 'dessert' || name.includes('cake') || name.includes('sweet')) {
    return [
      {
        url: baseImg,
        title: 'Artisan Pastry Plating',
        subtitle: 'Rich belgian cocoa and glaze'
      },
      {
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        title: 'Side Angle & Moist Sponge Layers',
        subtitle: 'Layered dark chocolate ganache filling'
      },
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        title: 'Garnish & Berry Compote View',
        subtitle: 'Dusted with gold flakes and fresh mint'
      }
    ];
  }

  if (category === 'rolls' || name.includes('roll') || name.includes('wrap')) {
    return [
      {
        url: baseImg,
        title: 'Flaky Paratha Wrap View',
        subtitle: 'Crispy layered flatbread loaded with fillings'
      },
      {
        url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        title: 'Side View & Cut Cross-Section',
        subtitle: 'Grilled tikka chunks, pickled onions, and mint chutney'
      },
      {
        url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
        title: 'Served with Roasted Green Chilies',
        subtitle: 'Hot off the tawa with fresh lemon squeeze'
      }
    ];
  }

  if (category === 'healthy' || name.includes('salad') || name.includes('bowl')) {
    return [
      {
        url: baseImg,
        title: 'Organic Fresh Bowl',
        subtitle: 'Crisp greens, avocado slices, and seeds'
      },
      {
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
        title: 'Top Down Nutrient View',
        subtitle: 'Rich in dietary fiber and clean plant proteins'
      },
      {
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        title: 'Olive Oil & Vinaigrette Dressing',
        subtitle: 'Cold-pressed extra virgin dressing'
      }
    ];
  }

  // Default fallback multi-angle gallery
  return [
    {
      url: baseImg,
      title: 'Full Dish Presentation',
      subtitle: 'Chef special recipe prepared fresh to order'
    },
    {
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      title: 'Side Angle & Texture Close-up',
      subtitle: 'Rich flavours, fresh herbs, and artisan garnish'
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      title: 'Serving & Condiments',
      subtitle: 'Served with house condiments and dip'
    }
  ];
};
