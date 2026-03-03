'use client';

interface MetricsCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
};

export default function MetricsCard({
  title,
  value,
  description,
  icon,
  color,
}: MetricsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}
