// import { client, urlFor } from "@/lib/sanity";
// import Link from "next/link";
// import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { Leaf } from "lucide-react";

// interface Props {
//     params: Promise<{ slug: string }>;
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//     const { slug } = await params;
//     const category = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
//     if (!category) return { title: "Collection Not Found" };
//     return { title: `${category.title} | Dolakha ` };
// }

// export default async function CategoryPage({ params }: Props) {
//     const { slug } = await params;

//     const data = await client.fetch(
//         `{
//       "category": *[_type == "category" && slug.current == $slug][0],
//       "products": *[_type == "product" && category->slug.current == $slug] | order(_createdAt desc)
//     }`,
//         { slug }
//     );

//     if (!data.category) notFound();

//     return (
//         <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">

//         </div>
//     );
// }

import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

import Image from "next/image";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BulletinPage({ params }: Props) {
    const { slug } = await params;
    const data = await client.fetch(`*[_type == "bulletin" && slug.current == $slug][0]`, { slug });
    return (
        <div className="container mx-auto px-6 flex flex-col gap-6 items-center pt-32 pb-20 font-sans text-[#3d2b1f] bg-[#fdfaf5] min-h-screen overflow-x-hidden">
            <div className="image ">
                <Image
                    src={urlFor(data.mainImage).width(100).url()}
                    alt={data.title}
                    width={500}
                    height={500}
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    priority
                />
            </div>
            <div className="title">
                {data.title}
            </div>
            <div className="flex items-center gap-6">


                <div className="content font-sans text-[#3d2b1f]">
                    {data.content}
                </div>

            </div>
            <div className="button flex justify-center items-center ml-6 mr-6 py-6 px-12 rounded-full bg-[#a3573a] text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-700 shadow-xl">
                <button>
                    <Link href="/shop">Shop Now</Link>
                </button>
            </div>
        </div>
    );
}

