import { ProfileDetail } from '@/components/profile-detail';

export default function NutritionSettings() {
  return (
    <ProfileDetail
      title="Настройки питания"
      description="Здесь будут ваши предпочтения для подбора рецептов."
      items={[
        { label: 'Тип питания', value: 'Не выбран' },
        { label: 'Аллергии и исключения', value: 'Не указаны' },
      ]}
    />
  );
}
