import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Star, Eye, MousePointer, ShoppingCart, Plus, Edit, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumListing {
  id: string;
  product_name: string;
  product_type: string;
  description: string;
  features: string[];
  pricing: any;
  target_segments: string[];
  business_unit_id: string;
  display_order: number;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
  updated_at: string;
  business_unit?: {
    name: string;
    code: string;
  };
}

export const PremiumListings = () => {
  const [listings, setListings] = useState<PremiumListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PremiumListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<PremiumListing | null>(null);

  const [formData, setFormData] = useState({
    product_name: '',
    product_type: 'FUND',
    description: '',
    status: 'ACTIVE',
    display_order: 0
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, statusFilter, typeFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('premium_listings')
        .select(`
          *,
          business_unit:business_units(name, code)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      toast.error('Failed to load premium listings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.product_type === typeFilter);
    }

    setFilteredListings(filtered);
  };

  const handleSubmit = async () => {
    try {
      if (editingListing) {
        const { error } = await supabase
          .from('premium_listings')
          .update(formData)
          .eq('id', editingListing.id);

        if (error) throw error;
        toast.success('Listing updated successfully');
      } else {
        const { error } = await supabase
          .from('premium_listings')
          .insert([{
            ...formData,
            features: [],
            pricing: {},
            target_segments: []
          }]);

        if (error) throw error;
        toast.success('Listing created successfully');
      }

      setIsCreateOpen(false);
      setEditingListing(null);
      setFormData({
        product_name: '',
        product_type: 'FUND',
        description: '',
        status: 'ACTIVE',
        display_order: 0
      });
      fetchListings();
    } catch (error: any) {
      toast.error('Failed to save listing: ' + error.message);
    }
  };

  const updateListingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('premium_listings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Listing ${status.toLowerCase()}`);
      fetchListings();
    } catch (error: any) {
      toast.error('Failed to update listing: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      ACTIVE: 'bg-green-500',
      INACTIVE: 'bg-gray-500',
      COMING_SOON: 'bg-blue-500'
    };

    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const getConversionRate = (listing: PremiumListing) => {
    if (listing.clicks === 0) return '0.0';
    return ((listing.conversions / listing.clicks) * 100).toFixed(1);
  };

  const getCTR = (listing: PremiumListing) => {
    if (listing.impressions === 0) return '0.0';
    return ((listing.clicks / listing.impressions) * 100).toFixed(1);
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'ACTIVE').length,
    totalImpressions: listings.reduce((sum, l) => sum + l.impressions, 0),
    totalConversions: listings.reduce((sum, l) => sum + l.conversions, 0),
    avgCTR: listings.length > 0
      ? (listings.reduce((sum, l) => sum + (l.impressions > 0 ? (l.clicks / l.impressions) * 100 : 0), 0) / listings.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Premium Listings</h1>
          <p className="text-muted-foreground">Manage featured products and services</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setEditingListing(null);
            setFormData({
              product_name: '',
              product_type: 'FUND',
              description: '',
              status: 'ACTIVE',
              display_order: 0
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Premium Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingListing ? 'Edit' : 'Create'} Premium Listing</DialogTitle>
              <DialogDescription>
                {editingListing ? 'Update' : 'Add'} a featured product or service
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label>Product Type</Label>
                <Select
                  value={formData.product_type}
                  onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FUND">Fund</SelectItem>
                    <SelectItem value="LOAN">Loan</SelectItem>
                    <SelectItem value="INVESTMENT">Investment</SelectItem>
                    <SelectItem value="ADVISORY">Advisory</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description"
                  rows={4}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingListing ? 'Update' : 'Create'} Listing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Listings</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Impressions</CardDescription>
            <CardTitle className="text-3xl">{stats.totalImpressions.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Conversions</CardDescription>
            <CardTitle className="text-3xl">{stats.totalConversions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg CTR</CardDescription>
            <CardTitle className="text-3xl">{stats.avgCTR}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FUND">Fund</SelectItem>
                <SelectItem value="LOAN">Loan</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
                <SelectItem value="ADVISORY">Advisory</SelectItem>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
                <SelectItem value="ACCOUNT">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading premium listings...</div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No listings found</div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{listing.product_name}</h3>
                            {getStatusBadge(listing.status)}
                            <Badge variant="outline">{listing.product_type}</Badge>
                            {listing.business_unit && (
                              <Badge variant="secondary">{listing.business_unit.name}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{listing.description}</p>
                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{listing.impressions.toLocaleString()}</span>
                              <span className="text-muted-foreground">impressions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MousePointer className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{listing.clicks}</span>
                              <span className="text-muted-foreground">clicks</span>
                              <span className="text-xs text-muted-foreground">({getCTR(listing)}%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{listing.conversions}</span>
                              <span className="text-muted-foreground">conversions</span>
                              <span className="text-xs text-muted-foreground">({getConversionRate(listing)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingListing(listing);
                            setFormData({
                              product_name: listing.product_name,
                              product_type: listing.product_type,
                              description: listing.description,
                              status: listing.status,
                              display_order: listing.display_order
                            });
                            setIsCreateOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {listing.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateListingStatus(listing.id, 'INACTIVE')}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => updateListingStatus(listing.id, 'ACTIVE')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};