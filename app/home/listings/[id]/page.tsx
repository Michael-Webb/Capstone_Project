// app/listings/[id]/page.tsx

import ListingForm from "@/components/listing-form/ListingForm";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default function ListingPage({ params }: { params: { id: string } }) {
  return (
    <>
      <ListingForm id={params.id} />
    </>
  );
}
