import Image from "next/image";

import { User } from "@/app/users/list/page";

import { DotsThreeOutlineVertical, PencilSimple, TrashSimple } from "phosphor-react";

type Props = {
    user: User;
    editUser: (userId: string) => void;
    openDeleteModal: (userId: string) => void;
}

export function UserListItem({ user, editUser, openDeleteModal }: Props) {
    return (
        <>
            <div key={user.id} className="bg-white p-4 flex border-b-[1px] last:join-item items-center">
                <div className="flex  w-[25%] overflow-hidden items-center">
                    <input type="checkbox" className="checkbox border-slate-500 border-2 rounded-sm checkbox-sm" />
                    <div className="avatar ml-3 max-w-xs justify-center">
                        <div className="w-14 rounded-full">
                            <Image alt="User image" src={user.imageUrl} width={12} height={12} />
                        </div>
                    </div>
                    <span className="text-black text-md ml-2 font-semibold">{user.name}</span>
                </div>
                <div className="w-[25%]">
                    <span className="text-md text-black">{user.company}</span>
                </div>
                <div className="w-[25%]">
                    <span className="text-md text-black" >{user.role}</span>
                </div>
                <div className="flex w-[25%] items-center">
                    <span className="text-md text-black">{user.verified ? "Yes" : "No"}</span>
                    <div
                        className={`badge ${user.status === "Active" ? "bg-green-100 text-green-500" : (user.status === "Banned" ? "bg-red-100 text-red-700" : "bg-warning text-yellow-700")} font-bold border-0 h-6 rounded-md ml-20 min-w-[67.7px]`}
                    >
                        {user.status}
                    </div>

                    <div className="dropdown dropdown-top dropdown-end ml-auto">
                        <div
                            tabIndex={0}
                            role="button"
                            className="bg-white border-0 m-1"
                        >
                            <DotsThreeOutlineVertical size={16} />
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-slate-700 rounded-box z-10 w-52 p-2 shadow font-bold"
                        >
                            <li><a onClick={() => editUser(user.id)}><PencilSimple weight="bold" />Edit</a></li>
                            <li><a onClick={() => openDeleteModal(user.id)}><TrashSimple weight="bold" />Delete</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}