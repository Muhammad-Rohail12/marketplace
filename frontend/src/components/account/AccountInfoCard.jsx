import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatDate';

export default function AccountInfoCard({ user }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Account Information</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Email verified</dt>
          <dd>
            <Badge variant={user.emailVerified ? 'success' : 'warning'}>
              {user.emailVerified ? 'Verified' : 'Not verified'}
            </Badge>
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Account status</dt>
          <dd>
            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>{user.status}</Badge>
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Member since</dt>
          <dd>{formatDate(user.createdAt)}</dd>
        </div>
        {user.lastLoginAt && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Last login</dt>
            <dd>{formatDate(user.lastLoginAt, { hour: '2-digit', minute: '2-digit' })}</dd>
          </div>
        )}
      </dl>
    </Card>
  );
}