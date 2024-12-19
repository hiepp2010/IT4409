import { notFound } from 'next/navigation'

function getCategoryData(slug: string) {
  const categories = {
    'sneakers': { name: 'Sneakers' },
    // ... other categories
  }
  return categories[slug as keyof typeof categories]
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  const category = getCategoryData(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      <p>This is the {category.name} category page. Add your product listings here.</p>
    </div>
  )
}

