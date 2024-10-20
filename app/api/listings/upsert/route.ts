import { NextRequest, NextResponse } from 'next/server';
import { upsertListing } from '@/app/actions/listings';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await upsertListing(formData);
  return NextResponse.json(result);
}
