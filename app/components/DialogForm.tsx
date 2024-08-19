"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
const FormSchema = z.object({
    date:z.date({message:"Please enter a valid date"}),
    amount:z.coerce.number({message:"please enter a valid number"}).min(0.1,{message:"please write more than 0.1"}).max(100000,{message:"above 1 lakh not supported yet!"}),
    account:z.union([z.literal("Accounts"),z.literal("Cash")]),
    note:z.string({message:"expected a string"})
    // amount:z.string({message})
  })
  
export function DialogForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            account:'Accounts'
            
        //   amount:0,
        //   date: new Date()
        },
      })
    
      function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
      }
    const [checked,setChecked] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-2 right-2 h-8 w-8 rounded-full text-xl lg:text-3xl lg:h-16 lg:w-16 bg-blue-600 text-white m-4">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{checked?"Income":"Expenses"}</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
      <Switch id="mode" onCheckedChange={(e)=>setChecked(p=>!p)}/>
      <Label htmlFor="mode">{checked?"Income":"Expenses"}</Label>
    </div>
    <div className="flex justify-between items-center">
        <span>Date</span>
        <span>{new Date().toLocaleDateString().toString()}</span>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
       
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Input placeholder="Accounts / Cash" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input placeholder="banana juice" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
            </div> */}
        <DialogFooter className="flex justify-end items-center">
          <Button type="submit" className={`${checked?`bg-blue-600`:`bg-orange-600`} text-white mt-4`}>Save</Button>
        </DialogFooter>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  )
}

