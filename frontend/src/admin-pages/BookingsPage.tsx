import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MoreVertical } from 'lucide-react';
import Loader from '@/components/shared/loader';
import api from '@/api';

type Booking = {
  _id: any;
  userId?: { _id: string; name: string; email: string } | string;
  dormId?: any;
  roomId?: { _id: string; room_number: string } | string;
  moveInDate?: string | null;
  stayDuration?: number;
  bookingFeePaid?: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [statusEdit, setStatusEdit] = useState<string | undefined>(undefined);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/bookings');
      setBookings(resp.data || []);
    } catch (err: any) {
      console.error('Failed to load bookings', err);
      setError(err?.response?.data?.error || err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openDetails = async (b: Booking) => {
    // fetch fresh booking details
    try {
      const resp = await api.get(`/bookings/${b._id}`);
      setSelected(resp.data);
      setStatusEdit(resp.data.status || 'Pending');
    } catch (err: any) {
      alert('Failed to load booking details');
    }
  };

  const updateStatus = async (id: any) => {
    if (!statusEdit) return;
    try {
      await api.put(`/bookings/${id}`, { status: statusEdit });
      fetchBookings();
      alert('Status updated');
      setSelected(null);
    } catch (err: any) {
      console.error('Failed to update status', err);
      alert(err?.response?.data?.error || 'Failed to update status');
    }
  };

  const getUserName = (user: Booking['userId']) => {
    if (typeof user === 'object' && user?.name) return user.name;
    return `User #${String(user ?? 'N/A')}`;
  };

  const getRoomNumber = (room: Booking['roomId']) => {
    if (typeof room === 'object' && room?.room_number) return `Room ${room.room_number}`;
    return `Room #${String(room ?? 'N/A')}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all booking requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchBookings} disabled={loading} className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">
            Refresh
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Move In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      <Loader className="mx-auto" />
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No bookings found</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={String(booking._id)} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{getUserName(booking.userId)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{getRoomNumber(booking.roomId)}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">฿{(booking.bookingFeePaid ?? booking.totalAmount ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            `rounded-full border-transparent ` +
                            (booking.status === 'Confirmed'
                              ? 'bg-lime-400 hover:bg-lime-500 text-black dark:bg-lime-400 dark:text-black dark:hover:bg-white'
                              : booking.status === 'Cancelled'
                                ? 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-500 dark:text-white dark:hover:bg-white dark:hover:text-black'
                                : 'bg-blue-400 hover:bg-blue-500 text-black dark:bg-blue-400 dark:text-black dark:hover:bg-white') // Pending
                          }
                        >
                          {booking.status === 'Confirmed' ? 'Paid' : booking.status || 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetails(booking)}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-foreground">Booking Details</h3>
              <div className="flex items-center gap-2">
                <select
                  value={statusEdit}
                  onChange={(e) => setStatusEdit(e.target.value)}
                  className="border rounded px-3 py-1 bg-background text-foreground border-input"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed (Paid)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <Button onClick={() => updateStatus(selected._id)} className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">Save</Button>
                <Button variant="ghost" onClick={() => setSelected(null)} className="rounded-full">Close</Button>
              </div>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Booking ID</dt>
                  <dd className="font-medium text-foreground">{String(selected._id)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">User</dt>
                  <dd className="font-medium text-foreground">{getUserName(selected.userId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Room</dt>
                  <dd className="font-medium text-foreground">{getRoomNumber(selected.roomId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Move In</dt>
                  <dd className="font-medium text-foreground">{selected.moveInDate ? new Date(selected.moveInDate).toLocaleString() : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Booking Fee Paid</dt>
                  <dd className="font-medium text-foreground">฿{(selected.bookingFeePaid ?? selected.totalAmount ?? 0).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="font-medium text-foreground">{selected.status === 'Confirmed' ? 'Paid' : selected.status}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm text-muted-foreground">Created At</dt>
                  <dd className="font-medium text-foreground">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
