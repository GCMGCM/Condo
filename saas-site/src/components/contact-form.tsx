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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '', subject: '', message: '' },
  });

  const onSubmit = async (values: FormValues) {
    setSuccess(false);
    // Simulate form submission (in a real app, you'd send this to your backend)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', values);
    setSuccess(true);
    reset();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
      <p className="mt-1 text-sm text-gray-600">
        Send us a message and we'll get back to you as soon as possible.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            {...register('subject')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Briefly describe your inquiry"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows={6}
            {...register('message')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Tell us more about your question or feedback"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>

        {success && (
          <p className="text-sm text-green-700">
            Message sent successfully! We'll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
