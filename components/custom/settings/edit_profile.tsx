// components/custom/settings/EditProfile.jsx
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import ProfilePicture from "@/components/custom/settings/profile_picture";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfile() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Edit Profile values:", values);
  };

  return (
    <div className="profile flex flex-col items-center justify-between h-auto min-h-[400px] sm:min-h-[594px] gap-3 sm:gap-4 md:gap-[12px] text-[14px] lg:w-1/3">
      <div className="PPcontianer flex items-center justify-center pt-4">
        <ProfilePicture size="lg" editable={true} />
      </div>

      <div className="fields w-full p-4 sm:p-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[14px]">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      className="w-full bg-[#3D4142] border-none px-3 py-1"
                      placeholder="Username"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[14px]">Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      className="w-full bg-[#3D4142] border-none px-3 py-1"
                      placeholder="m@example.com"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[14px]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      className="w-full bg-[#3D4142] border-none px-3 py-1"
                      placeholder="**********"
                      type="password"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="btns flex flex-col gap-2 sm:gap-[10px] w-full mt-6 sm:mt-8 px-4 sm:px-0">
        <Button className="w-full py-3 sm:py-4 px-4 bg-[#71717A]">
          Edit Profile
        </Button>
        <Button className="w-full py-3 sm:py-4 px-4 bg-[#84CC16]">
          Logout
        </Button>
      </div>
    </div>
  );
}
