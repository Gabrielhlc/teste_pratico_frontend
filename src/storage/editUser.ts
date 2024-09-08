import { User } from "@/app/users/list/page";
import { removeUserById } from "./removeUserById";
import { createUser } from "./createUser";

export function editUser(newUser: User) {
    removeUserById(newUser.id);

    createUser(newUser);
}