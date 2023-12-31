import React, { useEffect, useState } from "react";

import { parseCookies } from "nookies";
import { Pagination, Skeleton } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../../layouts/tatugaSchoolLayOut";
import SchoolOnly from "../../../../components/error/schoolOnly";
import Unauthorized from "../../../../components/error/unauthorized";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../../../data/school/menubarsHomepage";
import { GetUserCookie } from "../../../../service/user";
import { GetAllClassroom } from "../../../../service/school/classroom";

function Index({ user, error }) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai;
    } else if (user?.language === "English") {
      return sideMenusEnglish;
    }
  });
  const classrooms = useQuery(
    ["classrooms", page],
    () => GetAllClassroom({ page: page }),
    { keepPreviousData: true }
  );

  useEffect(() => {
    classrooms.refetch();
  }, []);
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  } else if (error?.statusCode === 403) {
    return <SchoolOnly user={user} />;
  }

  return (
    <Layout sideMenus={sideMenus} user={user}>
      <main className="w-full flex justify-start gap-10 py-5 items-center flex-col">
        <div className="w-11/12  grid grid-cols-8 gap-5">
          {classrooms?.data?.classrooms?.map((classroom) => {
            return (
              <Link
                href={`/school/dashboard/classrooms/teacher/${classroom.user.id}/classroom/${classroom.id}`}
                key={classroom.id}
                className="bg-white rounded-md hover:scale-105  transition duration-150
               overflow-hidden no-underline ring-2 ring-black text-black  col-span-2 relative h-60 flex flex-col"
              >
                <div
                  className="w-20 h-20 bg-blue-100 text-blue-500 flex items-center 
                justify-center absolute right-5 top-0 bottom-2 overflow-hidden rounded-full m-auto "
                >
                  {classrooms.isFetching ? (
                    <Skeleton />
                  ) : classroom.user.picture ? (
                    <Image
                      src={classroom.user.picture}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw"
                    />
                  ) : (
                    <span className="font-bold text-2xl uppercase">
                      {classroom.user.firstName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="w-full h-3/6 bg-blue-400 flex flex-col items-center justify-center">
                  <div className="w-11/12 truncate text-left">
                    {classrooms.isFetching ? (
                      <Skeleton variant="rectangular" width={100} height={30} />
                    ) : (
                      <span className="font-Kanit font-semibold text-2xl text-white">
                        {classroom.title}
                      </span>
                    )}
                    <div className="flex flex-col truncate text-white">
                      <span>{classroom.level}</span>
                      <span>{classroom?.description}</span>
                    </div>
                  </div>
                </div>
                <div className="flex bg-slate-50  justify-start items-start w-full h-3/6  ">
                  <div className="flex flex-col ml-5 truncate w-8/12 mt-5 text-left text-slate-700">
                    <span className="font-semibold">
                      สอนโดย {classroom?.user.firstName}{" "}
                      {classroom?.user?.lastName}
                    </span>
                    <span className="font-light">{classroom?.user.email}</span>
                    <span>{classroom?.user?.phone}</span>
                    <span>{classroom?.user?.school}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Pagination
          count={classrooms?.data?.totalPages}
          onChange={(e, page) => setPage(page)}
        />
      </main>
    </Layout>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.NEXT_PUBLIC_CLIENT_MAIN_URL}/auth/signIn`,
      },
    };
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      if (user.role !== "SCHOOL") {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: "schoolUserOnly",
            },
          },
        };
      } else if (user.role === "SCHOOL") {
        return {
          props: {
            user,
          },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_CLIENT_MAIN_URL}/auth/signIn`,
        },
      };
    }
  }
}
