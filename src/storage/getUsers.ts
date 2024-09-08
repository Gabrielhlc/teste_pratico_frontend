import { User } from "@/app/users/list/page";

export function getUsers() {
    const storage = window.localStorage.getItem('USER');

    const users: User[] = storage ? JSON.parse(storage) : [];

    return users;
}