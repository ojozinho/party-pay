export type Product = {
  id: string;
  name: string;
  enName: string;
  category: 'cervejas' | 'drinks' | 'combos' | 'shots' | 'sem alcool';
  price: number;
  description: string;
  image: number;
  tint: string;
  available: boolean;
  tag?: string;
};

export const products: Product[] = [
  {
    id: 'beer',
    name: 'Heineken Long Neck',
    enName: 'Heineken Long Neck',
    category: 'cervejas',
    price: 12,
    description: 'Long neck gelada, pronta pra retirar no bar central.',
    image: require('../assets/products/beer.jpg'),
    tint: '#FFD93D',
    available: true,
    tag: '+ vendido'
  },
  {
    id: 'caipirinha',
    name: 'Caipirinha especial',
    enName: 'House caipirinha',
    category: 'drinks',
    price: 22,
    description: 'Cachaça artesanal, limão tahiti, açúcar mascavo e gelo trincando.',
    image: require('../assets/products/cocktail.jpg'),
    tint: '#C5B4FF',
    available: true,
    tag: 'da casa'
  },
  {
    id: 'gin',
    name: 'Gin tônica frutas',
    enName: 'Fruit gin tonic',
    category: 'drinks',
    price: 28,
    description: 'Gin, tônica, frutas vermelhas e perfume cítrico.',
    image: require('../assets/products/gin.jpg'),
    tint: '#FF8FB1',
    available: true
  },
  {
    id: 'combo',
    name: 'Combo 4 long necks',
    enName: '4 long neck combo',
    category: 'combos',
    price: 42,
    description: 'Quatro long necks no balde, desconto de pista.',
    image: require('../assets/products/combo.jpg'),
    tint: '#FF6B6B',
    available: true,
    tag: '-25%'
  },
  {
    id: 'whisky',
    name: 'Whisky + energético',
    enName: 'Whisky and energy',
    category: 'combos',
    price: 48,
    description: 'Dose dupla com energético e gelo no copão.',
    image: require('../assets/products/whisky.jpg'),
    tint: '#7B5BD9',
    available: true
  },
  {
    id: 'energy',
    name: 'Energético lata',
    enName: 'Energy drink can',
    category: 'sem alcool',
    price: 16,
    description: 'Sem álcool, gelado, pra segurar a noite.',
    image: require('../assets/products/energy.jpg'),
    tint: '#4AD9D9',
    available: true
  }
];
