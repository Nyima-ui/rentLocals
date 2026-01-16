import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { SetStateAction, useState } from "react";
import { uploadProfilePicture } from "./action";
import { signUpUser } from "./action";
import { useRouter } from "next/navigation";

const SignUp = ({
  toggleSignIn,
}: {
  toggleSignIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const phone = formData.get("phone") as string;
      const firstName = formData.get("first-name") as string;
      const lastName = formData.get("last-name") as string;
      let avatar: string | null = null;
      if (profilePicture) {
        avatar = await uploadProfilePicture(profilePicture, firstName);
      }
      const data = await signUpUser({
        email,
        password,
        phone,
        firstName,
        lastName,
        avatar,
      });
      if (data.user && !data.session) {
        setIsVerifying(true);
        return;
      }
      router.push("/");
    } catch (err) {
      console.error(`Error signing up: ${(err as Error).message}`);
    }
  }
  return (
    <main className="h-auto w-screen flex justify-center items-center py-10">
      {isVerifying ? (
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle>Please check your Email</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle>Register an account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                {/* profile picture  */}
                <Field>
                  <FieldLabel htmlFor="picture">Profile Picture</FieldLabel>
                  <Avatar className="size-15! flex items-center justify-center bg-gray-500 rounded-lg overflow-hidden">
                    {avatarPreview ? (
                      <AvatarImage
                        src={avatarPreview}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="text-white size-10 rounded-2xl" />
                    )}
                  </Avatar>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Field>
                {/* first name  */}
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    name="first-name"
                    required
                  />
                </Field>
                {/* last name  */}
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    name="last-name"
                    required
                  />
                </Field>

                {/* email  */}
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
                {/* phone number  */}
                <Field>
                  <FieldLabel htmlFor="Phone">Phone</FieldLabel>
                  <Input id="Phone" type="tel" placeholder="+91" name="phone" />
                </Field>

                {/* password */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                  />

                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field>

                <FieldGroup>
                  <Field>
                    <Button type="submit" className="cursor-pointer">
                      Create Account
                    </Button>
                    <Button variant="outline" type="button">
                      Sign up with Google
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account?
                      <button
                        onClick={() => toggleSignIn((prev) => !prev)}
                        className="ml-1 cursor-pointer"
                      >
                        Sign in
                      </button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default SignUp;
