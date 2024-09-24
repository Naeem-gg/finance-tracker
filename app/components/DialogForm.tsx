"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const FormSchema = z.object({
  date: z.string().nonempty({ message: "Please enter a valid date" }),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.1, { message: "Please write more than 0.1" })
    .max(100000, { message: "Above 1 lakh not supported yet!" }),
  account: z.string().nonempty({ message: "Please select an account" }),
  note: z.string().nonempty({ message: "Please enter a note" }),
  type: z.enum(["Income", "Expenses"]),
});

type FormData = z.infer<typeof FormSchema>;

type Transaction = {
  id: string;
  date: string;
  amount: number;
  account: string;
  note: string;
  type: "Income" | "Expenses";
  createdAt: string;
  updatedAt: string;
};

export function DialogForm() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
      account: "",
      note: "",
      date: new Date().toISOString().split('T')[0],
      type: "Expenses",
    },
  });

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transactions");
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data, "data");
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        setTransactions([]);
        toast({
          title: "Error",
          description: "Failed to fetch transactions. Please try again later.",
          variant: "destructive",
        });
      }
    }

    fetchTransactions();
  }, []);

  const onSubmit = async (data: FormData) => {
    {/**
      // for testing
      toast({
          title: "Transaction added",
          description: "Your transaction has been added successfully.",
        });
        setTransactions(prev => [...prev, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
        form.reset();
        setChecked(false);
        setOpen(false);
     */}
    try {
      const formData = {
        ...data,
        amount: Number(data.amount),
        type: checked ? "Income" : "Expenses",
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log(response, "response");
      if (response.status === 201) {
        const newTransaction = await response.json();
        toast({
          title: "Transaction added",
          description: "Your transaction has been added successfully.",
        });
        form.reset();
        setChecked(false);
        setOpen(false);
        setTransactions(prev => [...prev, newTransaction]);
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-2 right-2 h-16 w-16 rounded-full text-xl lg:text-3xl lg:h-16 lg:w-16 bg-blue-600 text-white m-4"
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{checked ? "Income" : "Expenses"}</DialogTitle>
            <DialogDescription>
              Make changes to your account here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <Switch
              id="mode"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <Label htmlFor="mode">{checked ? "Income" : "Expenses"}</Label>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Accounts / Cash"
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="banana juice"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-end items-center">
                <Button
                  type="submit"
                  className={`${checked ? `bg-blue-600` : `bg-orange-600`} text-white mt-4`}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>{transaction.note}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
