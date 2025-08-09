import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Images, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff, 
  Monitor, 
  Tablet, 
  Smartphone,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  X
} from "lucide-react";

interface HeroImage {
  id: string;
  device_type: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function HeroImageManagement() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [showHeroDialog, setShowHeroDialog] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  
  // Form states
  const [heroDeviceType, setHeroDeviceType] = useState("desktop");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroAltText, setHeroAltText] = useState("");
  const [heroDisplayOrder, setHeroDisplayOrder] = useState("1");
  const [heroIsActive, setHeroIsActive] = useState(true);
  
  // Filter states
  const [filterDeviceType, setFilterDeviceType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('device_type', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hero images",
        variant: "destructive"
      });
    }
  };

  const createHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!heroImageFile || !heroDeviceType) {
      toast({
        title: "Missing information",
        description: "Please select a device type and upload an image file",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Upload the image file to storage
      const fileExt = heroImageFile.name.split('.').pop();
      const fileName = `hero-${heroDeviceType}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-banners')
        .upload(fileName, heroImageFile);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('hero-banners')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Get the next available display_order for this device_type
      const { data: existingImages } = await supabase
        .from('hero_images')
        .select('display_order')
        .eq('device_type', heroDeviceType)
        .order('display_order', { ascending: false })
        .limit(1);

      const nextDisplayOrder = existingImages && existingImages.length > 0 
        ? existingImages[0].display_order + 1 
        : 1;

      // Save the hero image data to the database
      const { error } = await supabase
        .from('hero_images')
        .insert({
          device_type: heroDeviceType,
          image_url: imageUrl,
          alt_text: heroAltText.trim() || 'Hero background image',
          display_order: parseInt(heroDisplayOrder) || nextDisplayOrder,
          is_active: heroIsActive,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hero image uploaded and added successfully"
      });

      resetHeroForm();
      setShowHeroDialog(false);
      fetchHeroImages();
    } catch (error: any) {
      console.error('Error creating hero image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload and add hero image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editingHero) return;

    try {
      let imageUrl = heroImageUrl; // Keep existing URL by default

      // If a new file was uploaded, upload it first
      if (heroImageFile) {
        const fileExt = heroImageFile.name.split('.').pop();
        const fileName = `hero-${heroDeviceType}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('hero-banners')
          .upload(fileName, heroImageFile);

        if (uploadError) throw uploadError;

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('hero-banners')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('hero_images')
        .update({
          device_type: heroDeviceType,
          image_url: imageUrl,
          alt_text: heroAltText.trim() || 'Hero background image',
          display_order: parseInt(heroDisplayOrder) || 1,
          is_active: heroIsActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingHero.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hero image updated successfully"
      });

      resetHeroForm();
      setShowHeroDialog(false);
      fetchHeroImages();
    } catch (error: any) {
      console.error('Error updating hero image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update hero image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) return;

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hero image deleted successfully"
      });

      fetchHeroImages();
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast({
        title: "Error",
        description: "Failed to delete hero image",
        variant: "destructive"
      });
    }
  };

  const toggleHeroImageStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Hero image ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      fetchHeroImages();
    } catch (error) {
      console.error('Error updating hero image status:', error);
      toast({
        title: "Error",
        description: "Failed to update hero image status",
        variant: "destructive"
      });
    }
  };

  const updateDisplayOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;

      fetchHeroImages();
    } catch (error) {
      console.error('Error updating display order:', error);
      toast({
        title: "Error",
        description: "Failed to update display order",
        variant: "destructive"
      });
    }
  };

  const openEditHeroDialog = (hero: HeroImage) => {
    setEditingHero(hero);
    setHeroDeviceType(hero.device_type);
    setHeroImageUrl(hero.image_url);
    setHeroAltText(hero.alt_text || '');
    setHeroDisplayOrder(hero.display_order.toString());
    setHeroIsActive(hero.is_active);
    setHeroImageFile(null);
    setShowHeroDialog(true);
  };

  const resetHeroForm = () => {
    setEditingHero(null);
    setHeroDeviceType("desktop");
    setHeroImageUrl("");
    setHeroAltText("");
    setHeroDisplayOrder("1");
    setHeroIsActive(true);
    setHeroImageFile(null);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const filteredImages = heroImages.filter(image => {
    if (filterDeviceType !== "all" && image.device_type !== filterDeviceType) {
      return false;
    }
    if (filterStatus === "active" && !image.is_active) {
      return false;
    }
    if (filterStatus === "inactive" && image.is_active) {
      return false;
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Images className="h-4 w-4 sm:h-5 sm:w-5" />
              Hero Images Management
            </CardTitle>
            <CardDescription className="text-sm">
              Manage hero images for different devices and organize their display order.
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              resetHeroForm();
              setShowHeroDialog(true);
            }}
            size="sm"
            className="self-start sm:self-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Hero Image</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="filter-device">Filter by Device</Label>
            <Select value={filterDeviceType} onValueChange={setFilterDeviceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="filter-status">Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Images Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Preview</TableHead>
                <TableHead className="min-w-[100px]">Device</TableHead>
                <TableHead className="min-w-[200px]">Alt Text</TableHead>
                <TableHead className="min-w-[80px]">Order</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">Created</TableHead>
                <TableHead className="text-right min-w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hero images found
                  </TableCell>
                </TableRow>
              ) : (
                filteredImages.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                        <img 
                          src={image.image_url} 
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(image.device_type)}
                        <span className="capitalize text-sm">{image.device_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm truncate max-w-[200px] block">
                        {image.alt_text || 'No alt text'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateDisplayOrder(image.id, image.display_order - 1)}
                          disabled={image.display_order <= 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {image.display_order}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateDisplayOrder(image.id, image.display_order + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={image.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {image.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {new Date(image.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditHeroDialog(image)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHeroImageStatus(image.id, image.is_active)}
                          className="h-8 w-8 p-0"
                        >
                          {image.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteHeroImage(image.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add/Edit Hero Image Dialog */}
      <Dialog open={showHeroDialog} onOpenChange={setShowHeroDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingHero ? 'Edit Hero Image' : 'Add New Hero Image'}
            </DialogTitle>
            <DialogDescription>
              {editingHero 
                ? 'Update the hero image details below.'
                : 'Upload a new hero image for your website.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={editingHero ? updateHeroImage : createHeroImage} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type *</Label>
                <Select value={heroDeviceType} onValueChange={setHeroDeviceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  min="1"
                  value={heroDisplayOrder}
                  onChange={(e) => setHeroDisplayOrder(e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-file">
                {editingHero ? 'Replace Image (optional)' : 'Upload Image *'}
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {editingHero && heroImageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Current image:</p>
                  <img 
                    src={heroImageUrl} 
                    alt="Current hero image" 
                    className="w-full h-32 object-cover rounded-md mt-1"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Textarea
                id="alt-text"
                value={heroAltText}
                onChange={(e) => setHeroAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-active"
                checked={heroIsActive}
                onCheckedChange={(checked) => setHeroIsActive(checked as boolean)}
              />
              <Label htmlFor="is-active" className="text-sm">
                Set as active (visible on website)
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowHeroDialog(false)}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingHero ? 'Update' : 'Upload'} Image
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}