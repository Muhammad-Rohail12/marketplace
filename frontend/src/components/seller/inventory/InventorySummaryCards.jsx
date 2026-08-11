import Card from '@/components/ui/Card';

export default function InventorySummaryCards({ summary }) {
  const cards = [
    { label: 'Total Products', value: summary.totalInventoryRecords },
    { label: 'Total Stock Units', value: summary.totalStockUnits },
    { label: 'Low Stock', value: summary.lowStockCount, tone: summary.lowStockCount > 0 ? 'text-warning-600' : '' },
    { label: 'Out of Stock', value: summary.outOfStockCount, tone: summary.outOfStockCount > 0 ? 'text-danger-600' : '' },
    { label: 'Reserved Units', value: summary.totalReservedUnits },
    { label: 'Inventory Value', value: summary.inventoryValue === null ? 'Available after pricing integration' : summary.inventoryValue },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <Card key={c.label}>
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className={`mt-1 text-xl font-semibold ${c.tone || ''}`}>{c.value}</p>
        </Card>
      ))}
    </div>
  );
}