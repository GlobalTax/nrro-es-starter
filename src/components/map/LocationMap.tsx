interface LocationMapProps {
  address: string;
  lat: number;
  lng: number;
}

export const LocationMap = ({ address, lat, lng }: LocationMapProps) => {
  // Crear URL de OpenStreetMap embed con marker
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`;
  
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-border">
      <iframe
        title={`Mapa de ubicación: ${address}`}
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
      />
    </div>
  );
};
