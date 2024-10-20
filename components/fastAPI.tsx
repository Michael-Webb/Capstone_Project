import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";
import { CopyToClipboardButton  } from "@/components/use-copy-to-clipboard"

export default async function fastAPI() {
  const supabase = createClient();
  

  const selectedColumns = `
    title,
    description,
    condition,
    condition_notes,
    colors,
    department,
    category,
    subcategory,
    all_style_tags,
    brand,
    size,
    material,
    id
  `;

  const { data, error } = await supabase
    .from("products")
    .select(selectedColumns)
    .eq("id", "c532f9b7-8487-4192-b63e-9cac9b68e90a")
    .limit(1);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching data</div>;
  }

  if (data && data.length > 0) {
    const inventory = data[0];

    const { data: files, error: listError } = await supabase.storage.from("listing-images").list(inventory.id, {
      limit: 1,
    });

    if (listError) {
      console.error("Error listing files:", listError);
      return <div>Error listing files</div>;
    }

    if (!files || files.length === 0) {
      console.error("No files found");
      return <div>No files found</div>;
    }

    const firstFile = files[0];

    const { data: publicUrlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(`${inventory.id}/${firstFile.name}`);

    const publicUrl = publicUrlData.publicUrl;
    console.log(publicUrl);

    const inventoryText = JSON.stringify(inventory, null, 2);
    return (
      <div className="flex justify-center items-center ">
        <div className="">
        <Image src={publicUrl} alt="Product Image" width={500} height={500} />
        </ div>
        <div className="w-full max-w-5xl p-4 rounded-lg dark:bg-slate-600 bg-slate-200">
          <CopyButton text={inventoryText} />
          <pre className="overflow-x-auto max-h-[75vh]">{inventoryText}</pre>
          <DownloadButton imageUrl={publicUrl} />

          <CopyToClipboardButton text={inventoryText} />
        </div>
      </div>
    );
  } else {
    return <div>No product found</div>;
  }
}
