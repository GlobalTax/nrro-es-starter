import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2 } from 'lucide-react';

// Opciones permitidas para Position (ordenadas por jerarquía)
const POSITION_OPTIONS = [
  { value: 'SOCIO', label: 'Socio' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'ASOCIADO', label: 'Asociado' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MASTER SCHOLAR', label: 'Master Scholar' },
] as const;

// Opciones permitidas para Specialization (ordenadas alfabéticamente)
const SPECIALIZATION_OPTIONS = [
  { value: 'CONTABILIDAD', label: 'Contabilidad' },
  { value: 'FISCALIDAD', label: 'Fiscalidad' },
  { value: 'LABORAL', label: 'Laboral' },
  { value: 'M&A', label: 'M&A' },
  { value: 'SERVICIOS CORPORATIVOS', label: 'Servicios Corporativos' },
  { value: 'SERVICIOS GLOBALES', label: 'Servicios Globales' },
] as const;

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  position: z.string().min(2, 'Position is required'),
  bio: z.string().optional(),
  specialization: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL format').optional().or(z.literal('')),
  avatar_url: z.string().nullable().optional(),
  order_index: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  specialization?: string;
  email?: string;
  linkedin?: string;
  avatar_url?: string;
  order_index: number;
  is_active: boolean;
}

interface TeamMemberFormDialogProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSuccess: () => void;
}

export function TeamMemberFormDialog({ open, onClose, member, onSuccess }: TeamMemberFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || '',
      position: member?.position || '',
      bio: member?.bio || '',
      specialization: member?.specialization || '',
      email: member?.email || '',
      linkedin: member?.linkedin || '',
      avatar_url: member?.avatar_url ?? null,
      order_index: member?.order_index || 0,
      is_active: member?.is_active ?? true,
    },
  });

  // Reset form when dialog opens or member changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: member?.name || '',
        position: member?.position || '',
        bio: member?.bio || '',
        specialization: member?.specialization || '',
        email: member?.email || '',
        linkedin: member?.linkedin || '',
        avatar_url: member?.avatar_url ?? null,
        order_index: member?.order_index || 0,
        is_active: member?.is_active ?? true,
      });
      setAvatarFile(null);
    }
  }, [open, member, form]);

  const uploadAvatar = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `team-avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media-library').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (values: TeamMemberFormValues) => {
    setIsSubmitting(true);
    try {
      let avatarUrl = values.avatar_url;

      // Handle avatar upload if there's a new file
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);

        // Delete old avatar if updating
        if (member?.avatar_url) {
          const oldPath = member.avatar_url.split('/').slice(-2).join('/');
          await supabase.storage.from('media-library').remove([oldPath]);
        }
      }

      const memberData = {
        name: values.name,
        position_es: values.position, // Guardar en columna _es
        position_ca: values.position, // Por ahora duplicar, traducir después
        position_en: values.position,
        bio_es: values.bio || null,
        bio_ca: values.bio || null,
        bio_en: values.bio || null,
        specialization_es: values.specialization || null,
        specialization_ca: values.specialization || null,
        specialization_en: values.specialization || null,
        email: values.email || null,
        linkedin: values.linkedin || null,
        avatar_url: avatarUrl || null,
        order_index: values.order_index,
        is_active: values.is_active,
      };

      if (member) {
        // Update existing member
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', member.id);

        if (error) throw error;

        toast({
          title: 'Team member updated',
          description: 'Changes saved successfully',
        });
      } else {
        // Create new member
        const { error } = await supabase
          .from('team_members')
          .insert([memberData]);

        if (error) throw error;

        toast({
          title: 'Team member created',
          description: 'New member added successfully',
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['team-members'] });
      
      form.reset();
      setAvatarFile(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </DialogTitle>
          <DialogDescription>
            {member
              ? 'Update team member information'
              : 'Add a new member to the team'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url, file) => {
                        field.onChange(url);
                        setAvatarFile(file);
                      }}
                      className="max-w-xs mx-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPECIALIZATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief professional biography..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show on public website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {member ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
