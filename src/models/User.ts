import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, OneToMany} from 'typeorm'
import UserHistory from "./UserHistory";

@Entity("tb_user")
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    email: string
    @Column()
    password:string
    @OneToMany(() => UserHistory, (history) => history.user)
    @JoinColumn({name: 'id_usuario'})
    history: UserHistory

    static async findById(id: number) {
        const builder = this.createQueryBuilder('u')
            .where('u.id = :id', {id: id})

        return await builder
            .getOne();
    }
    static async findByEmail(email: string) {
        const builder = this.createQueryBuilder('u')
            .where('u.email = :email', {email: email})

        return await builder
            .getOne();
    }
}

export default User
