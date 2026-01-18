// import { createClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/client";

export async function uploadProfilePicture(
  file: File,
  firstName: string,
): Promise<string | null> {
  // const supabase = await createClient();
  const supabase = createClient();
  const filePath = `${firstName}-${Date.now()}`;

  const { error } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = await supabase.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export interface NewUserDetails {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export async function signUpUser(userDetails: NewUserDetails) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: userDetails.email,
    password: userDetails.password,
    options: {
      data: {
        phone: userDetails.phone,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        avatar: userDetails.avatar,
      },
    },
  });
  if (error) throw error;
  return data;
}

export interface UserDetails {
  email: string;
  password: string;
}

export async function signInUser(userDetails: UserDetails) {
  // const supabase = await createClient();
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: userDetails.email,
    password: userDetails.password,
  });
  if (error) throw error;
}
