'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import UserTable from '@/components/admin/users/UserTable';
import { listUsers } from '@/services/userService';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLES } from '@/constants/roles';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'BUYER', label: 'Buyer' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'ADMIN', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

function AdminUsersContent() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await listUsers({ page, limit: 20, search: debouncedSearch, role, status });
      setUsers(res.data.users || []);
      setMeta(res.meta || { page: 1, totalPages: 1 });
    } catch (error) {
      setLoadError(error.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, role, status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  if (isLoading) return <PageLoader label="Loading users..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <Card className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search by name or email..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="flex-1" />
        <Select value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }} options={ROLE_OPTIONS} />
        <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} options={STATUS_OPTIONS} />
      </Card>
      <Card>
        {users.length === 0 ? <EmptyState title="No users found" message="No users match the selected filters." /> : <UserTable users={users} />}
        {users.length > 0 && <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>}
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminLayout><ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminUsersContent /></ProtectedRoute></AdminLayout>;
}