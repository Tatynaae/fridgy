import { ProfileDetail } from '@/components/profile-detail';

export default function PersonalData() {
  return (
    <ProfileDetail
      title="Личные данные"
      description="Информация вашего профиля. Пока отображается демонстрационный аккаунт."
      items={[
        { label: 'Имя', value: 'user' },
        { label: 'Электронная почта', value: 'user@example.com' },
      ]}
    />
  );
}
