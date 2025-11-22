import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MoreVertical } from 'lucide-react';
import api from '@/api';

type Booking = {
  _id: any;
  userId?: any;
  dormId?: any;
  roomId?: any;
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all booking requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchBookings} disabled={loading}>
            Refresh
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            New Booking
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
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading bookings...</td>
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
                          <span className="text-sm font-medium text-foreground">User #{String(booking.userId ?? 'N/A')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">Room #{String(booking.roomId ?? 'N/A')}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">฿{(booking.bookingFeePaid ?? booking.totalAmount ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status || 'Pending'}</Badge>
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
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold">Booking Details</h3>
              <div className="flex items-center gap-2">
                <select value={statusEdit} onChange={(e) => setStatusEdit(e.target.value)} className="border rounded px-3 py-1">
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <Button onClick={() => updateStatus(selected._id)}>Save</Button>
                <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Booking ID</dt>
                  <dd className="font-medium">{String(selected._id)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">User ID</dt>
                  <dd className="font-medium">{String(selected.userId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Room ID</dt>
                  <dd className="font-medium">{String(selected.roomId)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Move In</dt>
                  <dd className="font-medium">{selected.moveInDate ? new Date(selected.moveInDate).toLocaleString() : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Booking Fee Paid</dt>
                  <dd className="font-medium">฿{(selected.bookingFeePaid ?? selected.totalAmount ?? 0).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="font-medium">{selected.status}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm text-muted-foreground">Created At</dt>
                  <dd className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
