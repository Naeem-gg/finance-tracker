"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardFooter,CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { signIn } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"

export const FormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cpassword: z.string(),
  email: z.string().email("Invalid email address")
}).refine((data) => data.password === data.cpassword, {
  message: "Passwords don't match",
  path: ["cpassword"],
})

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export default function Signup() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      cpassword: "",
      email: "",
    },
    
  })
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
    
  })
const [isLoading,setIsLoading] = useState(0)
const { toast } = useToast()
 async function onSubmit(data: z.infer<typeof FormSchema>) {
  setIsLoading(1)
   const res = await fetch(`/api/users/signup`,{method:"POST",body:JSON.stringify(data),headers:{
    "Content-type": "application/json;"
   }})
   if(res.status === 200){
    toast({
      variant:"default",
      title: `Congratulations ${data.username} `,
      description: "New account has been created, please proceed to login"

    })
  }
   else toast({
      variant:"destructive",
      title:"Uhh ohh!!",
      description:"Hold tight, looks like something went wrong let us check."
    })  
    setIsLoading(2)
  }
  const router = useRouter()
const processLogin = async(data:z.infer<typeof loginFormSchema>)=>{
  setIsLoading(1)
  const res = await signIn("credentials",{email:data.email,password:data.password,redirect:false, callbackUrl:"/"})
  setIsLoading(0)
  if(res?.status!==200){
    toast({
      variant:"destructive",
      title:"Uhh ohh!!",
      description:"looks like you entered wrong email or password."
    })  
  }else {toast({
    variant:"default",
    title:"Success",
    description:"Successfully logged in. Yayy!"
  })  
  router.push("/")}
}
  return (
    <div className="mx-auto max-w-[400px] space-y-6">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 rounded-xl bg-muted p-1">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
            </CardHeader>
            <Form {...loginForm}>
<form onSubmit={loginForm.handleSubmit(processLogin)}>

            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <Input id="loginEmail" type="text" placeholder="Enter email" />
              </div> */}
              <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              {/* <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input id="loginPassword" type="password" placeholder="Enter password" />
              </div> */}
              <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Create a password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading ===1}>{isLoading!==1?"Sign In":"wait"}</Button>
            </CardFooter>
</form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create a new account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Create a password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm your password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading === 1}>{isLoading===0|| isLoading===2?"Sign Up":isLoading===1 &&"please wait"}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}