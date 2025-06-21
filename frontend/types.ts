export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    featured: boolean;
}
export interface CafeData {
    cafe: {
      name: string;
      logo: string;
      instagram: string;
    };
    products: Product[];
}
export interface Cafe {
    name: string;
    logo: string;
    instagram: string;
}
export interface Props {
    initialName?: string;
    initialLogo?: string;
    initialInstagram?: string;
    slug: string;
    onSaved?: () => void;
}
export interface CafeClientProps {
    name: string;
    logo: string;
    instagram: string;
    products: Product[];
}

export interface EditProductFormProps {
    product: Product;
    onClose: () => void;
    onUpdated: () => void;
  }
  