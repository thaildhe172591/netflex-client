import { NextResponse } from "next/server";

const countries = [
  { iso_3166_1: "US", english_name: "United States" },
  { iso_3166_1: "VN", english_name: "Vietnam" },
  { iso_3166_1: "JP", english_name: "Japan" },
  { iso_3166_1: "KR", english_name: "South Korea" },
  { iso_3166_1: "FR", english_name: "France" },
  { iso_3166_1: "DE", english_name: "Germany" },
  { iso_3166_1: "GB", english_name: "United Kingdom" },
  { iso_3166_1: "CA", english_name: "Canada" },
  { iso_3166_1: "IT", english_name: "Italy" },
  { iso_3166_1: "ES", english_name: "Spain" },
];

export async function GET() {
  try {
    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
