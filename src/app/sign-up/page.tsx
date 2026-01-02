"use client";
import { Form, User } from "lucide-react";
import { useState } from "react";
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

const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }

  async function handleImageUpload() {}
  async function handleUploadUserData() {}
  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget)

  }

  return (
    <main className="h-auto w-screen flex justify-center items-center py-10">
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
                />
              </Field>
              {/* phone number  */}
              {isSignUp && (
                <Field>
                  <FieldLabel htmlFor="Phone">Phone</FieldLabel>
                  <Input id="Phone" type="number" placeholder="+91" />
                </Field>
              )}
              {/* password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
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
                  <Button type="submit">
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
    </main>
  );
};

export default SignUp;
