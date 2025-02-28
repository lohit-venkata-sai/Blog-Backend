import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";

const createRandomizedUsers = async () => {
    try {
        const user = new User({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            userId: faker.string.uuid(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            avatar: faker.image.avatar(),
            bio: faker.lorem.sentence(),
        })
        await user.save();
    } catch (error) {
        console.log('error at faker', error.message);
    }
}



export { createRandomizedUsers }