import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="screen" style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </main>
  )
}
