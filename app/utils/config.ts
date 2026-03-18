// Main configuration file for influencer landing page
import {setTheme} from '~/lib/themeConfig';

// Navigation item type
export interface NavigationItem {
  name: string;
  href: string;
}

// Influencer and product configuration
export interface ProductInfo {
  name: string;
  description: string;
  price?: string;
  image: string;
  features?: string[];
  label?: string;
  handle?: string; // Shopify product handle
}

// Shopify-specific collection configuration
export interface ShopifyCollection {
  handle: string;
  title: string;
  description?: string;
  featured?: boolean;
  id?: string;
}

// Add the pose options interface
interface AIGenerationPose {
  id: string;
  name: string;
  description: string;
  icon?: string; // Lucide icon name
}

interface AIGenerationProduct {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  price: string;
}

export interface LandingPageConfig {
  // Brand & Influencer Details
  influencerName: string;
  influencerTitle: string;
  influencerBio: string;
  influencerImage: string;
  brandName: string;
  brandLogo: string;
  industry?: string;
  // Visual Theme
  brandStyle:
    | 'luxury'
    | 'sporty'
    | 'casual'
    | 'technical'
    | 'minimalist'
    | 'vibrant'
    | 'custom';
  heroBackgroundImage: string;
  heroVideoUrl?: string; // Optional video URL for background
  // Content
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
  // Navigation
  navigation: NavigationItem[];
  // Product Information
  mainProduct: ProductInfo;
  additionalProducts?: ProductInfo[];
  // Social Media
  instagramHandle?: string;
  twitterHandle?: string;
  youtubeChannel?: string;
  tiktokHandle?: string;
  // Social Links (processed from social media handles)
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
    website?: string;
  };
  // Contact Information
  contactEmail?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  newsletterEnabled: boolean;
  // Features & Sections
  showLimitedEdition: boolean;
  showCareerHighlights: boolean;
  showTestimonials: boolean;
  showSocialFeed: boolean;
  showAIMediaGeneration: boolean;
  showTrainingSection: boolean;

  // Customizable Products
  customizableProducts?: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    showcaseTitle?: string;
    showcaseTitleHighlight?: string;
    showcaseDescription?: string;
    features?: string[];
    ctaText?: string;
    ctaLink?: string;
    showcaseImage?: string;
    showcaseImageAlt?: string;
    viewAllText?: string;
    viewAllLink?: string;
  };

  // Testimonials
  testimonials?: Array<{
    name: string;
    role?: string;
    content: string;
    image?: string;
    rating?: number;
  }>;

  // Layout & UI Configuration
  layout: {
    cart: {
      width: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      maxWidth: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      minWidth: string;
      itemsAreaMaxHeight: string;
      itemsAreaMinHeight: string;
      summaryMinHeight: string;
    };
    header: {
      height: {
        mobile: string;
        desktop: string;
      };
      blur: boolean;
    };
    spacing: {
      containerPadding: string;
      sectionSpacing: string;
      cardSpacing: string;
    };
  };

  // AI Media Generation
  aiMediaGeneration: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    influencerReferenceImage: string; // Image of influencer for AI generation
    placeholderText: string;
    successMessage: string;
    errorMessage: string;
    processingMessage: string;
    shareText?: string; // Optional text for sharing generated content
    maxFileSize: number; // in MB
    allowedFormats: string[];
    features: string[];
    // Pose options
    poseOptions: AIGenerationPose[];
    // Product try-on options
    productOptions: AIGenerationProduct[];
    // Authentication and limits
    requiresAuth: boolean; // Require user authentication
    usageLimit: number; // Maximum generations per user per month
    resetPeriod: 'monthly' | 'weekly' | 'daily'; // How often limits reset
    loginPromptTitle: string;
    loginPromptMessage: string;
    limitReachedTitle: string;
    limitReachedMessage: string;
    // Photo ordering features
    enablePrinting?: boolean;
    printProductId?: string;
    printProductName?: string;
  };

  // Limited Edition
  limitedEdition: {
    title: string;
    description: string;
    productHandle: string;
    originalPrice: string;
    salePrice: string;
    endDate: string; // ISO date string
  };

  // Career Highlights
  careerHighlights: Array<{
    year: string;
    title: string;
    description: string;
    image?: string;
  }>;

  // Training Programs
  trainingPrograms?: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
    icon?: string;
  }>;

  // Shopify Configuration
  shopify: {
    featuredCollections: Array<{
      handle: string;
      title: string;
      featured: boolean;
    }>;
    featuredProducts: string[];
    mainCollectionHandle: string;
    limitedEditionCollectionHandle: string;
    defaultSorting: string;
    productsPerPage: number;
    enableCustomerAccounts: boolean;
  };

  // Products
  products: ProductInfo[];

  // Dynamically loaded Shopify collections (added during runtime)
  shopifyCollections?: Array<{
    handle: string;
    title: string;
    featured: boolean;
  }>;
}

// Hoso Matcha configuration
export const defaultConfig: LandingPageConfig = {
  // Brand & Influencer Details
  influencerName: 'Hoso Matcha',
  influencerTitle: 'Matcha Premium depuis Uji, Kyoto',
  influencerBio:
    "Hoso Matcha est ne de la rencontre entre l'art ancestral du matcha japonais et la patisserie artisanale. Nos matchas d'exception sont selectionnes a Uji, berceau du matcha depuis le XIVe siecle.",
  influencerImage: '/images/hero-background.jpg',
  brandName: 'HOSO MATCHA',
  brandLogo: '/images/logo/hoso-logo-noir.png',
  industry: 'matcha',

  // Visual Theme
  brandStyle: 'luxury',
  heroBackgroundImage: '/images/preset/bghero.png',
  heroVideoUrl: undefined,

  // Content
  heroTitle: 'HOSO',
  heroSubtitle:
    "L'art du matcha d'exception, directement depuis les jardins d'Uji, Kyoto",
  ctaText: 'DECOUVRIR',
  ctaLink: '/collections/all',

  // Navigation
  navigation: [
    {name: 'Accueil', href: '/'},
    {name: 'Nos Matchas', href: '/collections/matcha'},
    {name: 'Nos Kits', href: '/collections/kit'},
    {name: 'Accessoires', href: '/collections/accesoires'},
    {name: 'Notre Histoire', href: '/notre-histoire'},
    {name: 'Notre Magasin', href: '/notre-magasin'},
  ],

  // Product Information
  mainProduct: {
    name: 'Matcha Ceremonial',
    description:
      "Notre matcha ceremonial de grade superieur, cultive dans les jardins traditionnels d'Uji. Un gout umami profond et une texture soyeuse.",
    price: '34.00',
    image: '/images/product-1.png',
    handle: 'matcha-ceremonial',
    features: [
      'Grade ceremonial superieur',
      'Origine Uji, Kyoto',
      'Recolte premiere flush',
      'Mouture sur meule de pierre',
    ],
  },
  additionalProducts: [
    {
      name: 'Matcha Culinaire',
      description:
        'Ideal pour vos patisseries et boissons. Un matcha riche en saveur, parfait pour les lattes et les recettes.',
      price: '24.00',
      image: '/images/product-2.png',
      handle: 'matcha-culinaire',
      features: [
        'Parfait pour les lattes',
        'Ideal en patisserie',
        'Saveur riche et equilibree',
        'Format genereux',
      ],
    },
    {
      name: 'Chasen - Fouet en Bambou',
      description:
        'Fouet traditionnel en bambou, fabrique a la main au Japon. Indispensable pour une preparation authentique.',
      price: '28.00',
      image: '/images/product-3.png',
      handle: 'chasen-fouet-bambou',
      features: [
        'Bambou naturel',
        'Fabrication artisanale',
        '80 brins',
        'Traditionnel japonais',
      ],
    },
    {
      name: 'Chawan - Bol a Matcha',
      description:
        "Bol en ceramique artisanale, concu pour la preparation traditionnelle du matcha. Chaque piece est unique.",
      price: '42.00',
      image: '/images/product-4.png',
      handle: 'chawan-bol-matcha',
      features: [
        'Ceramique artisanale',
        'Forme traditionnelle',
        'Piece unique',
        'Fabrique au Japon',
      ],
    },
  ],

  // Social Media
  instagramHandle: 'hosobasqueparis_',
  twitterHandle: undefined,
  youtubeChannel: undefined,
  tiktokHandle: 'hosomatcha',

  // Social Links
  socialLinks: {
    instagram: 'https://www.instagram.com/hosobasqueparis_/',
    tiktok: 'https://www.tiktok.com/@hosobasque_',
  },

  // Contact Information
  contactEmail: 'contact@hosomatcha.com',
  contactInfo: {
    address: 'Paris, France',
    phone: undefined,
    email: 'contact@hosomatcha.com',
  },
  newsletterEnabled: true,

  // Features & Sections
  showLimitedEdition: false,
  showCareerHighlights: false,
  showTestimonials: true,
  showSocialFeed: false,
  showAIMediaGeneration: false,
  showTrainingSection: false,

  // Customizable Products
  customizableProducts: {
    title: 'Personnalisez votre coffret',
    subtitle:
      'Composez votre coffret matcha sur mesure avec nos produits selectionnes.',
    badgeText: 'Sur mesure',
    showcaseTitle: 'Votre coffret',
    showcaseTitleHighlight: 'personnalise',
    showcaseDescription:
      'Choisissez vos matchas et accessoires pour creer le coffret ideal.',
    features: [
      'Choix des matchas',
      'Accessoires traditionnels',
      'Emballage cadeau',
    ],
    ctaText: 'Composer mon coffret',
    ctaLink: '/customize-products',
    showcaseImage: '/images/customization-preview.jpg',
    showcaseImageAlt: 'Coffret matcha personnalise',
    viewAllText: 'Voir les coffrets',
    viewAllLink: '/customize-products',
  },

  // Layout & UI Configuration
  layout: {
    cart: {
      width: {
        mobile: '100vw',
        tablet: 'min(85vw, 380px)',
        desktop: 'min(90vw, 420px)',
      },
      maxWidth: {
        mobile: '100vw',
        tablet: '380px',
        desktop: '420px',
      },
      minWidth: '320px',
      itemsAreaMaxHeight: 'calc(100vh - 350px)',
      itemsAreaMinHeight: '200px',
      summaryMinHeight: '150px',
    },
    header: {
      height: {
        mobile: '60px',
        desktop: '80px',
      },
      blur: true,
    },
    spacing: {
      containerPadding: '1rem',
      sectionSpacing: '6.5rem',
      cardSpacing: '1.5rem',
    },
  },

  // AI Media Generation
  aiMediaGeneration: {
    title: 'EXPERIENCE MATCHA',
    subtitle: 'Creez votre moment matcha',
    description:
      'Decouvrez nos recettes et partagez votre experience matcha avec notre communaute.',
    buttonText: 'Creer',
    influencerReferenceImage: '/images/hero-background.jpg',
    placeholderText: 'Partagez votre photo',
    successMessage: 'Votre creation est prete !',
    errorMessage:
      'Une erreur est survenue. Veuillez reessayer.',
    processingMessage:
      'Creation en cours... Cela peut prendre quelques instants.',
    shareText:
      'Decouvrez mon moment matcha avec Hoso Matcha !',
    maxFileSize: 10,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    features: [
      'Generation IA de qualite',
      'Resultats instantanes',
      'Partage facile',
      'Plusieurs styles disponibles',
    ],
    poseOptions: [
      {
        id: 'celebrity',
        name: 'Style Matcha',
        description: 'Votre moment matcha',
        icon: 'users',
      },
      {
        id: 'try-on',
        name: 'Essai virtuel',
        description: 'Essayez nos accessoires',
        icon: 'shirt',
      },
    ],
    enablePrinting: false,
    printProductId: '',
    printProductName: '',
    productOptions: [],
    requiresAuth: true,
    usageLimit: 10,
    resetPeriod: 'monthly',
    loginPromptTitle: 'Connexion requise',
    loginPromptMessage: 'Veuillez vous connecter pour continuer.',
    limitReachedTitle: 'Limite atteinte',
    limitReachedMessage:
      'Vous avez atteint le nombre maximum de creations pour ce mois.',
  },

  // Limited Edition
  limitedEdition: {
    title: 'EDITION LIMITEE',
    description:
      'Notre matcha ceremonial grand cru, recolte de printemps. Edition limitee, seulement 50 boites disponibles.',
    productHandle: 'matcha-grand-cru',
    originalPrice: '59.00',
    salePrice: '49.00',
    endDate: '2026-12-31T23:59:59',
  },

  // Products
  products: [
    {
      name: 'Matcha Ceremonial',
      description:
        "Notre matcha ceremonial de grade superieur, cultive dans les jardins traditionnels d'Uji.",
      price: '34.00',
      image: '/images/product-1.png',
      handle: 'matcha-ceremonial',
      label: 'Bestseller',
      features: [
        'Grade ceremonial superieur',
        'Origine Uji, Kyoto',
        'Recolte premiere flush',
        'Mouture sur meule de pierre',
      ],
    },
    {
      name: 'Matcha Culinaire',
      description:
        'Ideal pour vos patisseries et boissons. Un matcha riche en saveur.',
      price: '24.00',
      image: '/images/product-2.png',
      handle: 'matcha-culinaire',
      label: 'Populaire',
      features: [
        'Parfait pour les lattes',
        'Ideal en patisserie',
        'Saveur riche',
        'Format genereux',
      ],
    },
    {
      name: 'Chasen - Fouet en Bambou',
      description:
        'Fouet traditionnel en bambou, fabrique a la main au Japon.',
      price: '28.00',
      image: '/images/product-3.png',
      handle: 'chasen-fouet-bambou',
      features: [
        'Bambou naturel',
        'Fabrication artisanale',
        '80 brins',
        'Traditionnel japonais',
      ],
    },
    {
      name: 'Chawan - Bol a Matcha',
      description:
        'Bol en ceramique artisanale pour la preparation traditionnelle.',
      price: '42.00',
      image: '/images/product-4.png',
      handle: 'chawan-bol-matcha',
      features: [
        'Ceramique artisanale',
        'Forme traditionnelle',
        'Piece unique',
        'Fabrique au Japon',
      ],
    },
  ],

  // Career Highlights - Repurposed as Brand Milestones
  careerHighlights: [
    {
      year: '2020',
      title: 'Naissance de Hoso Matcha',
      description:
        "Premiere selection de matcha d'Uji, debut de l'aventure entre tradition japonaise et savoir-faire francais.",
      image: '/images/product-1.png',
    },
    {
      year: '2021',
      title: 'Partenariat avec les producteurs d\'Uji',
      description:
        'Accord exclusif avec des producteurs familiaux de la region d\'Uji, berceau du matcha depuis le XIVe siecle.',
      image: '/images/product-2.png',
    },
    {
      year: '2023',
      title: 'Lancement de la boutique',
      description:
        'Ouverture de notre boutique en ligne et premiere collection d\'accessoires traditionnels.',
      image: '/images/product-3.png',
    },
    {
      year: '2024',
      title: 'Collection Grand Cru',
      description:
        'Lancement de notre gamme Grand Cru, les matchas les plus raffines selectionnes a la source.',
      image: '/images/product-4.png',
    },
  ],

  // Training Programs - Repurposed as Matcha Guides
  trainingPrograms: [
    {
      id: 'preparation',
      title: 'L\'ART DE LA PREPARATION',
      description:
        'Apprenez a preparer un matcha parfait avec les techniques traditionnelles japonaises',
      icon: 'coffee',
      link: '/about',
    },
    {
      id: 'selection',
      title: 'NOTRE SELECTION',
      description:
        'Decouvrez comment nous selectionnons les meilleurs matchas directement a Uji, Kyoto',
      icon: 'leaf',
      link: '/about',
    },
    {
      id: 'bienfaits',
      title: 'LES BIENFAITS',
      description:
        'Le matcha est riche en antioxydants, L-theanine et chlorophylle pour votre bien-etre',
      icon: 'heart',
      link: '/about',
    },
  ],

  // Shopify Configuration
  shopify: {
    featuredCollections: [
      {
        handle: 'matcha',
        title: 'Nos Matchas',
        featured: true,
      },
      {
        handle: 'accessoires',
        title: 'Accessoires',
        featured: true,
      },
      {
        handle: 'coffrets',
        title: 'Coffrets',
        featured: true,
      },
      {
        handle: 'patisserie',
        title: 'Patisserie',
        featured: false,
      },
    ],
    featuredProducts: [
      'matcha-ceremonial',
      'matcha-culinaire',
      'chasen-fouet-bambou',
      'chawan-bol-matcha',
    ],
    mainCollectionHandle: 'featured',
    limitedEditionCollectionHandle: 'limited-edition',
    defaultSorting: 'manual',
    productsPerPage: 12,
    enableCustomerAccounts: true,
  },

  // Testimonials
  testimonials: [
    {
      name: 'Marie L.',
      role: 'Cliente fidele',
      content:
        "Le matcha ceremonial de Hoso est d'une qualite exceptionnelle. La saveur umami est profonde et l'arriere-gout est doux et elegant. Je ne peux plus m'en passer pour mes rituels du matin.",
      rating: 5,
    },
    {
      name: 'Thomas D.',
      role: 'Patissier',
      content:
        "En tant que patissier, je suis tres exigeant sur la qualite des ingredients. Le matcha culinaire de Hoso apporte une couleur et un gout incomparables a mes creations. Un produit d'exception.",
      rating: 5,
    },
    {
      name: 'Sophie M.',
      role: 'Passionnee de the',
      content:
        "La difference avec les autres matchas est flagrante des la premiere gorgee. On sent le soin apporte a la selection et la mouture. L'emballage est aussi tres raffine, parfait pour offrir.",
      rating: 5,
    },
  ],
};

/**
 * Initialize the landing page configuration
 *
 * @param customConfig Optional custom configuration to override defaults
 * @returns The final configuration
 */
export function initConfig(
  customConfig: Partial<LandingPageConfig> = {},
): LandingPageConfig {
  const config = {...defaultConfig, ...customConfig};

  // Update social links from handles if not directly provided
  if (!customConfig.socialLinks) {
    config.socialLinks = {
      instagram: config.instagramHandle
        ? `https://instagram.com/${config.instagramHandle}`
        : undefined,
      twitter: config.twitterHandle
        ? `https://twitter.com/${config.twitterHandle}`
        : undefined,
      youtube: config.youtubeChannel
        ? `https://youtube.com/${config.youtubeChannel}`
        : undefined,
      tiktok: config.tiktokHandle
        ? `https://tiktok.com/@${config.tiktokHandle}`
        : undefined,
    };
  }

  // Initialize theme based on config
  setTheme({
    brandName: config.brandName,
    brandStyle: config.brandStyle,
    brandLogo: config.brandLogo,
    influencerName: config.influencerName,
    influencerTitle: config.influencerTitle,
    influencerImage: config.influencerImage,
    socialLinks: config.socialLinks,
  });

  return config;
}

/**
 * Get the current configuration - can be extended to support multiple influencers
 */
export function getConfig(influencerId?: string): LandingPageConfig {
  // For now, return default Hoso Matcha config
  // Later this can be extended to support multiple influencers
  return defaultConfig;
}

// Export the configuration
export default initConfig();
