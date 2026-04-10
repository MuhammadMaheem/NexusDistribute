const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
const BASE_URL = "https://maps.googleapis.com/maps/api";

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;

  try {
    const url = `${BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) return null;

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    return {
      lat,
      lng,
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
    };
  } catch {
    return null;
  }
}

export async function getPlaceDetails(placeId: string): Promise<GeocodeResult | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;

  try {
    const url = `${BASE_URL}/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") return null;

    const { lat, lng } = data.result.geometry.location;

    return {
      lat,
      lng,
      formattedAddress: data.result.formatted_address,
      placeId,
    };
  } catch {
    return null;
  }
}
