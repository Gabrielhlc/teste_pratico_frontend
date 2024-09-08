import { getUsers } from "./getUsers";

export function removeUserById(userId: string) {
    const storedUsers = getUsers();

    const filteredUsers = storedUsers.filter(user => user.id !== userId);

    window.localStorage.setItem('USER', JSON.stringify(filteredUsers));
}