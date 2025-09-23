"use server";

import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/api";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function ListExperiencesDialog() {
    const experiences = JSON.parse(await getExperiencesDTO());

    return (
        <table className="w-full border-collapse table-auto h-fit">
            <thead className="sr-only">
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody className="">
                {experiences.map((exp: Experience) => (
                    <tr
                        key={exp.slug}
                        className="group border-b hover:bg-muted h-[120px]"
                    >
                        <td>
                            <div className="relative w-[100px] h-[100px]">
                                <Image
                                    src={exp.featured_image}
                                    alt={exp.slug + " featured image"}
                                    fill={true}
                                    sizes={"(max-width: 100px)"}
                                    className={"object-cover"}
                                />
                            </div>
                        </td>
                        <td>
                            <Link
                                href={`/${exp.slug}/map`}
                                className={
                                    "ml-5 flex flex-col h-full justify-center"
                                }
                            >
                                <p
                                    className={
                                        "font-bold group-hover:underline"
                                    }
                                >
                                    {exp.title}
                                    <SquareArrowOutUpRight
                                        className={
                                            "size-3 inline-block ml-1 align-top"
                                        }
                                    />
                                </p>
                                <p className={"font-light"}>{exp.subtitle}</p>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
