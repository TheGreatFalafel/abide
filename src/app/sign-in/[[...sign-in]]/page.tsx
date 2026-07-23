import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="screen" style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </main>
  )
}
