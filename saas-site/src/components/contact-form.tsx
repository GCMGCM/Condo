'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInButton, SignedOut } from '@clerk/nextjs';

const Schema = z.object({
  subject: z.string().min(3, 'Subject is too short').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message is too short').max(4000, 'Message is too long'),
});

type FormValues = z.infer<typeof Schema>;

export default function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { subject: '', message: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.status === 401) {
        setServerError('Please sign in to contact support.');
        return;
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || 'Failed to create ticket');
      }
      setSuccess(true);
      reset();
    } catch (e: any) {
      setServerError(e.message || 'Unexpected error');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
      <p className="mt-1 text-sm text-gray-600">
        Submit your question and our support team will get back to you.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            {...register('subject')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Briefly describe your issue"
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
            placeholder="Provide details to help us assist you faster"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-sm text-gray-700 underline underline-offset-2 hover:text-gray-900"
              >
                Sign in to submit
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {success && (
          <p className="text-sm text-green-700">
            Ticket created successfully. We will reply shortly.
          </p>
        )}
      </form>
    </div>
  );
}
