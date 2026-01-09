"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How do I return an item?",
        answer:
            "To return an item, go to your Orders page, select the order you wish to return, and click on the 'Return Item' button. Follow the instructions to print your shipping label.",
    },
    {
        question: "When will I receive my refund?",
        answer:
            "Refunds are processed within 5-7 business days after we receive your return. The funds will be returned to your original payment method.",
    },
    {
        question: "Do you ship internationally?",
        answer:
            "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on your location.",
    },
    {
        question: "How can I track my order?",
        answer:
            "Once your order ships, you will receive an email with a tracking number. You can also view the status of your order in your account under 'Orders'.",
    },
    {
        question: "Can I cancel or change my order?",
        answer:
            "We process orders quickly, but if you need to make changes, please contact our support team within 1 hour of placing your order.",
    },
];

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof Accordion.Item>,
    React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
        className={`mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 ${className}`}
        {...props}
        ref={forwardedRef}
    >
        {children}
    </Accordion.Item>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof Accordion.Trigger>,
    React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
        <Accordion.Trigger
            className={`
        group flex flex-1 cursor-default items-center justify-between bg-white px-5 py-4 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-gray-200 outline-none hover:bg-gray-50 
        ${className}
      `}
            {...props}
            ref={forwardedRef}
        >
            {children}
            <ChevronDown
                className="text-gray-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
                size={20}
            />
        </Accordion.Trigger>
    </Accordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof Accordion.Content>,
    React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
        className={`
      data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px] 
      ${className}
    `}
        {...props}
        ref={forwardedRef}
    >
        <div className="px-5 py-4 text-gray-700">{children}</div>
    </Accordion.Content>
));
AccordionContent.displayName = "AccordionContent";

export default function HelpPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <h1 className="mb-8 text-3xl font-light">Frequently Asked Questions</h1>

            <Accordion.Root
                className="w-full rounded-md bg-white shadow-sm ring-1 ring-gray-200"
                type="single"
                defaultValue="item-0"
                collapsible
            >
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion.Root>

            <div className="mt-12 text-center text-gray-600">
                <p>Still have questions?</p>
                <a href="mailto:support@malicc.store" className="text-black underline mt-2 inline-block">
                    Contact Support
                </a>
            </div>
        </div>
    );
}
