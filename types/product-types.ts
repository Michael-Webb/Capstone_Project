// types/Product.ts

export interface Product {
    lp_id: number;
    posh_id: string;
    sku: string;
    title: string;
    description: string;
    new_with_tag: string;
    condition: string;
    condition_notes: string;
    keywords: string;
    sold: boolean;
    colors: string;
    department: string;
    category: string;
    subcategory: string;
    all_style_tags: string;
    item_cost: string;
    msrp: string;
    price: number;
    brand: string;
    size: string;
    material: string;
    first_image_url: string;
    image_gallery_Current: string;
    image_gallery_count_Current: number;
    Likes_Poshmark: number;
    Number_of_Days_Listed_Poshmark: number;
    total_token_count: number;
    total_token_price: number;
    completion_token_count: number;
    completion_token_price: number;
    prompt_token_count: number;
    prompt_token_price: number;
    id: string; // UUID is represented as a string in TypeScript
    created_at: Date;
    deleted_at: Date | null;
    updated_at: Date | null;
    file_id:string;
    image_id:string;
  }
