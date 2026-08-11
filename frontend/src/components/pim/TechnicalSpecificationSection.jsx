import SpecificationTable from './SpecificationTable';

export default function TechnicalSpecificationSection({ generalItems = [], technicalItems = [] }) {
  if (!generalItems.length && !technicalItems.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {generalItems.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">General</h3>
          <SpecificationTable items={generalItems} />
        </div>
      )}
      {technicalItems.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">Technical Specifications</h3>
          <SpecificationTable items={technicalItems} />
        </div>
      )}
    </div>
  );
}