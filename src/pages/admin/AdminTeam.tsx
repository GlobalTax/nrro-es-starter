import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberFormDialog } from '@/components/admin/team/TeamMemberFormDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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

export const AdminTeam = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: `Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;

    try {
      // Delete avatar from storage if exists
      if (memberToDelete.avatar_url) {
        const path = memberToDelete.avatar_url.split('/').slice(-2).join('/');
        await supabase.storage.from('media-library').remove([path]);
      }

      // Delete member from database
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberToDelete.id);

      if (error) throw error;

      toast({
        title: 'Team member deleted',
        description: 'Member removed successfully',
      });

      refetch();
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button onClick={() => { setSelectedMember(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{member.position}</Badge>
                </TableCell>
                <TableCell>{member.email || 'N/A'}</TableCell>
                <TableCell>{member.order_index}</TableCell>
                <TableCell>
                  <Switch
                    checked={member.is_active}
                    onCheckedChange={() => toggleActive(member.id, member.is_active)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(member)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <TeamMemberFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={refetch}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {memberToDelete?.name} from the team.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
