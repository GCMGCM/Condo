'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Schema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject is too short').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message is too short').max(4000, 'Message is too long'),
});

type FormValues = z.infer<typeof Schema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '', subject: '', message: '' },
  });

  async function onSubmit(values: FormValues) {
    setSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', values);
    setSuccess(true);
    form.reset();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
      <p className="mt-1 text-sm text-gray-600">
        Send us a message and we will get back to you as soon as possible.
      </p>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...form.register('email')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            {...form.register('subject')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Briefly describe your inquiry"
          />
          {form.formState.errors.subject && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows={6}
            {...form.register('message')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Tell us more about your question or feedback"
          />
          {form.formState.errors.message && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
        </button>

        {success && (
          <p className="text-sm text-green-700">
            Message sent successfully! We will get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
