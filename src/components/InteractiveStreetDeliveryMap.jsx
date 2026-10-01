import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, ZoomIn, ZoomOut, Maximize2, MapPin } from 'lucide-react';

export const InteractiveStreetDeliveryMap = ({ 
  restaurant, 
  customerAddress, 
  riderProgressPct = 0, 
  assignedRider 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const [mapTheme, setMapTheme] = useState('streets'); // streets | voyager | dark

  // Real-world coordinates in Delhi NCR for high realism
  const restoGPS = restaurant?.gps || { lat: 28.5700, lng: 77.3200 };
  const customerGPS = { lat: 28.5550, lng: 77.3450 }; // approx 2.8 km away in urban district

  // Realistic intermediate road waypoints
  const waypoints = [
    [restoGPS.lat, restoGPS.lng],
    [restoGPS.lat + (customerGPS.lat - restoGPS.lat) * 0.25 + 0.003, restoGPS.lng + (customerGPS.lng - restoGPS.lng) * 0.3],
    [restoGPS.lat + (customerGPS.lat - restoGPS.lat) * 0.65 - 0.002, restoGPS.lng + (customerGPS.lng - restoGPS.lng) * 0.7],
    [customerGPS.lat, customerGPS.lng]
  ];

  // Tile layers
  const tileLayers = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Destroy existing map if re-rendering
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [(restoGPS.lat + customerGPS.lat) / 2, (restoGPS.lng + customerGPS.lng) / 2],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

    // Add Tiles
    L.tileLayer(tileLayers[mapTheme], {
      maxZoom: 19
    }).addTo(map);

    // Custom Marker Icons
    const createHtmlIcon = (emoji, bgColor, pulseColor) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${pulseColor}; opacity: 0.3; animation: pulseSubtle 1.8s infinite;"></div>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${bgColor}; border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px; z-index: 2;">
              ${emoji}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    };

    // Restaurant Marker
    const restoMarker = L.marker([restoGPS.lat, restoGPS.lng], {
      icon: createHtmlIcon('🍳', '#FF5200', '#FF5200')
    }).addTo(map);
    restoMarker.bindPopup(`<b>${restaurant?.name || 'Restaurant'}</b><br>Food Pickup Location`);

    // Customer Home Marker
    const houseMarker = L.marker([customerGPS.lat, customerGPS.lng], {
      icon: createHtmlIcon('🏠', '#10B981', '#10B981')
    }).addTo(map);
    houseMarker.bindPopup(`<b>Delivery Address</b><br>${customerAddress?.text || 'Customer Doorstep'}<br>PIN: 4821`);

    // Route Polyline
    const polyline = L.polyline(waypoints, {
      color: '#FF5200',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Rider Marker
    const riderMarker = L.marker([restoGPS.lat, restoGPS.lng], {
      icon: createHtmlIcon('🛵', '#0284C7', '#38BDF8')
    }).addTo(map);
    riderMarker.bindPopup(`<b>${assignedRider?.name || 'Delivery Partner'}</b><br>Speed: 32 km/h • Real-time GPS`);
    riderMarkerRef.current = riderMarker;

      // Fit bounds nicely
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } catch (err) {
      console.warn('Map initialization note:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapTheme]);

  // Update Rider GPS position on map as progress advances
  useEffect(() => {
    if (!riderMarkerRef.current || !mapInstanceRef.current) return;

    const t = Math.min(1, Math.max(0, riderProgressPct / 100));

    // Interpolate along waypoints
    let lat, lng;
    if (t <= 0.33) {
      const subT = t / 0.33;
      lat = waypoints[0][0] + (waypoints[1][0] - waypoints[0][0]) * subT;
      lng = waypoints[0][1] + (waypoints[1][1] - waypoints[0][1]) * subT;
    } else if (t <= 0.66) {
      const subT = (t - 0.33) / 0.33;
      lat = waypoints[1][0] + (waypoints[2][0] - waypoints[1][0]) * subT;
      lng = waypoints[1][1] + (waypoints[2][1] - waypoints[1][1]) * subT;
    } else {
      const subT = (t - 0.66) / 0.34;
      lat = waypoints[2][0] + (waypoints[3][0] - waypoints[2][0]) * subT;
      lng = waypoints[2][1] + (waypoints[3][1] - waypoints[2][1]) * subT;
    }

    riderMarkerRef.current.setLatLng([lat, lng]);
  }, [riderProgressPct]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  const handleZoom = (delta) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner bg-slate-950">
      
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating HUD Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] font-mono text-white flex items-center gap-2 shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-sky-400" />
          <span>Live GPS • 32 km/h</span>
        </div>

        {/* Map Theme Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 flex items-center gap-1 shadow-lg text-[10px] font-bold">
          <button
            onClick={() => setMapTheme('streets')}
            className={`px-2 py-0.5 rounded-lg transition-colors ${mapTheme === 'streets' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Streets
          </button>
          <button
            onClick={() => setMapTheme('voyager')}
            className={`px-2 py-0.5 rounded-lg transition-colors ${mapTheme === 'voyager' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Light
          </button>
          <button
            onClick={() => setMapTheme('dark')}
            className={`px-2 py-0.5 rounded-lg transition-colors ${mapTheme === 'dark' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Night
          </button>
        </div>
      </div>

      {/* Floating Zoom & Recenter Controls */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={() => handleZoom(1)}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleRecenter}
          className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
          title="Recenter Route"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
