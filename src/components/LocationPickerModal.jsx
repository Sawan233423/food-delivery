import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import { 
  MapPin, 
  Crosshair, 
  Search, 
  X, 
  Home, 
  Briefcase, 
  Heart, 
  Check, 
  Loader2, 
  Navigation,
  Compass,
  AlertCircle
} from 'lucide-react';

export const LocationPickerModal = ({ isOpen, onClose }) => {
  const { selectedAddress, setSelectedAddress, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(() => {
    return {
      lat: selectedAddress?.lat || 28.5700,
      lng: selectedAddress?.lng || 77.3200
    };
  });
  const [addressDetails, setAddressDetails] = useState({
    tag: selectedAddress?.tag || 'Home',
    flatNo: selectedAddress?.flatNo || 'Flat 402, Tower 4',
    area: selectedAddress?.text || 'Lotus Greens, Central Boulevard, Noida Sector 78',
    landmark: selectedAddress?.landmark || 'Near City Park Metro'
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Popular curated delivery hotspots for instant 1-tap select
  const popularHubs = [
    { name: 'Indiranagar 100ft Rd', city: 'Bengaluru', lat: 12.9716, lng: 77.6412 },
    { name: 'HSR Layout Sector 1', city: 'Bengaluru', lat: 12.9121, lng: 77.6446 },
    { name: 'Cyber Hub, DLF Phase 2', city: 'Gurugram', lat: 28.4952, lng: 77.0886 },
    { name: 'Sector 62 Tech Park', city: 'Noida', lat: 28.6270, lng: 77.3725 },
    { name: 'Connaught Place', city: 'New Delhi', lat: 28.6315, lng: 77.2167 },
    { name: 'Bandra West, Pali Hill', city: 'Mumbai', lat: 19.0607, lng: 72.8295 },
    { name: 'Koregaon Park', city: 'Pune', lat: 18.5362, lng: 73.8940 },
    { name: 'Hitec City, Madhapur', city: 'Hyderabad', lat: 17.4474, lng: 78.3762 }
  ];

  const recentAddresses = [
    {
      tag: 'Home',
      flatNo: 'Flat 402, Tower 4',
      text: 'Flat 402, Lotus Greens, Central Boulevard, Sector 78',
      landmark: 'Near City Park Metro',
      lat: 28.5700,
      lng: 77.3200
    },
    {
      tag: 'Work',
      flatNo: 'Tower B, 7th Floor',
      text: 'Tech Innovation Park, Sector 62, Electronic City',
      landmark: 'Opposite Fortis Hospital',
      lat: 28.6270,
      lng: 77.3725
    },
    {
      tag: 'Other',
      flatNo: 'Villa 12',
      text: 'Palm Meadows, Lake View Avenue, Phase 1',
      landmark: 'Next to Clubhouse',
      lat: 28.5355,
      lng: 77.3910
    }
  ];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = currentCoords.lat;
    const initialLng = currentCoords.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Use clean CartoDB Voyager tiles for modern food delivery aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Custom Draggable Pin Icon
    const pinIcon = L.divIcon({
      className: 'custom-gps-pin',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
          <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: #FF5200; opacity: 0.25; animation: pulseSubtle 1.8s infinite; bottom: -4px;"></div>
          <div style="background: #FF5200; color: white; width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 82, 0, 0.45); border: 2.5px solid white;">
            <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    // When pin is dragged, update coordinates and reverse geocode
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      reverseGeocodeCoords(pos.lat, pos.lng);
    });

    // When map is clicked, move marker there
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      reverseGeocodeCoords(e.latlng.lat, e.latlng.lng);
    });

    // Invalidate map size after animation render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Reverse geocoding helper (Nominatim with local fallback)
  const reverseGeocodeCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(', ');
          const shortAddress = parts.slice(0, 4).join(', ');
          setAddressDetails(prev => ({
            ...prev,
            area: shortAddress
          }));
          return;
        }
      }
    } catch {
      // Fallback in case of network throttle
    }

    // Fallback: estimate from coordinates
    const nearby = popularHubs.find(h => Math.abs(h.lat - lat) < 0.05 && Math.abs(h.lng - lng) < 0.05);
    if (nearby) {
      setAddressDetails(prev => ({
        ...prev,
        area: `${nearby.name}, ${nearby.city}`
      }));
    } else {
      setAddressDetails(prev => ({
        ...prev,
        area: `Sector Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      }));
    }
  };

  // Real GPS Geolocation Trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { animate: true });
          markerRef.current.setLatLng([latitude, longitude]);
        }

        reverseGeocodeCoords(latitude, longitude);
        setIsDetectingGPS(false);
        showToast('GPS Location Detected!', 'Location pinned from your device GPS', '📍');
      },
      (error) => {
        setIsDetectingGPS(false);
        let msg = 'Could not access device GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can select your address from the map or list below.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location detection timed out. Please try again or select from the map.';
        }
        setGpsError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Select a preset popular hub
  const handleSelectHub = (hub) => {
    setCurrentCoords({ lat: hub.lat, lng: hub.lng });
    setAddressDetails(prev => ({
      ...prev,
      area: `${hub.name}, ${hub.city}`
    }));

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([hub.lat, hub.lng], 16, { animate: true });
      markerRef.current.setLatLng([hub.lat, hub.lng]);
    }
  };

  // Select a recent saved address
  const handleSelectRecent = (addr) => {
    setSelectedAddress({
      tag: addr.tag,
      text: addr.text,
      flatNo: addr.flatNo,
      landmark: addr.landmark,
      coords: { x: 440, y: 390 },
      lat: addr.lat,
      lng: addr.lng
    });
    showToast('Delivery Address Updated', `Delivering to ${addr.tag} (${addr.text})`, '📍');
    onClose();
  };

  // Confirm and Save Address
  const handleSaveAndDeliver = () => {
    const fullText = addressDetails.flatNo 
      ? `${addressDetails.flatNo}, ${addressDetails.area}${addressDetails.landmark ? `, Near ${addressDetails.landmark}` : ''}`
      : addressDetails.area;

    const newAddr = {
      tag: addressDetails.tag,
      text: fullText,
      flatNo: addressDetails.flatNo,
      area: addressDetails.area,
      landmark: addressDetails.landmark,
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      coords: { x: 440, y: 390 }
    };

    setSelectedAddress(newAddr);
    try {
      localStorage.setItem('foodpulse_selected_address', JSON.stringify(newAddr));
    } catch {}
    showToast('Address Confirmed', `Delivering to ${newAddr.tag} • ${newAddr.text}`, '🚀');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in mobile-bottom-sheet"
    >
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 animate-slide-up flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display leading-tight">
                Select Delivery Location
              </h3>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Pinpoint your exact doorstep for ultra-fast live tracking
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          
          {/* Real GPS Detection Card */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/30">
                <Crosshair className={`w-5 h-5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Auto-Detect Current GPS Location
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Uses device satellites & Wi-Fi for 100% accurate pin
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGPS}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              {isDetectingGPS ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Interactive Leaflet Mini-Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Move or Drag Pin to Fine-Tune Doorstep</span>
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">
                Click map to reposition
              </span>
            </div>

            <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <div ref={mapContainerRef} className="w-full h-full" />
              
              <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm border border-slate-200 pointer-events-none">
                📍 {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Popular Hubs Quick Selector */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Popular City Food Delivery Hubs
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {popularHubs.map((hub) => (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-xs font-semibold text-slate-700 whitespace-nowrap transition-all"
                >
                  📍 {hub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Address Input Fields */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Complete Delivery Address Details
            </p>

            {/* Address Tag (Home, Work, Other) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Save as</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'Home', icon: Home, label: 'Home' },
                  { id: 'Work', icon: Briefcase, label: 'Work' },
                  { id: 'Other', icon: MapPin, label: 'Other' }
                ].map(tagItem => {
                  const Icon = tagItem.icon;
                  const isSelected = addressDetails.tag === tagItem.id;
                  return (
                    <button
                      key={tagItem.id}
                      type="button"
                      onClick={() => setAddressDetails(prev => ({ ...prev, tag: tagItem.id }))}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tagItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flat / Building / Street */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Flat / House / Floor No. *
                </label>
                <input
                  type="text"
                  value={addressDetails.flatNo}
                  onChange={(e) => setAddressDetails(prev => ({ ...prev, flatNo: e.target.value }))}
                  placeholder="e.g. Flat 402, 4th Floor"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressDetails.landmark}
                  onChange={(e) => setAddressDetails(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="e.g. Near Metro Station / Park"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Area / Road detected */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Area / Road Name (Resolved from GPS) *
              </label>
              <input
                type="text"
                value={addressDetails.area}
                onChange={(e) => setAddressDetails(prev => ({ ...prev, area: e.target.value }))}
                placeholder="Sector or area name"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Recent Saved Addresses */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Saved Addresses
            </p>
            <div className="space-y-2">
              {recentAddresses.map((addr) => {
                const isCurrent = selectedAddress?.tag === addr.tag;
                return (
                  <div
                    key={addr.tag}
                    onClick={() => handleSelectRecent(addr)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                        {addr.tag === 'Home' ? '🏠' : addr.tag === 'Work' ? '💼' : '📍'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">{addr.tag}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.2 rounded-full font-bold">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{addr.text}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 px-2.5 py-1 rounded-lg bg-orange-50 flex-shrink-0"
                    >
                      Deliver Here
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom Action */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span className="font-bold text-slate-800">Delivering to:</span>{' '}
            <span className="text-slate-600 truncate max-w-xs inline-block align-bottom font-medium">
              {addressDetails.area || 'Current Pin'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndDeliver}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md shadow-orange-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Deliver Here</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
