import { getTemplateCountByCategory } from './templates/templateRegistry';

const baseCategories = [
    {
        id: 'uzatu',
        title: { kk: 'Ұзату', ru: 'Проводы невесты' },
        icon: '✨',
        bg: '#f0fdf4',
    },
    {
        id: 'wedding',
        title: { kk: 'Үйлену тойы', ru: 'Свадьба' },
        icon: '💍',
        bg: '#fffbeb',
    },
    {
        id: 'sundet',
        title: { kk: 'Сүндет той', ru: 'Сүндет той' },
        icon: '👦',
        bg: '#f0fdf4',
    },
    {
        id: 'tusaukeser',
        title: { kk: 'Тұсаукесер', ru: 'Тұсаукесер' },
        icon: '👣',
        bg: '#fffbeb',
    },
    {
        id: 'merei',
        title: { kk: 'Мерейтой', ru: 'Юбилей' },
        icon: '🎂',
        bg: '#f0fdf4',
    },
    {
        id: 'besik',
        title: { kk: 'Бесік той', ru: 'Бесік той' },
        icon: '👶',
        bg: '#fffbeb',
    },
];

export const categories = baseCategories.map((cat) => ({
    ...cat,
    count: getTemplateCountByCategory(cat.id),
}));