import WorkspaceClient from "@/components/WorkspaceClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const WorkSpacePage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <WorkspaceClient />;
};

export default WorkSpacePage;
