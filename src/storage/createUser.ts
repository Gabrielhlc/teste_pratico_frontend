import { User } from "@/app/users/list/page";
import { getUsers } from "./getUsers";

export function createUser(newUser: User) {
    const storedUsers = getUsers();

    const storage = JSON.stringify([...storedUsers, newUser]);
    window.localStorage.setItem('USER', storage);
}