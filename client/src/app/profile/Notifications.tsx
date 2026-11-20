import { ProfileDetail } from '@/components/profile-detail';

export default function Notifications() {
  return (
    <ProfileDetail
      title="Уведомления"
      description="Здесь появится управление напоминаниями Fridgy."
      items={[
        { label: 'Напоминания о продуктах', value: 'Помогут вовремя использовать продукты из холодильника.' },
        { label: 'Идеи рецептов', value: 'Подскажут, что приготовить из доступных ингредиентов.' },
      ]}
    />
  );
}
