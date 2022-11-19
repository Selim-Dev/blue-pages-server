import { Category } from './../../categories/category.entity';
import { Connection, getManager,getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';


export class CategoryCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
		const categories = await getRepository(Category).find();
		if(categories.length) return;


    await factory(Category)().createMany(5);
  }
}
