import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Cancel01FreeIcons,
  Location01FreeIcons,
  Location10FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import React, { useEffect, useRef, useState } from "react"
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"

export type LocationValue = {
  name: string
  address: string
  latitude: number | null
  longitude: number | null
}

export type InputLocationProps = {
  location: {
    value?: LocationValue
    setValue: (val: LocationValue) => void
  }
}

type Suggestion = {
  place_id: number
  display_name: string
  name?: string
  lat: string
  lon: string
}

// Custom Leaflet Marker Icon
const markerIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<div style="display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
    <div style="background-color: hsl(222.2 47.4% 11.2%); color: white; padding: 8px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2px solid white;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
  </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
})

// Helper component to fix map sizing when modal opens
function MapResizer({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)
    return () => clearTimeout(timer)
  }, [map, center])
  return null
}

// Helper component to handle click events on the map
function MapEventsHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function InputLocation({ location }: InputLocationProps) {
  const [name, setName] = useState(location.value?.name || "")
  const [address, setAddress] = useState(location.value?.address || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const defaultLat = location.value?.latitude ?? -6.2
  const defaultLng = location.value?.longitude ?? 106.816666
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    defaultLat,
    defaultLng,
  ])
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([
    defaultLat,
    defaultLng,
  ])
  const [mapLocationName, setMapLocationName] = useState(
    location.value?.name || ""
  )
  const [mapLocationAddress, setMapLocationAddress] = useState(
    location.value?.address || ""
  )
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (location.value?.name !== undefined) {
      setName(location.value.name)
    }
    if (location.value?.address !== undefined) {
      setAddress(location.value.address)
    }
  }, [location.value?.name, location.value?.address])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    location.setValue({
      name: newName,
      address,
      latitude: location.value?.latitude ?? null,
      longitude: location.value?.longitude ?? null,
    })
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setAddress(newAddress)
    location.setValue({
      name,
      address: newAddress,
      latitude: location.value?.latitude ?? null,
      longitude: location.value?.longitude ?? null,
    })

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    if (newAddress.trim().length < 3) {
      setSuggestions([])
      setIsDropdownOpen(false)
      return
    }

    setIsLoadingSuggestions(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddress)}&limit=5&addressdetails=1`
        )
        const data: Suggestion[] = await res.json()
        setSuggestions(data || [])
        setIsDropdownOpen((data || []).length > 0)
      } catch (err) {
        console.error("Geocoding error:", err)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 350)
  }

  const handleSelectSuggestion = (s: Suggestion) => {
    const selectedLat = parseFloat(s.lat)
    const selectedLng = parseFloat(s.lon)
    const placeName = s.name || s.display_name.split(",")[0]
    const fullAddress = s.display_name

    const finalName = name || placeName
    setName(finalName)
    setAddress(fullAddress)

    location.setValue({
      name: finalName,
      address: fullAddress,
      latitude: selectedLat,
      longitude: selectedLng,
    })
    setIsDropdownOpen(false)
  }

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedCoords([lat, lng])
    setIsReverseGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      if (data && data.display_name) {
        const fullAddr = data.display_name
        const shortName = data.name || fullAddr.split(",")[0]
        setMapLocationAddress(fullAddr)
        setMapLocationName(shortName)
      } else {
        const fallback = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        setMapLocationAddress(fallback)
        setMapLocationName(fallback)
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err)
      const fallback = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      setMapLocationAddress(fallback)
      setMapLocationName(fallback)
    } finally {
      setIsReverseGeocoding(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setMapCenter([latitude, longitude])
        handleMapClick(latitude, longitude)
      },
      (err) => {
        console.error("Geolocation error:", err)
        alert("Unable to retrieve your location.")
      }
    )
  }

  // Open Map Dialog
  const handleOpenMap = () => {
    const currentLat = location.value?.latitude ?? -6.2
    const currentLng = location.value?.longitude ?? 106.816666
    setMapCenter([currentLat, currentLng])
    setSelectedCoords([currentLat, currentLng])
    setMapLocationName(name || location.value?.name || "")
    setMapLocationAddress(address || location.value?.address || "")
    setIsMapOpen(true)
  }

  const handleConfirmMapLocation = () => {
    const finalName = name || mapLocationName || "Selected Location"
    const finalAddress = mapLocationAddress || address

    setName(finalName)
    setAddress(finalAddress)

    location.setValue({
      name: finalName,
      address: finalAddress,
      latitude: selectedCoords[0],
      longitude: selectedCoords[1],
    })
    setIsMapOpen(false)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid gap-8">
        <Field>
          <FieldLabel htmlFor="location-name-input">Location Name</FieldLabel>
          <Input
            id="location-name-input"
            type="text"
            placeholder="Place name (e.g. Starbucks, Warung Bona)..."
            value={name}
            onChange={handleNameChange}
          />
        </Field>

        <div className="relative w-full">
          <Field>
            <FieldLabel htmlFor="location-address-input">Address</FieldLabel>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="location-address-input"
                  type="text"
                  placeholder="Search address (e.g. Jalan Raya Bona)..."
                  value={address}
                  onChange={handleAddressInputChange}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsDropdownOpen(true)
                  }}
                />
                {isLoadingSuggestions && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 animate-pulse text-xs text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenMap}
                title="Pick location on map"
                className="flex items-center gap-1.5 px-3"
              >
                <HugeiconsIcon icon={Location10FreeIcons} size={18} />
                <span className="hidden text-xs font-medium sm:inline">
                  Map
                </span>
              </Button>
            </div>
          </Field>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              {suggestions.map((s) => {
                const shortName = s.name || s.display_name.split(",")[0]
                return (
                  <button
                    key={s.place_id}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-lg p-2.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="line-clamp-1 font-semibold">
                      {shortName}
                    </span>
                    <span className="line-clamp-1 text-[10px] text-muted-foreground">
                      {s.display_name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex h-[540px] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl fade-in-0 zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Location10FreeIcons}
                  className="text-primary"
                />
                <h3 className="text-sm font-semibold">
                  Select Location on Map
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsMapOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <HugeiconsIcon icon={Cancel01FreeIcons} size={18} />
              </Button>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full flex-1 bg-muted/20">
              <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapResizer center={mapCenter} />
                <MapEventsHandler onClick={handleMapClick} />
                <Marker position={selectedCoords} icon={markerIcon} />
              </MapContainer>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute right-4 bottom-4 z-[400] flex items-center gap-1.5 rounded-full border bg-background px-3 py-2 text-xs font-medium shadow-md transition-all hover:bg-accent active:scale-95"
                title="Use Current Location"
              >
                <HugeiconsIcon
                  icon={Location01FreeIcons}
                  size={16}
                  className="text-primary"
                />
                <span>My Location</span>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col gap-2 border-t bg-background p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  Selected Location:
                </span>
                {isReverseGeocoding && (
                  <span className="animate-pulse font-medium text-primary">
                    Fetching address...
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-2 text-xs">
                <span className="line-clamp-1 font-semibold text-foreground">
                  {mapLocationName || "Location Name"}
                </span>
                <span className="line-clamp-1 text-[11px] text-muted-foreground">
                  {mapLocationAddress ||
                    `Lat: ${selectedCoords[0].toFixed(5)}, Lng: ${selectedCoords[1].toFixed(5)}`}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMapOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmMapLocation}
                  className="font-medium"
                >
                  Select Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
