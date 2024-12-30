export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const workspaceId = (await params).id

  return <div className="w-full grid gap-5 pb-10 pt-3" />
}
