"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Container, Heading, Text, Flex, Link } from "@radix-ui/themes";

// FAQs 
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

// forwardRef is used to pass ref to the child component
// Accordion Item 
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

// Accordion Trigger 
const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof Accordion.Trigger>,
    React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
        <Accordion.Trigger
            className={`
        group flex flex-1 cursor-default items-center justify-between px-5 py-4 text-[15px] leading-none outline-none 
        bg-[var(--color-panel-solid)] text-[var(--gray-12)] shadow-[0_1px_0] shadow-[var(--gray-a4)]
        hover:bg-[var(--gray-a2)] transition-colors
        ${className}
      `}
            {...props}
            ref={forwardedRef}
        >
            {children}
            <ChevronDown
                className="text-[var(--gray-11)] ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
                size={20}
            />
        </Accordion.Trigger>
    </Accordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content 
const AccordionContent = React.forwardRef<
    React.ElementRef<typeof Accordion.Content>,
    React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
        className={`
      data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]
       bg-[var(--color-panel-solid)]
      ${className}
    `}
        {...props}
        ref={forwardedRef}
    >
        <div className="px-5 py-4 text-[var(--gray-11)]">{children}</div>
    </Accordion.Content>
));
AccordionContent.displayName = "AccordionContent";

export default function HelpPage() {
    return (
        <Container size="2" p="4">
            <Heading size="8" mb="8" weight="light">Frequently Asked Questions</Heading>

            {/* Accordion for FAQs */}
            <Accordion.Root
                className="w-full rounded-md shadow-sm ring-1 ring-[var(--gray-a4)] bg-[var(--color-surface)]"
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

            {/* Contact Support */}
            <Flex direction="column" align="center" mt="8" gap="2">
                <Text color="gray">Still have questions?</Text>
                <Link href="mailto:support@malicc.store" color="ruby" underline="always">
                    Contact Support
                </Link>
            </Flex>
        </Container>
    );
}
