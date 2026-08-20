import UserStatusBadge from '@/components/admin/users/UserStatusBadge';

export default function UserTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Role</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{user.firstName} {user.lastName}</td>
              <td className="py-2 pr-4">{user.email}</td>
              <td className="py-2 pr-4">{user.role}</td>
              <td className="py-2 pr-4"><UserStatusBadge status={user.status} /></td>
              <td className="py-2 pr-4">{user.emailVerified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}