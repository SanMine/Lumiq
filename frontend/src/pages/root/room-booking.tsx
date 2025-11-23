import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle, Upload, Edit } from "lucide-react";
import api, { authService } from "@/api";

type BookingStep = 1 | 2 | 3 | 4 | 5;

export default function RoomBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);

  // Data from backend
  const [dorm, setDorm] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(`#${Date.now()}`);
  const [confirming, setConfirming] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    semester: "",
    duration: "",
    dormType: "Male Dorm",
    roomType: "Single",
    floor: "",
    paymentMethod: "QR PromptPay",
    paymentSlip: null as File | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Require authentication to access booking page
        const token = localStorage.getItem("token");
        if (!token) {
          navigate(`/auth/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`);
          return;
        }

        // Load current logged-in user
        if (token) {
          try {
            const me = await authService.getCurrentUser(token);
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
                  studentId: full.data.studentId || full.data.student_id || prev.studentId,
                }));
              } catch (err) {
                setCurrentUser(me?.user || null);
                setFormData((prev) => ({
                  ...prev,
                  name: me?.user?.name || prev.name,
                  email: me?.user?.email || prev.email,
                }));
              }
            }
          } catch (err) {
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
          // Set room type from actual room data
          if (roomResp.data.room_type) {
            setFormData(prev => ({ ...prev, roomType: roomResp.data.room_type }));
          }
        }
      } catch (err) {
        console.warn("Failed to load booking data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, paymentSlip: e.target.files![0] }));
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as BookingStep);
    }
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/auth/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`);
        return;
      }

      setConfirming(true);

      const prices = {
        roomPerMonth: room?.price_per_month || dorm?.price || 3000,
        insurance: dorm?.insurance_policy || dorm?.insurance || 0,
        bookingFee: room?.booking_fees || 0,
        waterFees: dorm?.Water_fee || dorm?.WaterFee || dorm?.waterFee || 0,
        electricityFees: dorm?.Electricity_fee || dorm?.ElectricityFee || dorm?.electricityFee || 0,
      };

      const firstMonthTotal =
        prices.roomPerMonth +
        prices.insurance +
        prices.waterFees +
        prices.electricityFees;

      // Map semester to date
      let moveInDate = new Date();
      if (formData.semester === "fall2024") moveInDate = new Date("2024-08-01");
      else if (formData.semester === "spring2025") moveInDate = new Date("2025-01-01");
      else if (formData.semester === "summer2025") moveInDate = new Date("2025-06-01");
      else moveInDate.setDate(moveInDate.getDate() + 1); // Default to tomorrow

      // Map duration to string (direct from formData)
      const stayDuration = formData.duration;

      // Map payment method to enum
      let paymentMethod = "qr";
      if (formData.paymentMethod === "Card") paymentMethod = "card";
      else if (formData.paymentMethod === "Pay at Dorm Office") paymentMethod = "slip";

      const payloadBase: any = {
        dormId: dorm?._id || dorm?.id || id,
        roomId: room?._id || room?.id,
        moveInDate: moveInDate.toISOString(),
        stayDuration: stayDuration,
        term_stay: formData.semester,
        dormType: formData.dormType,
        durationType: "months",
        paymentMethod: paymentMethod,
        bookingFeePaid: prices.bookingFee || 0,
        totalAmount: Math.max(0, firstMonthTotal) || 0,
      };

      const now = new Date();
      const booked_date = now.toISOString().slice(0, 10);
      const booked_time = now.toTimeString().slice(0, 8);
      payloadBase.booking_fees = prices.bookingFee || 0;
      payloadBase.booked_date = booked_date;
      payloadBase.booked_time = booked_time;
      payloadBase.expected_move_in_date = moveInDate.toISOString();

      let resp;
      if (paymentMethod === "slip" && formData.paymentSlip) {
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
      setCurrentStep(5);
    } catch (err: any) {
      console.error("Failed to create booking", err);
      const message = err?.response?.data?.error || err?.message || "Failed to create booking";
      alert(message);
    } finally {
      setConfirming(false);
    }
  };

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

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="border-2 border-border bg-card max-w-2xl w-full">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground">Booking Successful!</h1>
            <p className="text-muted-foreground text-lg">
              Your booking ID is <span className="text-lime-400 font-bold">{bookingId}</span>.
              Please scan the QR code below for payment.
            </p>

            <div className="bg-white p-8 rounded-lg inline-block">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Payment"
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                className="rounded-full w-fit min-h-[40px] text-black cursor-pointer border-2 border-border hover:bg-muted px-8"
                onClick={() => navigate("/dorms")}
              >
                Go to Dashboard
              </Button>
              <Button
                className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
              >
                Share Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Book a Room</h1>

        {/* Step 1: Basic Info */}
        <Card className="border-2 border-border bg-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Step 1: Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Ethan Carter"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="20210001"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ethan.carter@lumiq.edu"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester/Term of Stay</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => handleInputChange("semester", value)}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Fall 2024" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall2024">Fall 2024</SelectItem>
                    <SelectItem value="spring2025">Spring 2025</SelectItem>
                    <SelectItem value="summer2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Stay Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange("duration", value)}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Full Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Semester</SelectItem>
                    <SelectItem value="half">Half Semester</SelectItem>
                    <SelectItem value="year">Full Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Room Preferences */}
        <Card className="border-2 border-border bg-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Step 2: Room Preferences</h2>

            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Dorm Type</Label>
                <div className="flex gap-3">
                  <Button
                    variant={formData.dormType === "Male Dorm" ? "default" : "outline"}
                    className={formData.dormType === "Male Dorm" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("dormType", "Male Dorm")}
                  >
                    Male Dorm
                  </Button>
                  <Button
                    variant={formData.dormType === "Female Dorm" ? "default" : "outline"}
                    className={formData.dormType === "Female Dorm" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("dormType", "Female Dorm")}
                  >
                    Female Dorm
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Room Type</Label>
                <div className="flex gap-3">
                  <Button
                    variant={formData.roomType === "Single" ? "default" : "outline"}
                    className={formData.roomType === "Single" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("roomType", "Single")}
                  >
                    Single
                  </Button>
                  <Button
                    variant={formData.roomType === "Double" ? "default" : "outline"}
                    className={formData.roomType === "Double" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("roomType", "Double")}
                  >
                    Double
                  </Button>
                  <Button
                    variant={formData.roomType === "Shared" ? "default" : "outline"}
                    className={formData.roomType === "Shared" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("roomType", "Shared")}
                  >
                    Shared
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Preferred Floor</Label>
                <Select
                  value={formData.floor}
                  onValueChange={(value) => handleInputChange("floor", value)}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Any Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Floor</SelectItem>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                    <SelectItem value="4">Floor 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Payment */}
        <Card className="border-2 border-border bg-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Step 3: Payment (Optional)</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Dorm Fee</Label>
                <Input
                  value={`฿${room?.price_per_month?.toLocaleString() || dorm?.price?.toLocaleString() || "1,200"} / Month`}
                  disabled
                  className="bg-muted border-border"
                />
              </div>

              <div>
                <Label className="mb-3 block">Payment Method</Label>
                <div className="flex gap-3">
                  <Button
                    variant={formData.paymentMethod === "QR PromptPay" ? "default" : "outline"}
                    className={formData.paymentMethod === "QR PromptPay" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("paymentMethod", "QR PromptPay")}
                  >
                    QR PromptPay
                  </Button>
                  <Button
                    variant={formData.paymentMethod === "Card" ? "default" : "outline"}
                    className={formData.paymentMethod === "Card" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("paymentMethod", "Card")}
                  >
                    Card
                  </Button>
                  <Button
                    variant={formData.paymentMethod === "Pay at Dorm Office" ? "default" : "outline"}
                    className={formData.paymentMethod === "Pay at Dorm Office" ? "bg-primary" : "border-2"}
                    onClick={() => handleInputChange("paymentMethod", "Pay at Dorm Office")}
                  >
                    Pay at Dorm Office
                  </Button>
                </div>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-lime-400" />
                <div>
                  <h3 className="text-foreground font-semibold mb-2">Upload Payment Slip</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Drag and drop or browse to upload.
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                  />
                  <Button
                    variant="outline"
                    className="border-2 border-border"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                  {formData.paymentSlip && (
                    <p className="text-lime-400 text-sm mt-2">
                      File uploaded: {formData.paymentSlip.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Review & Confirm */}
        <Card className="border-2 border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Step 4: Review & Confirm</h2>
              <Button
                variant="ghost"
                className="text-lime-400 hover:text-lime-500"
                onClick={() => setCurrentStep(1)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-semibold text-muted-foreground">Basic Info</div>
                <div className="md:col-span-2 text-foreground">
                  Name: {formData.name || "Ethan Carter"}, Student ID: {formData.studentId || "20210001"},
                  Email: {formData.email || "ethan.carter@lumiq.edu"}, Phone: {formData.phone || "+1 (555) 123-4567"},
                  Term: {formData.semester || "Fall 2024"}, Duration: {formData.duration || "Full Semester"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-border pt-4">
                <div className="font-semibold text-muted-foreground">Room Preferences</div>
                <div className="md:col-span-2 text-foreground">
                  Dorm Type: {formData.dormType}, Room Type: {formData.roomType},
                  Preferred Floor: {room?.floor || formData.floor || "Any Floor"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-border pt-4">
                <div className="font-semibold text-muted-foreground">Payment</div>
                <div className="md:col-span-2 text-foreground">
                  Payment Method: {formData.paymentMethod},
                  Slip: {formData.paymentSlip ? formData.paymentSlip.name : "Not uploaded"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}