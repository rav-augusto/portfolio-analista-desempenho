import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar userEmail={user.email || ''} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
