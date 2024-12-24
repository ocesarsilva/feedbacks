export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const siteId = (await params).id

  return <div>{siteId}</div>
}
