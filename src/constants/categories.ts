export interface CategoryConstant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export const categories: CategoryConstant[] = [
  {
    id: '1',
    name: 'Điện tử',
    slug: 'dien-tu',
    description: 'Các sản phẩm điện tử',
  },
  {
    id: '2',
    name: 'Thời trang',
    slug: 'thoi-trang',
    description: 'Quần áo và phụ kiện thời trang',
  },
  {
    id: '3',
    name: 'Sách',
    slug: 'sach',
    description: 'Sách và tạp chí',
  },
  {
    id: '4',
    name: 'Gia dụng',
    slug: 'gia-dung',
    description: 'Các sản phẩm gia dụng',
  },
  {
    id: '5',
    name: 'Thể thao',
    slug: 'the-thao',
    description: 'Thiết bị thể thao và fitness',
  },
];
