import { getUsers } from "./getUsers";

export function getUserById(userId: string) {
    const storedUsers = getUsers();

    const user = storedUsers.find(user => user.id === userId);

    return user;
}