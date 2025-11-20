import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChipsInput } from '@/components/ui/chips-input';
import { Building2, Edit2, Trash2, Plus, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface Room {
  _id: number;
  dormId: number;
  room_number: string;
  room_type: 'Single' | 'Double' | 'Triple';
  capacity: number;
  price_per_month: number;
  floor: number;
  description?: string;
  amenities?: string;
  zone?: string;
  images?: string[];
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
  current_resident_id?: number;
  expected_move_in_date?: string;
  expected_available_date?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RoomsPageProps {
  token: string;
}

export default function RoomsPage({ token }: RoomsPageProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pageAlert, setPageAlert] = useState<
    | null
    | { title?: string; description?: string; variant?: 'default' | 'destructive' }
  >(null);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [submitAction, setSubmitAction] = useState<null | 'create' | 'update'>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedDormId, setSelectedDormId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Room>>({
    room_number: '',
    room_type: 'Single',
    capacity: 1,
    price_per_month: 0,
    floor: 1,
    description: '',
    amenities: '',
    zone: '',
    images: [],
    status: 'Available',
  });
  const [amenitiesChips, setAmenitiesChips] = useState<string[]>([]);

  // Fetch user's default dorm on mount
  useEffect(() => {
    fetchDefaultDorm();
  }, [token]);

  // Fetch rooms when selected dorm changes
  useEffect(() => {
    if (selectedDormId) fetchRooms();
  }, [selectedDormId, token]);

  const fetchDefaultDorm = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${apiUrl}/dorms`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.data && response.data.length > 0) {
        setSelectedDormId(response.data[0]._id);
      } else {
        setError('No dorms found. Please create a dorm first.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch dorms';
      setError(errorMsg);
      console.error('Error fetching dorms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${apiUrl}/rooms?dormId=${selectedDormId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setRooms(response.data || []);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch rooms';
        setError(errorMsg);
        console.error('Error fetching rooms:', err);
      }
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
      // parse amenities string into chips array
      const chips = room.amenities ? room.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [];
      setAmenitiesChips(chips);
      // ensure zone is present in formData when editing
      if (!('zone' in room)) {
        setFormData((prev) => ({ ...prev, zone: '' }));
      }
    } else {
      setEditingRoom(null);
      setFormData({
        room_number: '',
        room_type: 'Single',
        capacity: 1,
        price_per_month: 0,
        floor: 1,
        description: '',
        amenities: '',
        images: [],
        status: 'Available',
      });
      setAmenitiesChips([]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRoom(null);
    setFormData({
      room_number: '',
      room_type: 'Single',
      capacity: 1,
      price_per_month: 0,
      floor: 1,
      description: '',
      amenities: '',
      images: [],
      status: 'Available',
    });
    setAmenitiesChips([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'floor' || name === 'price_per_month' ? Number(value) : value,
    }));
  };

  const submitForm = async () => {
    if (!formData.room_number || !formData.price_per_month) {
      setPageAlert({ title: 'Missing fields', description: 'Room number and price are required', variant: 'destructive' });
      window.setTimeout(() => setPageAlert(null), 4000);
      return;
    }

    try {
      setIsSubmitting(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

      const submitData = {
        ...formData,
        dormId: selectedDormId,
        // convert chips array to a comma-separated string for backend
        amenities: amenitiesChips.join(', '),
      } as any;

      if (editingRoom) {
        // Update room
        await axios.put(`${apiUrl}/rooms/${editingRoom._id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPageAlert({ title: 'Update Completed.', description: 'The room was updated successfully.', variant: 'default' });
      } else {
        // Create new room
        await axios.post(`${apiUrl}/rooms`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPageAlert({ title: 'Create Completed.', description: 'The room was created successfully.', variant: 'default' });
      }

      // auto-dismiss
      window.setTimeout(() => setPageAlert(null), 4000);

      // close confirm + dialog
      setIsSubmitConfirmOpen(false);
      setSubmitAction(null);
      handleCloseDialog();
      await fetchRooms();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save room';
      setPageAlert({ title: 'Unable to save', description: errorMsg, variant: 'destructive' });
      window.setTimeout(() => setPageAlert(null), 6000);
      console.error('Error saving room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      await axios.delete(`${apiUrl}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // show success callout
      setPageAlert({ title: 'Completed.', description: 'The room was deleted successfully.', variant: 'default' });
      // auto-dismiss
      window.setTimeout(() => setPageAlert(null), 4000);
      await fetchRooms();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete room';
      setPageAlert({ title: 'Unable to delete', description: errorMsg, variant: 'destructive' });
      window.setTimeout(() => setPageAlert(null), 6000);
      console.error('Error deleting room:', err);
    }
  };

  // Update a single room's status
  const updateRoomStatus = async (roomId: number, status: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      await axios.put(
        `${apiUrl}/rooms/${roomId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Optimistically update local state
      setRooms((prev) => prev.map((r) => (r._id === roomId ? { ...r, status } : r)));
      // show brief success callout
      setPageAlert({ title: 'Status Updated', description: 'Room status was updated.', variant: 'default' });
      window.setTimeout(() => setPageAlert(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update status';
      alert(`Error: ${errorMsg}`);
      console.error('Error updating room status:', err);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Occupied':
        return 'secondary';
      case 'Reserved':
        return 'outline';
      case 'Maintenance':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const filteredRooms =
    filterStatus === 'All'
      ? rooms
      : rooms.filter((room) => room.status === filterStatus);

  if (loading && selectedDormId === null) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && selectedDormId === null) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage rooms for your dorm
            </p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()}
            className="w-full sm:w-auto"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Page Alert - Styled like AlertDialog */}
      {pageAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md px-4">
            <div className="mx-auto pointer-events-auto w-full bg-background rounded-lg border shadow-lg">
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="flex items-center justify-center">
                  {pageAlert.variant === 'destructive' ? (
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  )}
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {pageAlert.title}
                  </h2>
                  <p className="text-sm text-center text-muted-foreground">
                    {pageAlert.description?.split('deleted').map((part, index, array) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < array.length - 1 && (
                          <span className="text-destructive font-medium">deleted</span>
                        )}
                      </React.Fragment>
                    )) || pageAlert.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && rooms.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Total Rooms</p>
                <p className="text-2xl sm:text-3xl font-bold">{rooms.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Available</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {rooms.filter(r => r.status === 'Available').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Occupied</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {rooms.filter(r => r.status === 'Occupied').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {rooms.filter(r => r.status === 'Maintenance').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Filter by Status</p>
        <div className="flex flex-wrap gap-2">
          {['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && selectedDormId && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {!loading && (
        <>
          {filteredRooms.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {rooms.length === 0
                      ? 'No rooms created yet. Click "Add Room" to get started.'
                      : `No rooms with status "${filterStatus}"`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <Card key={room._id} className="bg-card text-card-foreground gap-3 rounded-xl border py-3 shadow-sm flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Card Header */}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          Room {room.room_number}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {room.room_type} • Floor {room.floor}
                        </CardDescription>
                        {room.zone && (
                          <div className="text-xs text-muted-foreground truncate">
                            <span className="font-medium">Building/Zone:</span> {room.zone}
                          </div>
                        )}
                      </div>

                      {/* Status dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              `text-xs whitespace-nowrap bg-white border ` +
                              (room.status === 'Available'
                                ? 'text-green-600 border-green-200 hover:bg-white'
                                : room.status === 'Reserved'
                                ? 'text-amber-600 border-amber-200 hover:bg-white'
                                : room.status === 'Occupied'
                                ? 'text-red-600 border-red-200 hover:bg-white'
                                : room.status === 'Maintenance'
                                ? 'text-blue-600 border-blue-200 hover:bg-white'
                                : 'hover:bg-white')
                            }
                          >
                            {room.status}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44">
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={room.status} onValueChange={(value) => updateRoomStatus(room._id, value)}>
                            <DropdownMenuRadioItem value="Available">Available</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Reserved">Reserved</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Occupied">Occupied</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Maintenance">Maintenance</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  {/* Card Body */}
                  <CardContent className="flex-1 pt-3 space-y-2">
                    {/* Capacity and Floor */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Capacity</p>
                        <p className="text-xl font-bold">{room.capacity}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Floor</p>
                        <p className="text-xl font-bold">{room.floor}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Monthly Rate</p>
                      <p className="text-2xl font-bold break-words">฿{room.price_per_month.toLocaleString()}</p>
                    </div>

                    {/* Description */}
                    {room.description && (
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Description</p>
                        <p className="text-sm line-clamp-2">
                          {room.description}
                        </p>
                      </div>
                    )}

                    {/* Amenities */}
                    {room.amenities && (
                      <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Amenities</p>
                        <p className="text-sm line-clamp-1">
                          {room.amenities}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  {/* Card Footer */}
                  <div className="px-6 py-3 border-t flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs bg-white text-black hover:bg-gray-100 border border-gray-200 shadow-sm"
                      onClick={() => handleOpenDialog(room)}
                    >
                      <Edit2 className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <AlertDialog
                      open={isAlertOpen && deleteTarget === room._id}
                      onOpenChange={(open) => {
                        setIsAlertOpen(open);
                        if (!open) setDeleteTarget(null);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setDeleteTarget(room._id)}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Room {room.room_number}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this room? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => { setIsAlertOpen(false); setDeleteTarget(null); }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={async () => {
                            setDeleteLoading(true);
                            await handleDelete(room._id);
                            setDeleteLoading(false);
                            setIsAlertOpen(false);
                            setDeleteTarget(null);
                          }}>
                            {deleteLoading ? 'Processing...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Room Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[60vw] h-[90vh] min-w-[50vw] min-h-[80vh] overflow-y-auto p-10">
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </DialogTitle>
            <DialogDescription>
              {editingRoom
                ? 'Update room details and settings'
                : 'Create a new room for your dorm'}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitAction(editingRoom ? 'update' : 'create');
              setIsSubmitConfirmOpen(true);
            }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room_number" className="text-sm font-medium">Room Number *</Label>
                  <Input
                    id="room_number"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, A-201"
                    disabled={isSubmitting}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_type" className="text-sm font-medium">Room Type *</Label>
                  <Select
                    value={formData.room_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        room_type: value as 'Single' | 'Double' | 'Triple',
                      }))
                    }
                  >
                    <SelectTrigger id="room_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single Room</SelectItem>
                      <SelectItem value="Double">Double Room</SelectItem>
                      <SelectItem value="Triple">Triple Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-sm font-medium">Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    max="3"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-sm font-medium">Floor *</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    min="1"
                    value={formData.floor}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_month" className="text-sm font-medium">Monthly Rate (฿) *</Label>
                  <Input
                    id="price_per_month"
                    name="price_per_month"
                    type="number"
                    min="0"
                    value={formData.price_per_month === 0 ? '' : formData.price_per_month}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-sm font-medium">Building / Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Building A, Zone 2"
                    disabled={isSubmitting}
                    className="text-base"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Additional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add room details, views, or special features..."
                  rows={3}
                  disabled={isSubmitting}
                  className="resize-none text-base"
                />
                <p className="text-xs text-muted-foreground">Optional field</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities" className="text-sm font-medium">Amenities</Label>
                <ChipsInput
                  id="amenities"
                  value={amenitiesChips}
                  onChange={setAmenitiesChips}
                  placeholder="Add amenity and press Enter (WiFi, AC, Hot Water)"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Optional field</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                className="sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={editingRoom ? 'secondary' : 'default'}
                disabled={isSubmitting}
                className="sm:flex-1"
                onClick={() => {
                  setSubmitAction(editingRoom ? 'update' : 'create');
                  setIsSubmitConfirmOpen(true);
                }}
              >
                {isSubmitting ? (editingRoom ? 'Updating...' : 'Creating...') : editingRoom ? 'Update Room' : 'Create Room'}
              </Button>
            </div>
          </form>

          {/* Create/Update confirmation dialog */}
          <AlertDialog
            open={isSubmitConfirmOpen}
            onOpenChange={(open) => {
              setIsSubmitConfirmOpen(open);
              if (!open) setSubmitAction(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {submitAction === 'update' ? 'Update Room' : 'Create Room'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {submitAction === 'update'
                    ? 'Are you sure you want to update this room? Changes will be saved.'
                    : 'Are you sure you want to create this room?'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setIsSubmitConfirmOpen(false); setSubmitAction(null); }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className={buttonVariants({ variant: 'default' })} onClick={async () => {
                  await submitForm();
                }}>
                  {isSubmitting ? 'Processing...' : submitAction === 'update' ? 'Update' : 'Create'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}