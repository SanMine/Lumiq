import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import api from "@/api"

// Fix Leaflet default marker icon issue with Vite
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface AddressFormData {
  addressLine1: string
  subDistrict: string
  district: string
  province: string
  zipCode: string
  country: string
}

interface AdminLocationProps {
  dormId?: string // Optional - if not provided, component will resolve the admin's dorm
}

// Component to handle map clicks and pan to new locations
function LocationMarker({ position, setPosition, center }: { 
  position: [number, number] | null
  setPosition: (pos: [number, number]) => void
  center: [number, number]
}) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  // Pan to new center when it changes
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return position ? <Marker position={position} /> : null
}

export default function AdminLocation({ dormId }: AdminLocationProps) {
  const [address, setAddress] = useState<AddressFormData>({
    addressLine1: "",
    subDistrict: "",
    district: "",
    province: "",
    zipCode: "",
    country: "Thailand",
  })

  const [location, setLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.7883, 98.9853])
  
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [currentDormId, setCurrentDormId] = useState<string | null>(dormId ?? null)
  
  const [addressMessage, setAddressMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [locationMessage, setLocationMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    // If a dormId is provided, load that dorm. Otherwise resolve the current admin's dorm.
    const init = async () => {
      try {
        if (dormId) {
          await loadDormData(dormId)
          return
        }

        // Fetch current admin's dorms and pick the first one
        const resp = await api.get('/dorms/my')
        const myDorms = resp.data || []
        if (myDorms.length === 0) {
          setAddressMessage({ type: 'error', text: 'No dorm found for this admin. Please create a dorm first.' })
          setIsLoadingData(false)
          return
        }

        const resolvedId = myDorms[0]._id
        await loadDormData(resolvedId)
      } catch (err) {
        console.error('Error resolving dorm id:', err)
        const e = err as any
        const msg = e?.response?.data?.error || e?.message || 'Unable to resolve dorm for this admin.'
        setAddressMessage({ type: 'error', text: msg })
        setIsLoadingData(false)
      }
    }

    init()
  }, [dormId])

  const loadDormData = async (id: string) => {
    try {
      // remember which dorm we're working with
      setCurrentDormId(id)
      setIsLoadingData(true)
      const resp = await api.get(`/dorms/${id}`)
      const data = resp.data
      
      if (data.address) {
        setAddress({
          addressLine1: data.address.addressLine1 || "",
          subDistrict: data.address.subDistrict || "",
          district: data.address.district || "",
          province: data.address.province || "",
          zipCode: data.address.zipCode || "",
          country: data.address.country || "Thailand",
        })
      }
      
      if (data.latitude && data.longitude) {
        const pos: [number, number] = [data.latitude, data.longitude]
        setLocation(pos)
        setMapCenter(pos)
      }
    } catch (error) {
      console.error("Error loading dorm data:", error)
      const err = error as any
      const msg = err?.response?.data?.error || err?.message || "Failed to load dorm data. Please refresh the page."
      setAddressMessage({ 
        type: "error", 
        text: msg
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setAddress(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // Save ONLY address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.addressLine1 || !address.district || !address.province || !address.zipCode) {
      setAddressMessage({ 
        type: "error", 
        text: "Please fill in all required address fields" 
      })
      return
    }

    setIsLoadingAddress(true)
    setAddressMessage(null)

    try {
      if (!currentDormId) {
        setAddressMessage({ type: 'error', text: 'Dorm id not resolved. Please create or select a dorm first.' })
        setIsLoadingAddress(false)
        return
      }

      const resp = await api.put(`/dorms/${currentDormId}/address`, { address })

      setAddressMessage({ 
        type: "success", 
        text: resp.data?.message || "Address saved successfully!" 
      })

      setTimeout(() => setAddressMessage(null), 3000)

    } catch (error) {
      console.error("Error saving address:", error)
      const err = error as any
      const msg = err?.response?.data?.error || err?.message || "An error occurred while saving address"
      setAddressMessage({ 
        type: "error", 
        text: msg
      })
    } finally {
      setIsLoadingAddress(false)
    }
  }

  // Save ONLY location
  const handleSaveLocation = async () => {
    if (!location) {
      setLocationMessage({ 
        type: "error", 
        text: "Please select a location on the map first" 
      })
      return
    }

    setIsLoadingLocation(true)
    setLocationMessage(null)

    try {
      if (!currentDormId) {
        setLocationMessage({ type: 'error', text: 'Dorm id not resolved. Please create or select a dorm first.' })
        setIsLoadingLocation(false)
        return
      }

      const resp = await api.put(`/dorms/${currentDormId}/location`, {
        latitude: location[0],
        longitude: location[1],
      })

      setLocationMessage({ 
        type: "success", 
        text: resp.data?.message || "Location saved successfully!" 
      })

      setTimeout(() => setLocationMessage(null), 3000)

    } catch (error) {
      console.error("Error saving location:", error)
      const err = error as any
      const msg = err?.response?.data?.error || err?.message || "An error occurred while saving location"
      setLocationMessage({ 
        type: "error", 
        text: msg
      })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLocationMessage({ type: "success", text: "Getting your location..." })
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: [number, number] = [position.coords.latitude, position.coords.longitude]
          setLocation(pos)
          setMapCenter(pos)
          setLocationMessage({ type: "success", text: "Current location detected! Click 'Save Location' to save it." })
        },
        (error) => {
          setLocationMessage({ type: "error", text: "Unable to get your location. Please enable location permissions." })
        }
      )
    } else {
      setLocationMessage({ type: "error", text: "Geolocation is not supported by your browser" })
    }
  }

  if (isLoadingData) {
    return (
      <div className="py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dorm data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Dorm Address & Location</h2>
      <p className="text-muted-foreground mb-6">
        You can save the address and location separately. Each section can be saved independently.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Address form */}
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Address Details</CardTitle>
            <CardDescription>Fill out your dorm's address. This can be saved independently.</CardDescription>
          </CardHeader>
          <CardContent>
            {addressMessage && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                addressMessage.type === "success" 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {addressMessage.text}
              </div>
            )}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="addressLine1" 
                  placeholder="e.g., 123 Main Street, Building A" 
                  value={address.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subDistrict">Sub-district (Tambon)</Label>
                <Input
                  id="subDistrict"
                  placeholder="e.g., Chang Phueak"
                  value={address.subDistrict}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">
                    District (Amphoe) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="district"
                    placeholder="e.g., Mueang Chiang Mai"
                    value={address.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">
                    Province <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="province"
                    placeholder="e.g., Chiang Mai"
                    value={address.province}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">
                    Zip Code <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="zipCode" 
                    placeholder="e.g., 50200" 
                    value={address.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="country" 
                    placeholder="Thailand" 
                    value={address.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="button" 
              onClick={handleSaveAddress}
              disabled={isLoadingAddress}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoadingAddress ? "Saving Address..." : "Save Address"}
            </Button>
          </CardFooter>
        </Card>

        {/* Interactive Map section */}
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Map Location</CardTitle>
            <CardDescription>Click on the map to pin your dorm's exact location. This can be saved independently.</CardDescription>
          </CardHeader>
          <CardContent>
            {locationMessage && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                locationMessage.type === "success" 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {locationMessage.text}
              </div>
            )}

            <div className="w-full h-80 lg:h-96 rounded-md overflow-hidden border mb-3">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={location} setPosition={setLocation} center={mapCenter} />
              </MapContainer>
            </div>
            
            {location ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <p className="text-sm font-medium text-blue-900">Selected Location:</p>
                <p className="text-xs text-blue-700 font-mono">
                  Lat: {location[0].toFixed(6)}, Long: {location[1].toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-3">
                <p className="text-sm text-gray-600">
                  ℹ️ Click anywhere on the map to set your dorm's location
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleUseCurrentLocation}
                className="flex-1"
              >
                📍 Use Current Location
              </Button>
              <Button 
                type="button" 
                onClick={handleSaveLocation}
                disabled={isLoadingLocation || !location}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoadingLocation ? "Saving..." : "Save Location"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}