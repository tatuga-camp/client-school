import React from "react";

function Index() {
  return <div>Index</div>;
}

export default Index;

export async function getServerSideProps(ctx) {
  return {
    redirect: {
      permanent: false,
      destination: "/school/dashboard",
    },
  };
}
