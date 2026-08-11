'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';
import PermissionGuard from '@/components/auth/PermissionGuard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ROLES } from '@/constants/roles';
import { PERMISSIONS } from '@/constants/permissions';
import * as rbacDemoService from '@/services/rbacDemoService';
import { ApiError } from '@/lib/apiClient';

// Temporary verification page for Phase 15's RBAC system — exercises
// RoleGuard/PermissionGuard/backend demo endpoints together so the
// whole authorization chain can be visually confirmed in the browser.
function DemoButton({ label, onCall }) {
  const [result, setResult] = useState('');

  const handleClick = async () => {
    setResult('Calling...');
    try {
      const res = await onCall();
      setResult(`✅ ${res.message}`);
    } catch (err) {
      setResult(err instanceof ApiError ? `❌ ${err.statusCode}: ${err.message}` : '❌ Unexpected error');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleClick}>
        {label}
      </Button>
      <span className="text-sm text-gray-600">{result}</span>
    </div>
  );
}

function AccessCheckContent() {
  return (
    <div className="container-page flex flex-col gap-6 py-10">
      <h1 className="text-2xl font-semibold">Access Check (Phase 15 Verification)</h1>

      <Card className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase text-gray-500">Backend role/permission checks</h2>
        <DemoButton label="Call /demo/buyer-only" onCall={rbacDemoService.callBuyerOnly} />
        <DemoButton label="Call /demo/seller-only" onCall={rbacDemoService.callSellerOnly} />
        <DemoButton label="Call /demo/admin-only" onCall={rbacDemoService.callAdminOnly} />
        <DemoButton label="Call /demo/manage-products (Product.Create permission)" onCall={rbacDemoService.callManageProducts} />
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase text-gray-500">Frontend role/permission guards</h2>
        <RoleGuard allowedRoles={[ROLES.BUYER]} fallback={<p className="text-sm text-gray-400">Hidden: Buyer-only content</p>}>
          <p className="text-sm text-success-600">✅ Visible: Buyer-only content</p>
        </RoleGuard>
        <RoleGuard allowedRoles={[ROLES.SELLER]} fallback={<p className="text-sm text-gray-400">Hidden: Seller-only content</p>}>
          <p className="text-sm text-success-600">✅ Visible: Seller-only content</p>
        </RoleGuard>
        <RoleGuard allowedRoles={[ROLES.ADMIN]} fallback={<p className="text-sm text-gray-400">Hidden: Admin-only content</p>}>
          <p className="text-sm text-success-600">✅ Visible: Admin-only content</p>
        </RoleGuard>
        <PermissionGuard
          permission={PERMISSIONS.PRODUCT_CREATE}
          fallback={<p className="text-sm text-gray-400">Hidden: requires Product.Create</p>}
        >
          <p className="text-sm text-success-600">✅ Visible: requires Product.Create</p>
        </PermissionGuard>
      </Card>
    </div>
  );
}

export default function AccessCheckPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <AccessCheckContent />
      </ProtectedRoute>
    </MainLayout>
  );
}