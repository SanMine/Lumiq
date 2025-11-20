import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChipsInput } from '@/components/ui/chips-input';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
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
import { Dorm } from './mockData';

interface MyDormPageProps {
  token: string;
}

export default function MyDormPage({ token }: MyDormPageProps) {
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [dormsLoading, setDormsLoading] = useState(false);
  const [dormsError, setDormsError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDorm, setEditingDorm] = useState<Dorm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [facilitiesChips, setFacilitiesChips] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageAlert, setPageAlert] = useState<
    | null
    | { title?: string; description?: string; variant?: 'default' | 'destructive' }
  >(null);
  const [formData, setFormData] = useState<Partial<Dorm>>({
    name: '',
    location: '',
    description: '',
    image_url: '',
    availibility: true,
    facilities: '',
    price: 0,
    insurance_policy: 0,
    Water_fee: 0,
    Electricity_fee: 0,
    waterBillingType: 'per-month',
    electricityBillingType: 'per-month',
  });

  const fetchDorms = async () => {
    try {
      setDormsLoading(true);
      setDormsError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(`${apiUrl}/dorms`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setDorms(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setDorms([]);
        setDormsError(null);
      } else {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch dorms';
        setDormsError(errorMsg);
        console.error('Error fetching dorms:', err);
      }
    } finally {
      setDormsLoading(false);
    }
  };

  const handleOpenDialog = (dorm?: Dorm) => {
    if (dorm) {
      setEditingDorm(dorm);
      setFormData(dorm);
      setImagePreview(dorm.image_url || null);
      const facilities = dorm.facilities ? dorm.facilities.split(',').map(f => f.trim()).filter(f => f) : [];
      setFacilitiesChips(facilities);
    } else {
      setEditingDorm(null);
      setImagePreview(null);
      setFacilitiesChips([]);
      setFormData({
        name: '',
        location: '',
        description: '',
        image_url: '',
        availibility: true,
        facilities: '',
        price: 0,
        insurance_policy: 0,
        Water_fee: 0,
        Electricity_fee: 0,
        waterBillingType: 'per-month',
        electricityBillingType: 'per-month',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDorm(null);
    setImagePreview(null);
    setFacilitiesChips([]);
    setFormData({
      name: '',
      location: '',
      description: '',
      image_url: '',
      availibility: true,
      facilities: '',
      price: 0,
      insurance_policy: 0,
      Water_fee: 0,
      Electricity_fee: 0,
      waterBillingType: 'per-month',
      electricityBillingType: 'per-month',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    if (name === 'image_url' && value) {
      setImagePreview(value);
    } else if (name === 'image_url' && !value) {
      setImagePreview(null);
    }
  };

  const handleToggleAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availibility: !prev.availibility,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      setPageAlert({ 
        title: 'Validation Error', 
        description: 'Name and location are required fields.', 
        variant: 'destructive' 
      });
      window.setTimeout(() => setPageAlert(null), 4000);
      return;
    }
    try {
      setIsSubmitting(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const url = editingDorm 
        ? `${apiUrl}/dorms/${editingDorm._id}`
        : `${apiUrl}/dorms`;
      
      const submitData = {
        ...formData,
        facilities: facilitiesChips.join(', '),
      };
      
      if (editingDorm) {
        await axios.put(url, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPageAlert({ 
          title: 'Completed.', 
          description: 'The dorm was updated successfully.', 
          variant: 'default' 
        });
      } else {
        await axios.post(url, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPageAlert({ 
          title: 'Completed.', 
          description: 'The dorm was created successfully.', 
          variant: 'default' 
        });
      }
      window.setTimeout(() => setPageAlert(null), 4000);
      handleCloseDialog();
      await fetchDorms();
    } catch (err: any) {
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save dorm';
      setPageAlert({ 
        title: 'Unable to save', 
        description: errorMsg, 
        variant: 'destructive' 
      });
      window.setTimeout(() => setPageAlert(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (dormId: number) => {
    try {
      setDeleteLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      await axios.delete(
        `${apiUrl}/dorms/${dormId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setPageAlert({ 
        title: 'Completed.', 
        description: 'The dorm was deleted successfully.', 
        variant: 'default' 
      });
      window.setTimeout(() => setPageAlert(null), 4000);
      await fetchDorms();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete dorm';
      setPageAlert({ 
        title: 'Unable to delete', 
        description: errorMsg, 
        variant: 'destructive' 
      });
      window.setTimeout(() => setPageAlert(null), 6000);
      console.error('Error deleting dorm:', err);
    } finally {
      setDeleteLoading(false);
      setIsDeleteAlertOpen(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchDorms();
  }, []);

  return (
    <div className="space-y-6">
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

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dorm</h1>
          <p className="text-muted-foreground mt-1">
            Manage your dorm
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              disabled={dorms.length > 0 && !editingDorm}
              title={dorms.length > 0 ? "You can only create one dorm" : ""}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Dorm
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[60vw] h-[90vh] min-w-[50vw] min-h-[80vh] overflow-y-auto p-10">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingDorm ? 'Edit Dorm Details' : 'Create New Dorm'}
              </DialogTitle>
              <DialogDescription>
                {editingDorm
                  ? 'Update your dorm information below'
                  : 'Fill in the details to create your dorm'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Dorm Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Sunshine Dormitory"
                      disabled={isSubmitting}
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 123 University Ave"
                      disabled={isSubmitting}
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Describe your dorm, its amenities, rules, etc..."
                  rows={3}
                  disabled={isSubmitting}
                  className="resize-none text-base"
                />
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-medium">Dorm Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  disabled={isSubmitting}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Paste an image URL (Unsplash, Pexels, or your hosting service)
                </p>
                {imagePreview && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                )}
              </div>

              {/* Facilities */}
              <div className="space-y-2">
                <Label htmlFor="facilities" className="text-sm font-medium">Facilities</Label>
                <ChipsInput
                  id="facilities"
                  value={facilitiesChips}
                  onChange={setFacilitiesChips}
                  placeholder="Add facility and press Enter (WiFi, Gym, etc)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Pricing & Fees</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">Price per Month (฿)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      inputMode="decimal"
                      value={formData.price === 0 || !formData.price ? '' : formData.price}
                      onChange={handleInputChange}
                      placeholder="3000"
                      disabled={isSubmitting}
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance_policy" className="text-sm font-medium">Insurance Policy (฿)</Label>
                    <Input
                      id="insurance_policy"
                      name="insurance_policy"
                      type="number"
                      inputMode="decimal"
                      value={formData.insurance_policy === 0 || !formData.insurance_policy ? '' : formData.insurance_policy}
                      onChange={handleInputChange}
                      placeholder="500"
                      disabled={isSubmitting}
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Water Fee Section with Tabs */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Water Fee</h3>
                  <Tabs value={formData.waterBillingType || 'per-month'} onValueChange={(value) => setFormData({...formData, waterBillingType: value})} className="w-auto">
                    <TabsList className="grid w-auto grid-cols-2 gap-0">
                      <TabsTrigger value="per-month" className="text-xs px-3">Per Month</TabsTrigger>
                      <TabsTrigger value="per-unit" className="text-xs px-3">Per Unit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Water_fee" className="text-sm font-medium">Water Fee Amount (฿)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="Water_fee"
                      name="Water_fee"
                      type="number"
                      inputMode="decimal"
                      value={formData.Water_fee === 0 || !formData.Water_fee ? '' : formData.Water_fee}
                      onChange={handleInputChange}
                      placeholder="50"
                      disabled={isSubmitting}
                      className="text-base flex-1"
                    />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {formData.waterBillingType === 'per-unit' ? '฿ / unit' : '฿ / month'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Electricity Fee Section with Tabs */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Electricity Fee</h3>
                  <Tabs value={formData.electricityBillingType || 'per-month'} onValueChange={(value) => setFormData({...formData, electricityBillingType: value})} className="w-auto">
                    <TabsList className="grid w-auto grid-cols-2 gap-0">
                      <TabsTrigger value="per-month" className="text-xs px-3">Per Month</TabsTrigger>
                      <TabsTrigger value="per-unit" className="text-xs px-3">Per Unit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Electricity_fee" className="text-sm font-medium">Electricity Fee Amount (฿)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="Electricity_fee"
                      name="Electricity_fee"
                      type="number"
                      inputMode="decimal"
                      value={formData.Electricity_fee === 0 || !formData.Electricity_fee ? '' : formData.Electricity_fee}
                      onChange={handleInputChange}
                      placeholder="100"
                      disabled={isSubmitting}
                      className="text-base flex-1"
                    />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {formData.electricityBillingType === 'per-unit' ? '฿ / unit' : '฿ / month'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="availibility"
                  checked={formData.availibility || false}
                  onChange={handleToggleAvailability}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <Label htmlFor="availibility" className="cursor-pointer flex-1 text-sm">
                  <span className="font-medium">Mark as Available</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Dorm is open for new students</p>
                </Label>
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
                  type="submit" 
                  disabled={isSubmitting}
                  className="sm:flex-1"
                >
                  {isSubmitting
                    ? editingDorm ? 'Updating...' : 'Creating...'
                    : editingDorm ? 'Update Dorm' : 'Create Dorm'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Message */}
      {dormsError && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{dormsError}</p>
          </CardContent>
        </Card>
      )}

      {/* Dorms List */}
      {dormsLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading dorms...</div>
        </div>
      ) : dorms.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No dorms yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {dorms.map(dorm => (
            <Card key={dorm._id} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Image Section */}
                {dorm.image_url && (
                  <div className="lg:col-span-2 h-64 sm:h-80 lg:h-full overflow-hidden bg-muted min-h-80">
                    <img
                      src={dorm.image_url}
                      alt={dorm.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                {/* Details Section */}
                <div className={`p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex flex-col ${dorm.image_url ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground truncate">{dorm.name}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">{dorm.location}</p>
                      </div>
                      <Badge variant={dorm.availibility ? 'default' : 'secondary'} className="text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0">
                        {dorm.availibility ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>

                  {dorm.description && (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">Description</p>
                      <p className="text-sm sm:text-base text-foreground leading-relaxed line-clamp-3">{dorm.description}</p>
                    </div>
                  )}

                  {dorm.facilities && (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">Facilities</p>
                      <p className="text-sm sm:text-base text-foreground line-clamp-2">{dorm.facilities}</p>
                    </div>
                  )}

                  {/* Pricing Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t">
                    {dorm.price !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Price/Month</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">฿{dorm.price}</p>
                      </div>
                    )}
                    {dorm.rating !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Rating</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{dorm.rating.toFixed(1)} ⭐</p>
                      </div>
                    )}
                    {dorm.insurance_policy !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Insurance</p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">฿{dorm.insurance_policy}</p>
                      </div>
                    )}
                    {dorm.Water_fee !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Water</p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">
                          ฿{dorm.Water_fee} <span className="text-xs">/ {dorm.waterBillingType === 'per-unit' ? 'unit' : 'month'}</span>
                        </p>
                      </div>
                    )}
                    {dorm.Electricity_fee !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Electricity</p>
                        <p className="text-lg sm:text-xl font-bold text-foreground">
                          ฿{dorm.Electricity_fee} <span className="text-xs">/ {dorm.electricityBillingType === 'per-unit' ? 'unit' : 'month'}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4 border-t mt-auto">
                    <Button
                      onClick={() => handleOpenDialog(dorm)}
                      className="w-full sm:flex-1 text-sm sm:text-base"
                    >
                      <Edit2 className="mr-1 sm:mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog
                      open={isDeleteAlertOpen && deleteTarget === dorm._id}
                      onOpenChange={(open) => {
                        setIsDeleteAlertOpen(open);
                        if (!open) setDeleteTarget(null);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setDeleteTarget(dorm._id);
                            setIsDeleteAlertOpen(true);
                          }}
                          className="w-full sm:w-auto text-sm sm:text-base"
                        >
                          <Trash2 className="mr-1 sm:mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Dorm: {dorm.name}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this dorm? This action cannot be undone and will remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => { 
                            setIsDeleteAlertOpen(false); 
                            setDeleteTarget(null); 
                          }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            className={buttonVariants({ variant: 'destructive' })} 
                            onClick={async () => {
                              await handleDelete(dorm._id);
                            }}
                          >
                            {deleteLoading ? 'Processing...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}