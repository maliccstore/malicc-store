import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home');
  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-400">
  //     <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
  //       <Link href="/explore" style={{ color: 'blue' }}>
  //         Explore me
  //       </Link>

  //       <BlogPage />
  //     </main>
  //   </div>
  // );
}
