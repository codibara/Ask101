export default async function PostDetail({
    params,
  }: {
    params: Promise<{ slug: number }>
  }) {
    const { slug } = await params
    return <div>My Post: {slug}</div>
  }