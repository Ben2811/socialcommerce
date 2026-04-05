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
import { loginSchema } from "@/features/auth/schema";
import { Form } from "@base-ui/react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function LoginForm() {
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
        const formData = new FormData();
        formData.append("email", values.value.email);
        formData.append("password", values.value.password);

        await login(formData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Login failed. Please check your credentials and try again.",
        );
      }
    },
  });

  return (
    <Card className="w-full border-border/60 shadow-xl">
      <CardHeader className="space-y-3 border-b border-border/60 px-6 py-6">
        <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Login
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter your email and password to continue.
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
          <FieldGroup className="grid gap-5">
            <form.Field name="email">
              {(field) => (
                <Field>
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
            Login
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border/60 px-6 py-5">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
