export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      inventory_final_duplicate: {
        Row: {
          all_category: string | null
          all_colors: string | null
          all_style_tags: string | null
          Brand_Poshmark: string | null
          cogs_Current: string | null
          "Cost Price_Poshmark": string | null
          "Current Listing Price_Poshmark": number | null
          db_color: string | null
          db_condition: string | null
          db_condition_notes: string | null
          db_description: string | null
          db_keywords: string | null
          db_lpsold: string | null
          db_material: string | null
          db_size: string | null
          first_image_url: string | null
          Generated_Description: string | null
          Generated_Titles: string | null
          id: string
          image_gallery_count_Current: number | null
          image_gallery_Current: string | null
          initial_price: number | null
          Likes_Poshmark: number | null
          "Lowest Listed Price_Poshmark": number | null
          "lp-id_Current": number | null
          msrp: string | null
          "Number of Days Listed_Poshmark": number | null
          NWT_Text: string | null
          posh_desc: string | null
          PoshmarkID: string | null
          Size_Poshmark: string | null
          sku: string | null
          Title_Poshmark: string | null
        }
        Insert: {
          all_category?: string | null
          all_colors?: string | null
          all_style_tags?: string | null
          Brand_Poshmark?: string | null
          cogs_Current?: string | null
          "Cost Price_Poshmark"?: string | null
          "Current Listing Price_Poshmark"?: number | null
          db_color?: string | null
          db_condition?: string | null
          db_condition_notes?: string | null
          db_description?: string | null
          db_keywords?: string | null
          db_lpsold?: string | null
          db_material?: string | null
          db_size?: string | null
          first_image_url?: string | null
          Generated_Description?: string | null
          Generated_Titles?: string | null
          id?: string
          image_gallery_count_Current?: number | null
          image_gallery_Current?: string | null
          initial_price?: number | null
          Likes_Poshmark?: number | null
          "Lowest Listed Price_Poshmark"?: number | null
          "lp-id_Current"?: number | null
          msrp?: string | null
          "Number of Days Listed_Poshmark"?: number | null
          NWT_Text?: string | null
          posh_desc?: string | null
          PoshmarkID?: string | null
          Size_Poshmark?: string | null
          sku?: string | null
          Title_Poshmark?: string | null
        }
        Update: {
          all_category?: string | null
          all_colors?: string | null
          all_style_tags?: string | null
          Brand_Poshmark?: string | null
          cogs_Current?: string | null
          "Cost Price_Poshmark"?: string | null
          "Current Listing Price_Poshmark"?: number | null
          db_color?: string | null
          db_condition?: string | null
          db_condition_notes?: string | null
          db_description?: string | null
          db_keywords?: string | null
          db_lpsold?: string | null
          db_material?: string | null
          db_size?: string | null
          first_image_url?: string | null
          Generated_Description?: string | null
          Generated_Titles?: string | null
          id?: string
          image_gallery_count_Current?: number | null
          image_gallery_Current?: string | null
          initial_price?: number | null
          Likes_Poshmark?: number | null
          "Lowest Listed Price_Poshmark"?: number | null
          "lp-id_Current"?: number | null
          msrp?: string | null
          "Number of Days Listed_Poshmark"?: number | null
          NWT_Text?: string | null
          posh_desc?: string | null
          PoshmarkID?: string | null
          Size_Poshmark?: string | null
          sku?: string | null
          Title_Poshmark?: string | null
        }
        Relationships: []
      }
      "listing-images": {
        Row: {
          created_at: string
          image_id: number
          image_name: string | null
          image_sort: number | null
          openai_file_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string
          image_id?: number
          image_name?: string | null
          image_sort?: number | null
          openai_file_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string
          image_id?: number
          image_name?: string | null
          image_sort?: number | null
          openai_file_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_listing-images_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_hist_condition: {
        Row: {
          condition: string | null
          condition_notes: string | null
          created_at: string | null
          id: number
          product_id: string | null
        }
        Insert: {
          condition?: string | null
          condition_notes?: string | null
          created_at?: string | null
          id?: number
          product_id?: string | null
        }
        Update: {
          condition?: string | null
          condition_notes?: string | null
          created_at?: string | null
          id?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_hist_condition_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_hist_description: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_hist_description_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_hist_price: {
        Row: {
          created_at: string | null
          id: number
          price: number | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          price?: number | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          price?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_hist_price_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_hist_titles: {
        Row: {
          created_at: string | null
          id: number
          product_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hist_prod_titles_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          all_style_tags: string | null
          brand: string | null
          category: string | null
          colors: string | null
          completion_token_count: number | null
          completion_token_price: number | null
          condition: string | null
          condition_notes: string | null
          created_at: string | null
          deleted_at: string | null
          department: string | null
          description: string | null
          file_id: string | null
          first_image_url: string | null
          id: string
          image_gallery_count_Current: number | null
          image_gallery_Current: string | null
          image_id: string | null
          item_cost: number | null
          keywords: string | null
          Likes_Poshmark: number | null
          lp_id: number | null
          material: string | null
          messageValue: string | null
          msrp: number | null
          new_with_tag: string | null
          "Number of Days Listed_Poshmark": number | null
          posh_id: string | null
          price: number | null
          prompt_token_count: number | null
          prompt_token_price: number | null
          size: string | null
          sku: string | null
          sold: boolean | null
          subcategory: string | null
          title: string | null
          total_token_count: number | null
          total_token_price: number | null
          updated_at: string | null
          uploadedImages: string[] | null
        }
        Insert: {
          all_style_tags?: string | null
          brand?: string | null
          category?: string | null
          colors?: string | null
          completion_token_count?: number | null
          completion_token_price?: number | null
          condition?: string | null
          condition_notes?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          description?: string | null
          file_id?: string | null
          first_image_url?: string | null
          id?: string
          image_gallery_count_Current?: number | null
          image_gallery_Current?: string | null
          image_id?: string | null
          item_cost?: number | null
          keywords?: string | null
          Likes_Poshmark?: number | null
          lp_id?: number | null
          material?: string | null
          messageValue?: string | null
          msrp?: number | null
          new_with_tag?: string | null
          "Number of Days Listed_Poshmark"?: number | null
          posh_id?: string | null
          price?: number | null
          prompt_token_count?: number | null
          prompt_token_price?: number | null
          size?: string | null
          sku?: string | null
          sold?: boolean | null
          subcategory?: string | null
          title?: string | null
          total_token_count?: number | null
          total_token_price?: number | null
          updated_at?: string | null
          uploadedImages?: string[] | null
        }
        Update: {
          all_style_tags?: string | null
          brand?: string | null
          category?: string | null
          colors?: string | null
          completion_token_count?: number | null
          completion_token_price?: number | null
          condition?: string | null
          condition_notes?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          description?: string | null
          file_id?: string | null
          first_image_url?: string | null
          id?: string
          image_gallery_count_Current?: number | null
          image_gallery_Current?: string | null
          image_id?: string | null
          item_cost?: number | null
          keywords?: string | null
          Likes_Poshmark?: number | null
          lp_id?: number | null
          material?: string | null
          messageValue?: string | null
          msrp?: number | null
          new_with_tag?: string | null
          "Number of Days Listed_Poshmark"?: number | null
          posh_id?: string | null
          price?: number | null
          prompt_token_count?: number | null
          prompt_token_price?: number | null
          size?: string | null
          sku?: string | null
          sold?: boolean | null
          subcategory?: string | null
          title?: string | null
          total_token_count?: number | null
          total_token_price?: number | null
          updated_at?: string | null
          uploadedImages?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
          password: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_product_image: {
        Args: {
          product_id: string
          image_path: string
        }
        Returns: undefined
      }
      get_image_urls: {
        Args: {
          folder_id: string
        }
        Returns: {
          public_url: string
        }[]
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: unknown
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: unknown
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      restore_product: {
        Args: {
          product_id: string
        }
        Returns: undefined
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      soft_delete_product: {
        Args: {
          product_id: string
        }
        Returns: undefined
      }
      update_product_images: {
        Args: {
          product_id: string
          new_images: string[]
        }
        Returns: undefined
      }
      upload_to_openai: {
        Args: {
          product_id: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
