'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import * as yup from 'yup';
import { useFormik } from "formik";

import { User } from "../../list/page"

import { getUserById } from "@/storage/getUserById";
import { editUser } from "@/storage/editUser";
import { removeUserById } from "@/storage/removeUserById";


// Schema de validação do usuário a ser editado.
// -> Name é uma string obrigatória e precisa ter pelo menos 3 caracteres
// -> URL da imagem é uma string obrigatória e precisa iniciar com https ou data:image e finalizar com png, jpg, jpeg, gif, svg, bmp ou webp
// -> Company é uma string obrigatória  e segue o padrão das opções do select renderizado
// -> Role é uma string obrigatória e segue o padrão das opções do select renderizado
// -> Verified é um booleano que pode ser true ou falso
// -> Status é uma string obrigatória e segue o padrão das opções do select renderizado
const validationSchema = yup.object().shape({
    name: yup.string().required('Name required').min(3, (({ min }) => `The name must have at least ${min} characters`)),
    imageUrl: yup.string().matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|bmp|webp)|data:image\/(?:png|jpg|jpeg|gif|svg|bmp|webp);base64,.*)$/
        , "Invalid Url").required("Image required"),
    company: yup.string().oneOf(['Reliance', 'Opportunity', 'Hire you']).required(),
    role: yup.string().oneOf(['UI Designer', 'Hr Manager', 'Leader', 'Developer']).required(),
    verified: yup.bool(),
    status: yup.string().oneOf(['Active', 'Banned', 'Idle']).required(),
});

export default function Edit() {
    // Estado que mantém o valor descrito no checkbox de verified
    const [isVerified, setIsVerified] = useState<boolean>(false);

    // Click handler que altera o estado isVerified
    function handleIsVerified() {
        setIsVerified(!isVerified);
    }

    // Obtém o id do usuário pelo parâmetro da rota
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // Busca o usuário por id e obtém do localStorage 
    const user = getUserById(id);

    // na renderização inicial da página, atualiza o estado isVerified para o valor armazenado no usuário
    useEffect(() => {
        if (user) setIsVerified(user.verified)
    }, [])

    // Hook do formik para manipulação de dados e submissão do formulário de edição de usuário
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            id: user?.id,
            name: user?.name,
            imageUrl: user?.imageUrl,
            company: user?.company,
            role: user?.role,
            verified: user?.verified,
            status: user?.status,
        },

        validationSchema,
        onSubmit: (values, actions) => {
            const newUser: User = {
                id: values.id!,
                imageUrl: values.imageUrl!,
                name: values.name!.trim(),
                company: values.company!,
                role: values.role!,
                verified: isVerified,
                status: values.status!
            }

            editUser(newUser);

            router.push('/users/list');
            actions.resetForm();
        },
    });

    // Click handler que remove o usuário do localStorage e redireciona para a página de listagem de usuários
    function handleRemove(userId: string) {
        removeUserById(userId);
        router.push('/users/list');
    }

    // Click handler que redireciona de volta para a página de listagem de usuários
    function handleBackToList() {
        router.push('/users/list');
    }

    return (
        <div className="container flex flex-col bg-backgroundList p-3 xl:w-[25%] lg:w-[35%] sm:w-[60%] md:w-[50%] max-sm:w-[80%] rounded-lg">
            <div className="flex justify-between  w-full mb-8">
                <h1 className="font-bold text-2xl text-black">Edit User</h1>
                <button
                    className="btn btn-sm bg-warning border-0 text-white"
                    onClick={handleBackToList}
                >
                    Cancel
                </button>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="bg-listHeader p-4 rounded-xl drop-shadow-xl">
                    <div className=" flex flex-col  space-y-3">
                        <div className="flex flex-col">
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text text-lg text-black">Name</span>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange('name')}
                                    className={`input input-bordered bg-white drop-shadow-sm max-w-xs text-black ${errors.name && touched.name ? "input-error" : ""}`}
                                    onBlur={handleBlur('name')}
                                />
                                {errors.name && touched.name && <p className="text-red-700">{errors.name}</p>}
                            </label>
                        </div>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text text-lg text-black">Image</span>
                            </div>
                            <input
                                type="text"
                                name="imageUrl"
                                value={values.imageUrl}
                                onChange={handleChange('imageUrl')}
                                className={`input input-bordered bg-white drop-shadow-sm max-w-xs text-black ${errors.imageUrl && touched.imageUrl ? "input-error" : ""}`}
                                onBlur={handleBlur('imageUrl')}
                            />
                            {errors.imageUrl && touched.imageUrl && <p className="text-red-700">{errors.imageUrl}</p>}
                        </label>
                        <div className="avatar  max-w-xs justify-center">
                            <div className="w-24 rounded-full">
                                <Image alt="User image" src={values.imageUrl!} width={12} height={12} />
                            </div>
                        </div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-lg text-black">Company</span>
                            </div>
                            <select
                                className="select select-bordered bg-white drop-shadow-sm text-black"
                                name="company"
                                value={values.company}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="" disabled>Pick one</option>
                                <option value="Reliance">Reliance</option>
                                <option value="Opportunity">Opportunity</option>
                                <option value="Hire you">Hire you</option>
                            </select>
                            {errors.company && touched.company && <p className="text-red-700">{errors.company}</p>}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-lg text-black">Role</span>
                            </div>
                            <select
                                className="select select-bordered bg-white drop-shadow-sm text-black"
                                name="role"
                                value={values.role}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="" disabled>Pick one</option>
                                <option value="UI Designer">UI Designer</option>
                                <option value="Hr Manager">Hr Manager</option>
                                <option value="Leader">Leader</option>
                                <option value="Developer">Developer</option>
                            </select>
                            {errors.role && touched.role && <p className="text-red-700">{errors.role}</p>}
                        </label>

                        <label className="form-control w-fit flex flex-row items-center space-x-1">
                            <div className="label">
                                <span className="label-text text-lg text-black">Verified:</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={isVerified}
                                onChange={handleIsVerified}
                                className="checkbox border-slate-500 border-2 rounded-sm checkbox-sm checkbox-success"
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-lg text-black">Status</span>
                            </div>
                            <select
                                className="select select-bordered bg-white drop-shadow-sm text-black"
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="" disabled>Pick one</option>
                                <option value="Active">Active</option>
                                <option value="Banned">Banned</option>
                                <option value="Idle">Idle</option>
                            </select>
                            {errors.status && touched.status && <p className="text-red-700">{errors.status}</p>}
                        </label>
                    </div>
                    <div className="flex justify-between mt-10">
                        <button
                            className="btn btn-error text-white w-1/3"
                            onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}
                            type="button"
                        >
                            Delete
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-success w-1/3 text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box w-fit border-2 border-red-500 flex flex-col">
                    <div>
                        <h3 className="font-bold text-lg">Alert</h3>
                    </div>
                    <p className="py-4">Are you sure you want to delete this user? <br /> Press ESC or click outside to cancel</p>
                    <form method="dialog" className="flex justify-center">
                        <button className="btn btn-error w-1/2" onClick={() => handleRemove(user!.id)}>Delete</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}