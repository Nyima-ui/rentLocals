"use client";
import { User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase";

const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }

  async function uploadImage(
    file: File,
    firstName: string
  ): Promise<string | null> {
    const filePath = `${firstName}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file);

    if (error) {
      console.error(
        `Error uploading profile picture to storage: ${error.message}`
      );
      return null;
    }

    const { data } = await supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    let avatar: string | null = null;
    if (profilePicture) {
      avatar = await uploadImage(profilePicture, firstName);
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            first_name: firstName,
            last_name: lastName,
            avatar,
          },
        },
      });
      if (error) {
        console.error(`Error signing up: ${error.message}`);
        return;
      }
      if (data.user && !data.session) {
        setIsVerifying(true);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error(`Error signing in: ${error.message}`);
        return;
      }else{
        router.push("/")
      }
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
            <CardTitle>
              {isSignUp ? "Register an account" : "Login to your account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth}>
              <FieldGroup>
                {isSignUp && (
                  <>
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
                  </>
                )}
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
                {isSignUp && (
                  <Field>
                    <FieldLabel htmlFor="Phone">Phone</FieldLabel>
                    <Input
                      id="Phone"
                      type="tel"
                      placeholder="+91"
                      name="phone"
                    />
                  </Field>
                )}
                {/* password */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                  />
                  {isSignUp && (
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  )}
                </Field>
                {isSignUp && (
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                    <FieldDescription>
                      Please confirm your password.
                    </FieldDescription>
                  </Field>
                )}
                <FieldGroup>
                  <Field>
                    <Button type="submit" className="cursor-pointer">
                      {isSignUp ? "Create Account" : "Sign In"}
                    </Button>
                    <Button variant="outline" type="button">
                      {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      {isSignUp
                        ? "Already have an account?"
                        : "Create an account?"}
                      <button
                        onClick={() => setIsSignUp((prev) => !prev)}
                        className="ml-1"
                      >
                        {isSignUp ? "Sign in" : "Sign up"}
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
