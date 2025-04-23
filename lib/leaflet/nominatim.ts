export default async function getAddressInfoFromLatLng(lat: number, lng: number){
    const nominatimApi = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(nominatimApi);
    const data = await response.json();
    return data;
}