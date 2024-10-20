// components/ListingForm.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ListingDetails from "@/components/analytics/ListingDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImagePreview from "@/components/Images/ImagePreview";
import { deleteProductImage } from "@/app/actions/actions";
import ImageUpload from "@/components/listing-form/ImageUpload";
import { Database } from "@/types/supabase";
import { upsertListing, fetchListing } from "@/app/actions/getInventory";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  [key: string]: any;
};

const dateSchema = z.union([
  z.date(),
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
  }),
]);

const listingSchema = z.object({
  all_style_tags: z.string().nullable(),
  brand: z.string().nullable(),
  category: z.string().nullable(),
  colors: z.string().nullable(),
  completion_token_count: z.number().nullable(),
  completion_token_price: z.number().nullable(),
  condition: z.string().nullable(),
  condition_notes: z.string().nullable(),
  created_at: z.string().nullable(),
  deleted_at: z.string().nullable(),
  department: z.string().nullable(),
  description: z.string().nullable(),
  file_id: z.string().nullable(),
  first_image_url: z.string().nullable(),
  id: z.string(),
  image_gallery_count_Current: z.number().nullable(),
  image_gallery_Current: z.string().nullable(),
  image_id: z.string().nullable(),
  item_cost: z.number().nullable(),
  keywords: z.string().nullable(),
  Likes_Poshmark: z.number().nullable(),
  lp_id: z.number().nullable(),
  material: z.string().nullable(),
  messageValue: z.string().nullable(),
  msrp: z.number().nullable(),
  new_with_tag: z.string().nullable(),
  "Number of Days Listed_Poshmark": z.number().nullable(),
  posh_id: z.string().nullable(),
  price: z.number().nullable(),
  prompt_token_count: z.number().nullable(),
  prompt_token_price: z.number().nullable(),
  size: z.string().nullable(),
  sku: z.string().nullable(),
  sold: z.boolean().nullable(),
  subcategory: z.string().nullable(),
  title: z.string().nullable(),
  total_token_count: z.number().nullable(),
  total_token_price: z.number().nullable(),
  updated_at: z.string().nullable(),
  uploadedImages: z.array(z.string()).nullable(),
}).partial().passthrough();

type Department = "Women" | "Men" | "Kids" | "Home" | "Pets" | "Electronics";

const departments: Record<Department, string[]> = {
  Women: [
    "Accessories",
    "Bags",
    "Dresses",
    "Intimates & Sleepwear",
    "Jackets & Coats",
    "Jeans",
    "Jewelry",
    "Makeup",
    "Pants & Jumpsuits",
    "Shoes",
    "Shorts",
    "Skirts",
    "Sweaters",
    "Swim",
    "Tops",
    "Skincare",
    "Hair",
    "Bath & Body",
    "Global & Traditional Wear",
    "Other",
  ],
  Men: [],
  Kids: [],
  Home: [],
  Pets: [],
  Electronics: [],
};

type ListingFormValues = Product;

interface ListingFormProps {
  id: string;
}

export default function ListingForm({ id }: ListingFormProps) {
  const isNewListing = id === "new";
  const [listing, setListing] = useState<ListingFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`accordionState-${id}`);
      return saved ? JSON.parse(saved) : ["basic-info"];
    }
    return ["basic-info"];
  });

  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<Product>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      all_style_tags: null,
      brand: null,
      category: null,
      colors: null,
      completion_token_count: null,
      completion_token_price: null,
      condition: null,
      condition_notes: null,
      created_at: null,
      deleted_at: null,
      department: null,
      description: null,
      file_id: null,
      first_image_url: null,
      image_gallery_count_Current: null,
      image_gallery_Current: null,
      image_id: null,
      item_cost: null,
      keywords: null,
      Likes_Poshmark: null,
      lp_id: null,
      material: null,
      messageValue: null,
      msrp: null,
      new_with_tag: null,
      "Number of Days Listed_Poshmark": null,
      posh_id: null,
      price: null,
      prompt_token_count: null,
      prompt_token_price: null,
      size: null,
      sku: null,
      sold: null,
      subcategory: null,
      title: null,
      total_token_count: null,
      total_token_price: null,
      updated_at: null,
      uploadedImages: null,
    },
  });

  const handleAccordionChange = (value: string[]) => {
    setOpenAccordionItems(value);
    localStorage.setItem(`accordionState-${id}`, JSON.stringify(value));
  };

  const handleImageReorder = (newOrder: string[]) => {
    form.setValue("uploadedImages", newOrder, { shouldValidate: true });
  };

  const handleImageUpload = useCallback(
    (newImages: string[]) => {
      form.setValue("uploadedImages", newImages);
    },
    [form]
  );

  const handleImageMarkForDeletion = (imagePath: string) => {
    setImagesToDelete((prev) => 
      prev.includes(imagePath) 
        ? prev.filter(path => path !== imagePath) 
        : [...prev, imagePath]
    );
  };

  useEffect(() => {
    const loadListing = async () => {
      if (!isNewListing) {
        try {
          const data = await fetchListing(id);
          setListing(data);
          setCurrentTitle(data.title || "Untitled Listing");
          form.reset(data);

          // Load accordion state
          const saved = localStorage.getItem(`accordionState-${id}`);
          if (saved) {
            setOpenAccordionItems(JSON.parse(saved));
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
          toast({
            title: "Error",
            description: "Failed to fetch listing data.",
            variant: "destructive",
          });
        }
      } else {
        setCurrentTitle("New Listing");
        form.reset({
          // Set default values for a new listing here
        });
      }
    };

    loadListing();
  }, [id, isNewListing, form, toast]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`accordionState-${id}`);
    };
  }, [id]);

  async function onSubmit(data: ListingFormValues) {
    setIsLoading(true);

    try {
      const result = await upsertListing(data);

      // Handle image deletions
      for (const imagePath of imagesToDelete) {
        const deleteResult = await deleteProductImage(id, imagePath);
        if (!deleteResult.success) {
          console.error(`Failed to delete image: ${imagePath}`, deleteResult.error);
        }
      }

      // Update the form's uploadedImages field
      const updatedImages = (data.uploadedImages || []).filter(
        (imagePath) => !imagesToDelete.includes(imagePath)
      );
      form.setValue("uploadedImages", updatedImages);

      // Clear the imagesToDelete array
      setImagesToDelete([]);

      toast({
        title: "Success",
        description: isNewListing ? "Listing created successfully." : "Listing updated successfully.",
      });

      setCurrentTitle(result.title || "Untitled Listing");

      if (isNewListing) {
        router.push(`/home/listings/${result.id}`);
      } else {
        setListing(result);
        form.reset(result);
      }
    } catch (error) {
      console.error("Error in update/create process:", error);
      toast({
        title: "Error",
        description: isNewListing ? "Failed to create listing." : "Failed to update listing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isNewListing && !listing) return <div>Loading...</div>;

  const watchDepartment = form.watch("department");
  const watchCategory = form.watch("category");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">
        {isNewListing ? "Create New Listing" : `Edit Listing: ${currentTitle || "Loading..."}`}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form validation errors:", errors);
            toast({
              title: "Validation Error",
              description: "Please check the form for errors.",
              variant: "destructive",
            });
          })}
          className="space-y-8"
        >
          <Accordion
            type="multiple"
            className="w-full"
            value={openAccordionItems}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(Object.keys(departments) as Department[]).map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={!watchDepartment}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {watchDepartment &&
                              departments[watchDepartment as Department].map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchCategory === "Other" && (
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Category</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Enter custom category"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="uploadedImages">
              <AccordionTrigger>Images</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="uploadedImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uploaded Images</FormLabel>
                      <FormControl>
                        <div>
                          <ImageUpload
                            productId={id}
                            isNewListing={isNewListing}
                            onUploadComplete={handleImageUpload}
                          />
                          <ImagePreview
                            productId={id}
                            uploadedImages={field.value || null}
                            onReorder={handleImageReorder}
                            onMarkForDeletion={handleImageMarkForDeletion}
                            imagesToDelete={imagesToDelete}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={10} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing">
              <AccordionTrigger>Pricing</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="analytics">
              <AccordionTrigger>Analytics</AccordionTrigger>
              <AccordionContent>
                <ListingDetails listingId={id} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isNewListing ? "Create Listing" : "Update Listing"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
