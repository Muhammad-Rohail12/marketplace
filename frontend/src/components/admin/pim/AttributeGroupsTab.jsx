'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { pimService } from '@/services/pimService';

export default function AttributeGroupsTab() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const res = await pimService.listAttributeGroups({ limit: 100 });
    setGroups(res.data.groups);
    setIsLoading(false);
  };
  //
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await pimService.createAttributeGroup({ name: name.trim() });
    setName('');
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    await pimService.deleteAttributeGroup(id);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input id="group-name" placeholder="New group name (e.g. Physical Properties)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <Card key={g.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{g.name}</p>
                <p className="text-xs text-gray-500">{g.attributes?.length || 0} attributes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(g.id)}>Delete</Button>
            </Card>
          ))}
          {groups.length === 0 && <p className="text-sm text-gray-500">No attribute groups yet.</p>}
        </div>
      )}
    </div>
  );
}