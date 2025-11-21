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
  const [roomNumberTo, setRoomNumberTo] = useState<string>(''); // For bulk room creation

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
      const response = await axios.get(`${apiUrl}/dorms/my`, {
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
      setRoomNumberTo(''); // Reset range input when editing
      // parse amenities string into chips array
      const chips = room.amenities ? room.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [];
      setAmenitiesChips(chips);
      // ensure zone is present in formData when editing
      if (!('zone' in room)) {
        setFormData((prev) => ({ ...prev, zone: '' }));
      }
    } else {
      setEditingRoom(null);
      setRoomNumberTo(''); // Reset range input for new rooms
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
    setRoomNumberTo(''); // Reset range input
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.room_number || !formData.price_per_month) {
      setPageAlert({
        title: 'Validation Error',
        description: 'Room number and price are required fields.',
        variant: 'destructive',
      });
      window.setTimeout(() => setPageAlert(null), 4000);
      return;
    }

    try {
      setIsSubmitting(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

      const baseSubmitData = {
        ...formData,
        dormId: selectedDormId,
        amenities: amenitiesChips.join(', '),
      };

      if (editingRoom) {
        // Update single room
        await axios.put(`${apiUrl}/rooms/${editingRoom._id}`, baseSubmitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPageAlert({
          title: 'Completed.',
          description: 'The room was updated successfully.',
          variant: 'default',
        });
      } else {
        // Check if bulk creation is needed
        if (roomNumberTo && roomNumberTo.trim() !== '') {
          // Bulk room creation
          const startNum = parseInt(formData.room_number || '0');
          const endNum = parseInt(roomNumberTo);

          if (isNaN(startNum) || isNaN(endNum)) {
            setPageAlert({
              title: 'Validation Error',
              description: 'Room numbers must be valid numbers for bulk creation.',
              variant: 'destructive',
            });
            window.setTimeout(() => setPageAlert(null), 4000);
            setIsSubmitting(false);
            return;
          }

          if (endNum < startNum) {
            setPageAlert({
              title: 'Validation Error',
              description: 'End room number must be greater than or equal to start room number.',
              variant: 'destructive',
            });
            window.setTimeout(() => setPageAlert(null), 4000);
            setIsSubmitting(false);
            return;
          }

          // Create multiple rooms
          const roomCount = endNum - startNum + 1;
          const creationPromises = [];

          for (let i = startNum; i <= endNum; i++) {
            const roomData = {
              ...baseSubmitData,
              room_number: i.toString(),
            };
            creationPromises.push(
              axios.post(`${apiUrl}/rooms`, roomData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              })
            );
          }

          await Promise.all(creationPromises);
          setPageAlert({
            title: 'Completed.',
            description: `${roomCount} rooms were created successfully (${startNum} to ${endNum}).`,
            variant: 'default',
          });
        } else {
          // Single room creation
          await axios.post(`${apiUrl}/rooms`, baseSubmitData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setPageAlert({
            title: 'Completed.',
            description: 'The room was created successfully.',
            variant: 'default',
          });
        }
      }

      window.setTimeout(() => setPageAlert(null), 4000);
      handleCloseDialog();
      await fetchRooms();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save room';
      setPageAlert({
        title: 'Unable to save',
        description: errorMsg,
        variant: 'destructive',
      });
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
                    {pageAlert.description?.split(/(deleted|updated|created)/).map((part, index) => {
                      if (part === 'deleted' || part === 'updated' || part === 'created') {
                        return (
                          <span key={index} className="text-destructive font-medium">{part}</span>
                        );
                      }
                      return <React.Fragment key={index}>{part}</React.Fragment>;
                    }) || pageAlert.description}
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
                        <CardTitle className="text-lg sm:text-xl truncate">
                          Room {room.room_number}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {room.room_type} • Floor {room.floor}
                        </CardDescription>
                        {room.zone && (
                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
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
                              `text-xs sm:text-sm whitespace-nowrap bg-white border ` +
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
                  <CardContent className="flex-1 pt-3 space-y-2 sm:space-y-3">
                    {/* Capacity and Floor */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Capacity</p>
                        <p className="text-2xl sm:text-3xl font-bold">{room.capacity}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Floor</p>
                        <p className="text-2xl sm:text-3xl font-bold">{room.floor}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-muted rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Price Per Month</p>
                      <p className="text-2xl sm:text-3xl font-bold break-words">฿{room.price_per_month.toLocaleString()}</p>
                    </div>

                    {/* Description */}
                    {room.description && (
                      <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Description</p>
                        <p className="text-sm sm:text-base line-clamp-2">
                          {room.description}
                        </p>
                      </div>
                    )}

                    {/* Amenities */}
                    {room.amenities && (
                      <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Amenities</p>
                        <p className="text-sm sm:text-base line-clamp-1">
                          {room.amenities}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  {/* Card Footer */}
                  <div className="px-6 py-3 border-t flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => handleOpenDialog(room)}
                    >
                      <Edit2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => setDeleteTarget(room._id)}
                        >
                          <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
            <DialogTitle className="text-xl sm:text-2xl">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingRoom
                ? 'Update room details and settings'
                : 'Create a new room for your dorm'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Room Number Range - Only show for new rooms */}
                {!editingRoom ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs sm:text-sm font-medium">Room Number *</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="room_number"
                        name="room_number"
                        value={formData.room_number}
                        onChange={handleInputChange}
                        placeholder="From (e.g., 101)"
                        disabled={isSubmitting}
                        className="text-sm sm:text-base h-9 sm:h-10 flex-1"
                        required
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        id="room_number_to"
                        name="room_number_to"
                        value={roomNumberTo}
                        onChange={(e) => setRoomNumberTo(e.target.value)}
                        placeholder="To (Optional, e.g., 109)"
                        disabled={isSubmitting}
                        className="text-sm sm:text-base h-9 sm:h-10 flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Leave "To" empty to create single room</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="room_number" className="text-xs sm:text-sm font-medium">Room Number *</Label>
                    <Input
                      id="room_number"
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      placeholder="e.g., 101, A-201"
                      disabled={isSubmitting}
                      className="text-sm sm:text-base h-9 sm:h-10"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="room_type" className="text-xs sm:text-sm font-medium">Room Type *</Label>
                  <Select
                    value={formData.room_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        room_type: value as 'Single' | 'Double' | 'Triple',
                      }))
                    }
                  >
                    <SelectTrigger id="room_type" className="text-sm sm:text-base h-9 sm:h-10">
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
                  <Label htmlFor="capacity" className="text-xs sm:text-sm font-medium">Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    max="3"
                    value={formData.capacity === 0 ? '' : formData.capacity}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="text-sm sm:text-base h-9 sm:h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-xs sm:text-sm font-medium">Floor *</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    min="1"
                    value={formData.floor === 0 ? '' : formData.floor}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="text-sm sm:text-base h-9 sm:h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-xs sm:text-sm font-medium">Building / Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Building A, Zone 2"
                    disabled={isSubmitting}
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">Price Per Month</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_month" className="text-xs sm:text-sm font-medium">Price (฿) *</Label>
                  <Input
                    id="price_per_month"
                    name="price_per_month"
                    type="number"
                    min="0"
                    value={formData.price_per_month === 0 ? '' : formData.price_per_month}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="text-sm sm:text-base h-9 sm:h-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">Additional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add room details, views, or special features..."
                  rows={3}
                  disabled={isSubmitting}
                  className="resize-none text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground">Optional field</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities" className="text-xs sm:text-sm font-medium">Amenities</Label>
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
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-9 sm:h-10 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={editingRoom ? 'secondary' : 'default'}
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-9 sm:h-10 text-sm"
              >
                {isSubmitting ? (
                  editingRoom ? 'Updating...' : 'Creating...'
                ) : (
                  editingRoom ? 'Update Room' : 'Create Room'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
