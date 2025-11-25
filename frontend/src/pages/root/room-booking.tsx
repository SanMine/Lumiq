//room-booking.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api, { authService } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  User,
  Building2,
  DoorOpen,
  Wallet,
  Calculator,
  CreditCard,
  Upload,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  BedDouble,
  Users,
  Home,
  Droplets,
  Zap,
  Shield,
  Info,
  MessageSquare,
  Facebook,
} from "lucide-react";
import { generateInvoiceHTML, downloadInvoice } from "@/components/ui/InvoiceTemplate";

export default function RoomBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Data from backend
  const [dorm, setDorm] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    moveInDate: "",
    stayDuration: "",
    durationType: "months", // months or years
    paymentMethod: "card", // card, qr, slip
    paymentSlip: null as File | null,
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [bookingId, setBookingId] = useState<string>(`BK${Date.now()}`);
  const [confirming, setConfirming] = useState(false);

  // Price data (from backend or room object)
  // Helper to determine estimated cost based on billing type
  const getEstimatedWaterFee = () => {
    if (dorm?.waterBillingType === 'per-unit') return 200;
    return dorm?.Water_fee || dorm?.WaterFee || dorm?.waterFee || 200;
  };

  const getEstimatedElectricityFee = () => {
    if (dorm?.electricityBillingType === 'per-unit') return 500;
    return dorm?.Electricity_fee || dorm?.ElectricityFee || dorm?.electricityFee || 500;
  };

  const getWaterFeeLabel = () => {
    const rate = dorm?.Water_fee || dorm?.WaterFee || dorm?.waterFee || 0;
    const unit = dorm?.waterBillingType === 'per-unit' ? '/ unit' : '/ month';
    return `Water Fees (฿${rate.toLocaleString()} ${unit})`;
  };

  const getElectricityFeeLabel = () => {
    const rate = dorm?.Electricity_fee || dorm?.ElectricityFee || dorm?.electricityFee || 0;
    const unit = dorm?.electricityBillingType === 'per-unit' ? '/ unit' : '/ month';
    return `Electricity Fees (฿${rate.toLocaleString()} ${unit})`;
  };

  const prices = {
    roomPerMonth: room?.price_per_month || dorm?.price || 3000,
    insurance: dorm?.insurance_policy || dorm?.insurance || 6000,
    bookingFee: room?.booking_fees || 0 || 1000,
    waterRate: dorm?.Water_fee || dorm?.WaterFee || dorm?.waterFee || 0,
    electricityRate: dorm?.Electricity_fee || dorm?.ElectricityFee || dorm?.electricityFee || 0,
    waterFees: getEstimatedWaterFee(),
    electricityFees: getEstimatedElectricityFee(),
    waterLabel: getWaterFeeLabel(),
    electricityLabel: getElectricityFeeLabel(),
  };

  // Calculate totals
  const firstMonthTotal =
    prices.roomPerMonth - prices.bookingFee +
    prices.insurance +
    prices.waterFees +
    prices.electricityFees;

  const followingMonthTotal =
    prices.roomPerMonth + prices.waterFees + prices.electricityFees;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Require authentication to access booking page
        const token = localStorage.getItem("token");
        if (!token) {
          // redirect to sign-in with return url
          navigate(`/auth/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`);
          return;
        }

        // Try to load current logged-in user (full profile)
        if (token) {
          try {
            const me = await authService.getCurrentUser(token);
            // me may be { success, user }
            const userId = me?.user?.id || me?.id || me?.userId;
            if (userId) {
              try {
                const full = await api.get(`/users/${userId}`);
                setCurrentUser(full.data);
                setFormData((prev) => ({
                  ...prev,
                  name: full.data.name || prev.name,
                  email: full.data.email || prev.email,
                  phone: full.data.phone || prev.phone,
                }));
              } catch (err) {
                // fallback: if protected /users/:id fails, use me.user
                setCurrentUser(me?.user || null);
                setFormData((prev) => ({
                  ...prev,
                  name: me?.user?.name || prev.name,
                  email: me?.user?.email || prev.email,
                }));
              }
            }
          } catch (err) {
            // ignore - user not logged in
            console.debug("No logged-in user or failed to fetch me", err);
          }
        }

        const search = new URLSearchParams(location.search);
        const roomId = search.get("roomId") || (location.state as any)?.roomId;

        if (id) {
          const dormResp = await api.get(`/dorms/${id}`);
          setDorm(dormResp.data);
        }

        if (roomId) {
          const roomResp = await api.get(`/rooms/${roomId}`);
          setRoom(roomResp.data);
        }
      } catch (err) {
        console.warn("Failed to load booking data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location]);

  // Ensure the page is scrolled to top when this booking page mounts
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // fallback
      window.scrollTo(0, 0);
    }
  }, []);

  // Helper to safely parse amenities which may be stored as string, array, or missing
  const parseAmenities = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // If it's an object or other type, don't attempt to split — return empty
    return [];
  };

  // Format address objects into a single string. Handles strings and objects.
  const formatAddress = (address: any): string => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    if (typeof address === 'object') {
      const parts = [
        address.addressLine1,
        address.subDistrict,
        address.district,
        address.province,
        address.zipCode,
        address.country,
      ].filter(Boolean);

      return parts.length > 0 ? parts.join(', ') : "N/A";
    }
    return "N/A";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, paymentSlip: e.target.files![0] }));
    }
  };

  const handleConfirmBooking = async () => {
    // Create booking on backend
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/auth/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`);
        return;
      }

      setConfirming(true);

      const payloadBase: any = {
        dormId: dorm?._id || dorm?.id || id,
        roomId: room?._id || room?.id,
        moveInDate: formData.moveInDate || null,
        stayDuration: formData.stayDuration || 0,
        durationType: formData.durationType || "months",
        paymentMethod: formData.paymentMethod || "card",
        bookingFeePaid: prices.bookingFee || 0,
        totalAmount: Math.max(0, firstMonthTotal) || 0,
      };
      // Add additional metadata fields that backend also accepts (aliases)
      const now = new Date();
      const booked_date = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const booked_time = now.toTimeString().slice(0, 8); // HH:MM:SS
      payloadBase.booking_fees = prices.bookingFee || 0;
      payloadBase.booked_date = booked_date;
      payloadBase.booked_time = booked_time;
      payloadBase.expected_move_in_date = formData.moveInDate || null;

      let resp;
      if (formData.paymentMethod === "slip" && formData.paymentSlip) {
        const fd = new FormData();
        Object.keys(payloadBase).forEach((k) => fd.append(k, payloadBase[k] as any));
        fd.append("paymentSlip", formData.paymentSlip as File);

        resp = await api.post(`/bookings`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        resp = await api.post(`/bookings`, payloadBase);
      }

      const serverBooking = resp.data;
      setBookingId(String(serverBooking._id || serverBooking.id || serverBooking));
      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error("Failed to create booking", err);
      const message = err?.response?.data?.error || err?.message || "Failed to create booking";
      alert(message);
    } finally {
      setConfirming(false);
    }
  };

  const handleDownloadInvoice = () => {
    const stayDurationText = formData.stayDuration
      ? `${formData.stayDuration} ${formData.durationType}`
      : 'Not specified';

    downloadInvoice({
      bookingId,
      invoiceDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      dormName: dorm?.name || 'N/A',
      roomNumber: room?.room_number || 'N/A',
      roomType: room?.room_type || 'N/A',
      floor: room?.floor || 'N/A',
      moveInDate: formData.moveInDate,
      stayDuration: stayDurationText,
      bookingFee: prices.bookingFee,
      roomPerMonth: prices.roomPerMonth,
      insurance: prices.insurance,
      waterFees: prices.waterFees,
      electricityFees: prices.electricityFees,
      firstMonthTotal,
    });
  };

  // Prepare invoice data for rendering inside dialog
  const stayDurationText = formData.stayDuration
    ? `${formData.stayDuration} ${formData.durationType}`
    : 'Not specified';

  const invoiceData = {
    bookingId,
    invoiceDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    customerName: formData.name,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    dormName: dorm?.name || 'N/A',
    dormAddress: formatAddress(dorm?.address) || dorm?.location || 'N/A',
    dormPhone: dorm?.contact_phone || dorm?.phone || dorm?.contact_number || '',
    dormEmail: dorm?.contact_gmail || dorm?.contact_email || dorm?.email || '',
    dormLine: dorm?.contact_line || dorm?.line || dorm?.line_id || '',
    dormFacebook: dorm?.contact_facebook || dorm?.facebook || '',
    roomNumber: room?.room_number || 'N/A',
    roomType: room?.room_type || 'N/A',
    floor: room?.floor || 'N/A',
    moveInDate: formData.moveInDate,
    stayDuration: stayDurationText,
    bookingFee: prices.bookingFee,
    roomPerMonth: prices.roomPerMonth,
    insurance: prices.insurance,
    waterFees: prices.waterFees,
    electricityFees: prices.electricityFees,
    firstMonthTotal,
  };

  const invoiceHtml = generateInvoiceHTML(invoiceData);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!showInvoicePreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowInvoicePreview(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showInvoicePreview]);

  // When the success dialog closes (and we're NOT opening the invoice preview),
  // navigate the user to the dorm detail page.
  const prevSuccessRef = useRef<boolean>(false);
  useEffect(() => {
    const prev = prevSuccessRef.current;
    if (prev && !showSuccessDialog && !showInvoicePreview) {
      // navigate to dorm detail
      const dormId = dorm?._id || id;
      if (dormId) navigate(`/dorms/${dormId}`);
    }
    prevSuccessRef.current = showSuccessDialog;
  }, [showSuccessDialog, showInvoicePreview, dorm, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-2xl animate-in zoom-in-95 duration-300 z-60">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in-50 duration-500">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-3xl text-center">
              Booking Confirmed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-6 pt-4">
              <div className="space-y-2">
                <p className="text-lg text-foreground">
                  Your booking has been successfully processed.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <Badge variant="outline" className="text-base font-bold">
                      {bookingId}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Booking Fee Paid:</span>
                    <span className="text-xl font-bold text-primary">
                      ฿{prices.bookingFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* QR code removed - display Booking ID and Booking Fee only */}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  onClick={() => {
                    // Close the success dialog first to avoid Radix focus/overlay blocking interaction,
                    // then open the invoice preview overlay.
                    setShowSuccessDialog(false);
                    setShowInvoicePreview(true);
                  }}
                  variant="outline"
                  className="rounded-full border-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  View & Download Invoice
                </Button>
                <Button
                  onClick={() => navigate("/account")}
                  className="rounded-full bg-gradient text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Preview Dialog - Full Screen */}
      {showInvoicePreview && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => { if (e.currentTarget === e.target) setShowInvoicePreview(false); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full h-full max-w-[1400px] max-h-[95vh] bg-background rounded-lg shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Payment Invoice</h2>
                  <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadInvoice}
                  className="rounded-full bg-gradient text-white hover:scale-105 transition-transform"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => {
                    setShowInvoicePreview(false);
                    const dormId = dorm?._id || id;
                    if (dormId) navigate(`/dorms/${dormId}`);
                  }}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <span className="text-2xl">×</span>
                </Button>

              </div>
            </div>

            {/* Invoice Content */}
            <div className="flex-1 overflow-auto bg-muted/20 p-6">
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-xl" style={{ width: '210mm', minHeight: '297mm' }}>
                  <iframe
                    ref={iframeRef}
                    title="Invoice"
                    srcDoc={invoiceHtml}
                    className="block border-0 rounded-lg"
                    style={{
                      width: '210mm',
                      height: '297mm',
                      background: 'white',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Press ESC or click outside to close
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowInvoicePreview(false);
                    const dormId = dorm?._id || id;
                    if (dormId) navigate(`/dorms/${dormId}`);
                  }}
                  variant="outline"
                  className="rounded-full"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={handleDownloadInvoice}
                  className="rounded-full bg-gradient text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b-2 border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2 animate-in slide-in-from-left duration-500">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Complete Your Booking</h1>
          </div>
          <p className="text-muted-foreground text-lg animate-in slide-in-from-left duration-500 delay-100">
            Review your information and confirm your reservation
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* 1. Your Information */}
        <Card className="border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="w-6 h-6 text-primary" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-muted border-border h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="+66 XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-muted border-border h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-muted border-border h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moveInDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expected Move-in Date *
                </Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                  className="bg-muted border-border h-12"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Stay Duration (Optional)
                </Label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="6"
                    value={formData.stayDuration}
                    onChange={(e) => handleInputChange("stayDuration", e.target.value)}
                    className="bg-muted border-border h-12 max-w-[200px]"
                    min="1"
                  />
                  <Tabs
                    value={formData.durationType}
                    onValueChange={(value) => handleInputChange("durationType", value)}
                  >
                    <TabsList className="h-12">
                      <TabsTrigger value="months" className="px-6">
                        Months
                      </TabsTrigger>
                      <TabsTrigger value="years" className="px-6">
                        Years
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Dormitory Detail */}
        <Card className="border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="w-6 h-6 text-primary" />
              Dormitory Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dorm Name</p>
                <p className="text-xl font-semibold">{dorm?.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </p>
                {/* Use a compact table to keep contact info inside the card and prevent overflow */}
                {(() => {
                  const contactEmail = dorm?.contact_gmail || dorm?.contact_email || dorm?.email || dorm?.gmail;
                  const contactPhone = dorm?.contact_phone || dorm?.phone || dorm?.contact_number;
                  const contactLine = dorm?.contact_line || dorm?.line || dorm?.contactLine;
                  const contactFacebook = dorm?.contact_facebook || dorm?.facebook || dorm?.contactFacebook;

                  const anyContact = contactEmail || contactPhone || contactLine || contactFacebook;

                  if (!anyContact) {
                    return <p className="font-medium">N/A</p>;
                  }

                  return (
                    <table className="w-full text-sm">
                      <tbody>
                        {contactEmail && (
                          <tr>
                            <td className="align-top w-6 pr-3 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                            </td>
                            <td className="break-words font-medium">
                              <a href={`mailto:${contactEmail}`} className="hover:underline">{contactEmail}</a>
                            </td>
                          </tr>
                        )}

                        {contactPhone && (
                          <tr>
                            <td className="align-top w-6 pr-3 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                            </td>
                            <td className="break-words font-medium">
                              <a href={`tel:${contactPhone}`} className="hover:underline">{contactPhone}</a>
                            </td>
                          </tr>
                        )}

                        {contactLine && (
                          <tr>
                            <td className="align-top w-6 pr-3 text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                            </td>
                            <td className="break-words font-medium">{contactLine}</td>
                          </tr>
                        )}

                        {contactFacebook && (
                          <tr>
                            <td className="align-top w-6 pr-3 text-muted-foreground">
                              <Facebook className="w-4 h-4" />
                            </td>
                            <td className="break-words font-medium">
                              <a
                                href={contactFacebook.startsWith('http') ? contactFacebook : `https://${contactFacebook}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                              >
                                {contactFacebook}
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </p>
                <p className="font-medium">{formatAddress(dorm?.address) || dorm?.location || "N/A"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{dorm?.description || "No description available."}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-3">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {parseAmenities(dorm?.amenities || dorm?.facilities).length > 0 ? (
                    parseAmenities(dorm?.amenities || dorm?.facilities).map((amenity: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1">
                        {amenity}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No facilities listed</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Room Detail */}
        <Card className="border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DoorOpen className="w-6 h-6 text-primary" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Room Number</p>
                <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                  {room?.room_number || "N/A"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity
                </p>
                <p className="font-semibold text-lg">
                  {room?.capacity ? `${room.capacity} ${room.capacity === 1 ? "Person" : "People"}` : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Floor
                </p>
                <p className="font-semibold text-lg">Floor {room?.floor || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Building / Zone
                </p>
                <p className="font-semibold text-lg">{room?.zone || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <BedDouble className="w-4 h-4" />
                  Bed Type
                </p>
                <p className="font-semibold text-lg">{room?.room_type || "N/A"}</p>
              </div>

              <div className="md:col-span-3 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Room Information
                </p>
                <p className="text-foreground">{room?.description || "No additional information."}</p>
              </div>

              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground mb-3">In-Room Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {parseAmenities(room?.amenities).length > 0 ? (
                    parseAmenities(room?.amenities).map((amenity: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {amenity}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No amenities listed</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Prices */}
        <Card className="border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wallet className="w-6 h-6 text-primary" />
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Room Price (per month)</span>
                <span className="text-xl font-bold text-foreground">
                  ฿{prices.roomPerMonth.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">
                  Dorm Insurance (one-time)
                </span>
                <span className="text-xl font-bold text-foreground">
                  ฿{prices.insurance.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Booking Fee (reservation)</span>
                <span className="text-xl font-bold text-primary">
                  ฿{prices.bookingFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">
                  {prices.waterLabel}
                </span>
                <span className="text-lg font-medium">
                  ~฿{prices.waterFees.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">
                  {prices.electricityLabel}
                </span>
                <span className="text-lg font-medium">
                  ~฿{prices.electricityFees.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Payment Calculation */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="w-6 h-6 text-primary" />
              Payment Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* First Month */}
            <div className="bg-background rounded-lg p-6 border-2 border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                First Month (Move-in)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Room Price</span>
                  <span className="font-medium">฿{prices.roomPerMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm">- Booking Fee (already paid)</span>
                  <span className="font-medium">-฿{prices.bookingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Insurance (one-time)</span>
                  <span className="font-medium">฿{prices.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Water Fees (est.)</span>
                  <span className="font-medium">~฿{prices.waterFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Electricity Fees (est.)</span>
                  <span className="font-medium">~฿{prices.electricityFees.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total (First Month)</span>
                  <span className="text-2xl font-bold text-primary">
                    ~฿{firstMonthTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Following Months */}
            <div className="bg-background rounded-lg p-6 border-2 border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Following Months
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Room Price</span>
                  <span className="font-medium">฿{prices.roomPerMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Water Fees (est.)</span>
                  <span className="font-medium">~฿{prices.waterFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Electricity Fees (est.)</span>
                  <span className="font-medium">~฿{prices.electricityFees.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total (per month)</span>
                  <span className="text-2xl font-bold text-primary">
                    ~฿{followingMonthTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Water and electricity fees are estimates. Actual charges will be based on your usage and billed separately each month.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Payment Method */}
        <Card className="border-2 border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CreditCard className="w-6 h-6 text-primary" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/20">
              <p className="text-center text-lg">
                <span className="text-muted-foreground">Booking Fee to Pay: </span>
                <span className="text-3xl font-bold text-primary">
                  ฿{prices.bookingFee.toLocaleString()}
                </span>
              </p>
            </div>

            <Tabs
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange("paymentMethod", value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-14">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  QR PromptPay
                </TabsTrigger>
                <TabsTrigger value="slip" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Slip
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-muted border-border h-12"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-muted border-border h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="bg-muted border-border h-12"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr" className="mt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-6 rounded-lg border-2 border-border">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PromptPay:${prices.bookingFee}`}
                      alt="PromptPay QR"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Scan this QR code with your banking app to pay ฿{prices.bookingFee.toLocaleString()}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="slip" className="mt-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                  <Upload className="w-16 h-16 mx-auto text-primary" />
                  <div>
                    <h3 className="text-foreground font-semibold mb-2 text-lg">
                      Upload Payment Slip
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Upload proof of payment for ฿{prices.bookingFee.toLocaleString()}
                    </p>
                    <input
                      type="file"
                      id="slip-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                    />
                    <Button
                      variant="outline"
                      className="border-2 border-border h-12 px-8"
                      onClick={() => document.getElementById("slip-upload")?.click()}
                    >
                      Browse Files
                    </Button>
                    {formData.paymentSlip && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          File uploaded: {formData.paymentSlip.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Confirm Button */}
            <Button
              onClick={handleConfirmBooking}
              className="w-full h-14 text-lg font-semibold rounded-full bg-gradient text-white hover:scale-[1.02] transition-transform duration-200 shadow-lg"
              disabled={confirming}
            >
              {confirming ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking & Pay ฿{prices.bookingFee.toLocaleString()}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By confirming, you agree to our terms and conditions. Your booking fee is non-refundable.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t-2 border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                DormBooking
              </h3>
              <p className="text-sm text-muted-foreground">
                Secure and convenient dormitory booking for students. Find your perfect room today.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-primary transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Contact Support</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +66 XX XXX XXXX
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@dormbooking.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mon-Fri: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 DormBooking. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors">
                Security
              </button>
              <button className="hover:text-primary transition-colors">
                Help Center
              </button>
              <button className="hover:text-primary transition-colors">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}