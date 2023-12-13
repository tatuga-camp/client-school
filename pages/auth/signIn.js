import AuthButton from "@/components/auth/button";
import Loading from "@/components/loading/loading";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";

function SignIn() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  if (user.data) {
    Swal.fire({
      title: "กำลังพาไปยัง dashboard",
      html: "รอสักครู่นะครับ...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    router.push("/school/dashboard?redirect=success");
  }
  if (user.isLoading) {
    <div className="w-screen h-screen flex font-Poppins items-center justify-center gap-3 flex-col from-blue-100 to-blue-50 bg-gradient-to-t">
      <Loading />
    </div>;
  }
  return (
    <div className="w-screen h-screen flex font-Poppins items-center justify-center gap-3 flex-col from-blue-100 to-blue-50 bg-gradient-to-t">
      <span className="text-2xl">Please Login</span>
      <AuthButton />
    </div>
  );
}

export default SignIn;
