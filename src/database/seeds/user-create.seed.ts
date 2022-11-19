import { Connection, getManager,getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../auth/models/user.entity';
import { Roles } from '../../auth/roles.enum';
import * as bcrypt  from 'bcryptjs'
export class UserCreateSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // await getManager().query('TRUNCATE public.user');
		const admin = await getRepository(User).find({email:'admin@admin.com'});
		const users = await getRepository(User).find();
		if(users.length >2  ) return;
    await factory(User)().createMany(10);
		if(admin.length) return;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash('123456789', salt);
		await factory(User)().create({
			name: 'admin',
			email: 'admin@admin.com',
			password: hashedPassword,
			role: Roles.ADMIN,
		});
  }
}
