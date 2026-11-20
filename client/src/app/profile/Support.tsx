import { ProfileDetail } from '@/components/profile-detail';

export default function Support() {
  return (
    <ProfileDetail
      title="Служба поддержки"
      description="Ответы на частые вопросы о Fridgy."
      items={[
        { label: 'Как найти рецепт?', value: 'На главной странице выберите сканирование и добавьте фото продуктов.' },
        { label: 'Где искать сохранённые рецепты?', value: 'Откройте вкладку «Сохранённое» внизу экрана.' },
      ]}
    />
  );
}
