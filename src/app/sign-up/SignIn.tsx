import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInUser } from "./action";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = ({
  toggleSignUp,
}: {
  toggleSignUp: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      setIsLoading(true);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      await signInUser({ email, password });
      router.push("/");
    } catch (err) {
      console.error(`Error signing in ${(err as Error).message}`);
      setIsLoading(false);
    }
  }
  return (
    <main className="h-auto w-screen flex justify-center items-center py-10">
      <Card className="min-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </Field>

              {/* password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required name="password" />
              </Field>

              <FieldGroup>
                <Field>
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  <Button variant="outline" type="button">
                    Sign in with Google
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Create an account?
                    <button
                      onClick={() => toggleSignUp((prev) => !prev)}
                      className="ml-1 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignIn;
