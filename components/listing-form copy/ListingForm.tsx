// components/ListingForm.tsx

"use client";

import { useEffect, useState, useRef } from "react";
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
import { ImageUpload } from "@/components/listing-form copy/ImageUpload";
import ListingDetails from "@/components/analytics/ListingDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dateSchema = z.union([z.date(), z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date string",
})]);
// Define your schema based on the listing structure
const listingSchema = z
  .object({
    lp_id: z.number().nullable().optional(),
    posh_id: z.string().nullable().optional(),
    sku: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    new_with_tag: z.boolean().nullable().optional(),
    condition: z.string().nullable().optional(),
    condition_notes: z.string().nullable().optional(),
    keywords: z.string().nullable().optional(),
    sold: z.boolean().nullable().optional(),
    colors: z.string().nullable().optional(),
    department: z.enum(["Women", "Men", "Kids", "Home", "Pets", "Electronics"]).nullable().optional(),
    category: z.string().nullable().optional(),
    subcategory: z.string().nullable().optional(),
    all_style_tags: z.string().nullable().optional(),
    item_cost: z.string().nullable().optional(),
    msrp: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    brand: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    material: z.string().nullable().optional(),
    first_image_url: z.string().nullable().optional(),
    image_gallery_Current: z.string().nullable().optional(),
    image_gallery_count_Current: z.number().nullable().optional(),
    Likes_Poshmark: z.number().nullable().optional(),
    Number_of_Days_Listed_Poshmark: z.number().nullable().optional(),
    total_token_count: z.number().nullable().optional(),
    total_token_price: z.number().nullable().optional(),
    completion_token_count: z.number().nullable().optional(),
    completion_token_price: z.number().nullable().optional(),
    prompt_token_count: z.number().nullable().optional(),
    prompt_token_price: z.number().nullable().optional(),
    id: z.string().uuid(),
    created_at: dateSchema.nullable().optional(),
    updated_at: dateSchema.nullable().optional(),
    deleted_at: dateSchema.nullable().optional(),
  })
  .partial();

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
  Men: [
    // Add men's categories here
  ],
  Kids: [
    // Add kids' categories here
  ],
  Home: [],
  Pets: [],
  Electronics: [],
};

type ListingFormValues = z.infer<typeof listingSchema>;

interface ListingFormProps {
  id: string;
}

export default function ListingForm({ id }: ListingFormProps) {
  const isNewListing = id === "new";
  const [listing, setListing] = useState<ListingFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      lp_id: null,
      posh_id: null,
      sku: null,
      title: null,
      description: null,
      new_with_tag: null,
      condition: null,
      condition_notes: null,
      keywords: null,
      sold: null,
      colors: null,
      department: null,
      category: null,
      subcategory: null,
      all_style_tags: null,
      item_cost: null,
      msrp: null,
      price: null,
      brand: null,
      size: null,
      material: null,
      first_image_url: null,
      image_gallery_Current: null,
      image_gallery_count_Current: null,
      Likes_Poshmark: null,
      Number_of_Days_Listed_Poshmark: null,
      total_token_count: null,
      total_token_price: null,
      completion_token_count: null,
      completion_token_price: null,
      prompt_token_count: null,
      prompt_token_price: null,
      id: isNewListing ? undefined : id, // Use undefined for new listings
      created_at: null,
      deleted_at: null,
      updated_at: undefined,
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!isNewListing) {
        try {
          // Fetch listing data
          const { data, error } = await supabase.from("products").select().eq("id", id).single();

          if (error) throw error;

          setListing(data);
          setCurrentTitle(data.title || "Untitled Listing");

          // Fetch images from storage
          const { data: files, error: storageError } = await supabase.storage.from("listing-images").list(id);

          if (storageError) throw storageError;

          const imageUrls =
            files
              ?.filter((file) => file.name !== ".emptyFolderPlaceholder")
              .sort((a, b) => {
                const orderA = parseInt(a.name.split("-order-")[1]);
                const orderB = parseInt(b.name.split("-order-")[1]);
                return orderA - orderB;
              })
              .map((file) => {
                const {
                  data: { publicUrl },
                } = supabase.storage.from("listing-images").getPublicUrl(`${id}/${file.name}`);
                return publicUrl;
              }) || [];

          setServerImages(imageUrls);

          form.reset(data);
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

    fetchListing();
  }, [id, isNewListing, form, toast, supabase]);

  async function onSubmit(data: ListingFormValues) {
    console.log("onSubmit called with data:", data);
    setIsLoading(true);

    try {
      let result;
      let listingId = isNewListing ? null : id;

      // Convert date strings to Date objects
    const convertDates = (obj: Record<string, any>) => {
      const dateFields = ['created_at', 'updated_at', 'deleted_at'];
      dateFields.forEach(field => {
        if (obj[field] && typeof obj[field] === 'string') {
          obj[field] = new Date(obj[field]);
        }
      });
      return obj;
    };

    const dataToSubmit = convertDates({
      ...data,
      updated_at: new Date().toISOString(), // Set current date for update
    });

    console.log("Data to submit:", dataToSubmit);

      // Remove any undefined values
      Object.keys(dataToSubmit).forEach((key) => {
        if (dataToSubmit[key] === undefined) {
          delete dataToSubmit[key];
        }
      });

      console.log("Data after removing undefined values:", dataToSubmit);

      if (isNewListing) {
        const { id: _, ...newListingData } = dataToSubmit;
        console.log("Inserting new listing with data:", newListingData);
        result = await supabase.from("products").insert(newListingData).select();
      } else {
        console.log("Updating listing with ID:", listingId);
        result = await supabase.from("products").update(dataToSubmit).eq("id", listingId).select();
      }
      // Handle image changes
      if (listingId) {
        // Delete removed images
        for (const imageUrl of deletedImageUrls) {
          const fileName = imageUrl.split("/").pop();
          if (fileName) {
            await supabase.storage.from("listing-images").remove([`${listingId}/${fileName}`]);
          }
        }

        // Upload new images
        for (const file of newImageFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${listingId}/${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }

        // Fetch updated list of images
        const { data: updatedFiles } = await supabase.storage.from("listing-images").list(listingId);

        const updatedImageUrls =
          updatedFiles
            ?.filter((file) => file.name !== ".emptyFolderPlaceholder")
            .map((file) => {
              const {
                data: { publicUrl },
              } = supabase.storage.from("listing-images").getPublicUrl(`${listingId}/${file.name}`);
              return publicUrl;
            }) || [];

        setServerImages(updatedImageUrls);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: isNewListing ? "Listing created successfully." : "Listing updated successfully.",
      });

      setCurrentTitle(data.title || "Untitled Listing");

      if (isNewListing && listingId) {
        router.push(`/home/listings/${listingId}`);
      } else {
        // Refresh the form data and images
        setListing(data);
        setNewImageFiles([]);
        setDeletedImageUrls([]);
        form.reset(data);
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
          <Accordion type="multiple" className="w-full" defaultValue={["basic-info"]}>
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
                  {/* Add more basic fields here */}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="images">
              <AccordionTrigger>Images</AccordionTrigger>
              <AccordionContent>
                <ImageUpload
                  listingId={isNewListing ? null : id}
                  onImagesChange={(existingUrls, newFiles, deletedUrls) => {
                    setServerImages(existingUrls);
                    setNewImageFiles(newFiles);
                    setDeletedImageUrls(deletedUrls);
                  }}
                  initialImages={serverImages}
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
                {/* Add more description fields here */}
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
                  {/* Add more pricing fields here */}
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
