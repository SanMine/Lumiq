import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Calendar } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import api from "@/api"
import Loader from "@/components/shared/loader"

interface Room {
  _id: number | string
  dormId: number | { _id: number; name: string }
  room_number: string
  room_type: string
  capacity: number
  price_per_month: number
  booking_fees?: number
  floor?: number
  description?: string | null
  zone?: string | null
  amenities?: string | null
  images?: string[]
  status?: string
}

interface Dorm {
  _id: number | string
  name: string
}

export default function SingleRoomDetail() {
  const { id, roomId } = useParams<{ id: string; roomId: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [dorm, setDorm] = useState<Dorm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomsOfType, setRoomsOfType] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | number | null>(null)
  const [roomsCache, setRoomsCache] = useState<Record<string, Room>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  

  // helper: extract leading numeric part of room_number for numeric sorting
  const extractRoomNumber = (s?: string | number) => {
    if (s == null) return 0
    const str = String(s)
    const m = str.match(/\d+/)
    return m ? parseInt(m[0], 10) : Number.NaN
  }

  const sortRoomsByNumber = (arr: Room[]) => {
    return arr.slice().sort((a, b) => {
      const na = extractRoomNumber(a.room_number)
      const nb = extractRoomNumber(b.room_number)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      if (!isNaN(na)) return -1
      if (!isNaN(nb)) return 1
      return String(a.room_number).localeCompare(String(b.room_number))
    })
  }

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  

  useEffect(() => {
    const fetchData = async () => {
      if (!roomId) return
      setError(null)

      // If we already have this room in the cache, use it immediately (no full-page loader)
      const cached = roomsCache[String(roomId)]
      if (cached) {
        setRoom(cached)
        setSelectedRoomId(roomId)

        // ensure dorm is loaded
        if (!dorm && id) {
          try {
            const dormResp = await api.get(`/dorms/${id}`)
            setDorm(dormResp.data)
          } catch (e) {
            /* ignore */
          }
        }

        // populate roomsOfType from cache if available (sorted)
        const allCached = Object.values(roomsCache)
        if (allCached.length > 0) {
          const sameType = allCached.filter(r => r.room_type === cached.room_type && (id ? ((r.dormId && typeof r.dormId === 'object' ? String(r.dormId._id) : String(r.dormId)) === String(id)) : true))
          setRoomsOfType(sortRoomsByNumber(sameType))
        }

        return
      }

      setLoading(true)
      try {
        const [roomRes, dormRes] = await Promise.all([
          api.get(`/rooms/${roomId}`),
          id ? api.get(`/dorms/${id}`) : Promise.resolve({ data: null })
        ])

        setRoom(roomRes.data)
        setDorm(dormRes?.data || null)

        // fetch all rooms for the dorm then filter to same room_type
        const dormIdVal = id || (roomRes.data?.dormId && typeof roomRes.data.dormId === 'object' ? roomRes.data.dormId._id : roomRes.data.dormId)
        if (dormIdVal) {
          try {
            const roomsRes = await api.get(`/rooms?dormId=${dormIdVal}`)
            const allRooms: Room[] = roomsRes.data || []
            const sameType = allRooms.filter(r => r.room_type === roomRes.data.room_type)
            setRoomsOfType(sortRoomsByNumber(sameType))

            // build cache from allRooms
            const cache: Record<string, Room> = {}
            allRooms.forEach(r => {
              cache[String(r._id)] = r
            })
            setRoomsCache(prev => ({ ...prev, ...cache }))
          } catch (innerErr) {
            console.warn('Failed to load rooms list', innerErr)
            setRoomsOfType([])
          }
        }

        setSelectedRoomId(roomRes.data._id)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.error || err.message || 'Failed to load room')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roomId, id])

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      return () => container.removeEventListener('scroll', checkScroll)
    }
  }, [roomsOfType])

  if (loading) return <Loader />

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-2 border-border bg-card p-6">
          <p className="text-destructive font-semibold">{error || 'Room not found'}</p>
        </Card>
      </div>
    )
  }

  const amenities = Array.isArray(room.amenities)
    ? room.amenities.map(String)
    : typeof room.amenities === 'string'
    ? room.amenities.split(',').map(s => s.trim()).filter(Boolean)
    : []

  // Prepare images for gallery: show all saved images in the thumbnail grid
  const galleryImages = (room.images || []).filter(Boolean)
  const thumbCols = Math.min(galleryImages.length || 1, 4)

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Booking button navigates directly to the booking page */}

        {/* Back */}
        <button onClick={() => navigate(id ? `/dorms/${id}` : -1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {dorm?.name || 'Dorm'}
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-primary mb-2">
          {room.room_type || `Room ${room.room_number}`}
        </h1>
        <p className="text-muted-foreground mb-8">
          {room.description || 'Details about this room.'}
        </p>

        {/* Image Gallery - Dynamic Grid Layout */}
        <div className="space-y-4">
          {galleryImages.length === 0 ? (
            <Card className="w-full h-[400px] rounded-xl bg-muted/50 border-border flex items-center justify-center">
              <div className="text-muted-foreground">No images available</div>
            </Card>
          ) : galleryImages.length === 1 ? (
            // Single image - full width
            <Card className="w-full h-[500px] rounded-xl bg-muted/50 border-border overflow-hidden">
              <img src={galleryImages[0]} alt={room.room_type} className="w-full h-full object-cover" />
            </Card>
          ) : galleryImages.length === 2 ? (
            // Two images - side by side
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, idx) => (
                <Card key={idx} className="h-[400px] rounded-xl bg-muted/50 border-border overflow-hidden">
                  <img src={img} alt={`${room.room_type}-${idx}`} className="w-full h-full object-cover" />
                </Card>
              ))}
            </div>
          ) : galleryImages.length === 3 ? (
            // Three images - first large, two stacked on right
            <div className="grid grid-cols-2 gap-4">
              <Card className="row-span-2 h-[500px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[0]} alt={`${room.room_type}-0`} className="w-full h-full object-cover" />
              </Card>
              <Card className="h-[242px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[1]} alt={`${room.room_type}-1`} className="w-full h-full object-cover" />
              </Card>
              <Card className="h-[242px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[2]} alt={`${room.room_type}-2`} className="w-full h-full object-cover" />
              </Card>
            </div>
          ) : galleryImages.length === 4 ? (
            // Four images - grid 2x2
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, idx) => (
                <Card key={idx} className="h-[300px] rounded-xl bg-muted/50 border-border overflow-hidden">
                  <img src={img} alt={`${room.room_type}-${idx}`} className="w-full h-full object-cover" />
                </Card>
              ))}
            </div>
          ) : galleryImages.length === 5 ? (
            // Five images - 2 on top, 3 on bottom
            <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-3 sm:col-span-2 h-[350px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[0]} alt={`${room.room_type}-0`} className="w-full h-full object-cover" />
              </Card>
              <Card className="col-span-3 sm:col-span-1 h-[350px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[1]} alt={`${room.room_type}-1`} className="w-full h-full object-cover" />
              </Card>
              {galleryImages.slice(2, 5).map((img, idx) => (
                <Card key={idx + 2} className="h-[250px] rounded-xl bg-muted/50 border-border overflow-hidden">
                  <img src={img} alt={`${room.room_type}-${idx + 2}`} className="w-full h-full object-cover" />
                </Card>
              ))}
            </div>
          ) : (
            // Six or more images - masonry-style grid
            <div className="grid grid-cols-4 gap-4">
              <Card className="col-span-4 sm:col-span-2 row-span-2 h-[400px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[0]} alt={`${room.room_type}-0`} className="w-full h-full object-cover" />
              </Card>
              <Card className="col-span-4 sm:col-span-2 h-[192px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[1]} alt={`${room.room_type}-1`} className="w-full h-full object-cover" />
              </Card>
              <Card className="col-span-2 sm:col-span-1 h-[192px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[2]} alt={`${room.room_type}-2`} className="w-full h-full object-cover" />
              </Card>
              <Card className="col-span-2 sm:col-span-1 h-[192px] rounded-xl bg-muted/50 border-border overflow-hidden">
                <img src={galleryImages[3]} alt={`${room.room_type}-3`} className="w-full h-full object-cover" />
              </Card>
              {galleryImages.slice(4).map((img, idx) => (
                <Card key={idx + 4} className="col-span-2 sm:col-span-1 h-[200px] rounded-xl bg-muted/50 border-border overflow-hidden">
                  <img src={img} alt={`${room.room_type}-${idx + 4}`} className="w-full h-full object-cover" />
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Rooms: Enhanced horizontal carousel with animations */}
        <div className="mt-10 relative group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-foreground">Available Rooms</h3>
            <p className="text-sm text-muted-foreground">
              {roomsOfType.length} {roomsOfType.length === 1 ? 'room' : 'rooms'} of this type
            </p>
          </div>

          <div className="relative">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm border-2 border-border rounded-full p-2 shadow-lg hover:bg-muted transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {roomsOfType.length > 0 ? (
                roomsOfType.map((r, index) => {
                  const isSelected = String(r._id) === String(selectedRoomId)
                  return (
                    <Card
                      key={r._id}
                      onClick={() => {
                        setSelectedRoomId(r._id)
                        setRoom(r)
                        setRoomsCache(prev => ({ ...prev, [String(r._id)]: r }))
                        const dormParam = id || (r.dormId && typeof r.dormId === 'object' ? r.dormId._id : r.dormId)
                        if (dormParam) navigate(`/dorms/${dormParam}/rooms/${r._id}`)
                      }}
                      className={`
                        min-w-[180px] shrink-0 p-4 border-2 cursor-pointer
                        transition-all duration-300 ease-out
                        hover:scale-[1.02] hover:-translate-y-0.5
                        ${isSelected 
                          ? 'ring-4 ring-primary/50 border-transparent bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:shadow-lg'
                        }
                        animate-in fade-in slide-in-from-bottom-4
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <div className="space-y-3">
                        {/* Room Number Badge */}
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`
                              font-bold text-sm px-3 py-1
                              ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}
                            `}
                          >
                            {r.room_number}
                          </Badge>
                          {r.status === 'Available' && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          )}
                        </div>

                        {/* Room Type */}
                        <div>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {r.room_type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Floor {r.floor ?? 'N/A'}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border" />

                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-primary">
                            ฿{r.price_per_month?.toLocaleString?.() ?? r.price_per_month}
                          </span>
                          <span className="text-xs text-muted-foreground">/month</span>
                        </div>

                        {/* Status Badge */}
                        <Badge
                          className={
                            `w-full justify-center text-xs ` +
                            (r.status === 'Available'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : r.status === 'Reserved'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : r.status === 'Occupied'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : r.status === 'Maintenance'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 text-gray-800')
                          }
                        >
                          {r.status || 'Unknown'}
                        </Badge>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="text-muted-foreground py-8 text-center w-full">
                  No other rooms of this type found.
                </div>
              )}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm border-2 border-border rounded-full p-2 shadow-lg hover:bg-muted transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Gradient Overlays */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
            )}
          </div>
        </div>

        {/* Room Info Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left: Description & Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-4">Room Information</h2>
            <p className="text-muted-foreground mb-6">{room.description}</p>

            {/* Room Attributes Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold">Room Number</p>
                <p className="text-muted-foreground">{room.room_number}</p>
              </div>

              <div>
                <p className="font-semibold">Capacity</p>
                <p className="text-muted-foreground">
                  {room.capacity == null ? 'N/A' : `${room.capacity} ${room.capacity === 1 ? 'Person' : 'People'}`}
                </p>
              </div>

              <div>
                <p className="font-semibold">Floor</p>
                <p className="text-muted-foreground">{room.floor ?? 'N/A'}</p>
              </div>

              <div>
                <p className="font-semibold">Building / Zone</p>
                <p className="text-muted-foreground">{room.zone || 'N/A'}</p>
              </div>

              <div>
                <p className="font-semibold">Bed Type</p>
                <p className="text-muted-foreground">{room.room_type}</p>
              </div>
            </div>

            {/* Amenities */}
            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">In-Room Amenities</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {amenities.length > 0 ? amenities.map((item) => (
                <Card key={item} className="p-3 bg-muted/50 border-border rounded-lg text-sm flex items-center justify-center hover:bg-muted transition-colors">
                  {item}
                </Card>
              )) : (
                <div className="text-muted-foreground">No amenities listed.</div>
              )}
            </div>
          </div>

          {/* Right: Price Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 h-fit sticky top-6">
            <CardContent className="space-y-4 p-0">
              {/* Price Section */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Monthly Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ฿{room.price_per_month?.toLocaleString?.() ?? room.price_per_month}
                  </span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                {room.booking_fees != null && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Booking Fee (one-time)</p>
                    <div className="text-lg font-medium">฿{room.booking_fees?.toLocaleString?.() ?? room.booking_fees}</div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={
                    room.status === 'Available'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : room.status === 'Reserved'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : room.status === 'Occupied'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : room.status === 'Maintenance'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-800'
                  }>
                    {room.status || 'Unknown'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{dorm?.name || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Room Number</span>
                  <Badge variant="outline" className="font-bold">{room.room_number}</Badge>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Booking Button */}
              <Button 
                onClick={() => navigate(id ? `/dorms/${id}/book?roomId=${room._id}` : '/')}
                className="rounded-full bg-gradient w-full min-h-[48px] text-white cursor-pointer hover:scale-105 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl"
                disabled={room.status !== 'Available'}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book This Room
              </Button>

              {/* Info Text */}
              <p className="text-xs text-center text-muted-foreground pt-2">
                Secure your booking today • No hidden fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Section */}
        <Card className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-foreground">Ready to Make This Your Home?</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Don't miss out on this opportunity. Book your room now and start your journey with us.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-muted-foreground">Instant Confirmation</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-muted-foreground">Secure Payment</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-muted-foreground">24/7 Support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button 
                  onClick={() => navigate(id ? `/dorms/${id}` : -1)}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 hover:bg-muted px-8 h-14 font-semibold text-lg"
                >
                  View More Rooms
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}