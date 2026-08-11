'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLoader from '@/components/feedback/PageLoader';
import AttributeGroupsTab from '@/components/admin/pim/AttributeGroupsTab';
import AttributesTab from '@/components/admin/pim/AttributesTab';
import MeasurementUnitsTab from '@/components/admin/pim/MeasurementUnitsTab';
import VariantsTab from '@/components/admin/pim/VariantsTab';
import SpecTemplatesTab from '@/components/admin/pim/SpecTemplatesTab';
import ConfigTab from '@/components/admin/pim/ConfigTab';
import { pimService } from '@/services/pimService';
import { ROLES } from '@/constants/roles';

const TABS = ['Attribute Groups', 'Attributes', 'Measurement Units', 'Variants', 'Specification Templates', 'SKU/Barcode Config'];

function AdminPimContent() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [groups, setGroups] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([pimService.listAttributeGroups({ limit: 100 }), pimService.listAttributes({ limit: 100 })])
      .then(([g, a]) => {
        setGroups(g.data.groups);
        setAttributes(a.data.attributes);
      })
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  if (isLoading) return <PageLoader label="Loading PIM foundation..." />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Product Information Management</h1>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === tab ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Attribute Groups' && <AttributeGroupsTab />}
      {activeTab === 'Attributes' && <AttributesTab groups={groups} />}
      {activeTab === 'Measurement Units' && <MeasurementUnitsTab />}
      {activeTab === 'Variants' && <VariantsTab attributes={attributes} />}
      {activeTab === 'Specification Templates' && <SpecTemplatesTab />}
      {activeTab === 'SKU/Barcode Config' && <ConfigTab />}
    </div>
  );
}

export default function AdminPimPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminPimContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}