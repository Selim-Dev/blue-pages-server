import { Page } from './../../pages/page.entity';
import { Category } from './../../categories/category.entity';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import { define } from 'typeorm-seeding';
define(Page, () => {
  const page = new Page();
  page.title_en = randFullName();
  page.title_ar = randFullName();
  page.slug = randFullName();
  page.content = randFullName();
  return page;
});
