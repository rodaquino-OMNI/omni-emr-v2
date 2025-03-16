
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { UserRole } from '@/types/auth';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

const PendingApprovalList = () => {
  const { language } = useTranslation();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  
  // Clinical roles that require approval
  const clinicalRoles: UserRole[] = ['doctor', 'nurse', 'specialist', 'pharmacist', 'lab_technician', 'radiology_technician'];
  
  const fetchPendingUsers = async () => {
    setLoading(true);
    
    try {
      // Fetch users where approval_status is 'pending'
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, created_at')
        .in('role', clinicalRoles)
        .eq('approval_status', 'pending');
      
      if (error) throw error;
      
      // Type assertion to ensure correct typing of role
      const typedData = data?.map(user => ({
        ...user,
        role: user.role as UserRole
      })) || [];
      
      setPendingUsers(typedData);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      toast.error(
        language === 'pt' ? 'Erro ao carregar usuários' : 'Error loading users',
        { description: error.message }
      );
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingUsers();
  }, []);
  
  const handleApprove = async (userId: string) => {
    setProcessingUser(userId);
    
    try {
      // Update the user's approval status
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'approved' })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Remove user from pending list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      toast.success(
        language === 'pt' ? 'Usuário aprovado' : 'User approved',
        { description: language === 'pt' ? 'O usuário agora pode fazer login' : 'The user can now log in' }
      );
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast.error(
        language === 'pt' ? 'Erro ao aprovar usuário' : 'Error approving user',
        { description: error.message }
      );
    } finally {
      setProcessingUser(null);
    }
  };
  
  const handleReject = async (userId: string) => {
    setProcessingUser(userId);
    
    try {
      // Update the user's approval status
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'rejected' })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Remove user from pending list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      toast.success(
        language === 'pt' ? 'Usuário rejeitado' : 'User rejected',
        { description: language === 'pt' ? 'A conta foi rejeitada' : 'The account has been rejected' }
      );
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast.error(
        language === 'pt' ? 'Erro ao rejeitar usuário' : 'Error rejecting user',
        { description: error.message }
      );
    } finally {
      setProcessingUser(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getRoleName = (role: UserRole) => {
    const roleMap: Record<UserRole, { en: string, pt: string }> = {
      'doctor': { en: 'Doctor', pt: 'Médico' },
      'nurse': { en: 'Nurse', pt: 'Enfermeiro' },
      'specialist': { en: 'Specialist', pt: 'Especialista' },
      'pharmacist': { en: 'Pharmacist', pt: 'Farmacêutico' },
      'caregiver': { en: 'Caregiver', pt: 'Cuidador' },
      'patient': { en: 'Patient', pt: 'Paciente' },
      'administrative': { en: 'Administrative', pt: 'Administrativo' },
      'lab_technician': { en: 'Lab Technician', pt: 'Técnico de Laboratório' },
      'radiology_technician': { en: 'Radiology Technician', pt: 'Técnico de Radiologia' },
      'system_administrator': { en: 'System Administrator', pt: 'Administrador do Sistema' },
      'admin': { en: 'Admin', pt: 'Admin' },
      'physician': { en: 'Physician', pt: 'Médico' },
      'radiologist': { en: 'Radiologist', pt: 'Radiologista' },
      'therapist': { en: 'Therapist', pt: 'Terapeuta' },
      'receptionist': { en: 'Receptionist', pt: 'Recepcionista' },
      'medical_assistant': { en: 'Medical Assistant', pt: 'Assistente Médico' },
      'insurance_staff': { en: 'Insurance Staff', pt: 'Funcionário de Seguro' },
      'researcher': { en: 'Researcher', pt: 'Pesquisador' },
      'coordinator': { en: 'Coordinator', pt: 'Coordenador' },
      'student': { en: 'Student', pt: 'Estudante' },
      'guest': { en: 'Guest', pt: 'Convidado' },
      'medical_staff': { en: 'Medical Staff', pt: 'Equipe Médica' },
      'all': { en: 'All Roles', pt: 'Todos os Papéis' }
    };
    
    return roleMap[role]?.[language === 'pt' ? 'pt' : 'en'] || role;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {language === 'pt' ? 'Aprovações Pendentes' : 'Pending Approvals'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' 
                ? 'Gerencie contas de equipe clínica aguardando aprovação'
                : 'Manage clinical staff accounts awaiting approval'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {pendingUsers.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserCog className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>
              {language === 'pt'
                ? 'Nenhuma aprovação pendente no momento'
                : 'No pending approvals at the moment'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'pt' ? 'Nome' : 'Name'}</TableHead>
                <TableHead>{language === 'pt' ? 'Email' : 'Email'}</TableHead>
                <TableHead>{language === 'pt' ? 'Função' : 'Role'}</TableHead>
                <TableHead>{language === 'pt' ? 'Data' : 'Date'}</TableHead>
                <TableHead className="text-right">{language === 'pt' ? 'Ações' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleName(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        disabled={processingUser === user.id}
                      >
                        {processingUser === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        )}
                        {language === 'pt' ? 'Aprovar' : 'Approve'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(user.id)}
                        disabled={processingUser === user.id}
                      >
                        {processingUser === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1 text-destructive" />
                        )}
                        {language === 'pt' ? 'Rejeitar' : 'Reject'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchPendingUsers} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {language === 'pt' ? 'Atualizar' : 'Refresh'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingApprovalList;
