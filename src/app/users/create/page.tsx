'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import * as yup from 'yup';
import { useFormik } from "formik";
import { v4 } from 'uuid';

import { User } from "../list/page";
import { createUser } from "@/storage/createUser";


// Schema de validação do usuário a ser criado.
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

export default function Create() {
    // Estado que mantém o valor descrito no checkbox de verified
    const [isVerified, setIsVerified] = useState<boolean>(false);

    // Click handler que altera o estado isVerified
    function handleIsVerified() {
        setIsVerified(!isVerified);
    }

    // Hook do formik para manipulação de dados e submissão do formulário de criação de usuário
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            id: v4(),
            name: "",
            imageUrl: "https://www.svgrepo.com/show/5125/avatar.svg",
            company: "",
            role: "",
            verified: isVerified,
            status: "",
        },
        validationSchema,
        onSubmit: (values, actions) => {
            const newUser: User = {
                id: values.id,
                name: values.name.trim(),
                imageUrl: values.imageUrl.trim(),
                company: values.company,
                role: values.role,
                verified: isVerified,
                status: values.status
            }

            createUser(newUser);

            router.push('/users/list');
            actions.resetForm();
        },
    });

    const router = useRouter();

    function handleBackToList() {
        router.push('/users/list');
    }

    return (
        <div className="container flex flex-col bg-backgroundList p-3 xl:w-[25%] lg:w-[35%] sm:w-[60%] md:w-[50%] max-sm:w-[80%] rounded-lg">
            <div className="flex justify-between  w-full mb-8">
                <h1 className="font-bold text-2xl text-black">Add User</h1>
                <button
                    className="btn btn-sm bg-blue-700 border-0 text-white"
                    onClick={handleBackToList}
                >
                    Back to List
                </button>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="bg-listHeader p-4 rounded-xl drop-shadow-xl">
                    <div className=" flex flex-col space-y-3">
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
                                <Image alt="User image" src={values.imageUrl} width={12} height={12} />
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
                    <button type="submit" disabled={isSubmitting} className="btn btn-success w-1/2  mt-10 text-white">Save</button>
                </div>
            </form>
        </div>
    )
}