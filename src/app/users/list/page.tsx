'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast, Toaster } from "sonner";
import debounce from 'lodash.debounce';

import { getUsers } from "@/storage/getUsers";
import { removeUserById } from "@/storage/removeUserById";

import { UserListItem } from "@/components/userListItem";

import { ArrowDown, Plus } from "phosphor-react";
import clipboard from '@/assets/Clipboard.png';


export type User = {
    id: string;
    name: string;
    imageUrl: string;
    company: string;
    role: string;
    verified: boolean;
    status: string;
}

export default function Home() {
    // Estado de usuários
    const [users, setUsers] = useState<User[]>([] as User[]);
    // Estado do termo de pesquisa
    const [searchTerm, setSearchTerm] = useState<string>("");
    // Estado dos usuários filtrados de acordo com o termo de pesquisa
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    // Estado do id do usuário a ser removido. torna-se nulo toda vez que um usuário foi removido ou a ação de remover foi cancelada durante o modal de confirmação de remoção
    const [userIdToRemove, setUserIdToRemove] = useState<string | null>(null);
    // Estado da ordenação por nome
    const [isAscending, setIsAscending] = useState<boolean>(true);
    // Estado de carregamento
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();

    // useEffect que busca os usuários do localStorage e os guarda ordenado no estado filteredUsers
    useEffect(() => {
        setIsLoading(true);

        const data = getUsers();
        const sortedUsers = data.sort((a: User, b: User) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);

        setIsLoading(false);
    }, [isLoading]);

    // Debounce da pesquisa. Só faz a filtragem após uma breve pausa de digitação do usuário.
    const debouncedFilter = useCallback(
        debounce((term) => {
            const lowerCaseSearchTerm = term.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                user.company.toLowerCase().includes(lowerCaseSearchTerm) ||
                user.role.toLowerCase().includes(lowerCaseSearchTerm) ||
                (lowerCaseSearchTerm.includes('yes') && user.verified) ||
                (lowerCaseSearchTerm.includes('no') && !user.verified) ||
                user.status.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredUsers(filtered);
        }, 300),
        [users]
    );

    // Ativa debouncedFilter sempre que o searchTerm é alterado.
    useEffect(() => {
        debouncedFilter(searchTerm);
    }, [searchTerm, debouncedFilter]);

    // Click handler que altera o estado do searchTerm quando o usuário digita no input de pesquisa
    function handleSearchChange(e: any) {
        setSearchTerm(e.target.value);
    }

    // Click handler que Redireciona para a página de criação de usuário
    function handleCreateUser() {
        router.push('/users/create');
    }

    // Ordena o estado de usuários de acordo com a ordenação passada
    function sortUsers(users: User[], ascending: boolean) {
        const sortedUsers = users.sort((a: User, b: User) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        setUsers([...sortedUsers]);
    }

    // Click handler que altera a ordem atual e chama sortUsers com esta nova ordem
    function handleToggleSortUsersOrder() {
        setIsAscending(!isAscending);
        sortUsers(users, !isAscending);
    }

    // Click handler que redireciona para a página de edição de usuário de acordo com o id do usuário
    function handleEdit(userId: string) {
        router.push(`/users/edit/${userId}`)
    }

    // Click handler que remove o usuário de acordo com o estado userIdToRemove
    function handleRemove() {
        if (userIdToRemove) {
            const updatedUsers = users.filter(user => user.id !== userIdToRemove);
            setUsers(updatedUsers);
            removeUserById(userIdToRemove);

            toast.success('User successfully Deleted!');
            setUserIdToRemove(null)
        }
    }

    // Altera o estado do usuário a ser removido de acordo com o id e abre o modal de confirmação de remoção do usuário
    function openDeleteModal(userId: string) {
        setUserIdToRemove(userId);
        (document.getElementById('delete_modal') as HTMLDialogElement).showModal();
    }

    return (
        <div className="container flex flex-col bg-backgroundList p-3 lg:w-[75%] sm:w-full sm:max-w-screen rounded-lg">
            <div className="flex justify-between w-full mb-12">
                <h1 className="font-bold text-2xl text-black">User</h1>
                <button
                    className="btn btn-sm bg-blue-700 border-0 text-white"
                    onClick={handleCreateUser}
                >
                    <Plus weight="bold" />New User
                </button>
            </div>
            <div className="join join-vertical drop-shadow-lg">
                <div className="w-full bg-white p-5 rounded-t-xl join-item">
                    <label className="input input-bordered flex items-center gap-2 bg-white w-fit drop-shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e)}
                            className="grow text-black"
                            placeholder="Search user..."
                        />
                    </label>
                </div>

                <div className="mb-6 join-item max-h-[600px] overflow-y-scroll no-scrollbar">
                    <div className=" bg-listHeader p-4 flex ">
                        <div className="flex space-x-6 w-[25%] items-center">
                            <input type="checkbox" className="checkbox border-slate-500 border-2 rounded-sm checkbox-sm" />
                            <span className="text-black text-md font-semibold flex space-x-1">
                                <span>Name</span>
                                <div className="tooltip flex items-center tooltip-accent" data-tip="change order">
                                    <button onClick={handleToggleSortUsersOrder} className="focus:outline-none flex items-center transform transition-transform duration-300">
                                        <span className={`inline-block transform transition-transform duration-300 ${isAscending ? 'rotate-0' : '-rotate-180'}`}>
                                            <ArrowDown weight="bold" size={16} />
                                        </span>
                                    </button>
                                </div>
                            </span>
                        </div>
                        <div className="w-[25%]">
                            <span className="text-md text-gray-500">Company</span>
                        </div>
                        <div className="w-[25%]">
                            <span className="text-md text-gray-500">Role</span>
                        </div>
                        <div className="flex space-x-14 w-[25%]">
                            <span className="text-md text-gray-500">Verified</span>
                            <span className="text-md text-gray-500">Status</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center my-12">
                            <span className="loading loading-bars text-primary loading-lg flex justify-center" />
                        </div>
                    ) :
                        <div className="">
                            {users.length > 0 ? filteredUsers.map(user => {
                                return (
                                    <UserListItem
                                        key={user.id}
                                        user={user}
                                        editUser={handleEdit}
                                        openDeleteModal={openDeleteModal}
                                    />
                                )
                            }) : (
                                <div className="flex flex-col space-y-2 items-center mt-8">
                                    <Image src={clipboard} alt="empty list icon" />
                                    <p className="text-center">Empty List<br /> Add the first user!</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
            <dialog id="delete_modal" className="modal">
                <div className="modal-box w-fit border-2 border-red-500 flex flex-col">
                    <div>
                        <h3 className="font-bold text-lg">Alert</h3>
                    </div>
                    <p className="py-4">Are you sure you want to delete this user? <br /> Press ESC or click outside to cancel</p>
                    <form method="dialog" className="flex justify-center">
                        <button className="btn btn-error w-1/2" onClick={handleRemove}>Delete</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <Toaster richColors />
        </div>
    );
}
