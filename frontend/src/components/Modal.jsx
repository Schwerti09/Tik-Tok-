import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

/**
 * Reusable modal dialog built with Headless UI Dialog.
 *
 * Props:
 *  - open        {boolean}   whether the modal is visible
 *  - onClose     {function}  called when backdrop or × is clicked
 *  - title       {string}    modal heading
 *  - children    {ReactNode} modal body content
 *  - size        {'sm'|'md'|'lg'|'xl'}  width preset (default 'md')
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Centering wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${maxWidths[size]} bg-white rounded-2xl shadow-glass border border-brand-100 p-6 relative`}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
                  aria-label="Schließen"
                >
                  <X size={18} />
                </button>

                {/* Title */}
                {title && (
                  <Dialog.Title className="text-lg font-bold gradient-text mb-4 pr-8">
                    {title}
                  </Dialog.Title>
                )}

                {/* Body */}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
