"use client";

import { register } from "@/actions/auth/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/features/auth/schema/register";
import { Form } from "@base-ui/react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function RegisterForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      address: "",
      phonenumber: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("email", values.value.email);
        formData.append("username", values.value.username);
        formData.append("password", values.value.password);
        formData.append("confirmPassword", values.value.confirmPassword);
        formData.append("address", values.value.address);
        formData.append("phonenumber", values.value.phonenumber);
        console.log(formData);

        await register(formData);
        toast.success("Tài khoản được tạo thành công.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Đăng ký thất bại. Vui lòng kiểm tra thông tin của bạn và thử lại.",
        );
      }
    },
  });

  return (
    <Card className="w-full border-border/60 shadow-xl">
      <CardHeader className="space-y-3 border-b border-border/60 px-6 py-6">
        <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Đăng Ký
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tạo tài khoản của bạn
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Nhập thông tin của bạn dưới đây để bắt đầu.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-6">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup className="grid gap-5 md:grid-cols-2">
            <form.Field name="email">
              {(field) => (
                <Field className="md:col-span-1">
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@example.com"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="username">
              {(field) => (
                <Field className="md:col-span-1">
                  <FieldLabel htmlFor={field.name}>Tên người dùng</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Chọn tên người dùng"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="phonenumber">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="03xxxxxxxx"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="address">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Địa chỉ</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Địa chỉ đầy đủ của bạn"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tạo một mật khẩu"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nhập lại mật khẩu của bạn"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            onClick={() => form.handleSubmit()}
          >
            Tạo tài khoản
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border/60 px-6 py-5">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
