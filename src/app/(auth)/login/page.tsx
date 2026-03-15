"use client";

import { login } from "@/actions/auth/login";
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
import { loginSchema } from "@/lib/shared/schema/login";
import { Form } from "@base-ui/react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async (values) => {
      try {
        console.log("Submitting form with values:", values.value);
        const formData = new FormData();
        formData.append("email", values.value.email);
        formData.append("password", values.value.password);
        await login(formData);
      } catch (error) {
        toast.error(
          "Login failed. Please check your credentials and try again.",
        );
      }
    },
  });
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="my-20 w-full max-w-md p-8">
        <CardHeader></CardHeader>
        <CardContent>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      // 3. Use handleChange for proper validation tracking
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your email"
                    />
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your password"
                    />
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            onClick={() => form.handleSubmit()}
          >
            Login
          </Button>
          <Button variant="link" className="w-full border border-border">
            <Link href="/register">Register</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
