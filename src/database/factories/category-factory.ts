import { Category } from './../../categories/category.entity';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import { define } from 'typeorm-seeding';
define(Category, () => {
  const category = new Category();
  category.name_en = randFullName();
  category.name_ar = randFullName();
  return category;
});
